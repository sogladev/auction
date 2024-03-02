using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

public class LocalItem
{
    [BsonElement("id")]
    public int Id { get; set; } = 0;
}