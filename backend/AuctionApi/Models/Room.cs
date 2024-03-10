using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

public class Room
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("settings")]
    public required RoomSettings Settings { get; set; }

    [BsonElement("users")]
    public List<User> Users { get; set; } = [];

    [BsonElement("auctions")]
    public List<Auction> Auctions { get; set; } = [];
}