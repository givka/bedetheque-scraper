import {Album} from './album';
import {Utils} from './utils';

export class Serie {
  serieId: number;
  serieTitle: string;
  numberOfAlbums: number;
  serieCover!: string | null;
  albumsId!: number[];
  voteAverage!: number;
  voteCount!: number;
  recommendationsId: number[];
  dateBegin: number;
  dateEnd: number;

  constructor($: CheerioStatic) {
    this.serieId = parseInt($('.idbel').text(), 10);
    this.serieTitle = $('h1 a').text();

    const match = $('.serie-info').text().match(/Tomes? :([0-9]+)/);
    this.numberOfAlbums = match ? parseInt(match[1], 10) : 0;
    this.recommendationsId = this.getRecommendationsId($);
  }

  public async addAlbumsInfo(albums: Album[]) {
    this.albumsId = albums.map(album => album.albumId);
    [this.voteAverage, this.voteCount] = this.getVoteAverage(albums);

    if (albums.length == 0) return;

    this.serieCover = albums[0].imageCover;
    this.dateBegin = albums[0].date;
    this.dateEnd = albums[albums.length - 1].date;
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

  private getRecommendationsId($: CheerioStatic) {
    return $('.alire li a')
      .map((i, elem) => $(elem).attr('href'))
      .get()
      .map(url => Utils.urlToSerieID(url));
  }
}
