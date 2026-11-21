-- Pride of Pakistan: advertising tables
-- Run ONCE in phpMyAdmin on database u182799714_pride (SQL tab), BEFORE
-- deploying the advertising feature. Safe to run again: it skips existing tables.

CREATE TABLE IF NOT EXISTS `advertisements` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `title`        VARCHAR(255) NOT NULL,
  `advertiser`   VARCHAR(255) NOT NULL,
  `imageDesktop` VARCHAR(255) NOT NULL,
  `imageMobile`  VARCHAR(255) NOT NULL DEFAULT '',
  `imageSquare`  VARCHAR(255) NOT NULL DEFAULT '',
  `altText`      VARCHAR(255) NOT NULL DEFAULT '',
  `linkUrl`      VARCHAR(500) NOT NULL DEFAULT '',
  `placements`   JSON NOT NULL,
  `startsAt`     DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endsAt`       DATETIME(3) NULL,
  `status`       INT NOT NULL DEFAULT 1,
  `priority`     INT NOT NULL DEFAULT 1,
  `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`    DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `advertisements_status_idx` (`status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ad_stats` (
  `id`     INT NOT NULL AUTO_INCREMENT,
  `adId`   INT NOT NULL,
  `day`    DATE NOT NULL,
  `views`  INT NOT NULL DEFAULT 0,
  `clicks` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ad_stats_adId_day_key` (`adId`, `day`),
  INDEX `ad_stats_day_idx` (`day`),
  CONSTRAINT `ad_stats_adId_fkey` FOREIGN KEY (`adId`) REFERENCES `advertisements` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
