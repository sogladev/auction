export type Auction = {
  rowId: number;
  itemId: number;
  expiration?: number;
  guid?: string;
  itemLevel?: number;
  itemName?: string;
  itemSubType?: string;
  itemType?: string;
  minLevel?: number;
  minimumPrice?: number;
  quality?: number;
  status?: number;
  bid?: number;
  bidderName?: string;
  myBid?: number;
};

export type Room = {
  name: string;
  id: string;
  enableDiscordProtection: boolean;
  bidDurationInSeconds: number;
  countDownTimeInSeconds: number;
  restrictBidsToEquipable: boolean;
  hideNameOfHighestBidder: boolean;
  hidePayoutDetails: boolean;
  organiserFee: number;
  minimumBid: number;
  minimumBidIncrement: number;
  auctions: Auction[];
};

export type BidRequest = {
  itemId: number;
  rowId: number;
  myBid: number;
  myName: string;
};
