import {IncomingMessage} from "http";
/**
 * Represents an object literal were all the values have the same type
 */
export interface Dictionary<T> {
  [key: string]: T;
}

/**
 * Interfaces prefixed by `Fb` are dependant on the protocol used by facebook
 */

/**
 * Facebook's presence
 */
export interface FbPresence {
  /**
   * TODO: explain. Does it stand for "version" ?
   */
  v: number,

  /**
   * Timestamp in seconds
   */
  time: number,

  /**
   * The ID of the user
   */
  user: string,

  /**
   * The state of the presence
   * TODO: explain the meaning of these fields
   */
  state: {
    ut: number;
    t2: any[]; // TODO: type
    lm2: any; // TODO: type
    uct2: number; // Timestamp in milliseconds
    tr: any; // TODO: type
    tw: number;
    at: number; // Timestamp in milliseconds
  },

  /**
   * TODO: explain
   * Entries are of the form "p_" + userID
   */
  ch: Dictionary<number>
}

/**
 * Facebook's accessibility cookie
 * TODO: explain the meaning of these fields
 */
export interface FbAccessibilityCookie {
  sr: number;
  "sr-ts": number;
  jk: number;
  "jk-ts": number;
  kb: number;
  "kb-ts": number;
  hcm: number;
  "hcm-ts": number;
}

export interface QueryResponse extends IncomingMessage {
  body: string;
}
