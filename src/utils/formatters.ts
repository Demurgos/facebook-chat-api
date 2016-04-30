import {formatAttachment, formatAttachments} from "./formatters/attachments";

export function formatEvent(m) {
  return {
    type: "event",
    threadID: m.thread_fbid.toString(),
    logMessageType: m.log_message_type,
    logMessageData: m.log_message_data,
    logMessageBody: m.log_message_body,
    author: m.author.split(":")[1]
  };
}

export function formatTyp(event) {
  return {
    isTyping: !!event.st,
    from: event.from.toString(),
    threadID: (event.to || event.thread_fbid || event.from).toString(),
    fromMobile: !!event.from_mobile,
    // TODO: remove this in the next release
    from_mobile: !!event.from_mobile,
    userID: (event.realtime_viewer_fbid || event.from).toString(),
    type: 'typ',
  };
}

export function formatReadReceipt(event) {
  return {
    reader: event.reader.toString(),
    time: event.time,
    threadID: (event.thread_fbid || event.reader).toString(),
    type: 'read_receipt',
  };
}

export function formatRead(event) {
  return {
    threadID: ((event.chat_ids && event.chat_ids[0]) || (event.thread_fbids && event.thread_fbids[0])).toString(),
    time: event.timestamp,
    type: 'read'
  };
}

export function formatDeltaMessage(m){
  var md = m.delta.messageMetadata;
  return {
    type: "message",
    senderID: md.actorFbId,
    body: m.delta.body,
    threadID: (md.threadKey.threadFbId || md.threadKey.otherUserFbId).toString(),
    messageID: md.messageId,
    attachments: (m.delta.attachments || []).map(v => formatAttachment(v.mercury)),
    timestamp: md.timestamp,
    isGroup: !!md.threadKey.threadFbId
  }
}

export function formatMessage(m) {
  var originalMessage = m.message ? m.message : m;
  var obj = {
    type: "message",
    senderName: originalMessage.sender_name,
    senderID: originalMessage.sender_fbid.toString(),
    participantNames: (originalMessage.group_thread_info ? originalMessage.group_thread_info.participant_names : [originalMessage.sender_name.split(' ')[0]]),
    participantIDs: (originalMessage.group_thread_info ? originalMessage.group_thread_info.participant_ids.map(function(v) {return v.toString();}) : [originalMessage.sender_fbid]),
    body: originalMessage.body,
    threadID: originalMessage.tid && originalMessage.tid.split(".")[0] === "id" ? originalMessage.tid.split('.')[1] : originalMessage.thread_fbid || originalMessage.other_user_fbid,
    threadName: (originalMessage.group_thread_info ? originalMessage.group_thread_info.name : originalMessage.sender_name),
    location: originalMessage.coordinates ? originalMessage.coordinates : null,
    messageID: originalMessage.mid ? originalMessage.mid.toString() : originalMessage.message_id,
    attachments: formatAttachments(originalMessage.attachments, originalMessage.attachmentIds, originalMessage.attachment_map, originalMessage.share_map),
    timestamp: originalMessage.timestamp,
    timestampAbsolute: originalMessage.timestamp_absolute,
    timestampRelative: originalMessage.timestamp_relative,
    timestampDatetime: originalMessage.timestamp_datetime,
    pageID: m.type === "pages_messaging" ? m.realtime_viewer_fbid.toString() : null,
    isGroup: obj.participantIDs.length > 2,
  };

  return obj;
}

export function formatThread(data) {
  return {
    threadID: data.thread_fbid.toString(),
    participants: data.participants.map(function (v) {
      return v.replace('fbid:', '');
    }),
    participantIDs: data.participants.map(function (v) {
      return v.replace('fbid:', '');
    }),
    formerParticipants: data.former_participants,
    name: data.name,
    snippet: data.snippet,
    snippetHasAttachment: data.snippet_has_attachment,
    snippetAttachments: data.snippet_attachments,
    snippetSender: (data.snippet_sender || '').replace('fbid:', ''),
    unreadCount: data.unread_count,
    messageCount: data.message_count,
    imageSrc: data.image_src,
    timestamp: data.timestamp,
    serverTimestamp: data.server_timestamp, // what is this?
    muteSettings: data.muteSettings,
    isCanonicalUser: data.is_canonical_user,
    isCanonical: data.is_canonical,
    canonicalFbid: data.canonical_fbid,
    isSubscribed: data.is_subscribed,
    rootMessageThreadingID: data.root_message_threading_id,
    folder: data.folder,
    isArchived: data.is_archived,
    recipientsLoadable: data.recipients_loadable,
    hasEmailParticipant: data.has_email_participant,
    readOnly: data.read_only,
    canReply: data.can_reply,
    composerEnabled: data.composer_enabled,
    blockedParticipants: data.blocked_participants,
    lastMessageID: data.last_message_id
  };
}


export function formatPresence(presence, userID) {
  return {
    type: "presence",
    timestamp: presence.la * 1000,
    userID: userID,
    statuses: presence.p
  };
}

export {formatDate} from "./formatters/date";
export {formatAttachment, formatAttachments} from "./formatters/attachments";
