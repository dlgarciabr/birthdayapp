/*
  Warnings:

  - Made the column `countryId` on table `Person` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birthdate" DATETIME NOT NULL,
    "countryId" INTEGER NOT NULL,
    CONSTRAINT "Person_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Person" ("birthdate", "countryId", "id", "name", "surname") SELECT "birthdate", "countryId", "id", "name", "surname" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE UNIQUE INDEX "Person_name_key" ON "Person"("name");
CREATE UNIQUE INDEX "Person_surname_key" ON "Person"("surname");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
