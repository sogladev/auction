import { calculateBidIncrement } from 'src/components/AuctionIncrement'
import { AuctionState, RoomState } from 'src/components/models'

import { describe, expect, it } from 'vitest';

const room = <RoomState>{
  minimumBidIncrement: 10
};

const auction = <AuctionState>{
  bid: 100,
};

describe('calculateBidIncrement', () => {
  it('should return minimum bid increment if no bid placed', () => {
    auction.myBid = undefined

    const result = calculateBidIncrement(auction, room);

    expect(result).toEqual(110);
  });

  it('should increment existing bid by minimum bid increment', () => {
    auction.myBid = 105

    const result = calculateBidIncrement(auction, room);

    expect(result).toEqual(115);
  });

  it('should return minimum required bid if new increment+myBid is lower', () => {
    auction.myBid = 80

    const result = calculateBidIncrement(auction, room);

    expect(result).toEqual(110);
  });

  it('should handle invalid myBid values', () => {
    auction.myBid = 'invalid'

    const result = calculateBidIncrement(auction, room);

    expect(result).toEqual(110);
  } );
});
