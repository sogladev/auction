import { Auction, Room } from 'src/components/models';

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

export function getNextIncrement(auction: Auction, room: Room): number {
  // increment myBid with minimumBidIncrement
  // unless we do not have a valid bid then return minimumBid
  const minimumBid = minimumAcceptableBid(auction, room);
  console.log('GetNextIncrement: minimumBid: ', minimumBid);
  if (
    auction.myBid === undefined ||
    isNaN(auction.myBid) ||
    auction.myBid < minimumBid
  ) {
    return minimumBid;
  }
  return auction.myBid + room.minimumBidIncrement;
}
