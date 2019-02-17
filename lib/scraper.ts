import { ProxyFetcher, ProxyType } from './proxy-fetcher';
import { Utils } from './utils';
import { Serie } from './serie';
import { Album } from './album';
import { Author } from './author';

export class Scraper {

  static async scrapeSeries(proxyList: ProxyType[], letter: string) {
    const urls = await this.getSeriesUrlFromLetter(proxyList, letter);
    return Promise.all(urls.map((url, index) => this.getSerie(proxyList, url, index * 500)));
  }

  static async scrapeAuthors(proxyList: ProxyType[], letter: string) {
    const urls = await this.getAuthorsUrlFromLetter(proxyList, letter);
    return Promise.all(urls.map((url, index) => this.getAuthor(proxyList, url, index * 500)));
  }

  static async getSeriesUrlFromLetter(proxyList: ProxyType[], letter: string): Promise<string[]> {
    console.log(`${letter}: searching for series urls...`);
    const baseUrl = 'https://www.bedetheque.com/bandes_dessinees_';
    const $: CheerioAPI = await ProxyFetcher.requestProxy(proxyList, `${baseUrl}${letter}.html`, 1);
    if (!$) { return this.getSeriesUrlFromLetter(proxyList, letter); }
    const urls = $('.nav-liste li')
      .filter((index, element) => ($(element).find('img').attr('src').includes('France')))
      .map((index, element) => $(element).find('a').attr('href').replace('.html', '__10000.html'))
      .get();
    console.log(`${letter}: found ${urls.length} series urls`);
    return urls;
  }

  static async getAuthorsUrlFromLetter(proxyList: ProxyType[], letter: string): Promise<string[]> {
    console.log(`${letter}: searching for authors urls...`);
    const baseUrl = 'https://www.bedetheque.com/liste_auteurs_BD_';
    const $: CheerioAPI = await ProxyFetcher.requestProxy(proxyList, `${baseUrl}${letter}.html`);
    if (!$) { return this.getAuthorsUrlFromLetter(proxyList, letter); }
    const urls = $('.nav-liste li')
      .map((index, element) => $(element).find('a').attr('href'))
      .get();
    console.log(`${letter}: found ${urls.length} authors urls`);
    return urls;
  }

  static async getSerie(proxyList: ProxyType[], url: string, sleepTime: number) {
    await Utils.setTimeoutPromise(sleepTime);
    const $: CheerioAPI = await ProxyFetcher.requestProxy(proxyList, url);
    if (!$) {
      console.log(`✘ serie:   ${url}`);
      return { serie: null, albums: null };
    }
    const serie = new Serie($);
    const albums = $('.liste-albums > li')
    .filter((index, elem) => index < serie.numberOfAlbums)
    .map((index, elem) => new Album($(elem), $, serie.serieId, serie.serieTitle))
    .get() as unknown as Album[];
    serie.addAlbumsInfo(albums);
    console.log(`✔ serie:   ${serie.serieTitle} with ${serie.albumsId.length} albums`);
    return { serie, albums };
  }

  static async getAuthor(proxyList: ProxyType[], url: string, sleepTime: number) {
    await Utils.setTimeoutPromise(sleepTime);
    const $: CheerioAPI = await ProxyFetcher.requestProxy(proxyList, url);
    if (!$) {
      console.log(`✘ author:  ${url}`);
      return null;
    }
    const author = new Author($);
    console.log(`✔ author:  ${author.name}`);
    return author;
  }

  // private static raceMultipleRequests(proxyList: ProxyType[], letter: string)
  // : Promise<string[]> {
  //   return new Promise(((resolve, reject) => {
  //     const promises = Array.from(Array(20)).map((e, i) =>
  //       this.getSeriesUrlFromLetter(proxyList, letter).then(result => resolve(result)));
  //   }));
  // }

}
