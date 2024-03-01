import { Auction } from 'src/components/models';
//import { newAuctionsFromCsv, newAuctionsFromItemIds } from 'src/components/ParseTextImportNewAuctions';
import { newAuctionsFromItemIds } from 'src/components/ParseTextImportNewAuctions';

import { describe, expect, it } from 'vitest';

describe('newAuctionsFromItemIds', () => {
  it('Should parse if given a string of itemIds', () => {
    const itemIds = '123,456,789';

    const expectedAuctions = [
      <Auction>{
        rowId: 1,
        itemId: 123,
      },
      <Auction>{
        rowId: 2,
        itemId: 456,
      },
      <Auction>{
        rowId: 3,
        itemId: 789,
      },
    ];

    const result = newAuctionsFromItemIds(itemIds);

    expect(result).toEqual(expectedAuctions);
  });
  it('Should parse if given a single itemId', () => {
    const itemIds = '123';

    const expectedAuctions = [
      <Auction>{
        rowId: 1,
        itemId: 123,
      },
    ];

    const result = newAuctionsFromItemIds(itemIds);

    expect(result).toEqual(expectedAuctions);
  });
  it('Should parse if given a malformed itemId', () => {
    const itemIds = '123,';

    const expectedAuctions = [
      <Auction>{
        rowId: 1,
        itemId: 123,
      },
    ];

    const result = newAuctionsFromItemIds(itemIds);

    expect(result).toEqual(expectedAuctions);
  });
  it('Should parse if given a malformed itemId 2', () => {
    const itemIds = ',123,,';

    const expectedAuctions = [
      <Auction>{
        rowId: 1,
        itemId: 123,
      },
    ];

    const result = newAuctionsFromItemIds(itemIds);

    expect(result).toEqual(expectedAuctions);
  });
  it('Should parse if given a string of itemIds malformed', () => {
    const itemIds = ',123,,456,789,';

    const expectedAuctions = [
      <Auction>{
        rowId: 1,
        itemId: 123,
      },
      <Auction>{
        rowId: 2,
        itemId: 456,
      },
      <Auction>{
        rowId: 3,
        itemId: 789,
      },
    ];

    const result = newAuctionsFromItemIds(itemIds);

    expect(result).toEqual(expectedAuctions);
  });
  it('Should parse if given a string of itemIds malformed with spaces', () => {
    const itemIds = ', ,123 , , 456, 789 ,';

    const expectedAuctions = [
      <Auction>{
        rowId: 1,
        itemId: 123,
      },
      <Auction>{
        rowId: 2,
        itemId: 456,
      },
      <Auction>{
        rowId: 3,
        itemId: 789,
      },
    ];

    const result = newAuctionsFromItemIds(itemIds);

    expect(result).toEqual(expectedAuctions);
  });

});
