import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Main {
  'get' : ActorMethod<[], Response>,
  'update' : ActorMethod<[Merchant], Response>,
}
export interface Merchant {
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
export interface _SERVICE extends Main {}
