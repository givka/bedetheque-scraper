import {ProxyFetcher} from './proxy-fetcher';
import {Utils} from './utils';
import {Serie} from './serie';
import {Album} from './album';
import {Author} from './author';

export class Scraper {

  static async scrapeSeries(letter: string) {
    await ProxyFetcher.updateProxyList();
    const urls = await this.getSeriesUrlFromLetter(letter);
    return Promise.all(urls.map((url, index) => this.getSerie(url, index * 500)));
  }

  static async scrapeAuthors(letter: string) {
    await ProxyFetcher.updateProxyList();
    const urls = await this.getAuthorsUrlFromLetter(letter);
    return Promise.all(urls.map((url, index) => this.getAuthor(url, index * 500)));
  }

  static async getSeriesUrlFromLetter(letter: string): Promise<string[]> {
    console.log(`🔍  ${letter}: searching for series urls...`);
    const url = `https://www.bedetheque.com/bandes_dessinees_${letter}.html`;

    const promises = Array.from(Array(50)).map(() => ProxyFetcher.requestProxy(url, 10000));
    const $: CheerioStatic = await Utils.raceFirstSuccess(promises);

    const urls = $('.nav-liste li')
      .filter((index, element) => ($(element).find('img').attr('src').includes('France')))
      .map((index, element) => $(element).find('a').attr('href').replace('.html', '__10000.html'))
      .get();

    console.log(`${letter}: found ${urls.length} series urls`);
    return urls;
  }

  static async getAuthorsUrlFromLetter(letter: string): Promise<string[]> {
    console.log(`🔍  ${letter}: searching for authors urls...`);

    const url = `https://www.bedetheque.com/liste_auteurs_BD_${letter}.html`;

    const promises = Array.from(Array(50)).map(() => ProxyFetcher.requestProxy(url, 10000));
    const $: CheerioStatic = await Utils.raceFirstSuccess(promises);

    const urls = $('.nav-liste li')
      .map((index, element) => $(element).find('a').attr('href'))
      .get();

    console.log(`${letter}: found ${urls.length} authors urls`);
    return urls;
  }

  static async getSerie(url: string, sleepTime: number) {
    await Utils.sleepFor(sleepTime);
    const $ = await ProxyFetcher.requestProxy(url, 60000)
      .catch(async () => {
        console.log(`⟳ serie:   ${url}`);
        await Utils.sleepFor(500);
        return ProxyFetcher.requestProxy(url, 60000);
      });

    const serie = new Serie($);
    const albums = $('.liste-albums > li')
      .filter((index, elem) => $(elem).find('.numa').text() === '')
      .map((index, elem) => new Album($(elem), $, serie.serieId, serie.serieTitle))
      .get() as unknown as Album[];
    serie.addAlbumsInfo(albums);
    console.log(`✔ serie:   ${serie.serieTitle} with ${serie.albumsId.length} albums`);
    return {serie, albums};
  }

  static async getAuthor(url: string, sleepTime: number) {
    await Utils.sleepFor(sleepTime);
    const $ = await ProxyFetcher.requestProxy(url, 60000)
      .catch(async () => {
        console.log(`⟳ author:   ${url}`);
        await Utils.sleepFor(500);
        return ProxyFetcher.requestProxy(url, 60000);
      });


    const author = new Author($);
    console.log(`✔ author:  ${author.name}`);
    return author;
  }
}
