import {Dictionary, FbPresence} from "./interfaces";

/**
 * This module encodes/decodes facebook's presence JSON strings
 */

let presenceRegExp: RegExp;
let toEncoded: Dictionary<string> = {};

/**
 * A map to go from an encoded character to a decoded value (this value is just an URI-encoded string)
 **/
let fromEncoded: Dictionary<string> = {
  _: '%',
  A: '%2',
  B: '000',
  C: '%7d',
  D: '%7b%22',
  E: '%2c%22',
  F: '%22%3a',
  G: '%2c%22ut%22%3a1',
  H: '%2c%22bls%22%3a',
  I: '%2c%22n%22%3a%22%',
  J: '%22%3a%7b%22i%22%3a0%7d',
  K: '%2c%22pt%22%3a0%2c%22vis%22%3a',
  L: '%2c%22ch%22%3a%7b%22h%22%3a%22',
  M: '%7b%22v%22%3a2%2c%22time%22%3a1',
  N: '.channel%22%2c%22sub%22%3a%5b',
  O: '%2c%22sb%22%3a1%2c%22t%22%3a%5b',
  P: '%2c%22ud%22%3a100%2c%22lc%22%3a0',
  Q: '%5d%2c%22f%22%3anull%2c%22uct%22%3a',
  R: '.channel%22%2c%22sub%22%3a%5b1%5d',
  S: '%22%2c%22m%22%3a0%7d%2c%7b%22i%22%3a',
  T: '%2c%22blc%22%3a1%2c%22snd%22%3a1%2c%22ct%22%3a',
  U: '%2c%22blc%22%3a0%2c%22snd%22%3a1%2c%22ct%22%3a',
  V: '%2c%22blc%22%3a0%2c%22snd%22%3a0%2c%22ct%22%3a',
  W: '%2c%22s%22%3a0%2c%22blo%22%3a0%7d%2c%22bl%22%3a%7b%22ac%22%3a',
  X: '%2c%22ri%22%3a0%7d%2c%22state%22%3a%7b%22p%22%3a0%2c%22ut%22%3a1',
  Y: '%2c%22pt%22%3a0%2c%22vis%22%3a1%2c%22bls%22%3a0%2c%22blc%22%3a0%2c%22snd%22%3a1%2c%22ct%22%3a',
  Z: '%2c%22sb%22%3a1%2c%22t%22%3a%5b%5d%2c%22f%22%3anull%2c%22uct%22%3a0%2c%22s%22%3a0%2c%22blo%22%3a0%7d%2c%22bl%22%3a%7b%22ac%22%3a'
};

let decodedValues = [];
for (let decoded in fromEncoded) {
  toEncoded[fromEncoded[decoded]] = decoded;
  decodedValues.push(fromEncoded[decoded]);
}
decodedValues.reverse();
presenceRegExp = new RegExp(decodedValues.join("|"), 'g');

// TODO: Is this encoding function sensitive to the order of the properties ?
export function encodePresenceJSON(decodedJSON: string): string {
  return encodeURIComponent(decodedJSON)
    .replace(/([_A-Z])|%../g, (m, n) => {
      return n ? '%' + n.charCodeAt(0).toString(16) : m;
    })
    .toLowerCase()
    .replace(presenceRegExp, m => toEncoded[m]);
}

export function decodePresenceJSON(encodedJSON: string): string {
  return decodeURIComponent(encodedJSON.replace(/[_A-Z]/g, m => fromEncoded[m]));
}

export function encodePresence (presence: FbPresence): string {
  return encodePresenceJSON(JSON.stringify(presence));
}

export function decodePresence(encoded: string): FbPresence {
  return JSON.parse(decodePresenceJSON(encoded));
}
