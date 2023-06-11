// Remember to set type: module in package.json or use .mjs extension
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url)); //will get full path to correct directory file://user/daniel_nie..../lib/lowDb.js
const file = join(__dirname, 'db.json'); //file where we will be saving the message history

let cached = global.lowDb; // cached data

if (!cached) {
  cached = global.lowDb = { conn: null };
}

async function dBconnect() {
  if (!cached.conn) {
    //if we dont already have data in the db, prevents db being created every instantiation
    const adapter = new JSONFile(file);
    const db = new Low(adapter);
    db.data = { messageHistory: {} };
    cached.conn = db;
  }

  await cached.conn.read(); //reads the data from the database (db.json)
  cached.conn.data = cached.conn.data || { messageHistory: {} }; //if data is present then return the data, if its empty return an empty object

  return cached.conn;
}

export default dBconnect;
