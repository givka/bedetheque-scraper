export class Message {
  static letterDone(letter) {
    console.log(`\n\rLetter ${letter} Done\n\r`);
  }

  static databaseScraped() {
    console.log('\n\rAll database of bedetheque.com is scraped.\n\r');
  }

  static foundFreeProxiesList(proxyList, timeout) {
    console.log(`Found ${proxyList.length} proxies with ${timeout}ms timeout to scrap bedetheque.com`);
  }

  static foundSeriesFromLetter(series, letter) {
    console.log(`Found ${series.length} series not scraped for letter ${letter}`);
  }

  static retryRequest(url) {
    console.log(`RETRY ${url}`);
  }

  static searchingSeriesFromLetter(letter) {
    console.log(`Searching all series beginning with the letter ${letter}\n\rIt can take some time...`);
  }

  static searchingFreeProxiesList(timeout) {
    console.log(`Searching Free Proxy List with ${timeout}ms timeout.`);
  }

  static serieAdded(seriesDone, nbrOfSeries, serie) {
    console.log(`${seriesDone}/${nbrOfSeries}: added ${serie.titre}, with ${Object.keys(serie.albums).length} albums`);
  }

  static serieFail(seriesDone, nbrOfSeries, url) {
    console.log(`${seriesDone}/${nbrOfSeries}: fail ${url}`);
  }
}
