using AuctionApi.Models;
using AuctionApi.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace AuctionApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController(RoomsService roomsService, WarcraftService warcraftService) : ControllerBase
{
    private readonly RoomsService _roomsService = roomsService;
    private readonly WarcraftService _itemsService = warcraftService;

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

        // Check if auctions have expired and change their state to assigned
        if (room.Auctions is not null)
        {
            long CurrentTimeUnixTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            bool changeState = false;
            foreach (Auction auction in room.Auctions)
            {
                if (auction.Status == Status.Bidding)
                {
                    if (CurrentTimeUnixTimestamp >= auction.Expiration)
                    {
                        auction.Status = Status.Assigned;
                        changeState = true;
                    }
                }
            }
            if (changeState)
            {
                await _roomsService.UpdateAsync(id, room);
            }
        }
        return room;
    }

    [HttpGet("{id:length(24)}/settings")]
    public async Task<ActionResult<RoomSettings>> GetSettings(string id)
    {
        var room = await _roomsService.GetAsync(id);

        if (room is null || room.Settings is null)
        {
            return NotFound();
        }
        return room.Settings;
    }

    [HttpGet("{id:length(24)}/auctions")]
    public async Task<ActionResult<List<Auction>>> GetAuctions(string id)
    {
        var room = await _roomsService.GetAsync(id);

        if (room is null || room.Auctions is null)
        {
            return NotFound();
        }

        // Check if auctions have expired and change their state to assigned
        if (room.Auctions is not null)
        {
            long CurrentTimeUnixTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            bool changeState = false;
            foreach (Auction auction in room.Auctions)
            {
                if (auction.Status == Status.Bidding)
                {
                    if (CurrentTimeUnixTimestamp >= auction.Expiration)
                    {
                        auction.Status = Status.Assigned;
                        changeState = true;
                    }
                }
            }
            if (changeState)
            {
                await _roomsService.UpdateAsync(id, room);
            }
        }
        return room.Auctions;
    }

    [HttpPost("create")]
    public async Task<IActionResult> Post(string Namespace)
    {
        // Validate if Namespace matches a valid namespace
        if (!(new[]{
             APINamespace.Era, APINamespace.Progression, APINamespace.Retail
            }.Contains(Namespace)))
        {
            return BadRequest("Namespace must match a valid namespace. ");
        };

        Room newRoom = new()
        {
            Settings = new RoomSettings
            {
                Namespace = Namespace
            }
        };

        await _roomsService.CreateAsync(newRoom);

        return CreatedAtAction(nameof(Get), new { id = newRoom.Id }, newRoom);
    }

    [HttpPost]
    public async Task<IActionResult> Post(Room newRoom)
    {
        await _roomsService.CreateAsync(newRoom);

        return CreatedAtAction(nameof(Get), new { id = newRoom.Id }, newRoom);
    }

    [HttpPut("{id:length(24)}/settings")]
    public async Task<IActionResult> UpdateSettings(string id, RoomSettings updatedSettings)
    {
        var room = await _roomsService.GetAsync(id);

        if (room is null)
        {
            return NotFound();
        }

        room.Settings = updatedSettings;

        await _roomsService.UpdateAsync(id, room);

        return NoContent();
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
    public async Task<IActionResult> UpdateItems(string id, List<Auction> newAuctions)
    {
        Room? room = await _roomsService.GetAsync(id);

        if (room is null)
        {
            return NotFound();
        }

        // Set default values
        int i = 1;
        foreach (Auction auction in newAuctions)
        {
            // Set fields from room settings
            auction.MinimumPrice = room.Settings.MinimumBid;
            auction.Status = Status.Pending;
            auction.RowId = i++;
            // Update item info from warcraft API
            LocalItemInfo item = await _itemsService.GetFromWarcraftAPI(auction.ItemId, room.Settings.Namespace);
            auction.ItemInfo = item;
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


    [HttpPatch("{id:length(24)}/start")]
    public async Task<ActionResult<Room>> Patch(string id, List<Auction> newAuctions)
    {
        Room? room = await _roomsService.GetAsync(id);

        if (room is null || room.Auctions is null)
        {
            return NotFound();
        }

        // Set pending auctions to bid
        // Set expiration date
        // Update minimumPrice of pending auctions
        long StartTimeUnixTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        foreach (Auction auction in room.Auctions)
        {
            if (auction.Status == Status.Pending)
            {
                auction.Status = Status.Bidding;
                // Find auction from newAuctions.
                Auction? newAuction = newAuctions.FirstOrDefault(a => (a.ItemId == auction.ItemId) && (a.RowId == auction.RowId));
                if (newAuction is not null)
                {
                    auction.MinimumPrice = newAuction.MinimumPrice;
                }

                auction.Expiration = StartTimeUnixTimestamp + room.Settings.BidDurationInSeconds;
            }
        }

        await _roomsService.UpdateAsync(id, room);

        return NoContent();
    }

    /// Updates the bid for the auction with the given row ID and item ID.
    /// Validates that the auction exists and is in progress.
    /// Ensures the bid meets the minimum bid amount based on current bid or starting price.
    [HttpPatch("{id:length(24)}/auctions")]
    public async Task<ActionResult<Room>> Patch(string id, BidRequest newBid)
    {
        Room? room = await _roomsService.GetAsync(id);

        if (room is null || room.Auctions is null)
        {
            return NotFound();
        }

        // RowId and ItemId must match the auction we're trying to update
        Auction? auction = room.Auctions.Where(a => (a.RowId == newBid.RowId) && (a.ItemId == newBid.ItemId)).FirstOrDefault();
        if (auction is null)
        {
            return NotFound();
        }

        // Calculate minimum acceptable bid
        int BidMinimumAcceptable;
        bool NoBidHasBeenPlaced = auction.Bid is null || auction.BidderName is null;
        if (NoBidHasBeenPlaced)
        {
            BidMinimumAcceptable = auction.MinimumPrice ?? room.Settings.MinimumBid;
        }
        else
        {
            BidMinimumAcceptable = (int)auction.Bid! + room.Settings.MinimumBidIncrement;
        }

        bool IsBidTooLow = newBid.MyBid < BidMinimumAcceptable;
        bool IsAuctionInBiddingState = auction.Status == Status.Bidding;

        bool isValidBid = !IsBidTooLow && IsAuctionInBiddingState;
        if (isValidBid)
        {
            auction.Bid = newBid.MyBid;
            auction.BidderName = newBid.MyName;
        }

        /// Updates the auction expiration if we are in the countdown window
        /// Sets the new expiration to the current time plus the countdown duration.
        long CurrentTimeUnixTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        bool IsExpirationTimeUpdated = auction.Expiration - CurrentTimeUnixTimestamp < room.Settings.CountDownTimeInSeconds;
        if (IsExpirationTimeUpdated)
        {
            auction.Expiration = room.Settings.CountDownTimeInSeconds + CurrentTimeUnixTimestamp;
        }

        bool requireDatabaseUpdate = isValidBid || IsExpirationTimeUpdated;
        if (requireDatabaseUpdate)
        {
            await _roomsService.UpdateAsync(id, room);
        }

        if (!IsAuctionInBiddingState)
        {
            return BadRequest("Auction must be in bidding state");
        }

        if (IsBidTooLow)
        {
            return BadRequest($"Bid must be at least {BidMinimumAcceptable}");
        }

        return NoContent();
    }

    // Admin commands
    [HttpPatch("{id:length(24)}/close")]
    public async Task<ActionResult<Room>> Patch(string id, Auction auction)
    {
        Room? room = await _roomsService.GetAsync(id);

        if (room is null || room.Auctions is null)
        {
            return NotFound();
        }

        // Set auction to completed
        Auction? auctionToModify = room.Auctions.FirstOrDefault(a => (a.ItemId == auction.ItemId) && (a.RowId == auction.RowId));
        if (auctionToModify is not null)
        {
            if (auctionToModify.Status == Status.Assigned)
            {
                return BadRequest("Auction has already been closed");
            }
            auctionToModify.Status = Status.Assigned;
        }

        await _roomsService.UpdateAsync(id, room);

        return NoContent();
    }

    [HttpPatch("{id:length(24)}/countdown")]
    public async Task<ActionResult<Room>> PatchCountdown(string id, Auction auction)
    {
        Room? room = await _roomsService.GetAsync(id);

        if (room is null || room.Auctions is null)
        {
            return NotFound();
        }

        // Set auction to completed
        Auction? auctionToModify = room.Auctions.FirstOrDefault(a => (a.ItemId == auction.ItemId) && (a.RowId == auction.RowId));
        if (auctionToModify is not null)
        {
            if (auctionToModify.Status == Status.Assigned)
            {
                return BadRequest("Auction has been closed");
            }
            long CurrentTimeUnixTimeStamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            auctionToModify.Expiration = CurrentTimeUnixTimeStamp + room.Settings.CountDownTimeInSeconds;
        }

        await _roomsService.UpdateAsync(id, room);

        return NoContent();
    }

    [HttpPatch("{id:length(24)}/restart")]
    public async Task<ActionResult<Room>> PatchRestart(string id, Auction auction)
    {
        Room? room = await _roomsService.GetAsync(id);

        if (room is null || room.Auctions is null)
        {
            return NotFound();
        }

        // Set auction to completed
        Auction? auctionToModify = room.Auctions.FirstOrDefault(a => (a.ItemId == auction.ItemId) && (a.RowId == auction.RowId));
        if (auctionToModify is not null)
        {
            if (auction.Status == Status.Pending)
            {
                return BadRequest("Auction cannot be restarted, but be bidding or closed");
            }
            auctionToModify.Status = Status.Bidding;
            long CurrentTimeUnixTimeStamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            auctionToModify.Expiration = CurrentTimeUnixTimeStamp + room.Settings.BidDurationInSeconds;
            auctionToModify.BidderName = null;
            auctionToModify.Bid = auctionToModify.MinimumPrice ?? room.Settings.MinimumBid;
        }

        await _roomsService.UpdateAsync(id, room);

        return NoContent();
    }

    [HttpPatch("{id:length(24)}/reopen")]
    public async Task<ActionResult<Room>> PatchReopen(string id, Auction auction)
    {
        Room? room = await _roomsService.GetAsync(id);

        if (room is null || room.Auctions is null)
        {
            return NotFound();
        }

        // Set auction to completed
        Auction? auctionToModify = room.Auctions.FirstOrDefault(a => (a.ItemId == auction.ItemId) && (a.RowId == auction.RowId));
        if (auctionToModify is not null)
        {
            if (auction.Status != Status.Assigned)
            {
                return BadRequest("Auction is not closed, cannot re open");
            }
            auctionToModify.Status = Status.Bidding;
            long CurrentTimeUnixTimeStamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            auctionToModify.Expiration = CurrentTimeUnixTimeStamp + room.Settings.BidDurationInSeconds;
            auctionToModify.MinimumPrice = auctionToModify.MinimumPrice ?? room.Settings.MinimumBid;
        }

        await _roomsService.UpdateAsync(id, room);

        return NoContent();
    }

    [HttpPatch("{id:length(24)}/delete")]
    public async Task<ActionResult<Room>> PatchDelete(string id, Auction auction)
    {
        Room? room = await _roomsService.GetAsync(id);

        if (room is null || room.Auctions is null)
        {
            return NotFound();
        }
        // Set auction to completed
        Auction? auctionToSetCountdown = room.Auctions.FirstOrDefault(a => (a.ItemId == auction.ItemId) && (a.RowId == auction.RowId));
        if (auctionToSetCountdown is not null)
        {
            room.Auctions.Remove(auctionToSetCountdown);
        }

        await _roomsService.UpdateAsync(id, room);

        return NoContent();
    }
}