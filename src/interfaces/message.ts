import {Readable} from "stream";

export interface Message {
  body: string;
  sticker?: string;
  attachment?: Readable | Readable[];
  url?: string;
}
