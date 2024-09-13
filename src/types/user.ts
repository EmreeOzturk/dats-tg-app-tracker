export interface User {
  _id: string;
  ipAddress: string;
  username: string;
  location: string;
  downloadSpeed: number;
  uploadSpeed: number;
  points: number;
  totalTimeOfUsingApp: number;
  isFollowingTwitter: boolean;
  hasJoinedDiscord: boolean;
  hasJoinedTelegram: boolean;
  profilePhoto: string;
  evmAddress: string;
  substrateAddress: string;
}
