/**
 * The object passed in the callback has the following shape:
 * `threadID`, `participantIDs`, `formerParticipants`,
 * `name`, `snippet`, `snippetHasAttachment`, `snippetAttachments`,
 * `snippetSender`, `unreadCount`, `messageCount`, `imageSrc`,
 * `timestamp`, `serverTimestamp`, `muteSettings`, `isCanonicalUser`,
 * `isCanonical`, `canonicalFbid`, `isSubscribed`, `rootMessageThreadingID`,
 * `folder`, `isArchived`, `recipientsLoadable`, `hasEmailParticipant`,
 * `readOnly`, `canReply`, `composerEnabled`, `blockedParticipants`, `lastMessageID`
 */
export interface Thread {
  threadID: string;
  participantIDs: string[];
  formerParticipants: string[];
  name: string;
  snippet: string;
  snippetHasAttachment: boolean;
  snippetAttachments: string[];
  snippetSender: string;
  unreadCount: number;
  messageCount: number;
  imageSrc: string;
  timestamp: any;
  serverTimestamp: string;
  muteSettings: any[];
  isCanonicalUser: boolean;
  isCanonical: boolean;
  canonicalFbid: number;
  isSubscribed: boolean;
  rootMessageThreadingID: number;
  folder: string;
  isArchived: boolean;
  recipientsLoadable: any;
  hasEmailParticipant: boolean;
  readOnly: boolean;
  canReply: boolean;
  composerEnabled: boolean;
  blockedParticipants: string[];
  lastMessageID: number;
}
