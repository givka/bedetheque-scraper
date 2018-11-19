// const express = require('express');
// const Utils = require('./utils');

// const series = require('./database.json');

// const app = express();
// const albums = Utils.getAlbumsFromSeries(series);

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// app.get('/serie/:id', (req, res) => {
//   const serie = getSerie(req.params.id);
//   res.json(serie);
// });

// app.get('/album/:id', (req, res) => {
//   const album = getAlbum(req.params.id);
//   res.json(album);
// });

// app.get('/', (req, res) => {
//   res.json(series);
// });

// app.listen(3000, () => { console.log('Example app listening on port 3000!'); });

// function getSerie(id) {
//   return series[id] || {};
// }

// function getAlbum(id) {
//   return albums[id] || {};
// }

