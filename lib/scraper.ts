import moment from 'moment';
import { Proxy } from './proxy';
import { Utils } from './utils';
import { DataBase, DataBaseType } from './database';
import { Message } from './message';
import { Serie } from './serie';

export class Scraper {
  public nbrOfSeries = 0;

  public seriesDone = 0;

  public currentLetter = '?';

  public date = moment();

  constructor() {
    this.getAllSeries();
  }

  private async getAllSeries() {
    const letters = '0ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const db = await DataBase.readDb();
    for (const letter of letters) {
      const proxy = new Proxy();
      await proxy.getFreeProxyList(5000);
      await this.getSeriesFromLetter(proxy, letter, db);
      Message.letterDone(letter);
    }
    Message.databaseScraped();
  }

  private async getSeriesFromLetter(proxy: Proxy, letter: string, db: DataBaseType) : Promise<any> {
    Message.searchingSeriesFromLetter(letter);
    const uri = `https://www.bedetheque.com/bandes_dessinees_${letter}.html`;
    const $: CheerioAPI = await proxy.requestProxy(uri);

    if (!$) { return this.getSeriesFromLetter(proxy, letter, db); }

    const series = $('.nav-liste li')
      .filter((index, element) => ($(element).find('img').attr('src').includes('France')))
      .map((index, element) => $(element).find('a').attr('href').replace('.html', '__10000.html'))
      .get()
      .filter(sUri => !db[parseInt(sUri.match(/serie-([0-9]*)-BD/)![1], 10)]);

    this.nbrOfSeries += series.length;
    this.currentLetter = letter;
    Message.foundSeriesFromLetter(series, letter);
    return Promise.all(series.map((url, index) => this.getSerie(proxy, url, index * 500, db)));
  }

  private async getSerie(proxy : Proxy, uri: string, sleepTime: number, db: DataBaseType) {
    await Utils.setTimeoutPromise(sleepTime);
    const $: CheerioAPI = await proxy.requestProxy(uri);
    this.seriesDone += 1;
    if (!$) {
      Message.serieFail(this.seriesDone, this.nbrOfSeries, uri);
      return null;
    }
    const serie = new Serie($);
    db[serie.serieId] = serie;
    DataBase.writeDbSync(db);
    Message.serieAdded(this.seriesDone, this.nbrOfSeries, serie);
    return serie;
  }

  public getDuration() {
    const now = moment();
    const then = this.date;
    const ms = moment(now, 'DD/MM/YYYY HH:mm:ss').diff(moment(then, 'DD/MM/YYYY HH:mm:ss'));
    const d = moment.duration(ms);
    return `${Math.floor(d.asHours())}h${moment.utc(ms).format(':mm[m]:ss[s]')}`;
  }
}
