import * as utils from "../utils";
import * as log from "npmlog";

export function getMarkAsRead (defaultFuncs, api, ctx) {
  return function markAsRead(threadID, callback) {
    if(!callback) {
      callback = function() {};
    }

    var form = {};
    form["ids[" + threadID + "]"] = true;

    defaultFuncs
      .post("https://www.facebook.com/ajax/mercury/change_read_status.php", ctx.jar, form)
      .then(utils.saveCookies(ctx.jar))
      .then(utils.parseAndCheckLogin(ctx.jar, defaultFuncs))
      .then(function(resData) {
        if (resData.error) {
          throw resData;
        }

        return callback();
      })
      .catch(function(err) {
        log.error("Error in markAsRead", err);
        return callback(err);
      });
  };
}

export default getMarkAsRead;
