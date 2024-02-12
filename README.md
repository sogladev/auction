<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Ella36/auction">
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

TODO

gorm ORM
gin web framework

REST vs GraphQL
use REST.small project, simple data, API users use the same data, only 1 source

playwright simple gui test
postman

swagger



zap logger
https://github.com/uber-go/zap

https://apitest.dev/
apitest


## Requirements
go1.22.0 linux/amd64

## Resources
to be added
https://www.knowledgefactory.net/2022/01/go-lang-vuejs-mysql-crud-example.html
https://github.com/vacaramin/Go-Websocket-ChatRoom

https://www.youtube.com/watch?v=8uiZC0l4Ajw

chat client massive
https://github-com.translate.goog/GoBelieveIO/im_service/tree/master?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en

## Usage

`/hlm p`

https://github.com/Ella36/Hloot

## Roadmap
Addon export [x]
- [x] Export game data
- [x] Import game data

Website [ ]

philosophy: build like a CRUD app and then expand, add tests, basic CI

- [ ] import JSON data
- [ ] parse and reply with auctions to render
- [ ] show data to listeners
- [ ] print list of auctions
- [ ] make a room
- [ ] join room as viewer or lootmaster
- [ ] authenticate viewer
- [ ] authenticate lootmaster
- [ ] join room with a code
- [ ] show users that are listening

Addon import
- [ ] take JSON and import
- [ ] add auctions as "sold" so they can be traded by addon

## Notes

data / schema

https://dbdiagram.io/d/auction-65c9ab1aac844320aeec5e81

![Db Diagram](./images/db_diagram.png.png)

1. meta data
```mermaid
flowchart LR;
    game-->in-->website-->out-->game
    in[(items.csv)]
    out[(sold_items.csv)]
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

![Ingame Export Screenshot](./images/game_export_screenshot.png)

`/hlm e` export

Add items with hlma (from id) or with shift+click (from bags)

note: items created with /hlma do not have a guid and when importing are not auto-tradeable
shift+click items to add. will export/import the guid and allow auto-trading

Test string for /hlma
```/hlma 19137 18814 17076 18563 17069 17071 17105 17204 16795 16808 16813 16821 16834 16842 16846 16854 16866 18264 18260 17011```
smaller
```/hlma 19137 18814 17076```


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

## Config

## Database

## Implementing GUI

[Python.org]: https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Electron.js]: https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white
[Electron-url]: https://www.electronjs.org/


[Twitch.com]: 	https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white
[Twitch-url]:    https://twitch.com
[Youtube-url]:    https://youtube.com
[Youtube.com]: https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white
[gui-screenshot]: https://github.com/Ella36/gui-compilation-from-cluster/raw/main/screenshot.png