/**
 * This module contains interfaces for facebook's internal representation of attachments
 */

type AttachType = "sticker" | "file" | "photo" | "animated_image" | "share" | "video";

export interface FbAttachment {
  attach_type: AttachType;
}

// TODO: check ALL the types in this interface + document
export interface FbStickerAttachment {
  attach_type: "sticker";
  url: string;
  metadata: {
    stickerID: any; // TODO: add type: why is toString used in _formatAttachment ?
    packID: any; // TODO: add type: why is toString used in _formatAttachment ?
    frameCount: number; // I guess...
    frameRate: number;
    framesPerRow: number;
    framesPerCol: number;
    spriteURI: string;
    spriteURI2x: string;
    height: number;
    width: number;
    // caption: string;
    // description: string;
  }
}

// TODO: check ALL the types in this interface + document
export interface FbStickerInfo {
  caption: string;
  description: string;
}

// TODO: check ALL the types in this interface + document
export interface FbFileAttachment {
  attach_type: "file";
  name: string;
  url: string;
}

// TODO: check ALL the types in this interface + document
export interface FbFileInfo {
  id: any;
  file_size: number;
  is_malicious: boolean;
  mime_type: string;
}

// TODO: check ALL the types in this interface + document
export interface FbPhotoAttachment {
  attach_type: "photo";
  name: string;
  hires_url: string;
  thumbnail_url: string;
  preview_url: string;
  preview_width: number;
  preview_height: number;
  url: string;
}

// TODO: check ALL the types in this interface + document
export interface FbPhotoInfo {
  id: any; // TODO: type
  filename: string;
  mime_type: string;
  image_data: {
    url: string;
    width: number;
    height: number;
  }
}

// TODO: check ALL the types in this interface + document
export interface FbAnimatedImageAttachment {
  attach_type: "animated_image";
  name: string;
  url: string;
  preview_url: string;
  preview_width: number;
  preview_height: number;
  thumbnail_url: string;
}

// TODO: check ALL the types in this interface + document
export interface FbAnimatedImageInfo {
  id: any; // TODO: type
  filename: string;
  mime_type: string;
  image_data: {
    url: string;
    width: number;
    height: number;
    raw_gif_image: any; // TODO: type
    raw_webp_image: any; // TODO: type
    animated_gif_url: string;
    animated_gif_preview_url: string;
    animated_webp_url: string;
    animated_webp_preview_url: string;
  }
}

// TODO: check ALL the types in this interface + document
export interface FbShareAttachment {
  attach_type: "share";
  share: {
    description: string;
    share_id: any; // TODO: type
    subattachments: any; // TODO: type
    media: {
      animated_image_size: number;
      image_size: {
        width: number;
        height: number;
      }
      image: any; // TODO: type
      playable: boolean;
      duration: number;
    }
    source: string;
    title: string;
    uri: string;
  }
}

// TODO: check ALL the types in this interface + document
export interface FbShareInfo {
  href: string;
}

// TODO: check ALL the types in this interface + document
export interface FbVideoAttachment {
  attach_type: "video";
  name: string;
  thumbnail_url: string;
  preview_url: string;
  preview_width: number;
  preview_height: number;
  url: string;
  metadata: {
    fbid: any; // TODO: type
    duration: number;
    dimensions: {
      width: number;
      height: number;
    }
  }
}

// TODO: check ALL the types in this interface + document
export interface FbVideoInfo {}
