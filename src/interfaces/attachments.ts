export type AttachmentType = 'sticker' | 'file' | 'photo' | 'animated_image' | 'share' | 'video';

export interface BaseAttachment {
  type: AttachmentType;
}

/**
 * If `attachments` contains an object with type is `"sticker"`, the same object will contain the following fields:
 * `url`, `stickerID`, `packID`, `frameCount`, `frameRate`,
 * `framesPerRow`, `framesPerCol`, `spriteURI`, `spriteURI2x`,
 * `height`, `width`, `caption`, `description`.
 */
export interface StickerAttachment extends BaseAttachment {
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

/**
 * If `attachments` contains an object with type is `"file"`, the same object will contain the following fields:
 * `name`, `url`, `ID`, `fileSize`, `isMalicious`, `mimeType`.
 */
export interface FileAttachment extends BaseAttachment {
  type: "file";
  name: string;
  url: string;
  ID: number;
  fileSize: number;
  isMalicious: boolean;
  mimeType: string;
}

/**
 * If `attachments` contains an object with type is `"photo"`, the same object will contain the following fields:
 * `name`, `hiresUrl`, `thumbnailUrl`, `previewUrl`, `previewWidth`,
 * `previewHeight`, `facebookUrl`, `ID`, `filename`, `mimeType`,
 * `url`, `width`, `height`.
 */
export interface PhotoAttachment extends BaseAttachment {
  type: "photo";
  name: string;
  hiresUrl: string; // TODO: check this type
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

/**
 * If `animated_image` contains an object with type is `"animated_image"`, the same object will contain the following fields:
 * `name`, `facebookUrl`, `previewUrl`, `previewWidth`, `previewHeight`,
 * `thumbnailUrl`, `ID`, `filename`, `mimeType`, `width`, `height`,
 * `url`, `rawGifImage`, `rawWebpImage`, `animatedGifUrl`,
 * `animatedGifPreviewUrl`, `animatedWebpUrl`, `animatedWebpPreviewUrl`
 */
export interface AnimatedImageAttachment extends BaseAttachment {
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

/**
 * If `attachments` contains an object with type is `"share"`, the same object will contain the following fields:
 * `description`, `ID`, `subattachments`, `animatedImageSize`, `width`,
 * `height`, `image`, `playable`, `duration`, `source`, `title`,
 * `facebookUrl`, `url`.
 */
export interface ShareAttachment extends BaseAttachment {
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

// TODO: Document video attachments
/**
 * If `attachments` contains an object with type is `"share"`, the same object will contain the following fields:
 * `description`, `ID`, `subattachments`, `animatedImageSize`, `width`,
 * `height`, `image`, `playable`, `duration`, `source`, `title`,
 * `facebookUrl`, `url`.
 */
export interface VideoAttachment extends BaseAttachment {
  type: "video";
  filename: string;
  thumbnailUrl: string;
  previewUrl: string;
  previewWidth: number;
  previewHeight: number;
  ID: string;
  url: string;
  width: number;
  height: number;
  duration: number;
}

export type Attachment = StickerAttachment | FileAttachment | PhotoAttachment | AnimatedImageAttachment | ShareAttachment | VideoAttachment;
