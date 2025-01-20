/*
  Warnings:

  - A unique constraint covering the columns `[user_id,election_id]` on the table `votes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `votes_user_id_election_id_key` ON `votes`(`user_id`, `election_id`);
