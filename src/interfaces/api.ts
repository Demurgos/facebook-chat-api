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

export interface Api {
  addUserToGroup: Function;
  changeArchivedStatus: Function;
  changeGroupImage: Function;
  changeNickname: Function;
  changeThreadColor: Function;
  changeThreadEmoji: Function;
  deleteMessage: Function;
  deleteThread: Function;
  getCurrentUserID: Function;
  getFriendsList: Function;
  getOnlineUsers: Function;
  getThreadList: Function;
  getUserID: Function;
  getUserInfo: Function;
  listen: Function;
  logout: Function;
  markAsRead: Function;
  removeUserFromGroup: Function;
  searchForThread: Function;
  sendMessage: Function;
  sendTypingIndicator: Function;
  setTitle: Function;
}
