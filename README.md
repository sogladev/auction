<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/jellemeeus/auction">
  </a>

  <h3 align="center">
  Auction</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#requirements">Requirements</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#resources">Resources</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#notes">Notes</a></li>
    <li><a href="#gui">GUI</a></li>
    <li><a href="#upload">Upload</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

# Auction

## Built With

frontend:
node v20.11.0
vue js 3
vitest
quasar

backend:
dotnet webapi
mongodb + compass
swagger

vuetest
playwright simple gui test
postman
Thunder Client extension

## Requirements

TODO

## Resources

https://vuejs.org/
https://quasar.dev/docs

https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-8.0&tabs=visual-studio

## Usage

see addon `./addon`
`/hlm p` export Pending items
`/hlm i` import auctioned items

TODO

## Roadmap

v0:
- [x] Create a room with adjustable auction settings
- [x] Participate in an auction as user / admin
- [x] Export / Import auctions from ingame <--> web

v1:
- [ ] Role management (Admin, User)
- [ ] User management, balance, name, icon
- [ ] Web socket instead of polling

Addon export [ ]

- [x] export game data
- [x] import game data
- [x] data model adjustments
- [ ] adjust addon to remove unneeded features
- [ ] add amount of items

Roles / Auth
- [ ] join room as viewer or lootmaster
- [ ] authenticate viewer
- [ ] authenticate lootmaster
- [ ] show users that are participating

Style
- [x] add dark theme
- [x] status bar with some content
- [x] room settings form design
- [x] form slider for fee %, bid duration, countdown

Data
- [x] same data format addon
- [x] design room mongoDB document structure
- [x] validate form input backend
- [x] validate form input frontend
- [ ] Make generic datastore based on PonyStore, ItemInfo loads from datastore
- [ ] Add BoE tag when pulling from API

Pages/navigation
- [x] join room with a code
- [x] navigate to index, a room
- [x] index page
- [x] go to a new room
- [x] form page and navigate to a room
- [j] display auctions of room from db
- [x] display a list of auctions
- [x] increment auction
- [x] load room settings from db
- [x] make scrollable list for many auctions
- [x] display valid room
- [x] conditional load of valid room
- [x] global room data
- [x] load room data when creating
- [x] load room data when loading

Items
- [x] create new auction form items CSV
- [x] create new auction from ID list
- [x] load itemInfo data from Blizzard API
- [x] fix increment
- [x] add caching before API
- [x] add item data for each namespace
- [ ] add amount of items

Session

- [x] submit auction to db
- [x] refresh auction data from db
- [x] auto refreshing
- [x] optimize refreshing
- [x] session state. Start auctions
- [x] session state. End auctions
- [ ] Add loot master / admin authentication

Admin controls
- [x] Admin buttons, delete, countdown, close, restart, etc

Session / General controls
- [ ] Filter by item name
- [x] Filter by "watched"
- [ ] Filter by usable
- [ ] Add BoE bid as a group

Live / real time updates
- [x] Display progression bars
- [x] Timer 1: fast update to update current time which updates progression timers
- [x] Timer 2: 1 sec or slower: Server updates

## Notes

data / schema

https://dbdiagram.io/d/auction-65c9ab1aac844320aeec5e81

![Db Diagram](./images/db_diagram.png.png)

1. meta data

```mermaid
flowchart LR;
    game-->in-->website-->out-->game
    in[(items.csv)]
    out[(encodedItems)]
    website([website])
```

1. Loot master interaction
   addon handles exporting of items
   website handles auctions + cuts
   addon handles trading player items

```mermaid
flowchart LR;
    in-->website-->out-->trade
    out[(sold_items.csv)]
    in([addon export items])
    out([addon import auctions])
    trade([trade items])
    website([auctions website])
```

1. Player interaction
   no addon required for player

```mermaid
flowchart LR;
    website-->game
    game([trade loot master for item])
    website([bid with website gui])
```

1. Addon export items

```mermaid
flowchart LR;
    export-->data
    data[(items.csv)]
    export(["Session:ExportAllPendingAuctionsToGUI()"])
```

## Addon

see ./addon under "addon" branch

![Ingame Export Screenshot](./images/game_export_screenshot.png)

`/hlm e` export

Add items with hlma (from id) or with shift+click (from bags)

note: items created with /hlma do not have a guid and when importing are not auto-tradeable
shift+click items to add. will export/import the guid and allow auto-trading

Test string for /hlma
`/hlma 19137 18814 17076 18563 17069 17071 17105 17204 16795 16808 16813 16821 16834 16842 16846 16854 16866 18264 18260 17011`
smaller
`/hlma 19137 18814 17076`

`/hlm e`

```
rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
2,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid
3,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid
4,12282,Worn Battleaxe,1,2,1,Weapon,Two-Handed Axes,1,3000,Item-5827-0-40000000C90648E0
5,140,Brawler's Boots,1,1,0,Armor,Miscellaneous,1,3000,Item-5827-0-40000000C90648DE
```

![Ingame Import Screenshot](./images/game_import_screenshot.png)

`/hlm i`

itemIdreateForId(tonumber(elements[1]))
item.info = {
status = tonumber(elements[2]),
minPrice = tonumber(elements[3]),
exp = tonumber(elements[4]),
winner = elements[5],
salePrice = tonumber(elements[6])
}
item.guid = elements[7] -- Encode != Decode. Field is only needed to be decoded from GUI

```
rowID,itemId,status,minPrice,exp,winner,salePrice,guid
1:12282,3,3000,1707706195,Anonuwu,3000:2:19137,3,3000,1707706195,Anonuwu,3100,Item-5827-0-40000000C90648DE
```

1. Website
   TODO: itemName, icon, rarity from wowhead API

```mermaid
flowchart LR;
    input-->magic-->output
```

## Frontend

output

```
rowID,itemId,status,minPrice,exp,winner,salePrice,guid
1:12282,3,3000,1707706195,Anonuwu,3000:2:19137,3,3000,1707706195,Anonuwu,3100,Item-5827-0-40000000C90648DE
```

ItemIds from molten core

```
19137,18814,17076,12282,16901, 18815, 18816, 17204, 17082,7078, 18646, 18803, 19140, 17073, 17069, 18821, 18879, 18264, 18260
```


Toggle options group

```
Options for toggles
group: ref(['op1'])
options: [ { label: 'Option 1', value: 'op1' }, { label: 'Option 2', value: 'op2' }, { label: 'Option 3', value: 'op3' } ]
  <div class="q-pa-lg">
    <q-option-group
      v-model="group"
      :options="options"
      color="yellow"
      type="toggle"
    />
  </div>
```

### Tools installed

Typescript
JSX
Vue Router
Pinia
Vitest
E2E Playright
ESLINT+Prettier

```
npm create vite@latestnpm install primevue✔ Project name: … auction
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Vitest for Unit Testing? … No / Yes
✔ Add an End-to-End Testing Solution? › Playwright
✔ Add ESLint for code quality? … No / Yes
✔ Add Prettier for code formatting? … No / Yes
```

## Backend

TODO: Use pony client to gather data. Does it cache? Store item data in mongo

dotnet add package ArgentPonyWarcraftClient --version 8.1.8

https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-8.0&tabs=linux#secret-manager

dotnet user-secrets init
dotnet user-secrets set "Blizzard:ClientId" "clientId-xxxxxxxxxxxxxxxxxxxx"
dotnet user-secrets set "Blizzard:ClientSecret" "clientSecret-xxxxxxxxxxxxxxxxxxxx"

https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-mongo-app?view=aspnetcore-8.0&tabs=visual-studio-code

mongodb
compass

mongodb://localhost:27017

response of GET request to /api/auctions

```
[
  {
    "id": "65d1eeb92ba931f1cf61f531",
    "rowId": 1,
    "itemId": 19137,
    "status": 1,
    "minimumPrice": 3000,
    "expiration": 1708217000,
    "itemName": "Onslaught Girdle",
    "quality": 4,
    "itemLevel": 78,
    "minLevel": 60,
    "itemType": "Armor",
    "itemSubType": "Plate",
    "guid": "noguid"
  },
  ...
]
```

Document data format

```
// JSON Room
{
  "name": "Lootmaster",
  "enableDiscordProtection": false,
  "organiserFee": 10,
  "minimumBid": 10,
  "minimumBidIncrement": 1,
  "bidDurationInSeconds": 240,
  "countDownTimeInSeconds": 40,
  "restrictBidsToEquipable": false,
  "hideNameOfHighestBidder": false,
  "hidePayoutDetails": false,
  "users": [
    { "name": "user1" },
    { "name": "user2" },
    { "name": "user3" },
    { "name": "user4" },
  ],
  "auctions": [
  {
  "rowId": 1,
  "status": 1,
  "expiration": 1708217000,
  "itemId": 19137,
  "guid": "noguid"
  "minimumPrice": 3000,
  "itemName": "Onslaught Girdle",
  "quality": 4,
  "itemLevel": 78,
  "minLevel": 60,
  "itemType": "Armor",
  "itemSubType": "Plate",
  },
  {
  "rowId": 2,
  "status": 1,
  "expiration": 1708217000,
  "itemId": 18814,
  "guid": "noguid"
  "minimumPrice": 3000,
  "itemName": "Choker of the Fire Lord",
  "quality": 4,
  "itemLevel": 78,
  "minLevel": 60,
  "itemType": "Armor",
  "itemSubType": "Miscellaneous",
  },
  {
  "rowId": 3,
  "status": 1, "expiration": 1708217000,
  "itemId": 12282,
  "guid": "Item-5827-0-40000000C90648E0"
  "minimumPrice": 1000,
  "itemName": "Worn Battleaxe",
  "quality": 1,
  "itemLevel": 2,
  "minLevel": 1,
  "itemType": "Weapon",
  "itemSubType": "Weapon,Two-Handed Axes",
  },
  {
  "rowId": 4,
  "status": 1,
  "expiration": 1708217000,
  "itemId": 12282,
  "guid": "Item-5827-0-40000000C90648DE"
  "minimumPrice": 1000,
  "itemName": "Brawler's Boots",
  "quality": 1,
  "itemLevel": 1,
  "minLevel": 1,
  "itemType": "Armor",
  "itemSubType": "Miscellaneous",
  },
  ]
}
```

# Video


# Images

![](./images/frontend_index_dark_selected.png)
![](./images/frontend_room_dark_admin1.png)
![](./images/frontend_room_dark_admin2.png)
![](./images/frontend_room_dark_admin3.png)
![](./images/frontend_room_dark_user1.png)
![](./images/frontend_room_dark_user2.png)
![](./images/frontend_room_dark_user3.png)

[Python.org]: https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Electron.js]: https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white
[Electron-url]: https://www.electronjs.org/
[Twitch.com]: https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white
[Twitch-url]: https://twitch.com
[Youtube-url]: https://youtube.com
[Youtube.com]: https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white
[gui-screenshot]: https://github.com/jellemeeus/gui-compilation-from-cluster/raw/main/screenshot.png
