namespace AuctionApi.Models;

public class WarcraftDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string WarcraftCollectionName { get; set; } = null!;

    public string ItemsCollectionName { get; set; } = null!;
}