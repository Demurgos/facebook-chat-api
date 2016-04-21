import * as log from "npmlog";
import * as utils from "./utils";
import {setOptions} from "./options";
import {Api, ApiContext, ApiIO} from "./interfaces/api";

// Method generators
import getAddUserToGroup from "./api/add-user-to-group";
import getChangeArchivedStatus from "./api/change-archived-status";
import getChangeGroupImage from "./api/change-group-image";
import getChangeNickname from "./api/change-nickname";
import getChangeThreadColor from "./api/change-thread-color";
import getChangeThreadEmoji from "./api/change-thread-emoji";
import getDeleteMessage from "./api/delete-message";
import getDeleteThread from "./api/delete-thread";
import getGetCurrentUserID from "./api/get-current-user-id";
import getGetFriendsList from "./api/get-friends-list";
import getGetOnlineUsers from "./api/get-online-users";
import getGetThreadHistory from "./api/get-thread-history";
import getGetThreadInfo from "./api/get-thread-info";
import getGetThreadList from "./api/get-thread-list";
import getGetUserID from "./api/get-user-id";
import getGetUserInfo from "./api/get-user-info";
import getListen from "./api/listen";
import getLogout from "./api/logout";
import getMarkAsRead from "./api/mark-as-read";
import getRemoveUserFromGroup from "./api/remove-user-from-group";
import getSearchForThread from "./api/search-for-thread";
import getSendMessage from "./api/send-message";
import getSendTypingIndicator from "./api/send-typing-indicator";
import getSetTitle from "./api/set-title";

function getApi (defaultFuncs: ApiIO, api: Api, ctx: ApiContext): Api {
  // api.setOptions;
  // api.getAppState;
  api.addUserToGroup = getAddUserToGroup(defaultFuncs, api, ctx);
  api.changeArchivedStatus = getChangeArchivedStatus(defaultFuncs, api, ctx);
  api.changeGroupImage = getChangeGroupImage(defaultFuncs, api, ctx);
  api.changeNickname = getChangeNickname(defaultFuncs, api, ctx);
  api.changeThreadColor = getChangeThreadColor(defaultFuncs, api, ctx);
  api.changeThreadEmoji = getChangeThreadEmoji(defaultFuncs, api, ctx);
  api.deleteMessage = getDeleteMessage(defaultFuncs, api, ctx);
  api.deleteThread = getDeleteThread(defaultFuncs, api, ctx);
  api.getCurrentUserID = getGetCurrentUserID(defaultFuncs, api, ctx);
  api.getFriendsList = getGetFriendsList(defaultFuncs, api, ctx);
  api.getOnlineUsers = getGetOnlineUsers(defaultFuncs, api, ctx);
  api.getThreadHistory = getGetThreadHistory(defaultFuncs, api, ctx);
  api.getThreadInfo = getGetThreadInfo(defaultFuncs, api, ctx);
  api.getThreadList = getGetThreadList(defaultFuncs, api, ctx);
  api.getUserID = getGetUserID(defaultFuncs, api, ctx);
  api.getUserInfo = getGetUserInfo(defaultFuncs, api, ctx);
  api.listen = getListen(defaultFuncs, api, ctx);
  api.logout = getLogout(defaultFuncs, api, ctx);
  api.markAsRead = getMarkAsRead(defaultFuncs, api, ctx);
  api.removeUserFromGroup = getRemoveUserFromGroup(defaultFuncs, api, ctx);
  api.searchForThread = getSearchForThread(defaultFuncs, api, ctx);
  api.sendMessage = getSendMessage(defaultFuncs, api, ctx);
  api.sendTypingIndicator = getSendTypingIndicator(defaultFuncs, api, ctx);
  api.setTitle = getSetTitle(defaultFuncs, api, ctx);

  return api;
}

export function buildAPI(globalOptions, html, jar): [ApiContext, ApiIO, Api] {
  var maybeCookie = jar.getCookies("https://www.facebook.com").filter(function(val) {
    return val.cookieString().split("=")[0] === "c_user";
  });

  if(maybeCookie.length === 0) {
    throw {error: "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify."};
  }

  var userID = maybeCookie[0].cookieString().split("=")[1].toString();
  log.info("Logged in");

  var clientID = (Math.random() * 2147483648 | 0).toString(16);

  // All data available to api functions
  var ctx = {
    userID: userID,
    jar: jar,
    clientID: clientID,
    globalOptions: globalOptions,
    loggedIn: true,
    access_token: 'NONE'
  };

  var api: Api = <any> {
    setOptions: setOptions.bind(null, globalOptions),
    getAppState: function getAppState() {
      return utils.getAppState(jar);
    },
  };

  var defaultFuncs: ApiIO = utils.makeDefaults(html, userID);

  api = getApi(defaultFuncs, api, ctx);

  return [ctx, defaultFuncs, api];
}

export default Api;
