# bedetheque-scraper
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

NodeJS script to scrap the entire database of [bdgest.com](https://www.bdgest.com/) / [bedetheque.com](https://www.bedetheque.com/). (approx. 50.000+ series, 300.000+ albums, 30.000+ authors)

<img src="https://www.bdgest.com/skin/logo_bdgest_250.png">

## Installation

```bash
npm install bedetheque-scraper --save
```

## Basic Usage

```javascript
const { Scraper } = require('bedetheque-scraper');
// import { Scraper } from 'bedetheque-scraper' // using CommonJS

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0'.split('');

async function run() {
  for (const letter of letters) {
    const serieUrls = await Scraper.getSeriesUrlFromLetter(letter);
    for(const serieUrl of serieUrls) {
      const {serie, albums} = await Scraper.getSerie(serieUrl);
      console.log(serie.serieTitle);
    }      
    
    const authorUrls = await Scraper.getAuthorsUrlFromLetter(letter);
    for(const authorUrl of authorUrls) {
      const author = await Scraper.getAuthor(authorUrl);
      console.log(author.name);
    }      
  }
}

run();
```
## API

### Interfaces
```ts
Serie 
{
  serieId: number;
  serieTitle: string;
  serieUrl: string;
  numberOfAlbums: number;
  serieCover: { small: string, large: string };
  albumsId: number[];
  voteAverage: number;
  voteCount: number;
  recommendationsId: number[];
  dateBegin: number;
  dateEnd: number;
}
```
```ts
Album
{
  serieId: number;
  albumId: number;
  albumNumber: number;
  serieTitle: string;
  serieUrl: string;
  albumTitle: string;
  albumUrl: string;
  scenario: string;
  drawing: string;
  colors: string;
  date: number;
  editor: string;
  estimationEuros: number[]
  nbrOfPages: number;
  imageCover: { small: string, large: string };
  imageExtract: { small: string, large: string };
  imageReverse: { small: string, large: string };
  voteAverage: number; // %
  voteCount: number;
}
```
```ts
Author
{
  authorId: number;
  image: string;
  name: string;
  birthDate: string;
  deathDate: string;
  seriesIdScenario: number[];
  seriesIdDrawing: number[];
  seriesIdBoth: number[];
}
```
```ts
Proxy
{
  host: string;
  port: number;
}
```
## Endpoints
- ```ts 
  Scraper.getSeriesUrlFromLetter(letter: string, proxy?: Proxy): Promise<string[]>;
  ```
  > `const serieUrls = await Scraper.getSeriesUrlFromLetter('A');`

- ```ts
  Scraper.getAuthorsUrlFromLetter(letter: string, proxy?: Proxy): Promise<string[]>;
  ```
  > `const authorUrls = await Scraper.getAuthorsUrlFromLetter('A');`

- ```ts
  Scraper.getSerie(url: string, proxy?: Proxy): Promise<{serie: Serie, albums: Album[]>;
  ```
  > `const {serie, albums} = await Scraper.getSerie('https://www.bedetheque.com/serie-10739-BD-Roi-des-mouches.html')`

- ```ts
  Scraper.getAuthor(url: string, proxy?: Proxy): Promise<Author>;
  ```
  > `const author = await Scraper.getAuthor('https://www.bedetheque.com/auteur-232-BD-Blain-Christophe.html')`

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/bedetheque-scraper.svg
[npm-url]: https://npmjs.com/package/bedetheque-scraper
[downloads-image]: https://img.shields.io/npm/dm/bedetheque-scraper.svg
[downloads-url]: https://npmjs.org/package/bedetheque-scraper
