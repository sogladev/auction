using AuctionApi.Models;
using AuctionApi.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace AuctionApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController(RoomsService roomsService) : ControllerBase
{
    private readonly RoomsService _roomsService = roomsService;

    [HttpGet]
    public async Task<List<Room>> Get() =>
        await _roomsService.GetAsync();

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Room>> Get(string id)
    {
        var room = await _roomsService.GetAsync(id);

        if (room is null)
        {
            return NotFound();
        }

        return room;
    }

    [HttpPost("create")]
    public async Task<IActionResult> Post()
    {
        var newRoom = new Room();
        await _roomsService.CreateAsync(newRoom);

        return CreatedAtAction(nameof(Get), new { id = newRoom.Id }, newRoom);
    }

    [HttpPost]
    public async Task<IActionResult> Post(Room newRoom)
    {
        await _roomsService.CreateAsync(newRoom);

        return CreatedAtAction(nameof(Get), new { id = newRoom.Id }, newRoom);
    }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, Room updatedRoom)
    {
        var room = await _roomsService.GetAsync(id);

        if (room is null)
        {
            return NotFound();
        }

        updatedRoom.Id = room.Id;

        await _roomsService.UpdateAsync(id, updatedRoom);

        return NoContent();
    }

    [HttpPut("{id:length(24)}/items")]
    public async Task<IActionResult> UpdateItems(string id, string csvData)
    {
        // 'rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid';
        // rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid 1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid 2,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid 3,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid 4,12282,Worn Battleaxe,1,2,1,Weapon,Two-Handed Axes,1,3000,Item-5827-0-40000000C90648E0
        Room? room = await _roomsService.GetAsync(id);

        if (room is null)
        {
            return NotFound();
        }

        var sReader = new StringReader(csvData);
        var csvReader = new CsvReader(sReader, CultureInfo.InvariantCulture);

        var records = csvReader.GetRecords<dynamic>().Skip(1).ToList();

        List<Auction> newAuctions = new List<Auction>();
        foreach (var record in records)
        {
            // Create a new Auction object from the CSV data and add it to your database or another storage system.
            var auction = new Auction
            {
                RowId = record["rowId"].ToString(),
                ItemId = record["id"].ToString(),
                ItemName = record["name"].ToString(),
                Quality = record["quality"].ToString(),
                ItemLevel = int.Parse(record["ilvl"]),
                MinLevel = int.Parse(record["minLevel"]),
                ItemType = record["itemType"].ToString(),
                ItemSubType = record["itemSubType"].ToString(),
                Status = record["infoStatus"].ToString(),
                MinimumPrice = decimal.Parse(record["infoMinPrice"]),
                Guid = record["guid"].ToString()
            };
            newAuctions.Add(auction);
        }

        room.Auctions = newAuctions;

        await _roomsService.UpdateAsync(id, room);

        return NoContent();
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var auction = await _roomsService.GetAsync(id);

        if (auction is null)
        {
            return NotFound();
        }

        await _roomsService.RemoveAsync(id);

        return NoContent();
    }
    
    
    [HttpPatch("{id:length(24)}")]
    public async Task<ActionResult<Room>> Patch(string id, Bid newBid)
    {
        Room? room = await _roomsService.GetAsync(id);

        if (room is null || room.Auctions is null)
        {
            return NotFound();
        }
        Auction? auction = room.Auctions.Where(a => (a.RowId == newBid.RowId) && (a.ItemId == newBid.ItemId)).FirstOrDefault();
        // is valid bid
        if (auction is null)
        {
            return NotFound();
        }
        // TODO: add updatedAuction.Status == 2 to verify auction is in progress
        int currentBid = auction.Bid is null ? auction.MinimumPrice : (int)auction.Bid;
        int BidMinimumAcceptable = auction.BidderName is null ? auction.MinimumPrice : currentBid + room.MinimumBidIncrement;

        if (newBid.MyBid < BidMinimumAcceptable)
        {
            return BadRequest($"Bid must be at least {BidMinimumAcceptable}");
        }
        auction.Bid = newBid.MyBid;
        auction.BidderName = newBid.MyName;

        await _roomsService.UpdateAsync(id, room);

        return room;
    }
}