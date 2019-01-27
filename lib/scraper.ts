import { ProxyFetcher, ProxyType } from './proxy-fetcher';
import { Utils } from './utils';
import { Message } from './message';
import { Serie } from './serie';
import { Album } from './album';

export class Scraper {
  public static async getSeriesUrlFromLetter(proxyList: ProxyType[], letter: string)
  : Promise<string[]> {
    Message.searchingSeriesFromLetter(letter);
    const uri = `https://www.bedetheque.com/bandes_dessinees_${letter}.html`;
    const $: CheerioAPI = await ProxyFetcher.requestProxy(proxyList, uri);

    if (!$) { return this.getSeriesUrlFromLetter(proxyList, letter); }

    const series = $('.nav-liste li')
      .filter((index, element) => ($(element).find('img').attr('src').includes('France')))
      .map((index, element) => $(element).find('a').attr('href').replace('.html', '__10000.html'))
      .get();

    Message.foundSeriesFromLetter(series, letter);
    return series;
  }

  public static async getSerie(proxyList: ProxyType[], uri: string, sleepTime: number) {
    await Utils.setTimeoutPromise(sleepTime);
    const $: CheerioAPI = await ProxyFetcher.requestProxy(proxyList, uri);
    if (!$) {
      Message.serieFail(uri);
      return { serie: null, albums: null };
    }
    const serie = new Serie($);
    const albums = $('.liste-albums > li')
    .map((index, elem) => new Album($(elem), $, serie.serieId, serie.serieTitle))
    .get() as unknown as Album[];
    serie.addAlbumsInfo(albums);
    Message.serieAdded(serie);
    return { serie, albums };
  }

  private static raceMultipleRequests(ms: number, promise: Promise<any>) {
    return new Promise(((resolve, reject) => {
      setTimeout(() => { reject(new Error('timeout')); }, ms);
      promise.then(resolve, reject);
    }));
  }
}
