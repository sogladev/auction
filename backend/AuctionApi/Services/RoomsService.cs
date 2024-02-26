using AuctionApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace AuctionApi.Services;

public class RoomsService
{
    private readonly IMongoCollection<Room> _roomsCollection;

    public RoomsService(
        IOptions<AuctionDatabaseSettings> auctionDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            auctionDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            auctionDatabaseSettings.Value.DatabaseName);

        _roomsCollection = mongoDatabase.GetCollection<Room>(
            auctionDatabaseSettings.Value.RoomsCollectionName);
    }

    public async Task<List<Room>> GetAsync() =>
        await _roomsCollection.Find(_ => true).ToListAsync();

    public async Task<Room?> GetAsync(string id) =>
        await _roomsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Room newRoom) =>
        await _roomsCollection.InsertOneAsync(newRoom);

    public async Task UpdateAsync(string id, Room updatedRoom) =>
        await _roomsCollection.ReplaceOneAsync(x => x.Id == id, updatedRoom);

    public async Task RemoveAsync(string id) =>
        await _roomsCollection.DeleteOneAsync(x => x.Id == id);
}