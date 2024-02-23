import { AuctionState, RoomState } from 'src/components/models';

export function calculateBidIncrement(
  auction: AuctionState,
  room: RoomState,
): number {
  // ensures that a user's bid is increased to
  // at least the minimum allowable bid amount
  // based on the current bid, minimum bid and the configured increment
  const noBidHasBeenPlaced = auction.bid === undefined || isNaN(auction.bid);
  const noMyBidHasBeenPlaced = auction.myBid === undefined || isNaN(auction.myBid);
  if (noBidHasBeenPlaced) {
    return noMyBidHasBeenPlaced ? auction.minimumPrice : auction.myBid + room.minimumBidIncrement;
  }
  const minimumNewBid: number = auction.bid + room.minimumBidIncrement;
  let newBid: number;
  if (noMyBidHasBeenPlaced) {
    newBid = minimumNewBid;
  } else {
    // increment bid by the minimum increment to get a new bid amount.
    const myNewBid = auction.myBid + room.minimumBidIncrement;
    // check new amount is not lower than the minimum
    newBid = myNewBid > minimumNewBid ? myNewBid : minimumNewBid;
  }
  return newBid;
}
