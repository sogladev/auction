using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AuctionApi.Models;

public class LocalItemInfo
{
    [BsonElement("id")]
    public int Id { get; set; }

    [BsonElement("name")]
    public required string Name { get; set; }

    [BsonElement("quality")]
    public int Quality { get; set; }

    [BsonElement("level")]
    public int Level { get; set; }

    [BsonElement("minLevel")]
    public int MinLevel { get; set; }

    [BsonElement("icon")]
    public string Icon { get; set; } = "";

    [BsonElement("itemSubType")]
    public required string ItemSubclassName { get; set; }

    [BsonElement("itemSubTypeId")]
    public int ItemSubclassId { get; set; }

    [BsonElement("itemType")]
    public required string ItemClassName { get; set; }

    [BsonElement("itemTypeId")]
    public int ItemClassId { get; set; }
}
