import * as log from "npmlog";
import * as utils from "./utils";
import {setOptions} from "./options";
import {Api, ApiContext, ApiIO} from "./interfaces/api";

// Method generators
import getAddUserToGroup from "./api/addUserToGroup";
import {getChangeArchivedStatus} from "./api/changeArchivedStatus";
import {getChangeGroupImage} from "./api/changeGroupImage";
import {getChangeNickname} from "./api/changeNickname";
import {getChangeThreadColor} from "./api/changeThreadColor";
import {getChangeThreadEmoji} from "./api/changeThreadEmoji";
import {getDeleteMessage} from "./api/deleteMessage";
import {getDeleteThread} from "./api/deleteThread";
import {getGetCurrentUserID} from "./api/getCurrentUserID";
import {getGetFriendsList} from "./api/getFriendsList";
import {getGetOnlineUsers} from "./api/getOnlineUsers";
import {getGetThreadList} from "./api/getThreadList";
import {getGetUserID} from "./api/getUserID";
import {getGetUserInfo} from "./api/getUserInfo";
import {getListen} from "./api/listen";
import {getLogout} from "./api/logout";
import {getMarkAsRead} from "./api/markAsRead";
import {getRemoveUserFromGroup} from "./api/removeUserFromGroup";
import {getSearchForThread} from "./api/searchForThread";
import {getSendMessage} from "./api/sendMessage";
import {getSendTypingIndicator} from "./api/sendTypingIndicator";
import {getSetTitle} from "./api/setTitle";

function getApi (defaultFuncs: ApiIO, api: Api, ctx: ApiContext): Api {
  return {
    addUserToGroup: getAddUserToGroup(defaultFuncs, api, ctx),
    changeArchivedStatus: getChangeArchivedStatus(defaultFuncs, api, ctx),
    changeGroupImage: getChangeGroupImage(defaultFuncs, api, ctx),
    changeNickname: getChangeNickname(defaultFuncs, api, ctx),
    changeThreadColor: getChangeThreadColor(defaultFuncs, api, ctx),
    changeThreadEmoji: getChangeThreadEmoji(defaultFuncs, api, ctx),
    deleteMessage: getDeleteMessage(defaultFuncs, api, ctx),
    deleteThread: getDeleteThread(defaultFuncs, api, ctx),
    getCurrentUserID: getGetCurrentUserID(defaultFuncs, api, ctx),
    getFriendsList: getGetFriendsList(defaultFuncs, api, ctx),
    getOnlineUsers: getGetOnlineUsers(defaultFuncs, api, ctx),
    getThreadList: getGetThreadList(defaultFuncs, api, ctx),
    getUserID: getGetUserID(defaultFuncs, api, ctx),
    getUserInfo: getGetUserInfo(defaultFuncs, api, ctx),
    listen: getListen(defaultFuncs, api, ctx),
    logout: getLogout(defaultFuncs, api, ctx),
    markAsRead: getMarkAsRead(defaultFuncs, api, ctx),
    removeUserFromGroup: getRemoveUserFromGroup(defaultFuncs, api, ctx),
    searchForThread: getSearchForThread(defaultFuncs, api, ctx),
    sendMessage: getSendMessage(defaultFuncs, api, ctx),
    sendTypingIndicator: getSendTypingIndicator(defaultFuncs, api, ctx),
    setTitle: getSetTitle(defaultFuncs, api, ctx),
  }
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

  var apiFuncNames = [
    'addUserToGroup',
    'changeArchivedStatus',
    'changeGroupImage',
    'changeThreadColor',
    'changeThreadEmoji',
    'changeNickname',
    'deleteMessage',
    'deleteThread',
    'getCurrentUserID',
    'getFriendsList',
    'getOnlineUsers',
    'getThreadHistory',
    'getThreadInfo',
    'getThreadList',
    'getUserID',
    'getUserInfo',
    'listen',
    'logout',
    'markAsRead',
    'removeUserFromGroup',
    'searchForThread',
    'sendMessage',
    'sendTypingIndicator',
    'setTitle',
  ];

  var defaultFuncs: ApiIO = utils.makeDefaults(html, userID);

  api = getApi(defaultFuncs, api, ctx);

  return [ctx, defaultFuncs, api];
}

export default Api;
