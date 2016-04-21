import {Thread} from "./thread";
import {Message} from "./message";
export interface ApiContext {
  userID: string;
  jar: any;
  clientID: string;
  globalOptions: any;
  loggedIn: boolean;
  access_token: string;
}

export interface ApiIO {
  get: Function;
  post: Function;
  postFormData: Function;
}

export interface ApiOptions {
  logLevel?: 'silly' | 'verbose' | 'info' | 'http' | 'warn' | 'error' | 'silent';
  selfListen?: boolean;
  listenEvents?: boolean;
  pageID?: number;
  updatePresence?: boolean;
  forceLogin?: boolean;
}

export interface Api {
  addUserToGroup (userID: number, threadID: number, callback?: (err: Error) => any): void;
  changeArchivedStatus (threadOrThreadsID: number | number[], archive: boolean, callback?: (err: Error) => any): void;
  changeGroupImage (image: any, threadID: number, callback?: (err: Error) => any): void;
  changeThreadColor(color: string, threadID: number, callback?: (err: Error) => any): any;
  changeThreadEmoji(emoji: string, threadID: number,  callback?: (err: Error) => any): any;
  changeNickname(nickname: string, threadID: number, participantID: number, callback?: (err: Error) => any): any;
  deleteMessage(messageOrMessagesID: number | number[], callback?: (err: Error) => any): any;
  getAppState(): any; // TODO
  getCurrentUserID(): number;
  getFriendsList(callback: (err: Error, arr: any[]) => any): void; // TODO
  getOnlineUsers(callback: (err: Error, arr: any) => any): void; // TODO
  getThreadHistory(threadID: number, start: number, end: number, timestamp: any, callback: (err: Error, history: any[]) => any): any; // TODO
  getThreadInfo(threadID: number, callback: (err: Error, info: any) => any): any; // TODO
  getThreadList(start: number, end: number, callback: (err: Error, obj: Thread[]) => any): void;
  deleteThread(threadOrThreads: number | number[], callback?: (err: Error) => any): void;
  getUserID(name: string, callback: (err: Error, arr: number[]) => any): void;
  getUserInfo(ids: number | number[], callback: (err: Error, arr: any[]) => any): void; // TODO
  listen(callback: (err: Error, eventType: Event) => any): void;
  logout(callback?: (err: Error) => any): void;
  markAsRead(threadID: number, callback?: (err?: Error) => any): void;
  removeUserFromGroup(userID: number, threadID: number, callback?: (err?: Error) => any): void;
  searchForThread(name: string | number | Array<string | number>, callback: (err: Error, obj: Thread) => any): void;
  sendMessage(message: string | Message, threadID: string | number | Array<string | number>, callback?: (err: Error, messageInfo: any) => any): void; // TODO
  sendTypingIndicator(threadID: number, callback?: (err: Error) => any): any;
  setOptions(options: ApiOptions): void;
  setTitle(newTitle: string, threadID: number, callback?: (err: Error, obj: any) => any): void; // TODO
}
