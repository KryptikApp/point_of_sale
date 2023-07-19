import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Main {
  'get' : ActorMethod<[], Response>,
  'getMerchantBySlug' : ActorMethod<[string], Response>,
  'isSlugAvailable' : ActorMethod<[string], ResponseBool>,
  'sendSMS' : ActorMethod<[string, string], string>,
  'txMessage' : ActorMethod<[string, string, string], ResponseMessage>,
  'update' : ActorMethod<[Merchant], Response>,
  'welcomeMessage' : ActorMethod<[string, string], ResponseMessage>,
}
export interface Merchant {
  'id' : string,
  'slug' : string,
  'businessName' : string,
  'phoneNumber' : string,
  'phoneNotifications' : boolean,
}
export interface Response {
  'status' : number,
  'data' : [] | [Merchant],
  'status_text' : string,
  'error_text' : [] | [string],
}
export interface ResponseBool {
  'status' : number,
  'data' : boolean,
  'status_text' : string,
  'error_text' : [] | [string],
}
export interface ResponseMessage {
  'status' : number,
  'data' : [] | [string],
  'status_text' : string,
  'error_text' : [] | [string],
}
export interface _SERVICE extends Main {}
