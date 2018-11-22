import * as fs from 'fs-extra';

// import * as ReadWriteLock from 'rwlock';

export class DataBase {
  // lock

  // constructor() {
  //   this.lock = new ReadWriteLock();
  // }

  static async readDb() {
    return fs.readJSON('database.json')
      .catch(async (e) => {
        await fs.writeJSON('database.json', {});
        return {};
      });
  }

  static async writeDb(serie) {
    const db = await this.readDb();
    db[serie.id] = serie;
    return fs.writeJSON('database.json', db);
  }

  static async writeDbSync(db) {
    return fs.writeJSONSync('database.json', db);
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
