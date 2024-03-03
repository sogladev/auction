using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

public class LocalItem
{
    [BsonElement("id")]
    public int Id { get; set; } = 0;

    [BsonElement("progression")]
    public LocalItemInfo ?Progression { get; set; }

    [BsonElement("era")]
    public LocalItemInfo ?Era { get; set; }

    [BsonElement("retail")]
    public LocalItemInfo ?Retail { get; set; }
}
