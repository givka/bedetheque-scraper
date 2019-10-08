import {Proxy} from './proxy-fetcher';
import {Utils} from './utils';
import {Serie} from './serie';
import {Album} from './album';
import {Author} from './author';

export class Scraper {
  static async getSeriesUrlFromLetter(letter: string, proxy: Proxy = null): Promise<string[]> {
    const $ = await Utils.requestWithProxy(`https://www.bedetheque.com/bandes_dessinees_${letter}.html`, proxy);

    return $('.nav-liste li')
      .filter((index, element) => ($(element).find('img').attr('src').includes('France')))
      .map((index, element) => $(element).find('a').attr('href').replace('.html', '__10000.html'))
      .get();
  }

  static async getAuthorsUrlFromLetter(letter: string, proxy: Proxy = null): Promise<string[]> {
    const $ = await Utils.requestWithProxy(`https://www.bedetheque.com/liste_auteurs_BD_${letter}.html`, proxy);

    return $('.nav-liste li')
      .map((index, element) => $(element).find('a').attr('href'))
      .get();
  }

  static async getSerie(url: string, proxy: Proxy = null) {
    const $ = await Utils.requestWithProxy(url, proxy);

    const serie = new Serie($);

    const albums = Album.formatAlbumsFromSerie($, serie);
    await serie.addAlbumsInfo(albums);

    return {serie, albums};
  }

  static async getAuthor(url: string, proxy: Proxy = null) {
    const $ = await Utils.requestWithProxy(url, proxy);

    const author = new Author($);
    await author.getImageDimensions();

    console.log('title: ' + $('title').text());


    return author;
  }
}
