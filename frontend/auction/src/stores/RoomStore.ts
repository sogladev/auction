import { defineStore } from 'pinia';

import { Auction, Room } from 'src/components/models';

export const useRoomStore = defineStore('RoomStore', {
  state: () => ({
    room: <Room>{
      name: 'default',
      id: 'default',
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
  },
  actions: {
    //increment() {
    //  this.counter++;
    //},
  },
});
