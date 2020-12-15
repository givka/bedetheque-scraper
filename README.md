# bedetheque-scraper
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]
[![devDependency Status][david-dev-image]][david-dev-url]

NodeJS script to scrap the entire database of [bdgest.com](https://www.bdgest.com/) / [bedetheque.com](https://www.bedetheque.com/). (approx. 40.000+ series, 260.000+ albums)

<img src="https://www.bdgest.com/skin/logo_bdgest_250.png">

## Installation

```bash
npm install bedetheque-scraper --save
```

## Basic Usage

```javascript
const { Scraper } = require('bedetheque-scraper');
// or using CommonJS
// import { Scraper } from 'bedetheque-scraper'

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
```
## API
### SeriesUrlFromLetter
```ts
Scraper.getSeriesUrlFromLetter(letter: string, proxy?: Proxy): Promise<string[]>;
```
#### Example
`letter = A`

Response body:
```json
[
  "https://www.bedetheque.com/serie-17120-BD-A-18-ans-sous-les-balles-au-Vercors.html",
  "https://www.bedetheque.com/serie-15457-BD-A-B.html",
  "..."
]
```
### AuthorsUrlFromLetter
```ts
Scraper.getAuthorsUrlFromLetter(letter: string, proxy?: Proxy): Promise<string[]>;
```
#### Example
`letter = A`

Response body:
```json
[
  "https://www.bedetheque.com/auteur-13335-BD-A-Ming.html",
  "https://www.bedetheque.com/auteur-13336-BD-A-Ying.html",
  "..."
]
```
### Serie
```ts
Scraper.getSerie(url: string, proxy?: Proxy): Promise<{serie, albums}>;
```
#### Example
`url = https://www.bedetheque.com/serie-10739-BD-Roi-des-mouches.html`

Response body
```json
{
  "serie": {
    "serieId": 10739,
    "serieTitle": "Le roi des mouches",
    "numberOfAlbums": 3,
    "albumsId": [ 42297, 77882, 178960 ],
    "recommendationsId": [ 3633, 51397, 326, 13687, 14319, 31517, 24640 ],
    "voteAverage": 87,
    "voteCount": 202,
    "serieCover": "Couv_42297.jpg",
    "serieCoverWidth": 650,
    "serieCoverHeight": 863,
    "dateBegin": 1104534000,
    "dateEnd": 1356994800 
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
      "date": 1104534000,
      "editor": "Albin Michel",
      "nbrOfPages": 62,
      "estimationEuros" : [20, 25],
      "imageCoverWidth": 650,
      "imageCoverHeight": 863
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
      "date": 1220220000,
      "editor": "Glénat",
      "nbrOfPages": 62,
      "estimationEuros" : null,
      "imageCoverWidth": 400,
      "imageCoverHeight": 533 
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
      "date": 1356994800,
      "editor": "Glénat",
      "estimationEuros" : null,
      "nbrOfPages": 62,
      "imageCoverWidth": 500,
      "imageCoverHeight": 666
    }
  ]
}
```
### Author
```ts
Scraper.getAuthor(url: string, proxy?: Proxy): Promise<Author>;
```
#### Example
`url = https://www.bedetheque.com/auteur-232-BD-Blain-Christophe.html`

Response body:
```json
{
  "authorId": 232,
  "name": "Blain, Christophe",
  "image": "Photo_232.jpg",
  "birthDate": "10/08/1970",
  "deathDate": null,
  "seriesIdScenario": [],
  "seriesIdDrawing": [ 55755, 3168, 2325, 1358, 10330, 1994 ],
  "seriesIdBoth": [ 27589, 38023, 14662, 517, 24260, 3898 ]
}
```

## Image Sizes
### Serie
```typescript
// serieCoverLarge: https://www.bedetheque.com/media/Couvertures/${serieCover}
// serieCoverSmall: https://www.bedetheque.com/cache/thb_couv/${serieCover}
public serieCover: string | null;
```
### Album
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
### Author
```typescript
// imageLarge: https://www.bedetheque.com/media/Photos/${image}
public image: string | null;
```
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
