import * as utils from "../utils";
import * as log from "npmlog";

interface Form {
  client: string;
  request_user_id?: string;
}

interface Payload {
  threads: FbThreadInfo[];
  message_blocked_ids: string[];
  payload_source: string | "server_fetch_thread_info"; // TODO: find all the possible values ?
}

// Note: the various IDs in the following examples are random examples with the same pattern.
interface FbThreadInfo {
  /**
   * The ID of the thread
   * Example: thread_id = "mid.4457235846258:65a2e50fb4f52a1d20";
   */
  thread_id: string;

  /**
   * The ID the current user or sender
   * Example: thread_fbid = "100010408012485"
   */
  thread_fbid: string;

  /**
   * The ID the current user or sender
   * Example: other_user_fbid = "100010408012485"
   */
  other_user_fbid: '100010976550983';

  /**
   * The list of participants in this thread
   * Example: participants = ["fbid:100010408012485"];
   */
  participants: string[]; // TODO: type

  /**
   * The former participants of this thread
   */
  former_participants: any[]; // TODO: type

  /**
   * The name of the thread.
   * Example: name = "";
   * Example: name = "Test Thread";
   */
  name: string;

  /**
   * TODO
   * Example: "basic-str-1512782456782"
   */
  snippet: string;

  /**
   * TODO
   */
  snippet_has_attachment: boolean;

  /**
   * TODO
   */
  snippet_attachments: any[]; // TODO: type

  /**
   * A value identifying the sender
   * Example: snippet_sender = "fbid:100010408012485"
   */
  snippet_sender: string;

  /**
   * TODO
   */
  unread_count: number;

  /**
   * TODO: the total number of messages ?
   */
  message_count: number;

  /**
   * TODO
   * Example: image_src = null;
   */
  image_src: any; // TODO: type

  /**
   * A localized string representing the date.
   * Example: timestamp_absolute = "Today";
   * Example: timestamp_absolute = "Aujourd’hui";
   */
  timestamp_absolute: string;

  /**
   * TODO
   * Example: timestamp_relative = "17:50";
   */
  timestamp_datetime: string;

  /**
   * TODO
   * Example: timestamp_relative = "17:50";
   */
  timestamp_relative: string;

  /**
   * TODO
   * Example: timestamp_time_passed = 0;
   */
  timestamp_time_passed: number;

  /**
   * TODO
   * Example: timestamp = 1462031403552;
   */
  timestamp: number;

  /**
   * TODO
   * Example: server_timestamp = 1462031403552;
   */
  server_timestamp: number;

  /**
   * TODO
   * Example: mute_settings = [];
   */
  mute_settings: any[]; // TODO: type

  /**
   * TODO
   */
  is_canonical_user: boolean;

  /**
   * TODO
   */
  is_canonical: boolean;

  /**
   * TODO
   */
  is_subscribed: boolean;

  /**
   * TODO: find the possible values ?
   * Example: folder = "inbox";
   */
  folder: string | "inbox";

  /**
   * TODO
   */
  is_archived: boolean;

  /**
   * TODO
   */
  recipients_loadable: boolean;

  /**
   * TODO
   */
  name_conversation_sheet_dismissed: boolean;

  /**
   * TODO
   */
  has_email_participant: boolean;

  /**
   * A boolean flag indicating if this thread is read-only.
   * TODO: read-only for everyone or just the current user ?
   */
  read_only: boolean;

  /**
   * TODO: can_reply for everyone or just the current user ? (rather current user)
   */
  can_reply: boolean;

  /**
   * TODO
   */
  composer_enabled: boolean;

  /**
   * TODO
   */
  last_message_timestamp: number;

  /**
   * TODO
   */
  last_read_timestamp: number;

  /**
   * TODO
   * Example: last_message_type = "non_ad";
   */
  last_message_type: string | "non_ad";

  /**
   * TODO
   */
  ephemeral_ttl_mode: number;

  /**
   * TODO
   */
  custom_like_icon: any; // TODO: type

  /**
   * TODO
   * Example: titan_originated_thread_id = "<4457235846258:0-e58a15c4d82ff0f4@mail.projektitan.com>";
   */
  titan_originated_thread_id: string;

  /**
   * TODO
   * Example: custom_nickname = null;
   */
  custom_nickname: any; // TODO: type

  /**
   * TODO
   * Example: custom_color = null;
   */
  custom_color: any;

  /**
   * TODO
   */
  admin_ids: any[]; // TODO: type

  /**
   * TODO
   */
  customization_enabled: boolean;
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

            let threadData: FbThreadInfo = resData.payload.threads[0];

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
