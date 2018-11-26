import { Album } from './album';

export interface AlbumsType{
  [key: number]: Album;
}

export class Serie {
  serieId: number;

  serieTitle: string;

  albums: AlbumsType;

  constructor($: CheerioAPI) {
    this.serieId = parseInt($('.idbel').text(), 10);
    this.serieTitle = $('h1 a').text();
    this.albums = this.getAlbums($);
  }

  private getAlbums($: CheerioAPI) {
    const albums: AlbumsType = {};
    $('.liste-albums > li')
      .each((index, elem) => {
        const album = new Album($(elem), $, this.serieId);
        albums[album.albumId] = album;
      });
    return albums;
  }
}
