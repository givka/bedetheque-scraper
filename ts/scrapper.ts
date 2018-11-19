import { Proxy } from './proxy';
import { Utils } from './utils';
import { DataBase } from './database';
import { Album } from './album';

export class Scrapper {
  cosntructor() {}

  static async getSeriesFromLetter(proxy: Proxy, letter, db) {
    const uri = `https://www.bedetheque.com/bandes_dessinees_${letter}.html`;
    const $: CheerioAPI = await proxy.requestProxy(uri);

    const series = $('.nav-liste li')
      .filter((index, element) => ($(element).find('img').attr('src').includes('France')))
      .map((index, element) => $(element).find('a').attr('href').replace('.html', '__10000.html'))
      .get()
      .filter(sUri => !db[sUri.match(/serie-([0-9]*)-BD/)[1]]);

    console.log(`There are ${series.length} series to do in letter ${letter}`);
    return series.map((serieUri, index) => this.getSerie(proxy, serieUri, db, index * 500));
  }

  static async getSerie(proxy : Proxy, uri, db, sleepTime) {
    await Utils.setTimeoutPromise(sleepTime);

    const $: CheerioAPI = await proxy.requestProxy(uri);
    if (!$) { return null; }

    const serie = this.getSerieInfo($);

    db[serie.id] = serie;

    DataBase.writeDb(db);

    return serie;
  }

  static getSerieInfo($) {
    return {
      id: parseInt($('.idbel').text(), 10),
      titre: $('h1 a').text(),
      albums: this.getSerieAlbums($),
    };
  }

  static getSerieAlbums($) {
    const albums = {};
    $('.liste-albums > li')
      .each((index, elem) => {
        const album = new Album($(elem), $);
        albums[album.id] = album;
      });
    return albums;
  }
}
