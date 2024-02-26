CREATE TABLE `room` (
  `roomId` varchar(255) UNIQUE,
  `participants` user,
  `session` session,
  `realm` string
);

CREATE TABLE `session` (
  `id` integer PRIMARY KEY,
  `auctionId` integer AUTO_INCREMENT,
  `minIncrement` integer,
  `bidDuration` integer,
  `countdown` integer,
  `integer` minBid,
  `allowOS` bool,
  `pool` integer
);

CREATE TABLE `auction` (
  `id` integer PRIMARY KEY,
  `itemId` integer,
  `status` ENUM ('pending', 'bidding', 'assigned'),
  `bidder` varchar(255),
  `bid` integer,
  `expiration` timestamp
);

CREATE TABLE `item` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `guid` string UNIQUE,
  `tradeExpiration` timestamp,
  `quality` ENUM ('poor', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact', 'heirloom', 'wowtoken'),
  `isBoE` bool COMMENT 'no expiration'
);

CREATE TABLE `character` (
  `guid` id UNIQUE,
  `name` varchar(255),
  `realm` varchar(255),
  `class` varchar(255)
);

CREATE TABLE `user` (
  `id` integer PRIMARY KEY,
  `character` name,
  `role` ENUM ('player', 'gamemaster'),
  `balance` integer
);

ALTER TABLE `user` ADD FOREIGN KEY (`id`) REFERENCES `room` (`participants`);

ALTER TABLE `room` ADD FOREIGN KEY (`session`) REFERENCES `session` (`id`);

ALTER TABLE `auction` ADD FOREIGN KEY (`bidder`) REFERENCES `character` (`name`);

ALTER TABLE `user` ADD FOREIGN KEY (`character`) REFERENCES `character` (`name`);

ALTER TABLE `auction` ADD FOREIGN KEY (`id`) REFERENCES `session` (`id`);

ALTER TABLE `item` ADD FOREIGN KEY (`id`) REFERENCES `auction` (`itemId`);
