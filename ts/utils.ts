export class Utils {
  constructor() {}

  static setTimeoutPromise(ms:number) {
    return new Promise((resolve) => {
      setTimeout(() => { resolve(); }, ms);
    });
  }

  static getAlbumsFromSeries(series) {
    const localAlbums = {};
    Object.keys(series).forEach((serieId) => {
      const serie = series[serieId];
      Object.keys(serie.albums).forEach((albumId) => {
        const album = serie.albums[albumId];
        localAlbums[albumId] = album;
      });
    });
    return localAlbums;
  }
}
