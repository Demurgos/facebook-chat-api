import {Dictionary} from "../interfaces";

import {FbAttachment, FbStickerAttachment, FbStickerInfo, FbFileAttachment, FbFileInfo, FbPhotoAttachment, FbPhotoInfo,
  FbAnimatedImageAttachment, FbAnimatedImageInfo, FbShareAttachment, FbShareInfo, FbVideoAttachment, FbVideoInfo
} from "../../interfaces/fb-attachments";

import {
  Attachment, StickerAttachment, FileAttachment, PhotoAttachment,
  AnimatedImageAttachment, ShareAttachment, VideoAttachment
} from "../../interfaces/attachments";


function formatStickerAttachment(attachment1: FbStickerAttachment, attachment2: FbStickerInfo): StickerAttachment {
  return {
    type: "sticker",
    url: attachment1.url,
    stickerID: attachment1.metadata.stickerID.toString(),
    packID: attachment1.metadata.packID.toString(),
    frameCount: attachment1.metadata.frameCount,
    frameRate: attachment1.metadata.frameRate,
    framesPerRow: attachment1.metadata.framesPerRow,
    framesPerCol: attachment1.metadata.framesPerCol,
    spriteURI: attachment1.metadata.spriteURI,
    spriteURI2x: attachment1.metadata.spriteURI2x,
    height: attachment1.metadata.height,
    width: attachment1.metadata.width,

    caption: attachment2.caption,
    description: attachment2.description,
  };
}

function formatFileAttachment(attachment1: FbFileAttachment, attachment2: FbFileInfo): FileAttachment {
  return {
    type: "file",
    name: attachment1.name,
    url: attachment1.url,

    ID: attachment2.id.toString(),
    fileSize: attachment2.file_size,
    isMalicious: attachment2.is_malicious,
    mimeType: attachment2.mime_type,
  };
}

function formatPhotoAttachment(attachment1: FbPhotoAttachment, attachment2: FbPhotoInfo): PhotoAttachment {
  return {
    type: "photo",
    name: attachment1.name, // Do we need this?
    hiresUrl: attachment1.hires_url,
    thumbnailUrl: attachment1.thumbnail_url,
    previewUrl: attachment1.preview_url,
    previewWidth: attachment1.preview_width,
    previewHeight: attachment1.preview_height,
    facebookUrl: attachment1.url, // wtf is this?

    ID: attachment2.id.toString(),
    filename: attachment2.filename,
    mimeType: attachment2.mime_type,
    url: attachment2.image_data.url,
    width: attachment2.image_data.width,
    height: attachment2.image_data.height,
  };
}

function formatAnimatedImageAttachment(attachment1: FbAnimatedImageAttachment, attachment2: FbAnimatedImageInfo): AnimatedImageAttachment {
  return {
    type: "animated_image",
    name: attachment1.name,
    facebookUrl: attachment1.url,
    previewUrl: attachment1.preview_url,
    previewWidth: attachment1.preview_width,
    previewHeight: attachment1.preview_height,
    thumbnailUrl: attachment1.thumbnail_url,

    ID: attachment2.id.toString(),
    filename: attachment2.filename,
    mimeType: attachment2.mime_type,
    width: attachment2.image_data.width,
    height: attachment2.image_data.height,
    url: attachment2.image_data.url,
    rawGifImage: attachment2.image_data.raw_gif_image,
    rawWebpImage: attachment2.image_data.raw_webp_image,
    animatedGifUrl: attachment2.image_data.animated_gif_url,
    animatedGifPreviewUrl: attachment2.image_data.animated_gif_preview_url,
    animatedWebpUrl: attachment2.image_data.animated_webp_url,
    animatedWebpPreviewUrl: attachment2.image_data.animated_webp_preview_url,
  };
}

function formatShareAttachment(attachment1: FbShareAttachment, attachment2: FbShareInfo): ShareAttachment {
  return {
    type: "share",
    description: attachment1.share.description,
    ID: attachment1.share.share_id.toString(),
    subattachments: attachment1.share.subattachments,
    animatedImageSize: attachment1.share.media.animated_image_size,
    width: attachment1.share.media.image_size.width,
    height: attachment1.share.media.image_size.height,
    image: attachment1.share.media.image,
    playable: attachment1.share.media.playable,
    duration: attachment1.share.media.duration,
    source: attachment1.share.source,
    title: attachment1.share.title,
    facebookUrl: attachment1.share.uri,

    url: attachment2.href,
  };
}

function formatVideoAttachment(attachment1: FbVideoAttachment, attachment2: FbVideoInfo): VideoAttachment {
  return {
    type: "video",
    filename: attachment1.name,
    thumbnailUrl: attachment1.thumbnail_url,
    previewUrl: attachment1.preview_url,
    previewWidth: attachment1.preview_width,
    previewHeight: attachment1.preview_height,
    ID: attachment1.metadata.fbid.toString(),
    url: attachment1.url,
    width: attachment1.metadata.dimensions.width,
    height: attachment1.metadata.dimensions.height,
    duration: attachment1.metadata.duration,
  };
}

/**
 * Formats one facebook attachment with its information to produce a normalized attachment
 * @param attachment
 * @param info
 * @returns {any}
 */
export function formatAttachment(attachment: FbAttachment, info?: any): Attachment {
  // TODO: THIS IS REALLY BAD
  info = info || {id: "", image_data: {}};

  switch (attachment.attach_type) {
    case "sticker":
      return formatStickerAttachment(<FbStickerAttachment> attachment, info);
    case "file":
      return formatFileAttachment(<FbFileAttachment> attachment, <FbFileInfo> info);
    case "photo":
      return formatPhotoAttachment(<FbPhotoAttachment> attachment, <FbPhotoInfo> info);
    case "animated_image":
      return formatAnimatedImageAttachment(<FbAnimatedImageAttachment> attachment, <FbAnimatedImageInfo> info);
    case "share":
      return formatShareAttachment(<FbShareAttachment> attachment, <FbShareInfo> info);
    case "video":
      return formatVideoAttachment(<FbVideoAttachment> attachment, <FbVideoInfo> info);
    default:
      throw new Error("unrecognized attach_file `" + JSON.stringify(attachment) + "`");
  }
}

/**
 *
 * @param attachments
 * @param attachmentIds
 * @param attachmentInfoMap a map from attachmentID to the corresponding attachmentInfo
 * @param shareMap
 * @returns {any}
 */
export function formatAttachments(attachments: FbAttachment[], attachmentIds: Dictionary<any>, attachmentInfoMap: Dictionary<any>, shareMap) {
  if (!attachments) {
    return [];
  }

  attachmentInfoMap = shareMap || attachmentInfoMap;

  return attachments
    .map((attachment, idx) => {
      if (!attachmentInfoMap || !attachmentIds || !attachmentInfoMap[attachmentIds[idx]]) {
        return formatAttachment(attachment);
      }
      return formatAttachment(attachment, attachmentInfoMap[attachmentIds[idx]]);
    });
}

export default formatAttachments;
