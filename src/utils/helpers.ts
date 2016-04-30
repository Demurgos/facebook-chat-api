import {Stream} from "stream";

/**
 * Checks if the supplied argument is a readable stream
 * @param obj
 * @returns {boolean}
 */
export function isReadableStream(obj: any): boolean {
  return obj instanceof Stream &&
    getType(obj._read) === 'Function' &&
    getType(obj._readableState) === 'Object';
}

/**
 * Adds zeros in front of the string `val` until its length is equal to or greater than `len`
 * @param val
 * @param len
 * @returns {string}
 */
export function padZeros(val: string | any, len: number = 2): string {
  let str: string = String(val);
  while (str.length < len){
    str = "0" + str;
  }
  return str;
}

/**
 * Converts the binary string `binString` to its decimal representation
 * @param binString
 * @returns {string}
 */
export function binaryToDecimal(binString: string): string {
  let decString = "";
  while (binString !== "0") {
    let end = 0;
    let fullName = "";
    for (let i = 0; i < binString.length; i++) {
      end = 2 * end + parseInt(binString[i], 10);
      if (end >= 10) {
        fullName += "1";
        end -= 10;
      } else {
        fullName += "0";
      }
    }
    decString = end.toString() + decString;
    binString = fullName.slice(fullName.indexOf("1"));
  }
  return decString;
}

/**
 * Returns a random unsigned 32 bits integer
 * @returns {number}
 */
export function randomUint32(): number {
  return Math.floor(Math.random() * 4294967295); // Math.pow(2, 32) - 1
}

/**
 * Returns a random unsigned 31 bits integer
 * @returns {number}
 */
export function randomUint31(): number {
  return Math.floor(Math.random() * 2147483648); // Math.pow(2, 31) - 1
}

export function generateThreadingID(clientID: number | string): string {
  let ret = Date.now();
  let value = randomUint32(); // Math.pow(2, 32) - 1
  let client = clientID;
  return `<${ret}:${value}-${client}@mail.projektitan.com>`;
}

export function generateOfflineThreadingID(): string {
  let ret = Date.now();
  let value = randomUint32();
  // str = padZeros((value % Math.pow(22)).toString(2), 22);
  let str = ("0000000000000000000000" + value.toString(2)).slice(-22);
  let messages = ret.toString(2) + str;
  return binaryToDecimal(messages);
}

export function getSignatureID(): string {
  return randomUint31().toString(16);
}

export function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}
