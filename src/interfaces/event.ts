import {Attachment} from "./attachment";
import {UserStatuses} from "./user-status";

export type EventType = 'message' | 'event' | 'typ' | 'read_receipt' | 'read' | 'presence';

export interface BaseEvent {
  type: EventType;
}

export interface MessageEvent extends BaseEvent {
  /**
   * If `type` is `message`, the object will contain the following fields:
   * + `senderID`: The id of the person who sent the message in the chat with threadID.
   * + `body`: The string corresponding to the message that was just received.
   * + `threadID`: The threadID representing the thread in which the message was sent.
   * + `messageID`: A string representing the message ID.
   * + `attachments`: An array of attachments to the message.
   * + `isGroup`: boolean, true if this thread is a group thread (more than 2 participants).
   *
   *  If enabled through [setOptions](#setOptions), this will also handle events. In this case, `message` will be either a message (see above) or an event object with the following fields:
   * - `type`: The string `"event"` or `"typ"`
   * - `threadID`: The threadID representing the thread in which the message was sent.
   */
    type: "message";
  senderID: string;
  body: string;
  threadID: string;
  messageID: string;
  attachments: Attachment[];
  isGroup: boolean;
}

export interface EventEvent extends BaseEvent {
  /**
   * If `type` is `"event"` then the object will also have those fields:
   * - `logMessageType`: String representing the type of event (`"log:thread-name"`, `"log:unsubscribe"`, `"log:subscribe"`, ...)
   * - `logMessageData`: Data relevant to the event.
   * - `logMessageBody`: String printed in the chat.
   * - `author`: The person who performed the event.
   */
    type: "event";
  logMessageType: string;
  logMessageData: any;
  logMessageBody: string;
  author: string;
}

export interface TypEvent extends BaseEvent {
  /**
   * If `type` is `"typ"` then the object will have the following fields:
   * - `isTyping`: Boolean representing whether or not a person started typing.
   * - `from`: ID of the user who started/stopped typing.
   * - `threadID`: Current threadID.
   * - `fromMobile`: Boolean representing whether or not the person's using a mobile device to type.
   */
    type: "typ";
  isTyping: boolean;
  from: number;
  threadID: string;
  fromMobile: boolean;
}

export interface ReadReceiptEvent extends BaseEvent {
  /**
   * If `type` is `"read_receipt"` then the object will have the following fields:
   * - `reader`: ID of the user who just read the message.
   * - `time`: The time at which the reader read the message.
   * - `threadID`: The thread in which the message was read.
   */
    type: "read_receipt";
  reader: string;
  threadID: string;
  time: string;
}

export interface ReadEvent extends BaseEvent {
  /**
   * If `type` is `"read"` then the object will have the following fields:
   * - `threadID`: The threadID representing the thread in which the message was sent.
   * - `time`: The time at which the user read the message.
   */
    type: "read";
  threadID: string;
  time: string;
}

export interface PresenceEvent extends BaseEvent {
  /**
   * If enabled through [setOptions](#setOptions), this will also return presence, (`type` will be `"presence"`), which is the online status of the user's friends. The object given to the callback will have the following fields:
   * - `type`: The string "presence".
   * - `timestamp`: How old the information is.
   * - `userID`: The ID of the user whose status this packet is describing
   * - `statuses`: An object with the following fields: `fbAppStatus`, `messengerStatus`, `otherStatus`, `status` and `webStatus`. All can contain any of the following values: `"active"`, `"idle"`, `"invisible"`, `"offline"`.
   */
    type: "presence";
  timestamp: number;
  userID: number;
  statuses: UserStatuses;
}

export type Event = MessageEvent | EventEvent | TypEvent;
