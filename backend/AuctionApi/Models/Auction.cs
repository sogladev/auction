using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

public class Auction
{
    [BsonElement("rowId")]
    public int RowId { get; set; }

    [BsonElement("itemId")]
    public int ItemId { get; set; }

    [BsonElement("status")]
    public int Status { get; set; }

    [BsonElement("minimumPrice")]
    public int MinimumPrice { get; set; }

    [BsonElement("expiration")]
    public int Expiration { get; set; }

    [BsonElement("itemName")]
    public string ItemName { get; set; } = null!;

    [BsonElement("quality")]
    public int Quality { get; set; }

    [BsonElement("itemLevel")]
    public int ItemLevel { get; set; }

    [BsonElement("minLevel")]
    public int MinLevel { get; set; }

    [BsonElement("itemType")]
    public string ItemType { get; set; } = null!;

    [BsonElement("itemSubType")]
    public string ItemSubType { get; set; } = null!;

    [BsonElement("guid")]
    public string Guid { get; set; } = null!;

   // bidder. Set once auction starts
    [BsonElement("bidderName")]
    public string? BidderName { get; set; }

   // bid. Set once auction starts
    [BsonElement("bid")]
    public int? Bid { get; set; }

    [BsonElement("myBid")]
    public int? MyBid { get; set; }
}