import * as fs from 'fs-extra';
import { Serie } from './serie';

// TODO: use async read / write with lock for no conflict;
// import * as ReadWriteLock from 'rwlock';
// lock

// constructor() {
//   this.lock = new ReadWriteLock();
// }

export interface DataBaseType{
  [key: number]: Serie;
}

export class DataBase {
  static async readDb() {
    const url = 'database/series.json';
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

  static async writeDbSync(db: DataBaseType) {
    const url = 'database/series.json';
    return fs.writeJSONSync(url, db);
  }
}
