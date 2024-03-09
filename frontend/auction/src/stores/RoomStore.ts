import { defineStore } from 'pinia';
import { api } from 'boot/axios';

import { Auction, Room, Namespace, Status } from 'src/components/models';

export const useRoomStore = defineStore('RoomStore', {
  state: () => ({
    room: {} as Room,
    isAdmin: false as boolean,
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
          this.room = response.data;
          this.isAdmin = true;
          return response.data.id;
        });
    },
    async fetch(roomId: string): Promise<boolean> {
      return api
        .get(`/api/rooms/${roomId}`)
        .then((response) => {
          this.room = response.data;
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
  },
});
