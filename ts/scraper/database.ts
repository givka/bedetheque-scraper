import * as fs from 'fs-extra';

// import * as ReadWriteLock from 'rwlock';

export class DataBase {
  // lock

  // constructor() {
  //   this.lock = new ReadWriteLock();
  // }

  static async readDb(letter) {
    const url = `database/${letter}.json`;
    return fs.readJSON(url)
      .catch(async (e) => {
        await fs.writeJSON(url, {})
          .catch(() => { fs.mkdirSync('database'); });
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
