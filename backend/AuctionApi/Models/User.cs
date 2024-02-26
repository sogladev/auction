using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

public class User
{
    [BsonElement("name")]
    public string Name { get; set; } = null!;

}