using AuctionApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

using ArgentPonyWarcraftClient;

namespace AuctionApi.Services;

public class WarcraftService
{
    private readonly IMongoCollection<LocalItem> _itemsCollection;

    private readonly WarcraftClient _warcraftClient;

    private readonly Dictionary<string, int> TypeToLocalQuality = new(){
            {"POOR", 0}, {"COMMON", 1}, {"UNCOMMON", 2}, {"RARE", 3},
            {"EPIC", 4}, {"LEGENDARY", 5}, {"ARTIFACT", 6},
            {"HEIRLOOM", 7}, {"WOW TOKEN", 8}
        };

    public WarcraftService(IOptions<WarcraftDatabaseSettings> warcraftDatabaseSettings, BlizzardAPISecrets blizzardAPISecrets)
    {
        var mongoClient = new MongoClient(
            warcraftDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            warcraftDatabaseSettings.Value.DatabaseName);

        _itemsCollection = mongoDatabase.GetCollection<LocalItem>(
            warcraftDatabaseSettings.Value.ItemsCollectionName);

        // TODO: Refresh token
        _warcraftClient = new WarcraftClient(blizzardAPISecrets.ClientId, blizzardAPISecrets.ClientSecret, Region.Europe, Locale.en_GB);
    }


    // Fetch local database for a given namespace. if not then fetch from Blizzard API and update local database
    public async Task<LocalItemInfo> GetFromWarcraftAPI(int id, string requestedAPINamespace)
    {
        // Declare variables
        RequestResult<Item> result;
        RequestResult<ItemMedia> media;
        LocalItemInfo newItemInfo;
        LocalItem newItem;

        // Get item from database
        var item = await GetAsync(id);

        // If no entry in database
        if (item is null)
        {
            // Get item from warcraft API
            result = await _warcraftClient.GetItemAsync(id, requestedAPINamespace);
            media = await _warcraftClient.GetItemMediaAsync(id, requestedAPINamespace);
            //  LocalPath/classic1x-eu/icons/56/inv_belt_29.jpg
            // Segments[4] "inv_belt_29.jpg"
            //{ Item { Links = Links { Self = Self { Href = "https://eu.api.blizzard.com/data/wow/item/19137?namespace=static-10.2.5_52554-eu" } }, Id = 19137, Name = "Onslaught Girdle", Quality = EnumType { Type = "EPIC", Name = "Epic" }, Level = 29, RequiredLevel = 25, Media = Media { Key = Self { Href = https://eu.api.blizzard.com/data/wow/media/item/19137?namespace=static-10.2.5_52554-eu }, Id = 19137 }, ItemClass = ItemClassReference { Key = Self { Href = https://eu.api.blizzard.com/data/wow/item-class/4?namespace=static-10.2.5_52554-eu }, Name = Armor, Id = 4 }, ItemSubclass = ItemSubclassReference { Key = Self { Href = https://eu.api.blizzard.com/data/wow/item-class/4/item-subclass/4?namespace=static-10.2.5_52554-eu }, Name = Plate, Id = 4 }, InventoryType = EnumType { Type = WAIST, Name = Waist }, PurchasePrice = 135370, SellPrice = 27074, MaxCount = 0, IsEquippable = True, IsStackable = False, PreviewItem = PreviewItem { Item = Media { Key = Self { Href = https://eu.api.blizzard.com/data/wow/item/19137?namespace=static-10.2.5_52554-eu }, Id = 19137 }, Context = 0, BonusList = , Quality = EnumType { Type = EPIC, Name = Epic }, Name = Onslaught Girdle, Media = Media { Key = Self { Href = https://eu.api.blizzard.com/data/wow/media/item/19137?namespace=static-10.2.5_52554-eu }, Id = 19137 }, ItemClass = ItemClassReference { Key = Self { Href = https://eu.api.blizzard.com/data/wow/item-class/4?namespace=static-10.2.5_52554-eu }, Name = Armor, Id = 4 }, ItemSubclass = ItemSubclassReference { Key = Self { Href = https://eu.api.blizzard.com/data/wow/item-class/4/item-subclass/4?namespace=static-10.2.5_52554-eu }, Name = Plate, Id = 4 }, InventoryType = EnumType { Type = WAIST, Name = Waist }, Binding = EnumType { Type = ON_ACQUIRE, Name = Binds when picked up }, UniqueEquipped = , Weapon = , Stats = ArgentPonyWarcraftClient.Stat[], Spells = , SellPrice = SellPrice { Value = 149, DisplayStrings = CurrencyDisplay { Header = Sell Price:, Gold = 0, Silver = 1, Copper = 49 } }, Requirements = Requirements { Level = DescribedValue { Value = 25, DisplayString = Requires Level 25 }, Faction =  }, Level = DescribedValue { Value = 29, DisplayString = Item Level 29 }, Durability = DescribedValue { Value = 55, DisplayString = Durability 55 / 55 } }, PurchaseQuantity = 1 }}

            newItemInfo = new()
            {
                Id = result.Value.Id,
                Name = result.Value.Name,
                // "EPIC", "RARE", "COMMON", "LEGENDARY", "HEIRLOOM", "ARTIFACT"
                Quality = TypeToLocalQuality[result.Value.Quality.Type],
                Level = result.Value.Level,
                MinLevel = result.Value.RequiredLevel,
                Icon = media.Value.Assets[0].Value.Segments[4],
                ItemClassName = result.Value.ItemClass.Name,
                ItemClassId = result.Value.ItemClass.Id,
                ItemSubclassName = result.Value.ItemSubclass.Name,
                ItemSubclassId = result.Value.ItemSubclass.Id,
            };

            switch (requestedAPINamespace)
            {
                case APINamespace.Progression:
                    newItem = new() { Id = newItemInfo.Id, Progression = newItemInfo, };
                    await CreateAsync(newItem);
                    break;
                case APINamespace.Era:
                    newItem = new() { Id = newItemInfo.Id, Era = newItemInfo, };
                    await CreateAsync(newItem);
                    break;
                case APINamespace.Retail:
                    newItem = new() { Id = newItemInfo.Id, Retail = newItemInfo, };
                    await CreateAsync(newItem);
                    break;
            }
            return newItemInfo; ;
        }
        // We have an item in the db. Do we have the info for the requested namespace?
        switch (requestedAPINamespace)
        {
            case APINamespace.Retail:
                if (item.Retail is not null)
                    return item.Retail;
                // Get item from warcraft API
                result = await _warcraftClient.GetItemAsync(id, requestedAPINamespace);
                media = await _warcraftClient.GetItemMediaAsync(id, requestedAPINamespace);
                // Create new item info
                newItemInfo = new()
                {
                    Id = result.Value.Id,
                    Name = result.Value.Name,
                    Quality = TypeToLocalQuality[result.Value.Quality.Type],
                    Level = result.Value.Level,
                    MinLevel = result.Value.RequiredLevel,
                    Icon = media.Value.Assets[0].Value.Segments[4],
                    ItemClassName = result.Value.ItemClass.Name,
                    ItemClassId = result.Value.ItemClass.Id,
                    ItemSubclassName = result.Value.ItemSubclass.Name,
                    ItemSubclassId = result.Value.ItemSubclass.Id,
                };
                // Create new item
                item.Retail = newItemInfo;
                newItem = new()
                {
                    Id = newItemInfo.Id,
                    Retail = newItemInfo,
                    Progression = item.Progression,
                    Era = item.Era,
                    // Update db
                };
                await UpdateAsync(id, newItem);
                return newItemInfo;
            case APINamespace.Era:
                if (item.Era is not null)
                    return item.Era;
                // Get item from warcraft API
                result = await _warcraftClient.GetItemAsync(id, requestedAPINamespace);
                media = await _warcraftClient.GetItemMediaAsync(id, requestedAPINamespace);
                // Create new item info
                newItemInfo = new()
                {
                    Id = result.Value.Id,
                    Name = result.Value.Name,
                    Quality = TypeToLocalQuality[result.Value.Quality.Type],
                    Level = result.Value.Level,
                    MinLevel = result.Value.RequiredLevel,
                    Icon = media.Value.Assets[0].Value.Segments[4],
                    ItemClassName = result.Value.ItemClass.Name,
                    ItemClassId = result.Value.ItemClass.Id,
                    ItemSubclassName = result.Value.ItemSubclass.Name,
                    ItemSubclassId = result.Value.ItemSubclass.Id,
                };
                // Create new item
                item.Era = newItemInfo;
                newItem = new()
                {
                    Id = newItemInfo.Id,
                    Era = newItemInfo,
                    Progression = item.Progression,
                    Retail = item.Era,
                    // Update db
                };
                await UpdateAsync(id, newItem);
                return newItemInfo;

            case APINamespace.Progression:
                if (item.Progression is not null)
                    return item.Progression;
                // Get item from warcraft API
                result = await _warcraftClient.GetItemAsync(id, requestedAPINamespace);
                media = await _warcraftClient.GetItemMediaAsync(id, requestedAPINamespace);
                // Create new item info
                newItemInfo = new()
                {
                    Id = result.Value.Id,
                    Name = result.Value.Name,
                    Quality = TypeToLocalQuality[result.Value.Quality.Type],
                    Level = result.Value.Level,
                    MinLevel = result.Value.RequiredLevel,
                    Icon = media.Value.Assets[0].Value.Segments[4],
                    ItemClassName = result.Value.ItemClass.Name,
                    ItemClassId = result.Value.ItemClass.Id,
                    ItemSubclassName = result.Value.ItemSubclass.Name,
                    ItemSubclassId = result.Value.ItemSubclass.Id,
                };
                // Create new item
                item.Progression = newItemInfo;
                newItem = new()
                {
                    Id = newItemInfo.Id,
                    Progression = newItemInfo,
                    Era = item.Era,
                    Retail = item.Era,
                    // Update db
                };
                await UpdateAsync(id, newItem);
                return newItemInfo;
        }
        throw new NotImplementedException("Invalid namespace was specified");
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