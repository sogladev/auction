import { minimumAcceptableBid } from 'src/components/MinimumAcceptableBid';
import { AuctionState, RoomState } from 'src/components/models';

import { describe, expect, it } from 'vitest';

describe('calculateBidIncrement', () => {
  it('should return minimum bid increment if no bid placed and no my bid placed', () => {
    const room = <RoomState>{
      minimumBidIncrement: 10,
      minimumBid: 50,
    };

    const auction = <AuctionState>{
      minimumPrice: 150,
      bid: undefined,
      myBid: undefined,
    };

    const result = minimumAcceptableBid(auction, room);

    expect(result).toEqual(150);
  });

  it('should return bid increment if min bid placed and not my bid placed', () => {
    const room = <RoomState>{
      minimumBidIncrement: 10,
      minimumBid: 50,
    };

    const auction = <AuctionState>{
      minimumPrice: 150,
      bid: 150,
      myBid: undefined,
    };

    const result = minimumAcceptableBid(auction, room);

    expect(result).toEqual(160);
  });
  it('should return bid increment if bid is placed and not my bid placed', () => {
    const room = <RoomState>{
      minimumBidIncrement: 10,
      minimumBid: 50,
    };

    const auction = <AuctionState>{
      minimumPrice: 150,
      bid: 200,
      myBid: undefined,
    };

    const result = minimumAcceptableBid(auction, room);

    expect(result).toEqual(210);
  });
  it('should return my bid increment if my bid is higher than bid', () => {
    const room = <RoomState>{
      minimumBidIncrement: 10,
      minimumBid: 50,
    };

    const auction = <AuctionState>{
      minimumPrice: 150,
      bid: 200,
      myBid: 220,
    };

    const result = minimumAcceptableBid(auction, room);

    expect(result).toEqual(230);
  });

  it('should return bid increment if invalid my bid is placed', () => {
    const room = <RoomState>{
      minimumBidIncrement: 10,
      minimumBid: 50,
    };

    const auction = <AuctionState>{
      minimumPrice: 150,
      bid: 200,
      myBid: 80,
    };

    const result = minimumAcceptableBid(auction, room);

    expect(result).toEqual(210);
  });
  it('should return bid increment if no my bid placed', () => {
    const room = <RoomState>{
      minimumBidIncrement: 10,
      minimumBid: 50,
    };

    const auction = <AuctionState>{
      minimumPrice: 150,
      bid: 200,
      myBid: undefined,
    };

    const result = minimumAcceptableBid(auction, room);

    expect(result).toEqual(210);
  });

  it('should return my bid incremented if no bid placed and my bid is placed', () => {
    const room = <RoomState>{
      minimumBidIncrement: 10,
      minimumBid: 50,
    };

    const auction = <AuctionState>{
      minimumPrice: 150,
      bid: undefined,
      myBid: 300,
    };

    const result = minimumAcceptableBid(auction, room);

    expect(result).toEqual(310);
  });
});
