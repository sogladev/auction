import { AuctionsToCSV } from 'src/utils/AuctionsToCSV';
import { Auction, Status } from 'src/components/models';

import { describe, expect, it } from 'vitest';

describe('export string', () => {
  it('should return string for single auction', () => {
    const auction = <Auction>{
      rowId: 1,
      itemId: 19137,
      status: Status.Assigned,
      minimumPrice: 10,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'DefaultAndy',
      bid: 20,
      myBid: null,
    };
    const auctions: Array<Auction> = [auction];

    const expectedString = '1:19137,3,10,1710257817,DefaultAndy,20,noguid';

    const result = AuctionsToCSV(auctions);

    expect(result).toEqual(expectedString);
  });
  it('should return string for single auction', () => {
    const auction = <Auction>{
      rowId: 1,
      itemId: 19137,
      status: Status.Assigned,
      minimumPrice: 10,
      expiration: 1710257817,
      guid: 'Item-5827-0-40000000C90648E0',
      bidderName: 'DefaultAndy',
      bid: 20,
      myBid: null,
    };
    const auctions: Array<Auction> = [auction];

    const expectedString = '1:19137,3,10,1710257817,DefaultAndy,20,Item-5827-0-40000000C90648E0';

    const result = AuctionsToCSV(auctions);

    expect(result).toEqual(expectedString);
  });
  it('should return string for invalid auction', () => {
    const auction = <Auction>{
      rowId: 1,
      itemId: 19137,
      status: Status.Bidding,
      minimumPrice: 10,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'DefaultAndy',
      bid: 20,
      myBid: null,
    };
    const auctions: Array<Auction> = [auction];

    const expectedString = '';

    const result = AuctionsToCSV(auctions);

    expect(result).toEqual(expectedString);
  });

  it('should return string for 2 auctions', () => {

    const auction1 = <Auction>{
      rowId: 1,
      itemId: 19137,
      status: Status.Assigned,
      minimumPrice: 10,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'DefaultAndy',
      bid: 20,
    };
    const auction2 = <Auction>{
      rowId: 2,
      itemId: 18814,
      status: Status.Assigned,
      minimumPrice: 15,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'Admin',
      bid: 30,
    };
    const auctions: Array<Auction> = [auction1, auction2];

    const auction1str = '1:19137,3,10,1710257817,DefaultAndy,20,noguid';
    const auction2str = '2:18814,3,15,1710257817,Admin,30,noguid';

    const expectedString = auction1str + ':' + auction2str;

    const result = AuctionsToCSV(auctions);

    expect(result).toEqual(expectedString);
  });

  it('should return string for 3 auctions', () => {
    const auction1 = <Auction>{
      rowId: 1,
      itemId: 19137,
      status: Status.Assigned,
      minimumPrice: 10,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'DefaultAndy',
      bid: 20,
    };
    const auction2 = <Auction>{
      rowId: 2,
      itemId: 18814,
      status: Status.Assigned,
      minimumPrice: 15,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'Admin',
      bid: 30,
    };
    const auction3 = <Auction>{
      rowId: 3,
      itemId: 17076,
      status: Status.Assigned,
      minimumPrice: 15,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'Admin',
      bid: 30,
    };
    const auctions: Array<Auction> = [auction1, auction2, auction3];

    const auction1str = '1:19137,3,10,1710257817,DefaultAndy,20,noguid';
    const auction2str = '2:18814,3,15,1710257817,Admin,30,noguid';
    const auction3str = '3:17076,3,15,1710257817,Admin,30,noguid';

    const expectedString = auction1str + ':' + auction2str + ':' + auction3str;

    const result = AuctionsToCSV(auctions);

    expect(result).toEqual(expectedString);
  });
  it('should return string for 3 auctions with 1 pending', () => {
    const auction1 = <Auction>{
      rowId: 1,
      itemId: 19137,
      status: Status.Pending,
      minimumPrice: 10,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'DefaultAndy',
      bid: 20,
    };
    const auction2 = <Auction>{
      rowId: 2,
      itemId: 18814,
      status: Status.Assigned,
      minimumPrice: 15,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'Admin',
      bid: 30,
    };
    const auction3 = <Auction>{
      rowId: 3,
      itemId: 17076,
      status: Status.Assigned,
      minimumPrice: 15,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'Admin',
      bid: 30,
    };
    const auctions: Array<Auction> = [auction1, auction2, auction3];

    //const auction1str = '1:19137,3,10,1710257817,DefaultAndy,20,noguid';
    const auction2str = '2:18814,3,15,1710257817,Admin,30,noguid';
    const auction3str = '3:17076,3,15,1710257817,Admin,30,noguid';

    const expectedString = auction2str + ':' + auction3str;

    const result = AuctionsToCSV(auctions);

    expect(result).toEqual(expectedString);
  });
  it('should return string for 3 auctions with 1 assigned to no one', () => {
    const auction1 = <Auction>{
      rowId: 1,
      itemId: 19137,
      status: Status.Assigned,
      minimumPrice: 10,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: undefined,
      bid: 20,
    };
    const auction2 = <Auction>{
      rowId: 2,
      itemId: 18814,
      status: Status.Assigned,
      minimumPrice: 15,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'Admin',
      bid: 30,
    };
    const auction3 = <Auction>{
      rowId: 3,
      itemId: 17076,
      status: Status.Assigned,
      minimumPrice: 15,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'Admin',
      bid: 30,
    };
    const auctions: Array<Auction> = [auction1, auction2, auction3];

    //const auction1str = '1:19137,3,10,1710257817,DefaultAndy,20,noguid';
    const auction2str = '2:18814,3,15,1710257817,Admin,30,noguid';
    const auction3str = '3:17076,3,15,1710257817,Admin,30,noguid';

    const expectedString = auction2str + ':' + auction3str;

    const result = AuctionsToCSV(auctions);

    expect(result).toEqual(expectedString);
  });
  it('should return string for 3 auctions with different order', () => {
    const auction1 = <Auction>{
      rowId: 1,
      itemId: 19137,
      status: Status.Assigned,
      minimumPrice: 10,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'DefaultAndy',
      bid: 20,
    };
    const auction2 = <Auction>{
      rowId: 2,
      itemId: 18814,
      status: Status.Assigned,
      minimumPrice: 15,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'Admin',
      bid: 30,
    };
    const auction3 = <Auction>{
      rowId: 3,
      itemId: 17076,
      status: Status.Assigned,
      minimumPrice: 15,
      expiration: 1710257817,
      guid: 'noguid',
      bidderName: 'Admin',
      bid: 30,
    };
    const auctions: Array<Auction> = [auction2, auction3, auction1];

    const auction1str = '1:19137,3,10,1710257817,DefaultAndy,20,noguid';
    const auction2str = '2:18814,3,15,1710257817,Admin,30,noguid';
    const auction3str = '3:17076,3,15,1710257817,Admin,30,noguid';

    const expectedString = auction1str + ':' + auction2str + ':' + auction3str;

    const result = AuctionsToCSV(auctions);

    expect(result).toEqual(expectedString);
  });







});


