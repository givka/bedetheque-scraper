import * as fs from 'fs-extra';

// import * as ReadWriteLock from 'rwlock';
const letters = '0ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export class DataBase {
  // lock

  // constructor() {
  //   this.lock = new ReadWriteLock();
  // }

  static async readAllDb() {
    console.time('read');
    let db = {};
    const dbArray = await Promise.all(letters.map(letter => this.readDb(letter)));
    dbArray.forEach((dbLetter) => { db = { ...db, ...dbLetter }; });
    console.timeEnd('read');
    return db;
  }

  static async readDb(letter) {
    const url = `database/${letter}.json`;
    return fs.readJSON(url)
      .catch(async (e) => {
        await fs.writeJSON(url, {})
          .catch(() => {
            fs.existsSync('database') || fs.mkdirSync('database');
            return fs.writeJSON(url, {});
          });
        return {};
      });
  }

  static async writeDbSync(db, letter) {
    const url = `database/${letter}.json`;
    return fs.writeJSONSync(url, db);
  }

  static readDbSync() {
    try {
      return fs.readJSONSync('database.json');
    } catch (e) {
      fs.writeJSONSync('database.json', {});
      return {};
    }
  }

  static writeSeries(db, series) {
    console.time('read-write');
    series.forEach((serie) => { db[serie.id] = serie; });
    fs.writeJSONSync('database.json', db);
    console.timeEnd('read-write');
  }
}
