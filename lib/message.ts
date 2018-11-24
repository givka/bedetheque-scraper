import { Serie } from './serie';
import { ProxyType } from './proxy';

export class Message {
  static letterDone(letter: string) {
    console.log(`\n\rLetter ${letter} Done\n\r`);
  }

  static databaseScraped() {
    console.log('\n\rAll database of bedetheque.com is scraped.\n\r');
  }

  static foundFreeProxiesList(proxyList: ProxyType[], timeout: number) {
    console.log(`Found ${proxyList.length} proxies with ${timeout}ms timeout to scrap bedetheque.com`);
  }

  static foundSeriesFromLetter(seriesUrl: string[], letter: string) {
    console.log(`Found ${seriesUrl.length} series not scraped for letter ${letter}`);
  }

  static retryRequest(url: string) {
    console.log(`RETRY ${url}`);
  }

  static searchingSeriesFromLetter(letter: string) {
    console.log(`Searching all series beginning with the letter ${letter}\n\rIt can take some time...`);
  }

  static searchingFreeProxiesList(timeout: number) {
    console.log(`Searching Free Proxy List with ${timeout}ms timeout.`);
  }

  static serieAdded(seriesDone: number, nbrOfSeries: number, serie: Serie) {
    console.log(`${seriesDone}/${nbrOfSeries}: added ${serie.serieTitle}, with ${Object.keys(serie.albums).length} albums`);
  }

  static serieFail(seriesDone: number, nbrOfSeries: number, url: string) {
    console.log(`${seriesDone}/${nbrOfSeries}: fail ${url}`);
  }
}
