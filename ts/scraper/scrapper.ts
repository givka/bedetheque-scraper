import { Proxy } from './proxy';
import { Utils } from '../utils';
import { DataBase } from './database';
import { Album } from './album';
import { Message } from './message';

export class Scrapper {
  private nbrOfSeries: number;

  private seriesDone = 0;

  cosntructor() {}

  public async getSeriesFromLetter(proxy: Proxy, letter, db) {
    Message.searchingSeriesFromLetter(letter);
    const uri = `https://www.bedetheque.com/bandes_dessinees_${letter}.html`;
    const $: CheerioAPI = await proxy.requestProxy(uri);

    const series = $('.nav-liste li')
      .filter((index, element) => ($(element).find('img').attr('src').includes('France')))
      .map((index, element) => $(element).find('a').attr('href').replace('.html', '__10000.html'))
      .get()
      .filter(sUri => !db[sUri.match(/serie-([0-9]*)-BD/)[1]]);

    this.nbrOfSeries = series.length;
    Message.foundSeriesFromLetter(series, letter);
    return Promise.all(series.map((url, index) => this.getSerie(proxy, url, index * 500)));
  }

  public async getSerie(proxy : Proxy, uri, sleepTime) {
    await Utils.setTimeoutPromise(sleepTime);
    const $: CheerioAPI = await proxy.requestProxy(uri);
    const serie = this.getSerieInfo($);

    DataBase.writeDbSync(serie);
    Message.serieAdded(++this.seriesDone, this.nbrOfSeries, serie);
    return serie;
  }

  private getSerieInfo($) {
    return {
      id: parseInt($('.idbel').text(), 10),
      titre: $('h1 a').text(),
      albums: this.getSerieAlbums($),
    };
  }

  private getSerieAlbums($) {
    const albums = {};
    $('.liste-albums > li')
      .each((index, elem) => {
        const album = new Album($(elem), $);
        albums[album.id] = album;
      });
    return albums;
  }
}
