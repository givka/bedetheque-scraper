import * as fs from 'fs-extra';

export class DataBase {
  static async readDb() {
    try {
      return fs.readJSON('database.json');
    } catch (e) {
      await fs.writeJSON('database.json', {});
      return {};
    }
  }

  static async writeDb(serie) {
    const db = await this.readDb();
    db[serie.id] = serie;
    fs.writeJSON('database.json', db);
  }
}
