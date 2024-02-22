
import { AuctionState } from 'src/components/models'

export function calculateBidIncrement(auction: AuctionState, room: RoomState): number{
  // TODO: If undefined, should check if there's a highest bidder, if not. Set to minbid
  // TODO: UnitTest
  // ensures that a user's bid is increased to
  // at least the minimum allowable bid amount
  // based on the current bid and the configured increment
    const minimumNewBid: number = auction.bid + room.minimumBidIncrement;
    let newBid: number;
    const noBidHasBeenPlaced = auction.myBid === undefined || isNaN(auction.myBid);
    if (noBidHasBeenPlaced) {
      newBid = minimumNewBid;
    } else {
      // increment bid by the minimum increment to get a new bid amount.
      const myNewBid = auction.myBid + room.minimumBidIncrement;
      // check new amount is not lower than the minimum
      newBid = myNewBid > minimumNewBid ? myNewBid : minimumNewBid;
    }
    return newBid
}
