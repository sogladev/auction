using AuctionApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

using ArgentPonyWarcraftClient;

namespace AuctionApi.Services;

public class WarcraftService
{
    private readonly IMongoCollection<LocalItem> _itemsCollection;

    private readonly WarcraftClient _warcraftClient;

    public WarcraftService(IOptions<WarcraftDatabaseSettings> warcraftDatabaseSettings, BlizzardAPISecrets blizzardAPISecrets)
    {

        var mongoClient = new MongoClient(
            warcraftDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            warcraftDatabaseSettings.Value.DatabaseName);

        _itemsCollection = mongoDatabase.GetCollection<LocalItem>(
            warcraftDatabaseSettings.Value.ItemsCollectionName);

        _warcraftClient = new WarcraftClient(blizzardAPISecrets.ClientId, blizzardAPISecrets.ClientSecret, Region.Europe, Locale.en_GB);
    }

    public async Task<LocalItem> GetFromWarcraftAPI(int id)
    {
        RequestResult<Item> result = await _warcraftClient.GetItemAsync(id, "static-eu");
        Console.WriteLine("Get warcraft API");
        Console.WriteLine(result.Value.Name);
        Console.WriteLine(result.Value.Id);
        LocalItem localItem = new LocalItem();
        localItem.Id = result.Value.Id;
        return localItem;

    }
    public async Task<List<LocalItem>> GetAsync() =>


        await _itemsCollection.Find(_ => true).ToListAsync();

    public async Task<LocalItem?> GetAsync(int id) =>
        await _itemsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(LocalItem newItem) =>
        await _itemsCollection.InsertOneAsync(newItem);

    public async Task UpdateAsync(int id, LocalItem updatedItem) =>
        await _itemsCollection.ReplaceOneAsync(x => x.Id == id, updatedItem);

    public async Task RemoveAsync(int id) =>
        await _itemsCollection.DeleteOneAsync(x => x.Id == id);
}