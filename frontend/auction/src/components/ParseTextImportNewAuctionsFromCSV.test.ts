import { Auction } from 'src/components/models';
import { newAuctionsFromCsv } from 'src/components/ParseTextImportNewAuctions';

import { describe, expect, it } from 'vitest';

describe('newAuctionsFromCSV', () => {
  it('Should parse if given a single auction', () => {
    const itemsCSV = `
rowId,itemId,itemName,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
`;

    const expectedAuctions = [
      <Auction>{
        rowId: 1,
        itemId: 19137,
        itemName: 'Onslaught Girdle',
        itemType: 'Armor',
        itemSubType: 'Plate',
      },
    ];

    const result = newAuctionsFromCsv(itemsCSV);

    expect(result).toEqual(expectedAuctions);
  });
  it('Should parse if given no auction', () => {
    const itemsCSV = `
rowId,itemId,itemName,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
`;

    const expectedAuctions: Array<Auction> = [];

    const result = newAuctionsFromCsv(itemsCSV);

    expect(result).toEqual(expectedAuctions);
  });
  it('Should parse if given multiple auctions', () => {
    const itemsCSV = `
rowId,itemId,itemName,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
2,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid
3,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid
`;

    const expectedAuctions = [
      <Auction>{
        rowId: 1,
        itemId: 19137,
        itemName: 'Onslaught Girdle',
        itemType: 'Armor',
        itemSubType: 'Plate',
      },
      <Auction>{
        rowId: 2,
        itemId: 18814,
        itemName: 'Choker of the Fire Lord',
        itemType: 'Armor',
        itemSubType: 'Miscellaneous',
      },
      <Auction>{
        rowId: 3,
        itemId: 17076,
        itemName: 'Bonereaver\'s Edge',
        itemType: 'Weapon',
        itemSubType: 'Two-Handed Swords',
      },
    ];

    const result = newAuctionsFromCsv(itemsCSV);

    expect(result).toEqual(expectedAuctions);
  });
  it('Should parse if given multiple auctions with malformed order', () => {
    const itemsCSV = `
rowId,itemId,itemName,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
3,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid
4,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid
`;

    const expectedAuctions = [
      <Auction>{
        rowId: 1,
        itemId: 19137,
        itemName: 'Onslaught Girdle',
        itemType: 'Armor',
        itemSubType: 'Plate',
      },
      <Auction>{
        rowId: 2,
        itemId: 18814,
        itemName: 'Choker of the Fire Lord',
        itemType: 'Armor',
        itemSubType: 'Miscellaneous',
      },
      <Auction>{
        rowId: 3,
        itemId: 17076,
        itemName: 'Bonereaver\'s Edge',
        itemType: 'Weapon',
        itemSubType: 'Two-Handed Swords',
      },
    ];

    const result = newAuctionsFromCsv(itemsCSV);

    expect(result).toEqual(expectedAuctions);
  });
  it('Should parse if given multiple auctions with whitespace', () => {
    const itemsCSV = `

rowId,itemId,itemName,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid

1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
3,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid


4,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid


`;

    const expectedAuctions = [
      <Auction>{
        rowId: 1,
        itemId: 19137,
        itemName: 'Onslaught Girdle',
        itemType: 'Armor',
        itemSubType: 'Plate',
      },
      <Auction>{
        rowId: 2,
        itemId: 18814,
        itemName: 'Choker of the Fire Lord',
        itemType: 'Armor',
        itemSubType: 'Miscellaneous',
      },
      <Auction>{
        rowId: 3,
        itemId: 17076,
        itemName: 'Bonereaver\'s Edge',
        itemType: 'Weapon',
        itemSubType: 'Two-Handed Swords',
      },
    ];

    const result = newAuctionsFromCsv(itemsCSV);

    expect(result).toEqual(expectedAuctions);
  });

});
