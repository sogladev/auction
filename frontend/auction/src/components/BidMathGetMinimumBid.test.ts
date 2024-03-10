import { minimumAcceptableBid } from 'src/components/BidMath';
import { Auction, RoomSettings } from 'src/components/models';

import { describe, expect, it } from 'vitest';

describe('minimumAcceptableBid', () => {
  it('should return minPrice if no bid placed and no my bid placed', () => {
    const settings = <RoomSettings>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: 100,
      bidderName: 'bidder',
    };

    const result = minimumAcceptableBid(auction, settings);

    expect(result).toEqual(110);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const settings = <RoomSettings>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: 110,
      bidderName: 'bidder',
    };

    const result = minimumAcceptableBid(auction, settings);

    expect(result).toEqual(120);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const settings = <RoomSettings>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: 110,
      bidderName: 'bidder',
    };

    const result = minimumAcceptableBid(auction, settings);

    expect(result).toEqual(120);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const settings = <RoomSettings>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: undefined,
      bidderName: undefined,
    };

    const result = minimumAcceptableBid(auction, settings);

    expect(result).toEqual(100);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const settings = <RoomSettings>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: undefined,
      bidderName: undefined,
    };

    const result = minimumAcceptableBid(auction, settings);

    expect(result).toEqual(100);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const settings = <RoomSettings>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: 110,
      bidderName: 'bidder',
    };

    const result = minimumAcceptableBid(auction, settings);

    expect(result).toEqual(120);
  });

  it('should return minPrice if no bid placed and no my bid placed', () => {
    const settings = <RoomSettings>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: 110,
      bidderName: 'bidder',
    };

    const result = minimumAcceptableBid(auction, settings);

    expect(result).toEqual(120);
  });
});
