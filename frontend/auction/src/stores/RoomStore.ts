import { defineStore } from 'pinia';
import { api } from 'boot/axios';

import { Auction, Room, Namespace, Status } from 'src/components/models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function newRoomFromResponseData(data: any): Room {
  const newRows: Array<Auction> = [];
  if (data.auctions !== null) {
    for (const auction of data.auctions) {
      const newAuction = <Auction>{
        expiration: auction.expiration,
        guid: auction.guid,
        itemId: auction.itemId,
        itemLevel: auction.itemLevel,
        itemName: auction.itemName,
        itemSubType: auction.itemSubType,
        itemType: auction.itemType,
        minLevel: auction.minLevel,
        minimumPrice: auction.minimumPrice,
        quality: auction.quality,
        rowId: auction.rowId,
        status: auction.status,
        // bid and bidderName are null if not started
        bid: auction.bid,
        bidderName: auction.bidderName,
      };
      newRows.push(newAuction);
    }
  }
  const newRoomState = <Room>{
    name: data.name,
    id: data.id,
    enableDiscordProtection: data.enableDiscordProtection,
    bidDurationInSeconds: data.bidDurationInSeconds,
    countDownTimeInSeconds: data.countDownTimeInSeconds,
    restrictBidsToEquipable: data.restrictBidsToEquipable,
    hideNameOfHighestBidder: data.hideNameOfHighestBidder,
    hidePayoutDetails: data.hidePayoutDetails,
    organiserFee: data.organiserFee,
    minimumBid: data.minimumBid,
    minimumBidIncrement: data.minimumBidIncrement,
    auctions: newRows,
    namespace: data.namespace,
  };
  return newRoomState;
}

export const useRoomStore = defineStore('RoomStore', {
  state: () => ({
    room: <Room>{
      name: 'default',
      id: 'default',
      namespace: Namespace.Progression,
      enableDiscordProtection: false,
      bidDurationInSeconds: 240,
      countDownTimeInSeconds: 40,
      restrictBidsToEquipable: false,
      hideNameOfHighestBidder: false,
      hidePayoutDetails: false,
      organiserFee: 10,
      minimumBid: 10,
      minimumBidIncrement: 2,
      auctions: <Auction[]>[],
    },
  }),
  getters: {
    //doubleCount: (state) => state.counter * 2,
    pendingAuctions: (state) => {
      const pendingAuctions: Array<Auction> = state.room.auctions.filter(
        (auction) => auction.status === Status.Pending,
      );
      return pendingAuctions;
    },
  },
  actions: {
    async create(namespace: Namespace): Promise<number> {
      return api
        .post(`/api/rooms/create?Namespace=${namespace}`)
        .then((response) => {
          console.log(response);
          const newRoomState: Room = newRoomFromResponseData(response.data);
          this.room = newRoomState;
          return response.data.id;
        });
    },
    async fetch(roomId: string): Promise<boolean> {
      try {
        const response = await api.get(`/api/rooms/${roomId}`);
        console.log(response);
        const newRoomState: Room = newRoomFromResponseData(response.data);
        this.room = newRoomState;
        console.log('newRoomState: ');
        console.log(this.room);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});
