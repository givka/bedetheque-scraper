import * as express from 'express';

import { Utils } from '../utils';
import { DataBase } from '../scraper/database';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/serie/:id', async (req, res) => {
  const series = await DataBase.readDb();
  const serie = getSerie(series, req.params.id);
  res.json(serie);
});

app.get('/album/:id', async (req, res) => {
  const series = await DataBase.readDb();
  const album = getAlbum(series, req.params.id);
  res.json(album);
});

app.get('/', async (req, res) => {
  const series = await DataBase.readDb();
  res.json(series);
});

app.listen(3000, () => { console.log('Example app listening on port 3000!'); });

function getSerie(series, id) {
  return series[id] || null;
}

function getAlbum(series, id) {
  const albums = Utils.getAlbumsFromSeries(series);
  return albums[id] || null;
}

