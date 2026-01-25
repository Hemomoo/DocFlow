export interface QuickCreateRoomDto {
  maxParticipants?: number;
  emptyTimeout?: number;
  metadata?: string;
}

export interface LiveKitConnectionDetailsDto {
  roomName: string;
  token: string;
  url: string;
  userName: string;
  userAvatar?: string;
}
