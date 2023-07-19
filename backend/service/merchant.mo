
// Importing base modules
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Char "mo:base/Char";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";
import Time "mo:base/Time";
import Random "mo:base/Random";
import Iter "mo:base/Iter";
import Int "mo:base/Int";

import Types "TypesHttp";

actor class Main(_smsApiKey : Text, _test:Text) {
    type Merchant = {
        id:Text;
        businessName : Text;
        phoneNotifications : Bool;
        phoneNumber : Text;
        slug : Text;
    };

    type Response = {
        status : Nat16;
        status_text : Text;
        data : ?Merchant;
        error_text : ?Text;
    };

    type ResponseMessage = {
        status : Nat16;
        status_text : Text;
        data : ?Text;
        error_text : ?Text;
    };

    type ResponseBool = {
        status : Nat16;
        status_text : Text;
        data : Bool;
        error_text : ?Text;
    };

    private stable var merchantStore : Trie.Trie<Text, Merchant> = Trie.empty();
    // save the SMS API key
    private stable let smsApiKey : Text = _smsApiKey;
    private stable let test : Text = _test;
  
    /**
    * Fetch the merchant's information
    */
    public shared query (msg) func get() : async Response {
        let caller : Principal = msg.caller;
        // fetch the merchant from the store
        // use the caller's principal ID as the key
        switch (Trie.get(merchantStore, key(Principal.toText(caller)), Text.equal)) {
        case (?merchant) {
            {
            status = 200;
            status_text = "OK";
            data = ?merchant;
            error_text = null;
            };
        };
        // if the merchant is not found, return a 404 error
        case null {
            {
            status = 404;
            status_text = "Not Found";
            data = null;
            error_text = ?("Merchant with principal ID: " # Principal.toText(caller) # " not found.");
            };
        };
        };
    };

    private func key(x : Text) : Trie.Key<Text> {
        return { hash = Text.hash(x); key = x };
    };

    /**
    * Updates the merchant's information
    * @param merchant - the merchant's information
    * @note - the merchant's information is stored in the merchantStore data structure
    */
    public shared (msg) func update(merchant : Merchant) : async Response {
        let caller : Principal = msg.caller;
        Debug.print("Updating merchant with caller: " # Principal.toText(caller));
        let res = await isSlugAvailable(merchant.slug);
        // generate a pseudo andom number between 0 and 100029
        let randomNumber = await generateRandomNumber(100029);
        var newSlug = "";
        // if slug is not available, append a random number to the slug
        // NOTE: THERE IS STILL A CHANCE FOR A COLLISION
        // IF TWO MERCHANTS HAVE THE SAME SLUG AND DRAW THE SAME RANDOM NUMBER
        if(res.data == false){
            newSlug := Text.concat(merchant.slug, Int.toText(randomNumber));
        }
        else{
            newSlug := merchant.slug;
        };
        // ensure that the slug is not empty
        if(newSlug == ""){
            newSlug := Principal.toText(caller);
        };
        Debug.print("NEW SLUG:" # newSlug);
        let newMerchant : Merchant = {
        businessName = merchant.businessName;
        phoneNotifications = merchant.phoneNotifications;
        phoneNumber = merchant.phoneNumber;
        slug = newSlug;
        id = Principal.toText(caller);
        };
        Debug.print("Passed slug check");
        merchantStore := Trie.replace(
        merchantStore,
        key(Principal.toText(caller)),
        Text.equal,
        ?newMerchant,
        ).0;
        try{
        var errorMsg = null;
        if(merchant.phoneNotifications) {
                    // send welcome message to merchant via sms (if enabled)
                    let res = await welcomeMessage(merchant.phoneNumber, merchant.businessName);
                };
        }
        catch(e){
            Debug.print("Error sending welcome message");
             return{
                status = 200;
                status_text = "OK (Error sending welcome message)";
                data = ?newMerchant;
                error_text = ?"Unable to send welcome message";
                }
            };
        {
        status = 200;
        status_text = "OK";
        data = ?newMerchant;
        error_text = null;
        };
    };

    public func getMerchantBySlug(slugKey:Text): async Response{
    let isAvailable:Bool = false;
    if(slugKey==""){
          return({
        status = 404;
        status_text = "Not Found";
        data = null;
        error_text = ?("Merchant with slug: " # slugKey # " not found.");
    })
    };
    for (kv in Trie.iter(merchantStore)) {
        let (key, value) = kv;
        // add non sensitive data to the response
        if(value.slug == slugKey){
            let merchantToReturn = {
                businessName =value.businessName;
                phoneNotifications = false;
                phoneNumber = "";
                slug =value.slug;
                id = value.id;
            };
            return({
            status = 200;
            status_text = "OK";
            data = ?merchantToReturn;
            error_text = null;
            })
        };
        };
    return({
        status = 404;
        status_text = "Not Found";
        data = null;
        error_text = ?("Merchant with slug: " # slugKey # " not found.");
    })
    };
  

  public func isSlugAvailable(slug:Text): async ResponseBool{
     let isAvailable:Bool = true;
     if(slug == ""){
        return
        {
        status = 200;
        status_text = "OK";
        data = false;
        error_text = null;
        };
     };
     for (kv in Trie.iter(merchantStore)) {
        let (key, value) = kv;
        // add non sensitive data to the response
        if(value.slug == slug){
            Debug.print("SLUG not Available");
            return
            {
            status = 200;
            status_text = "OK";
            data = false;
            error_text = null;
            }
        };
    };
    {
        status = 200;
        status_text = "OK";
        data = true;
        error_text = null;
    }
  };

    /**
    * Sends a welcome notification via sms
    * @param number - the phone number of the recipient
    * @param name - the name of the recipient
    */
    public shared (msg) func welcomeMessage(number:Text, name:Text) : async ResponseMessage {
       let body:Text = "{\"message\": {\"to\": {\"phone_number\": \"" #number# "\"},\"template\": \"TAG9DKR39N4KA7NN2THGEFDW3CYM\",\"data\": {\"recipientName\": \" " #name# "\"}}}";
        
        let res:Text = await sendSMS(body, name);
        // debug print args
        Debug.print(_smsApiKey);
        Debug.print(test);

        {
        status = 200;
        status_text = "OK";
        data = ?res;
        error_text = null;
        };
    };

    /**
    * Sends an transaction notification via sms
    * @param number - the phone number of the recipient
    * @param name - the name of the recipient
    * @param amount - the amount of the transaction
    */
    public shared (msg) func txMessage(number:Text, name:Text, amount:Text) : async ResponseMessage {
        let body:Text = "{\"message\": {\"to\": {\"phone_number\":\"" #number# "\"},\"template\": \"N3G4A5ZMC8M8CRKT4PR41PWRYGZC\",\"data\": {\"amount\": \"10\",\"currencyName\": \"ckBTC\",\"recipientName\":\"" #name# "\"}}}";
        let res:Text = await sendSMS(body, name);
        
        {
        status = 200;
        status_text = "OK";
        data = ?res;
        error_text = null;
        };
    };

    /**
    * Sends an sms message
    * @param bodyJson - the body of the request
    * @param name - the name of the recipient
    */
    public func sendSMS(bodyJson:Text, name:Text) : async Text {

    // DECLARE IC MANAGEMENT CANISTER
    // Used for the HTTP request
    let ic:Types.IC = actor ("aaaaa-aa");

    // url to send the request to
    let url = "https://api.courier.com/send";

    // Prepare headers for the system http_request call

    //idempotency keys should be unique so we create a function that generates them.
    let idempotency_key: Text = await generateRandomString(name);
    let requestHeaders = [
        { name= "Content-Type"; value = "application/json" },
        { name= "Idempotency-Key"; value = idempotency_key },
        { name= "Accept"; value="application/json"},
        { name= "Authorization"; value="Bearer" # " " # smsApiKey},
    ];

    let requestBodyAsBlob: Blob = Text.encodeUtf8(bodyJson); 
    let requestBodyAsNat8: [Nat8] = Blob.toArray(requestBodyAsBlob);

    // Build The HTTP request
    let http_request : Types.HttpRequestArgs = {
        url = url;
        max_response_bytes = ?Nat64.fromNat(1000);
        headers = requestHeaders;
        body = ?requestBodyAsNat8;
        method = #post;
        transform = null; //optional for request
    };
    
    // Add cycles to the next async call (in this case HTTP request)
    // 49.14M + 5200 * request_size + 10400 * max_response_bytes
    // 49.14M + (5200 * 1000) + (10400 * 1000) = 64.74M
    // calculations from 
    Cycles.add(70_000_000);
    
    // MAKE HTTPS REQUEST AND WAIT FOR RESPONSE
    //Since the cycles were added above, we can just call the IC management canister with HTTPS outcalls below
    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);

    // Decode that [Na8] array that is the body into readable text. 
    let response_body: Blob = Blob.fromArray(http_response.body);
    let ?decoded_text = Text.decodeUtf8(response_body) else return "No value returned";

    Debug.print("Response body: " # decoded_text);

    return(decoded_text)
  };

   /**
    * Generates a random string
    * @param name - relevenat name (included as part of the resulting string)
  */
  public func generateRandomString(name:Text) : async Text {
    let newnow = Time.now();
    // use current time as a seed
    let seed = Int.toText(newnow);
    let randomString = seed;

    // formatted string
    return "POS" # randomString # "POS" #name# "POS";
  };

  public func generateRandomNumber(maxNum:Int):async Int{
    let newnow = Time.now();
    return newnow % maxNum;
  };
    
}
  
 