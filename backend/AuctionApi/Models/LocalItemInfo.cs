using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

public class LocalItemInfo
{
    [BsonElement("id")]
    public int Id { get; set; } = 0;

    [BsonElement("name")]
    public required string Name { get; set; }

    [BsonElement("quality")]
    public int Quality { get; set; }

    [BsonElement("level")]
    public int Level { get; set; }
}
