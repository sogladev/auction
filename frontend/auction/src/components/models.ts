export type RoomState = {
  lootmaster?: string;
  enableDiscordProtection?: boolean;
  bidDurationInSeconds?: number;
  countDownTimeInSeconds?: number;
  restrictBidsToEquipable?: boolean;
  hideNameOfHighestBidder?: boolean;
  hidePayoutDetails?: boolean;
  organiserFee?: number;
  minimumBid?: number;
  minimumBidIncrement?: number;
};

export type AuctionState = {
  expiration?: number,
  guid?: string,
  itemId?: number,
  itemLevel?: number,
  itemName?: string,
  itemSubType?: string,
  itemType?: string,
  minLevel?: number,
  minimumPrice?: number,
  quality?: number,
  rowId?: number,
  status?: number,
  myBid?: number,
  bid?: number,
  bidderName?: string,
};

export type Bid = {
  itemId?: number,
  rowId?: number,
  myBid?: number,
  myName?: string,
};
