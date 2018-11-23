import * as express from 'express';
import * as moment from 'moment';
import { Utils } from '../utils';
import { DataBase } from '../scraper/database';
import { Scrapper } from '../scraper/scrapper';

const app = express();
const PORT = process.env.PORT || 3000;
let scraper: Scrapper = null;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/serie/:id', async (req, res) => {
  const series = await DataBase.readDb('A');
  const serie = getSerie(series, req.params.id);
  res.json(serie);
});

app.get('/status', (req, res) => {
  if (!scraper) { res.send('Scraping Engine not Running'); return; }

  setInterval(() => {
    res.write(`<div>${scraper.getDuration()}
     - Letter ${scraper.currentLetter}
      - ${scraper.seriesDone}
       / ${scraper.nbrOfSeries}</div>`);
  }, 500);
});

app.get('/album/:id', async (req, res) => {
  console.time('convert series => albums');
  const series = await DataBase.readDb('A');
  const album = getAlbum(series, req.params.id);
  console.timeEnd('convert series => albums');
  res.json(album);
});

app.get('/scrap', (req, res) => {
  scraper = null;
  scraper = new Scrapper();
  res.send('Scraping Engine launched');
});

app.get('/', async (req, res) => {
  const series = await DataBase.readAllDb();
  res.json(series);
});

app.listen(PORT, () => { console.log('App listening on port 3000!'); });

function getSerie(series, id) {
  return series[id] || null;
}

function getAlbum(series, id) {
  const albums = Utils.getAlbumsFromSeries(series);
  return albums[id] || null;
}

