export type AttachmentType = 'sticker' | 'file' | 'photo' | 'animated_image' | 'share';

export interface BaseAttachment {
  type: AttachmentType;
}

export interface StickerAttachment extends BaseAttachment {
  /**
   * If `attachments` contains an object with type is `"sticker"`, the same object will contain the following fields:
   * `url`, `stickerID`, `packID`, `frameCount`, `frameRate`,
   * `framesPerRow`, `framesPerCol`, `spriteURI`, `spriteURI2x`,
   * `height`, `width`, `caption`, `description`.
   */
    type: "sticker";
  url: string;
  stickerID: number;
  packID: number;
  frameCount: number;
  frameRate: number;
  framesPerRow: number;
  framesPerCol: number;
  spriteURI: string;
  spriteURI2x: string;
  height: number;
  width: number;
  caption: string;
  description: string;
}

export interface FileAttachment extends BaseAttachment {
  /**
   * If `attachments` contains an object with type is `"file"`, the same object will contain the following fields:
   * `name`, `url`, `ID`, `fileSize`, `isMalicious`, `mimeType`.
   */
    type: "file";
  name: string;
  url: string;
  ID: number;
  fileSize: number;
  isMalicious: boolean;
  mimeType: string;
}

export interface PhotoAttachment extends BaseAttachment {
  /**
   * If `attachments` contains an object with type is `"photo"`, the same object will contain the following fields:
   * `name`, `hiresUrl`, `thumbnailUrl`, `previewUrl`, `previewWidth`,
   * `previewHeight`, `facebookUrl`, `ID`, `filename`, `mimeType`,
   * `url`, `width`, `height`.
   */
    type: "photo";
  name: string;
  hiresUrl: string[];
  thumbnailUrl: string;
  previewUrl: string;
  previewWidth: number;
  previewHeight: number;
  facebookUrl: string;
  ID: number;
  filename: string;
  mimeType: string;
  url: string;
  width: number;
  height: number;
}

export interface AnimatedImageAttachment extends BaseAttachment {
  /**
   * If `animated_image` contains an object with type is `"animated_image"`, the same object will contain the following fields:
   * `name`, `facebookUrl`, `previewUrl`, `previewWidth`, `previewHeight`,
   * `thumbnailUrl`, `ID`, `filename`, `mimeType`, `width`, `height`,
   * `url`, `rawGifImage`, `rawWebpImage`, `animatedGifUrl`,
   * `animatedGifPreviewUrl`, `animatedWebpUrl`, `animatedWebpPreviewUrl`
   */
    type: "animated_image";
  name: string;
  facebookUrl: string;
  previewUrl: string;
  previewWidth: number;
  previewHeight: number;
  thumbnailUrl: string;
  ID: number;
  filename: string;
  mimeType: string;
  width: number;
  height: number;
  url: string;
  rawGifImage: any; // TODO
  rawWebpImage: any;  // TODO
  animatedGifUrl: string;
  animatedGifPreviewUrl: string;
  animatedWebpUrl: string;
  animatedWebpPreviewUrl: string;
}

export interface ShareAttachment extends BaseAttachment {
  /**
   * If `attachments` contains an object with type is `"share"`, the same object will contain the following fields:
   * `description`, `ID`, `subattachments`, `animatedImageSize`, `width`,
   * `height`, `image`, `playable`, `duration`, `source`, `title`,
   * `facebookUrl`, `url`.
   */
    type: "share";
  description: string;
  ID: number;
  subattachments: Attachment; // TODO
  animatedImageSize: number;
  width: number;
  height: number;
  image: any; // TODO : see above for images
  playable: boolean;
  duration: number;
  source: string;
  title: string;
  facebookUrl: string;
  url: string;
}

export type Attachment = StickerAttachment | FileAttachment | PhotoAttachment | AnimatedImageAttachment | ShareAttachment;
