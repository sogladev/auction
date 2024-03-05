using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

public class Room
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("namespace")]
    public required string Namespace { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = "defaultName";

    [BsonElement("enableDiscordProtection")]
    public bool EnableDiscordProtection { get; set; } = false;

    [BsonElement("organiserFee")]
    public int OrganiserFee { get; set; } = 5;

    [BsonElement("minimumBid")]
    public int MinimumBid { get; set; } = 10;

    [BsonElement("minimumBidIncrement")]
    public int MinimumBidIncrement { get; set; } = 2;

    [BsonElement("bidDurationInSeconds")]
    public int BidDurationInSeconds { get; set; } = 240;

    [BsonElement("countDownTimeInSeconds")]
    public int CountDownTimeInSeconds { get; set; } = 40;

    [BsonElement("restrictBidsToEquipable")]
    public bool RestrictBidsToEquipable { get; set; } = false;

    [BsonElement("hideNameOfHighestBidder")]
    public bool HideNameOfHighestBidder { get; set; } = false;

    [BsonElement("hidePayoutDetails")]
    public bool HidePayoutDetails { get; set; } = false;

    [BsonElement("users")]
    public List<User>? Users { get; set; }

    [BsonElement("auctions")]
    public List<Auction>? Auctions { get; set; }

}