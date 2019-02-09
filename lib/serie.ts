import { Album } from './album';

export class Serie {
  serieId: number;
  serieTitle: string;
  numberOfAlbums : number;
  serieCover! : string | null;
  albumsId!: number[];
  voteAverage!: number;
  voteCount!: number;

  constructor($: CheerioAPI) {
    this.serieId = parseInt($('.idbel').text(), 10);
    this.serieTitle = $('h1 a').text();

    const match = $('.serie-info').text().match(/Tomes? :([0-9]+)/);
    this.numberOfAlbums = parseInt(match && match[1] || '0', 10);
  }

  public addAlbumsInfo(albums: Album[]) {
    this.albumsId = albums.map(album => album.albumId);
    [this.voteAverage, this.voteCount] = this.getVoteAverage(albums);
    this.serieCover = albums[0] && albums[0].imageCover;
  }

  private getVoteAverage(albums: Album[]) {
    let voteAverage = 0;
    let voteCount = 0;
    albums.forEach((album) => {
      voteAverage += album.voteAverage * album.voteCount;
      voteCount += album.voteCount;
    });
    if (voteCount === 0) {
      return [0, 0];
    }
    return [Math.floor(voteAverage / voteCount * 10) / 10, voteCount];
  }
}
