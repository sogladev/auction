namespace AuctionApi.Models;

public class AuctionDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string AuctionsCollectionName { get; set; } = null!;

    public string RoomsCollectionName { get; set; } = null!;
}