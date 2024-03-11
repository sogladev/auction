import { defineStore } from 'pinia';
import { api } from 'boot/axios';

import {
  Auction,
  Room,
  Namespace,
  Status,
  RoomSettings,
} from 'src/components/models';

export const useRoomStore = defineStore('RoomStore', {
  state: () => ({
    room: {} as Room,
    auctions: {} as Auction[],
    settings: {} as RoomSettings,
    isAdmin: false as boolean,
    isShowAdminControls: true as boolean,
  }),
  getters: {
    pendingAuctions: (state) => {
      const pendingAuctions: Array<Auction> = state.auctions.filter(
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
          this.auctions = response.data.auctions;
          this.settings = response.data.settings;
          this.isAdmin = true;
          return response.data.id;
        });
    },
    async fetch(roomId: string): Promise<boolean> {
      return api
        .get(`/api/rooms/${roomId}`)
        .then((response) => {
          this.room = response.data;
          this.auctions = response.data.auctions;
          this.settings = response.data.settings;
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    async fetchAuctions(roomId: string): Promise<boolean> {
      return api
        .get(`/api/rooms/${roomId}/auctions`)
        .then((response) => {
          // this.auctions = response.data;
          response.data.forEach((newAuction: Auction) => {
            const existingAuction = this.auctions.find(
              (auction) =>
                auction.rowId === newAuction.rowId &&
                auction.itemId === newAuction.itemId,
            );
            if (existingAuction) {
              if (
                existingAuction.expiration !== newAuction.expiration ||
                existingAuction.guid !== newAuction.guid ||
                existingAuction.minimumPrice !== newAuction.minimumPrice ||
                existingAuction.status !== newAuction.status ||
                existingAuction.bid !== newAuction.bid ||
                existingAuction.bidderName !== newAuction.bidderName
              ) {
                Object.assign(existingAuction, newAuction);
                console.log('update : ', newAuction.rowId);
              } else {
                console.log('no change: ', newAuction.rowId);
              }
            } else {
              console.log('new auction');
              console.log('push new: ', newAuction.rowId);
              this.auctions.push(newAuction);
            }
          });
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    async fetchSettings(roomId: string): Promise<boolean> {
      return api
        .get(`/api/rooms/${roomId}/settings`)
        .then((response) => {
          this.settings = response.data;
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
    async toCSV(): Promise<string> {
      console.log('NotImplementedYet');
      return 'NotImplementedYet';
    },
  },
});
