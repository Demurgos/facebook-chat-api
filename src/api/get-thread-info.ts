import * as utils from "../utils";
import * as log from "npmlog";
import FbThread from "../interfaces/fb-thread";

interface Form {
  client: string;
  request_user_id?: string;
}

interface Payload {
  threads: FbThread[];
  message_blocked_ids: string[];
  payload_source: string | "server_fetch_thread_info"; // TODO: find all the possible values ?
}

export function getGetThreadInfo (defaultFuncs, api, ctx) {
  return function getThreadInfo(threadID, callback) {
    if(!callback) callback = function() {};

    var form: Form = {
      'client' : 'mercury'
    };

    api.getUserInfo(threadID, function(err, userRes) {
      if(err) {
        return callback(err);
      }
      var key = (Object.keys(userRes).length > 0) ? "user_ids" : "thread_fbids";
        form['threads['+key+'][0]'] = threadID;

        if(ctx.globalOptions.pageId) {
          form.request_user_id = ctx.globalOptions.pageId;
        }

        defaultFuncs.post("https://www.facebook.com/ajax/mercury/thread_info.php", ctx.jar, form)
          .then(utils.parseAndCheckLogin(ctx.jar, defaultFuncs))
          .then(function(resData) {
            if (resData.error) {
              throw resData;
            } else if (!resData.payload){
              throw {error: "Could not retrieve thread Info."};
            }
  
            let payload: Payload = resData.payload;

            if (!payload.threads || !payload.threads.length) {
              callback({error: "Unable to retrieve threadData"});
            }

            let threadData: FbThread = resData.payload.threads[0];

            var userData = userRes[threadID];
            var info = {
              participantIDs: threadData.participants.map(id => id.split(':').pop()),
              name: threadData.name != null ? threadData.name : userData.name,
              snippet: threadData.snippet,
              messageCount: threadData.message_count,
              emoji: threadData.custom_like_icon,
              nicknames: threadData.custom_nickname,
              color: threadData.custom_color,
            };
            callback(null, info);
          })
          .catch(function(err) {
            log.error("Error in getThreadInfo", err);
            return callback(err);
          });
    });
  };
}

export default getGetThreadInfo;
