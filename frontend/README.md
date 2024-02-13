# Auction

input:
```
rowId,id,name,quality,ilvl,minLevel,itemType,itemSubType,infoStatus,infoMinPrice,guid
1,19137,Onslaught Girdle,4,78,60,Armor,Plate,1,3000,noguid
2,18814,Choker of the Fire Lord,4,78,60,Armor,Miscellaneous,1,3000,noguid
3,17076,Bonereaver's Edge,4,77,60,Weapon,Two-Handed Swords,1,3000,noguid
4,12282,Worn Battleaxe,1,2,1,Weapon,Two-Handed Axes,1,3000,Item-5827-0-40000000C90648E0
5,140,Brawler's Boots,1,1,0,Armor,Miscellaneous,1,3000,Item-5827-0-40000000C90648DE
```
output
```
rowID,itemId,status,minPrice,exp,winner,salePrice,guid
1:12282,3,3000,1707706195,Anonuwu,3000:2:19137,3,3000,1707706195,Anonuwu,3100,Item-5827-0-40000000C90648DE
```

/ info page
    form
    join room
    create room
/raid/unique
/rmt/unique
/raid/unique
    session
    participate form
    admin start/stop
    list of items
    buttons to control
    interact with db


# Tools installed
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

# Notes
npm install primevue
difficult to do a simple task like basic navigation bar?npm create vite@latest

npm init quasar

# TODO

- [x] add dark theme so my eyes dont bleed 😎
- [ ] status bar with some content = cut out the rest
- [ ] display auction
- [ ] display a list of auctions
- [ ] add buttons
- [ ] make scrollable list for many auctions
- [ ] Keep footer or a header on top for data / filtering
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]