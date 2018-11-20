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
    fs.writeJSON('database.json', db);
  }

  static readDbSync() {
    try {
      return fs.readJSONSync('database.json');
    } catch (e) {
      fs.writeJSONSync('database.json', {});
      return {};
    }
  }

  static writeDbSync(serie) {
    console.time('read-write');

    const db = this.readDbSync();
    db[serie.id] = serie;

    fs.writeJSONSync('database.json', db);

    console.timeEnd('read-write');
  }
}
