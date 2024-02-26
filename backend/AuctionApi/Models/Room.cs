using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

public class Room
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public required string Name { get; set; }

    [BsonElement("enableDiscordProtection")]
    public bool EnableDiscordProtection { get; set; } = false;

    [BsonElement("organiserFee")]
    public int OrganiserFee { get; set; }

    [BsonElement("minimumBid")]
    public int MinimumBid { get; set; }

    [BsonElement("minimumBidIncrement")]
    public int MinimumBidIncrement { get; set; }
    
    [BsonElement("bidDurationInSeconds")]
    public int BidDurationInSeconds { get; set; }

    [BsonElement("countDownTimeInSeconds")]
    public int CountDownTimeInSeconds { get; set; }

    [BsonElement("restrictBidsToEquipable")]
    public bool RestrictBidsToEquipable { get; set; }

    [BsonElement("hideNameOfHighestBidder")]
    public bool HideNameOfHighestBidder { get; set; }

    [BsonElement("hidePayoutDetails")]
    public bool HidePayoutDetails { get; set; }

    [BsonElement("users")]
    public List<User>? Users { get; set; }

    [BsonElement("auctions")]
    public List<Auction>? Auctions { get; set; }

}