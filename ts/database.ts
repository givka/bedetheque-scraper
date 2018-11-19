import * as fs from 'fs-extra';

export class DataBase {
  static readDb() {
    return fs.readJSON('database.json')
      .catch(() => {
        fs.writeJSON('database.json', {});
        return {};
      });
  }

  static writeDb(obj) {
    fs.writeJSON('database.json', obj);
  }
}
