# bedetheque-scraper
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]
[![devDependency Status][david-dev-image]][david-dev-url]

NodeJS script to scrap the entire database of [bdgest.com](https://www.bdgest.com/) / [bedetheque.com](https://www.bedetheque.com/). (approx. 40.000+ series, 260.000+ albums)

<img src="https://www.bdgest.com/skin/logo_bdgest_250.png">

## How it works

It fetches a free proxy list with low timeout, then procede to scrape all comic series and albums letter by letter from bedetheque.com.
It will retry 5 times by serie until the serie and its albums are scraped.
## Installation

```bash
npm install bedetheque-scraper --save
```

## Basic Usage

```typescript
const { ProxyFetcher, Scraper } = require('bedetheque-scraper')
// or using CommonJS
// import { ProxyFetcher, Scraper } from 'bedetheque-scraper'

async function run() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0'.split('');
  for (const letter of letters) {
    const proxyList = await ProxyFetcher.getFreeProxyList();

    const [series, authors] = await Promise.all([
      Scraper.scrapeSeries(proxyList, letter),
      Scraper.scrapeAuthors(proxyList, letter),
    ]);

    console.log(`${letter} done with ${series.length} series and ${authors.length} authors`);
  }
}
```

## Structure
### Serie
```json
// 'https://www.bedetheque.com/serie-10739-BD-Roi-des-mouches.html'

{
  "serie": {
    "serieId": 10739,
    "serieTitle": "Le roi des mouches",
    "numberOfAlbums": 3,
    "albumsId": [ 42297, 77882, 178960 ],
    "recommendationsId": [ 3633, 51397, 326, 13687, 14319, 31517, 24640 ],
    "voteAverage": 87,
    "voteCount": 202,
    "serieCover": "Couv_42297.jpg"
  },
  "albums": [
    {
      "serieId": 10739,
      "serieTitle": "Le roi des mouches",
      "albumNumber": 1,
      "albumId": 42297,
      "albumTitle": "Hallorave",
      "imageCover": "Couv_42297.jpg",
      "imageExtract": "roidesmouches01p.jpg",
      "imageReverse": "Verso_42297.jpg",
      "voteAverage": 88,
      "voteCount": 65,
      "scenario": "Pirus, Michel",
      "drawing": "Mezzo",
      "colors": "Ruby",
      "date": "01/2005",
      "editor": "Albin Michel",
      "nbrOfPages": 62
    },
    {
      "serieId": 10739,
      "serieTitle": "Le roi des mouches",
      "albumNumber": 2,
      "albumId": 77882,
      "albumTitle": "L'origine du monde",
      "imageCover": "RoiDesMouchesLe2_18092008_213101.jpg",
      "imageExtract": "AlbroiDesMouchesLe2_18092008_213101.jpg",
      "imageReverse": "roidesmouches02v_77882.jpg",
      "voteAverage": 86,
      "voteCount": 100,
      "scenario": "Pirus, Michel",
      "drawing": "Mezzo",
      "colors": "Ruby",
      "date": "09/2008",
      "editor": "Glénat",
      "nbrOfPages": 62
    },
    {
      "serieId": 10739,
      "serieTitle": "Le roi des mouches",
      "albumNumber": 3,
      "albumId": 178960,
      "albumTitle": "Sourire suivant",
      "imageCover": "178960_c.jpg",
      "imageExtract": "178960_pla.jpg",
      "imageReverse": "Verso_178960.jpg",
      "voteAverage": 88,
      "voteCount": 37,
      "scenario": "Pirus, Michel",
      "drawing": "Mezzo",
      "colors": "Ruby",
      "date": "01/2013",
      "editor": "Glénat",
      "nbrOfPages": 62
    },
  ]
}
```
### Author
```json
// 'https://www.bedetheque.com/auteur-232-BD-Blain-Christophe.html'
{
  "id": 232,
  "name": "Blain, Christophe",
  "image": "https://www.bedetheque.com/media/Photos/Photo_232.jpg",
  "birthDate": "10/08/1970",
  "deathDate": null,
  "seriesIdScenario": [],
  "seriesIdDrawing": [ 55755, 3168, 2325, 1358, 10330, 1994 ],
  "seriesIdBoth": [ 27589, 38023, 14662, 517, 24260, 3898 ]
}
```

## Image Sizes

```typescript
// imageCoverLarge: https://www.bedetheque.com/media/Couvertures/${imageCover}
// imageCoverSmall: https://www.bedetheque.com/cache/thb_couv/${imageCover}
public imageCover: string | null;

// imageExtractLarge: https://www.bedetheque.com/media/Planches/${imageExtract}
// imageExtractSmall: https://www.bedetheque.com/cache/thb_planches/${imageExtract}
public imageExtract: string | null;

// imageReverseLarge: https://www.bedetheque.com/media/Versos/${imageReverse}
// imageReverseSmall: https://www.bedetheque.com/cache/thb_versos/${imageReverse}
public imageReverse: string | null;
```

## TODO

- [ ] scrap serie description
- [ ] scrap serie popularity

## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/bedetheque-scraper.svg
[npm-url]: https://npmjs.com/package/bedetheque-scraper
[david-dev-image]: https://david-dm.org/givka/bedetheque-scraper/dev-status.svg
[david-dev-url]: https://david-dm.org/givka/bedetheque-scraper?type=dev
[david-image]: https://david-dm.org/givka/bedetheque-scraper.svg
[david-url]: https://david-dm.org/givka/bedetheque-scraper
[downloads-image]: https://img.shields.io/npm/dm/bedetheque-scraper.svg
[downloads-url]: https://npmjs.org/package/bedetheque-scraper