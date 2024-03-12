import { Auction } from 'src/components/models';
import { newAuctionsFromCsv } from 'src/utils/ParseTextImportNewAuctions';

import { describe, expect, it } from 'vitest';

describe('newAuctionsFromCSV', () => {
  it('Should parse if given a single auction', () => {
    const itemsCSV = `
rowId,itemId,itemName,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,Item-5827-0-40000000C90648E0
`;

    const expectedAuctions = [
      <Auction>{
        rowId: 1,
        itemId: 19137,
        itemName: 'Onslaught Girdle',
        itemType: 'Armor',
        itemSubType: 'Plate',
        guid: 'Item-5827-0-40000000C90648E0',
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
        guid: 'noguid',
      },
      <Auction>{
        rowId: 2,
        itemId: 18814,
        itemName: 'Choker of the Fire Lord',
        itemType: 'Armor',
        itemSubType: 'Miscellaneous',
        guid: 'noguid',
      },
      <Auction>{
        rowId: 3,
        itemId: 17076,
        itemName: 'Bonereaver\'s Edge',
        itemType: 'Weapon',
        itemSubType: 'Two-Handed Swords',
        guid: 'noguid',
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
        guid: 'noguid',
      },
      <Auction>{
        rowId: 2,
        itemId: 18814,
        itemName: 'Choker of the Fire Lord',
        itemType: 'Armor',
        itemSubType: 'Miscellaneous',
        guid: 'noguid',
      },
      <Auction>{
        rowId: 3,
        itemId: 17076,
        itemName: 'Bonereaver\'s Edge',
        itemType: 'Weapon',
        itemSubType: 'Two-Handed Swords',
        guid: 'noguid',
      },
    ];

    const result = newAuctionsFromCsv(itemsCSV);

    expect(result).toEqual(expectedAuctions);
  });
  it('Should parse if given multiple auctions with whitespace', () => {
    const itemsCSV = `

rowId,itemId,itemName,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid

1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,Item-5827-0-40000000C90648E0
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
        guid: 'Item-5827-0-40000000C90648E0',
      },
      <Auction>{
        rowId: 2,
        itemId: 18814,
        itemName: 'Choker of the Fire Lord',
        itemType: 'Armor',
        itemSubType: 'Miscellaneous',
        guid: 'noguid',
      },
      <Auction>{
        rowId: 3,
        itemId: 17076,
        itemName: 'Bonereaver\'s Edge',
        itemType: 'Weapon',
        itemSubType: 'Two-Handed Swords',
        guid: 'noguid',
      },
    ];

    const result = newAuctionsFromCsv(itemsCSV);

    expect(result).toEqual(expectedAuctions);
  });

});
