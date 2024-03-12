import { Auction, Bids, RoomSettings } from 'src/components/models';

export function minimumAcceptableBid(auction: Auction, settings: RoomSettings): number {
  // if no bid: minimumPrice
  // if existing bid: bid + minimumIncrement
  const noBidHasBeenPlaced = !(typeof auction.bidderName === 'string');
  if (noBidHasBeenPlaced) {
    return auction.minimumPrice as number;
  } else {
    return (auction.bid as number) + settings.minimumBidIncrement;
  }
}

export function getNextIncrement(
  auction: Auction,
  settings: RoomSettings,
  bids: Bids,
): number {
  // increment myBid with minimumBidIncrement
  // unless we do not have a valid bid then return minimumBid
  const myBid = bids.getBid(auction.itemId, auction.rowId);
  const minimumBid = minimumAcceptableBid(auction, settings);
  if (myBid == null || isNaN(myBid) || myBid < minimumBid) {
    return minimumBid;
  }
  return myBid + settings.minimumBidIncrement;
}
