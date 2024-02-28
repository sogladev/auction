import { getNextIncrement } from 'src/components/BidMath';
import { Auction, Room } from 'src/components/models';

import { describe, expect, it } from 'vitest';

describe('getNextIncrement', () => {
  it('should return minPrice if no bid placed and no my bid placed', () => {
    const room = <Room>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: 100,
      bidderName: 'bidder',
      myBid: undefined,
    };

    const result = getNextIncrement(auction, room);

    expect(result).toEqual(110);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const room = <Room>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: 110,
      bidderName: 'bidder',
      myBid: undefined,
    };

    const result = getNextIncrement(auction, room);

    expect(result).toEqual(120);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const room = <Room>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: 110,
      bidderName: 'bidder',
      myBid: 100,
    };

    const result = getNextIncrement(auction, room);

    expect(result).toEqual(120);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const room = <Room>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: undefined,
      bidderName: undefined,
      myBid: 120,
    };

    const result = getNextIncrement(auction, room);

    expect(result).toEqual(130);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const room = <Room>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: undefined,
      bidderName: undefined,
      myBid: 50,
    };

    const result = getNextIncrement(auction, room);

    expect(result).toEqual(100);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const room = <Room>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: 110,
      bidderName: 'bidder',
      myBid: 130,
    };

    const result = getNextIncrement(auction, room);

    expect(result).toEqual(140);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const room = <Room>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: 110,
      bidderName: 'bidder',
      myBid: 115,
    };

    const result = getNextIncrement(auction, room);

    expect(result).toEqual(120);
  });
});
