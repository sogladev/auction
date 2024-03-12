import { Auction, Status } from 'src/components/models';

export function AuctionsToCSV(auctions: Array<Auction>): string {
  // this is how addon (LUA) will import auctions
  // `/hlm i`
  //
  // itemIdreateForId(tonumber(elements[1]))
  // item.info = {
  // status = tonumber(elements[2]),
  // minPrice = tonumber(elements[3]),
  // exp = tonumber(elements[4]), // winner = elements[5],
  // salePrice = tonumber(elements[6])
  // }
  // item.guid = elements[7] -- Encode != Decode. Field is only needed to be decoded from GUI
  //
  // rowID,itemId,status,minPrice,exp,winner,salePrice,guid
  // 1:12282,3,3000,1707706195,Anonuwu,3000:2:19137,3,3000,1707706195,Anonuwu,3100,Item-5827-0-40000000C90648DE

  // Auction.bidderName can be assigned to undefined or ''
  const wonAuctions: Array<Auction> = auctions.filter(
    (auction) => auction.status === Status.Assigned && auction.bidderName,
  );
  // sorts auctions by rowId
  wonAuctions.sort((a, b) => a.rowId - b.rowId);
  // map to strings
  const wonAuctionsStrings: Array<string> = wonAuctions.map(
    (a: Auction) =>
      `${a.rowId}:${a.itemId},${a.status},${a.minimumPrice},` +
      `${a.expiration},${a.bidderName},${a.bid},${a.guid}`,
  );
  const wonAuctionsString: string = wonAuctionsStrings.join(':');
  return wonAuctionsString;
}
