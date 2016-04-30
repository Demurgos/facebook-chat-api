import {IncomingMessage} from "http";

import * as Bluebird from "bluebird";
import * as log from "npmlog";
import {CookieJar} from "request";
import {ApiIO} from "./interfaces/api";
import {get, post, postFormData, JSONResult, requestWithDefaults} from "./utils/requests";
import {padZeros, randomUint32} from "./utils/helpers";
import {encodePresence} from "./utils/presence";
import {FbPresence, FbAccessibilityCookie, Dictionary} from "./utils/interfaces";


export function generatePresence(userID): string {
  let time: number = Date.now();

  let presence: FbPresence = {
    v: 3,
    time: Math.floor(time / 1000),
    user: userID,
    state: {
      ut: 0,
      t2: [],
      lm2: null,
      uct2: time,
      tr: null,
      tw: randomUint32() + 1,
      at: time
    },
    ch: {
      ["p_" + userID]: 0
    }
  };

  return "E" + encodePresence(presence);
}

export function generateAccessiblityCookie(): string {
  var time = Date.now();
  let accessibilityCookie: FbAccessibilityCookie = {
    sr: 0,
    'sr-ts': time,
    jk: 0,
    'jk-ts': time,
    kb: 0,
    'kb-ts': time,
    hcm: 0,
    'hcm-ts': time
  };

  return encodeURIComponent(JSON.stringify(accessibilityCookie));
}

// TODO: rename to generate ?
export function getGUID() {
  let sectionLength: number = Date.now();

  let id: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (char) {
    let r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    let _guid: string = (char == "x" ? r : r & 7 | 8).toString(16);
    return _guid;
  });
  return id;
}

/**
 * Return the substring from `str` from the first occurrence of `startToken` and the next occurrence of `endToken`.
 * The tokens are NOT part of the result.
 * If `startToken` is not found, returns an empty string.
 *
 * @param str The string to search
 * @param startToken
 * @param endToken
 * @returns {string}
 */
export function getFrom(str: string, startToken: string, endToken): string {
  let start: number = str.indexOf(startToken) + startToken.length;
  if (start < startToken.length) {
    return "";
  }

  let lastHalf = str.substring(start);
  let end = lastHalf.indexOf(endToken); // TODO: what if end token is not found ?
  return lastHalf.substring(0, end);
}

export function makeParsable(html: string) {
  return html.replace(/for\s*\(\s*;\s*;\s*\)\s*;\s*/, "");
}

/**
 * Builds an object from an array of pairs {name: string, val: any}
 * @param form
 * @returns {Dictionary<any>}
 */
export function arrToForm(form: Array<{name: string, val: any}>) {
  return arrayToObject(form, item => item.name, item => item.val);
}

/**
 * Creates key/value pairs for each item in the array. Then it merges all the pairs in a single object and returns it.
 * If two pairs have the same key, the dictionary will contain the one emitted by the latest item of the array.
 * @param arr
 * @param getKey
 * @param getValue
 * @returns {Dictionary<any>}
 */
function arrayToObject<T>(arr: T[], getKey: (item?: T) => string, getValue: (item?: T) => any): Dictionary<any> {
  return arr.reduce(
    (acc, item) => {
      acc[getKey(item)] = getValue(item);
      return acc;
    },
    <Dictionary<any>> {}
  );
}

/**
 * Returns a HH:mm string representation of the current time
 * @returns {string}
 */
export function genTimestampRelative(): string {
  let d = new Date();
  return d.getHours() + ":" + padZeros(d.getMinutes());
}

/**
 * Returns a default IO object with:
 * - get
 * - post
 * - postFormData
 *
 * @param html
 * @param userID
 */
export function makeDefaults(html: string, userID): ApiIO {
  let reqCounter = 1;
  let fb_dtsg: string = getFrom(html, "name=\"fb_dtsg\" value=\"", "\"");
  let ttstamp = "";
  for (let i = 0; i < fb_dtsg.length; i++) {
    ttstamp += fb_dtsg.charCodeAt(i);
  }
  ttstamp += '2';
  let revision: string = getFrom(html, "revision\":", ",");

  function mergeWithDefaults(obj: Dictionary<any>): Dictionary<any> {
    if (!obj) {
      return {};
    }

    // TODO: document ?
    let newObj = {
      __user: userID,
      __req: (reqCounter++).toString(36),
      __rev: revision,
      __a: 1,
      fb_dtsg: fb_dtsg,
      ttstamp: ttstamp,
    };

    if (!obj) {
      return newObj;
    }

    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && !newObj[prop]) {
        newObj[prop] = obj[prop];
      }
    }

    return newObj;
  }

  // TODO: type the return
  function postWithDefaults(url: string, jar: CookieJar, form?: Dictionary<any>): Bluebird<any> {
    return post(url, jar, mergeWithDefaults(form));
  }

  // TODO: type the return
  function getWithDefaults(url: string, jar: CookieJar, queryString?: Dictionary<any>): Bluebird<any> {
    return get(url, jar, mergeWithDefaults(queryString));
  }

  // TODO: type the return
  function postFormDataWithDefault(url: string, jar: CookieJar, form?: Dictionary<any>, qs?: Dictionary<any>): Bluebird<any> {
    return postFormData(url, jar, mergeWithDefaults(form), mergeWithDefaults(qs));
  }

  return {
    get: getWithDefaults,
    post: postWithDefaults,
    postFormData: postFormDataWithDefault,
  };
}

interface ParsedBody {
  jsmods: {
    require: Array<[string, any, any, Array<string>]>; // TODO: type
  }
  error: number;
}

// Returns a closure
export function parseAndCheckLogin(jar, defaultFuncs?: any): (data: JSONResult) => Bluebird<any> {
  return (data: JSONResult) => {
    return Bluebird.try(() => {
      log.verbose(`parseAndCheckLogin: ${data.body}`);
      if (data.statusCode >= 500 && data.statusCode < 600) {
        log.warn(`parseAndCheckLogin: Got status code ${data.statusCode} retrying...`);
        let url = `${data.request.uri.protocol}//${data.request.uri.hostname}${data.request.uri.pathname}`;
        if (data.request.headers['Content-Type'].split(";")[0] === "multipart/form-data") {
          return defaultFuncs
            .postFormData(url, jar, data.request.formData, {})
            .then(parseAndCheckLogin(jar));
        } else {
          return defaultFuncs
            .post(url, jar, data.request.formData)
            .then(parseAndCheckLogin(jar));
        }
      }
      if (data.statusCode !== 200) {
        throw new Error(`parseAndCheckLogin got status code: ${data.statusCode}. Bailing out of trying to parse response.`);
      }

      let res: ParsedBody = null;
      try {
        res = JSON.parse(makeParsable(data.body));
      } catch (err) {
        throw {
          error: "JSON.parse error. Check the `detail` property on this error.",
          detail: err,
          res: data.body
        };
      }

      // TODO: handle multiple cookies?
      if (res.jsmods
        && res.jsmods.require
        && Array.isArray(res.jsmods.require[0])
        && res.jsmods.require[0][0] === "Cookie") {
        res.jsmods.require[0][3][0] = res.jsmods.require[0][3][0].replace("_js_", "");
        var cookie = formatCookie(res.jsmods.require[0][3], "facebook");
        var cookie2 = formatCookie(res.jsmods.require[0][3], "messenger");
        jar.setCookie(cookie, "https://www.facebook.com");
        jar.setCookie(cookie2, "https://www.messenger.com");
      }

      if (res.error === 1357001) {
        throw {error: "Not logged in."};
      }
      return res;
    });
  };
}

// TODO: type
export function saveCookies(jar: CookieJar): (res: JSONResult) => JSONResult {
  return (res) => {
    let cookies: string[] = (<any> res.headers['set-cookie']) || [];
    cookies.forEach((cookie) => {
      if (cookie.indexOf(".facebook.com") > -1) {
        jar.setCookie(cookie, "https://www.facebook.com");
      }
      let messengerCookie = cookie.replace(/domain=\.facebook\.com/, "domain=.messenger.com");
      jar.setCookie(messengerCookie, "https://www.messenger.com");
    });
    return res;
  };
}

/**
 * arr is [name, value, ???, path]
 */
export function formatCookie(arr: string[], url: string) {
  return arr[0] + "=" + arr[1] + "; Path=" + arr[3] + "; Domain=" + url + ".com";
}

export function getAppState(jar: CookieJar) {
  return jar
    .getCookies("https://www.facebook.com")
    .concat(jar.getCookies("https://facebook.com"))
    .concat(jar.getCookies("https://www.messenger.com"));
}

export {
  formatMessage,
  formatThread,
  formatReadReceipt,
  formatRead,
  formatTyp,
  formatPresence,
  formatEvent,
  formatDeltaMessage
} from "./utils/formatters";
export {
  generateOfflineThreadingID,
  generateThreadingID,
  getType,
  isReadableStream,
  getSignatureID
} from "./utils/helpers";
export {get, post, postFormData} from "./utils/requests";
export let getJar = requestWithDefaults.jar;
