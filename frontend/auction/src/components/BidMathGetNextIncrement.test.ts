import { getNextIncrement } from 'src/components/BidMath';
import { Auction, Bids, RoomSettings } from 'src/components/models';

import { describe, expect, it } from 'vitest';

describe('getNextIncrement', () => {
  it('should return minPrice if no bid placed and no my bid placed', () => {
    const settings = <RoomSettings>{
      minimumBidIncrement: 10,
    };

    const auction = <Auction>{
      minimumPrice: 100,
      bid: 100,
      bidderName: 'bidder',
    };

    const bids = new Bids();

    const result = getNextIncrement(auction, settings, bids);

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

    const bids = new Bids();

    const result = getNextIncrement(auction, settings, bids);

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

    const bids = new Bids();
    bids.setBid(auction.itemId, auction.rowId, 100);

    const result = getNextIncrement(auction, settings, bids);

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

    const bids = new Bids();
    bids.setBid(auction.itemId, auction.rowId, 120);

    const result = getNextIncrement(auction, settings, bids);

    expect(result).toEqual(130);
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

    const bids = new Bids();
    bids.setBid(auction.itemId, auction.rowId, 50);

    const result = getNextIncrement(auction, settings, bids);

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

    const bids = new Bids();
    bids.setBid(auction.itemId, auction.rowId, 130);

    const result = getNextIncrement(auction, settings, bids);

    expect(result).toEqual(140);
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

    const bids = new Bids();
    bids.setBid(auction.itemId, auction.rowId, 115);

    const result = getNextIncrement(auction, settings, bids);

    expect(result).toEqual(120);
  });
});
