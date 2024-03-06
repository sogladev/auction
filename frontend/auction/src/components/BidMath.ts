import { Auction, Bids, Room } from 'src/components/models';

export function minimumAcceptableBid(auction: Auction, room: Room): number {
  // if no bid: minimumPrice
  // if existing bid: bid + minimumIncrement
  const noBidHasBeenPlaced = !(typeof auction.bidderName === 'string');
  if (noBidHasBeenPlaced) {
    console.log('minimumAcceptableBid: noBidHasBeenPlaced');
    return auction.minimumPrice as number;
  } else {
    console.log('minimumAcceptableBid: BidHasBeenPlaced');
    return (auction.bid as number) + room.minimumBidIncrement;
  }
}

export function getNextIncrement(
  auction: Auction,
  room: Room,
  bids: Bids,
): number {
  // increment myBid with minimumBidIncrement
  // unless we do not have a valid bid then return minimumBid
  const myBid = bids.getBid(auction.itemId, auction.rowId);
  const minimumBid = minimumAcceptableBid(auction, room);
  console.log('GetNextIncrement: minimumBid: ', minimumBid);
  if (myBid === undefined || isNaN(myBid) || myBid < minimumBid) {
    return minimumBid;
  }
  return myBid + room.minimumBidIncrement;
}
