# bedetheque-scraper
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

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
Scraper.getSerie(url: string, proxy?: Proxy): Promise<{serie: Serie, albums: Album[]>;
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
        "recommendationsId": [ 3633, 51397, 326, 13687, 14319, 31517, 24640 ],
        "albumsId": [ 42297, 77882, 178960 ],
        "voteAverage": 87.4,
        "voteCount": 219,
        "serieCover": {
            "small": "https://www.bedetheque.com/cache/thb_couv/Couv_42297.jpg",
            "large": "https://www.bedetheque.com/media/Couvertures/Couv_42297.jpg"
        },
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
            "imageCover": {
                "small": "https://www.bedetheque.com/cache/thb_couv/Couv_42297.jpg",
                "large": "https://www.bedetheque.com/media/Couvertures/Couv_42297.jpg"
            },
            "imageExtract": {
                "small": "https://www.bedetheque.com/cache/thb_planches/roidesmouches01p.jpg",
                "large": "https://www.bedetheque.com/media/Planches/roidesmouches01p.jpg"
            },
            "imageReverse": {
                "small": "https://www.bedetheque.com/cache/thb_versos/Verso_42297.jpg",
                "large": "https://www.bedetheque.com/media/Versos/Verso_42297.jpg"
            },
            "voteAverage": 88,
            "voteCount": 72,
            "scenario": "Pirus, Michel",
            "drawing": "Mezzo",
            "colors": "Ruby",
            "date": 1104534000,
            "estimationEuros": [ 20, 25 ],
            "editor": "Albin Michel",
            "nbrOfPages": 62
        },
        {
            "serieId": 10739,
            "serieTitle": "Le roi des mouches",
            "albumNumber": 2,
            "albumId": 77882,
            "albumTitle": "L'origine du monde",
            "imageCover": {
                "small": "https://www.bedetheque.com/cache/thb_couv/RoiDesMouchesLe2_18092008_213101.jpg",
                "large": "https://www.bedetheque.com/media/Couvertures/RoiDesMouchesLe2_18092008_213101.jpg"
            },
            "imageExtract": {
                "small": "https://www.bedetheque.com/cache/thb_planches/AlbroiDesMouchesLe2_18092008_213101.jpg",
                "large": "https://www.bedetheque.com/media/Planches/AlbroiDesMouchesLe2_18092008_213101.jpg"
            },
            "imageReverse": {
                "small": "https://www.bedetheque.com/cache/thb_versos/roidesmouches02v_77882.jpg",
                "large": "https://www.bedetheque.com/media/Versos/roidesmouches02v_77882.jpg"
            },
            "voteAverage": 86,
            "voteCount": 105,
            "scenario": "Pirus, Michel",
            "drawing": "Mezzo",
            "colors": "Ruby",
            "date": 1220220000,
            "estimationEuros": null,
            "editor": "Glénat",
            "nbrOfPages": 62
        },
        {
            "serieId": 10739,
            "serieTitle": "Le roi des mouches",
            "albumNumber": 3,
            "albumId": 178960,
            "albumTitle": "Sourire suivant",
            "imageCover": {
                "small": "https://www.bedetheque.com/cache/thb_couv/178960_c.jpg",
                "large": "https://www.bedetheque.com/media/Couvertures/178960_c.jpg"
            },
            "imageExtract": {
                "small": "https://www.bedetheque.com/cache/thb_planches/178960_pla.jpg",
                "large": "https://www.bedetheque.com/media/Planches/178960_pla.jpg"
            },
            "imageReverse": {
                "small": "https://www.bedetheque.com/cache/thb_versos/Verso_178960.jpg",
                "large": "https://www.bedetheque.com/media/Versos/Verso_178960.jpg"
            },
            "voteAverage": 90,
            "voteCount": 42,
            "scenario": "Pirus, Michel",
            "drawing": "Mezzo",
            "colors": "Ruby",
            "date": 1356994800,
            "estimationEuros": null,
            "editor": "Glénat",
            "nbrOfPages": 62
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
    "image": "https://www.bedetheque.com/media/Photos/Photo_232.jpg",
    "birthDate": "10/08/1970",
    "deathDate": null,
    "seriesIdBoth": [ 67863, 27589, 38023, 14662, 517, 24260, 3898 ],
    "seriesIdScenario": [],
    "seriesIdDrawing": [ 55755, 3168, 3125, 2325, 1358, 10330, 1994 ]
}
```
## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/bedetheque-scraper.svg
[npm-url]: https://npmjs.com/package/bedetheque-scraper
[downloads-image]: https://img.shields.io/npm/dm/bedetheque-scraper.svg
[downloads-url]: https://npmjs.org/package/bedetheque-scraper
