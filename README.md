# bedetheque-scraper
<img src="https://www.bdgest.com/skin/logo_bdgest_250.png">

## Description

NodeJS script to scrap the entire database of dbgest.com / bedetheque.com (approx. 260.000+ albums)

## How it works

It fetches a free proxy list with low timeout, then procede to scrape all comic series letter by letter from bedetheque.com.
The DataBase will be written in the folder database/series.json
It will retry 5 times by serie until the serie is scraped. You can rerun this script after completion to scrape series that were not scraped.
## Installation

```bash
npm install bedetheque-scraper --save
```

## Basic Usage

```typescript
const { Scraper } = require('bedetheque-scraper');
// or using CommonJS
import { Scraper } from 'bedetheque-scraper';

const scraper = new Scraper();
```

## DataBase Structure
```json
{
  "10739": {
    "serieId": 10739,
    "serieTitle": "Le roi des mouches",
    "albums": {
      "42297": {
        "serieId": 10739,
        "albumId": 42297,
        "albumTitle": "Hallorave",
        "imageCover": "Couv_42297.jpg",
        "imageExtract": "roidesmouches01p.jpg",
        "imageReverse": "Verso_42297.jpg",
        "voteAverage": 4.4,
        "voteCount": 65,
        "scenario": "Pirus, Michel",
        "drawing": "Mezzo",
        "colors": "Ruby",
        "date": "01/2005",
        "editor": "Albin Michel",
        "nbrOfPages": 62
      }, 
      ...
    }
  },
  "3": {  
    "serieId": 3,
    "serieTitle": "De Cape et de Crocs",
    "albums": { ... }
  },
  ...
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

- [ ] scrap album number
- [ ] scrap serie description
- [ ] scrap serie recommendations
- [ ] scrap serie popularity
- [ ] use async fs read / write with lock for no conflict
