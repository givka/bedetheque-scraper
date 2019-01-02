import { Album } from './album';

export class Serie {
  serieId: number;
  serieTitle: string;
  albumsId!: number[];
  voteAverage!: number;
  voteCount!: number;

  constructor($: CheerioAPI) {
    this.serieId = parseInt($('.idbel').text(), 10);
    this.serieTitle = $('h1 a').text();
  }

  public addAlbumsInfo(albums: Album[]) {
    this.albumsId = albums.map(album => album.albumId);
    [this.voteAverage, this.voteCount] = this.getVoteAverage(albums);
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
    return [voteAverage / voteCount, voteCount];
  }
}
