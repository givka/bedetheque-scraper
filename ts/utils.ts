export class Utils {
  constructor() {}

  static setTimeoutPromise(ms:number) {
    return new Promise((resolve) => {
      setTimeout(() => { resolve(); }, ms);
    });
  }

  static getAlbumsFromSeries(series) {
    const localAlbums = {};
    console.time('convert series => albums');

    Object.keys(series).forEach((serieId) => {
      const serie = series[serieId];
      Object.keys(serie.albums).forEach((albumId) => {
        const album = serie.albums[albumId];
        localAlbums[albumId] = album;
      });
    });
    console.timeEnd('convert series => albums');
    return localAlbums;
  }
}
