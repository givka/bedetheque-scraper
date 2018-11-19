import * as _ from 'lodash';
import { Proxy } from './proxy';
import { Scrapper } from './scrapper';
import { DataBase } from './database';

async function main() {
  const db = await DataBase.readDb();
  const proxy = new Proxy();

  const pages = '0'.split('')
    .map(letter => Scrapper.getSeriesFromLetter(proxy, letter, db));

  const allSeries = await Promise.all(pages);
  const series = allSeries.join().split(',');
}

main();

