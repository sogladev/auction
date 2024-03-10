using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

public enum Status
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
  public long? Expiration { get; set; }

  [BsonElement("itemInfo")]
  public LocalItemInfo? ItemInfo { get; set; }

  [BsonElement("guid")]
  public string Guid { get; set; } = "noguid"; // always noguid if not set

  // bidder. Set once auction starts
  [BsonElement("bidderName")]
  public string? BidderName { get; set; }

  // bid. Set once auction starts
  [BsonElement("bid")]
  public int? Bid { get; set; }

  // TODO: remove this. Not used serverside
  [BsonElement("myBid")]
  public int? MyBid { get; set; }
}