using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

enum Status
{
  Pending = 1,
  Bidding = 2,
  Assigned = 3,
}

public class Auction
{
    [BsonElement("itemId")]
    public int ItemId { get; set; }

    [BsonElement("rowId")]
    public int RowId { get; set; }

    [BsonElement("status")]
    public Status? Status { get; set; } = Models.Status.Pending;

    [BsonElement("minimumPrice")]
    public int? MinimumPrice { get; set; }

    [BsonElement("expiration")]
    public int? Expiration { get; set; }

    [BsonElement("itemName")]
    public string? ItemName { get; set; }

    [BsonElement("quality")]
    public int? Quality { get; set; }

    [BsonElement("itemLevel")]
    public int? ItemLevel { get; set; }

    [BsonElement("minLevel")]
    public int? MinLevel { get; set; }

    [BsonElement("itemType")]
    public string? ItemType { get; set; }

    [BsonElement("itemSubType")]
    public string? ItemSubType { get; set; }

    [BsonElement("guid")]
    public string? Guid { get; set; } = null!;

   // bidder. Set once auction starts
    [BsonElement("bidderName")]
    public string? BidderName { get; set; }

   // bid. Set once auction starts
    [BsonElement("bid")]
    public int? Bid { get; set; }

    [BsonElement("myBid")]
    public int? MyBid { get; set; }
}