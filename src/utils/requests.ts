import {IncomingMessage} from "http";

import * as Bluebird from "bluebird";
import * as request from "request";

import {getType} from "./helpers";

import {Url} from "url";
import {Dictionary} from "./interfaces";

type RequestOptions = request.CoreOptions & request.RequiredUriUrl;
export interface JSONResultHeaders {
  [header: string]: string;
  location?: string;
}

export interface JSONResult {
  statusCode: number;
  body: any; // string | Buffer;
  headers: JSONResultHeaders;
  request: {
    uri: Url;
    method: string;
    headers: JSONResultHeaders;
    formData: Dictionary<string>;
  };
}

export let requestWithDefaults = request.defaults({jar: true});

interface Headers {
  'Content-Type': string;
  'Referer': string;
  'Host': string;
  'Origin': string;
  'User-Agent': string;
  'Connection': string;
}

function getHeaders(url: string): Headers {
  let headers: Headers = {
    'Content-Type' : 'application/x-www-form-urlencoded',
    'Referer' : 'https://www.facebook.com/',
    'Host' : url.replace('https://', '').split("/")[0], // extract the hostname
    'Origin' : 'https://www.facebook.com',
    'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18',
    'Connection' : 'keep-alive',
  };

  return headers;
}

export function get(url: string, jar: request.CookieJar, queryString?: Dictionary<any>): Bluebird<JSONResult> {
  // I'm still confused about this
  if(getType(queryString) === "Object") {
    for(let prop in queryString) {
      if(queryString.hasOwnProperty(prop) && getType(queryString[prop]) === "Object") {
        queryString[prop] = JSON.stringify(queryString[prop]);
      }
    }
  }

  let options: RequestOptions = {
    headers: getHeaders(url),
    timeout: 60000,
    qs: queryString,
    url: url,
    method: "GET",
    jar: jar,
    gzip: true
  };

  return Bluebird.fromCallback((cb) => {
    requestWithDefaults(options, (error, response, body) => {
      if (error) {
        return cb(error);
      }
      cb(null, <JSONResult> <any> response);
    });
  });
}

export function post(url: string, jar: request.CookieJar, form: Dictionary<any>): Bluebird<JSONResult> {
  let options: RequestOptions = {
    headers: getHeaders(url),
    timeout: 60000,
    url: url,
    method: "POST",
    form: form,
    jar: jar,
    gzip: true
  };

  return Bluebird.fromCallback((cb) => {
    requestWithDefaults(options, (error, response, body) => {
      if (error) {
        return cb(error);
      }
      cb(null, <JSONResult> <any> response);
    });
  });
}

export function postFormData(url: string, jar: request.CookieJar, form: Dictionary<any>, queryString: Dictionary<any>): Bluebird<JSONResult> {
  let headers: Headers = getHeaders(url);
  headers['Content-Type'] = 'multipart/form-data';

  let options: RequestOptions = {
    headers: headers,
    timeout: 60000,
    url: url,
    method: "POST",
    formData: form,
    qs: queryString,
    jar: jar,
    gzip: true
  };

  return Bluebird.fromCallback((cb) => {
    requestWithDefaults(options, (error, response, body) => {
      if (error) {
        return cb(error);
      }
      cb(null, <JSONResult> <any> response);
    });
  });
}
