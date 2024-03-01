import Papa from 'papaparse';

import { Auction } from 'src/components/models';

// Convert a text string like below to new Auctions
// 19137,18814,17076,12282
export function newAuctionsFromItemIds(itemIds: string): Array<Auction> {
  const newAuctions: Array<Auction> = itemIds
    .split(',').filter(item => item.trim())
    .map((itemId: string, index: number) =>
      <Auction>{
        rowId: index + 1,
        itemId: Number(itemId)
      });
  return newAuctions
}

// Convert a text string like below to new Auctions
// rowId,itemId,itemName,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
// 1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
// 2,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid
// 3,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid
// 4,12282,Worn Battleaxe,1,2,1,Weapon,Two-Handed Axes,1,3000,Item-5827-0-40000000C90648E0
export function newAuctionsFromCsv(csvStringValue: string): Array<Auction> {
  const parseResult = Papa.parse(csvStringValue, {
    skipEmptyLines: true,
    header: true,
  });

  const newAuctions: Array<Auction> = parseResult.data.map(
    (value, index: number): Auction => {
      const item = value as { [key: string]: string };
      return <Auction>{
        rowId: index + 1,
        itemId: Number(item.itemId),
        itemName: item.itemName,
        itemType: item.itemType,
        itemSubType: item.itemSubType,
      };
    },
  );

  return newAuctions;
}
