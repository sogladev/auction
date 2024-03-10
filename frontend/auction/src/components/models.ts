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
  status?: Status;
  bid?: number;
  bidderName?: string;
  icon?: string;
};

export type User = {
  name: string;
};

export type Room = {
  name: string;
  id: string;
  namespace: Namespace;
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
  users: User[];
};

export type BidRequest = {
  itemId: number;
  rowId: number;
  myBid: number;
  myName: string;
};

export enum Status {
  Pending = 1,
  Bidding = 2,
  Assigned = 3,
}

export enum Namespace {
  Progression = 'static-classic-eu',
  Era = 'static-classic1x-eu',
  Retail = 'static-eu',
}
export class Bids {
  public bids: { [key: string]: number } = {};
  public watch: { [key: string]: boolean } = {};

  setBid(itemId: number, rowId: number, bidAmount: number) {
    this.bids[`${itemId}-${rowId}`] = bidAmount;
  }

  getBid(itemId: number, rowId: number) {
    return this.bids[`${itemId}-${rowId}`];
  }

  setWatchValue(itemId: number, rowId: number, isWatched: boolean) {
    this.watch[`${itemId}-${rowId}`] = isWatched;
  }

  getWatchValue(itemId: number, rowId: number) {
    console.log('get');
    return this.watch[`${itemId}-${rowId}`] == null
      ? false
      : this.watch[`${itemId}-${rowId}`];
  }

  toggleWatch(itemId: number, rowId: number) {
    this.watch[`${itemId}-${rowId}`] =
      this.watch[`${itemId}-${rowId}`] == null
        ? true
        : !this.watch[`${itemId}-${rowId}`];
    console.log('toggle: ', this.getWatchValue(itemId, rowId));
  }

  setWatch(itemId: number, rowId: number) {
    this.watch[`${itemId}-${rowId}`] = true;
  }

  unsetWatch(itemId: number, rowId: number) {
    this.watch[`${itemId}-${rowId}`] = false;
  }
}
