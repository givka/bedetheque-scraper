import * as _ from 'lodash';
import { Proxy } from './proxy';
import { Scrapper } from './scrapper';
import { DataBase } from './database';
import { Message } from './message';

async function main() {
  const db = await DataBase.readDbSync();

  const letters = '0AB'.split('');

  for (const letter of letters) {
    const proxy = new Proxy();
    await proxy.getFreeProxyList(5000);

    const scrapper = new Scrapper();
    await scrapper.getSeriesFromLetter(proxy, letter, db);

    Message.letterDone(letter);
  }

  Message.databaseScraped();
}

main();

