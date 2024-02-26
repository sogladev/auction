using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

public class Bid
{
    [BsonRequired]
    [BsonElement("rowId")]
    public int RowId { get; set; }

    [BsonRequired]
    [BsonElement("itemId")]
    public int ItemId { get; set; }

    [BsonRequired]
    [BsonElement("myBid")]
    public int MyBid { get; set; }

    [BsonRequired]
    [BsonElement("myName")]
    public string MyName { get; set; } = null!;
}