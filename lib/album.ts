import { Serie } from './serie';

const moment = require('moment');

export class Album {
  public serieId: number;
  public albumId: number;
  public albumNumber: number;
  public serieTitle: string;
  public serieUrl: string;
  public albumTitle: string;
  public albumUrl: string;
  public scenario: string;
  public drawing: string;
  public colors: string;
  public date: number;
  public editor: string;
  public estimationEuros: number[]
  public nbrOfPages: number;
  public imageCover: { small: string, large: string };
  public imageExtract: { small: string, large: string };
  public imageReverse: { small: string, large: string };
  public voteAverage: number; // voteAverage /100
  public voteCount: number;

  constructor(page: Cheerio, $: CheerioStatic, serie: Serie) {
    this.serieId = serie.serieId;
    this.serieTitle = serie.serieTitle;
    this.serieUrl = serie.serieUrl;
    this.albumNumber = Album.findAlbumNumber(page);
    this.albumId = parseInt(page.children().first().attr('name'), 10);
    this.albumTitle = page.find('.album-main .titre').attr('title');
    this.albumUrl = page.find('.album-main a').attr('href')
    this.imageCover = Album.findImage(page, 'browse-couvertures', 'Couvertures');
    this.imageExtract = Album.findImage(page, 'browse-planches', 'Planches');
    this.imageReverse = Album.findImage(page, 'browse-versos', 'Versos');
    this.voteAverage = Album.findVoteAverage(page, $);
    this.voteCount = this.findVoteCount(page, $);
    this.addDetails(page, $);
  }

  private static findAlbumNumber(page: Cheerio) {
    const match = page.find('.album-main .titre > span').text().match(/([0-9]+)/);
    return parseInt(match && match[1] || '1', 10);
  }

  private static findVoteAverage(page: Cheerio, $: CheerioStatic) {
    const voteAverage = page.find('.ratingblock  strong').text();
    return voteAverage ? 20 * parseFloat(voteAverage) : 0;
  }

  private findVoteCount(page: Cheerio, $: CheerioStatic) {
    if (this.voteAverage === null) {
      return 0;
    }
    const voteCount = page.find('.ratingblock p').text();
    if (!voteCount) {
      return 0;
    }
    return parseInt(voteCount.match(/\(([0-9]+) vote/)![1], 10);
  }

  private static findImage(page: Cheerio, className: string, path: string) {
    const elem = page.find(`.sous-couv .${className}`);
    const large = elem.attr('href')
    const small = elem.find('img').attr('src')
    return { small: small ? small : null, large: large ? large : null }
  }

  private addDetails(page: Cheerio, $: CheerioStatic) {
    page.find('.infos > li')
      .each((index, info) => {
        const pageInfo = $(info);
        this.addDetail(pageInfo);
      });
  }

  private addDetail(pageInfo: Cheerio) {
    const key = pageInfo.find('label').text().trim()
      .toLowerCase()
      .replace(' :', '');

    const value = pageInfo.text().split(':')[1]
      ? pageInfo.text().split(':')[1].trim()
      : null;

    if (!value) {
      return;
    }

    switch (key) {
      case 'scénario':
        this.scenario = value;
        break;
      case 'dessin':
        this.drawing = value;
        break;
      case 'couleurs':
        this.colors = value;
        break;
      case 'dépot légal':
        const date = value.slice(0, 7);
        this.date = moment(date, 'MM/YYYY').unix();
        break;
      case 'editeur':
        this.editor = value;
        break;
      case 'planches':
        this.nbrOfPages = parseInt(value, 10);
        break;
      case 'estimation':
        let arr = value.match(/(\d+) à (\d+)/);
        if (arr) {
          this.estimationEuros = [parseInt(arr[1]), parseInt(arr[2])];
        } else {
          arr = value.match(/Moins de (\d+)/)
          this.estimationEuros = arr ? [parseInt(arr[1])] : [];
        }
      default:
        break;
    }
  }

  static formatAlbumsFromSerie($: CheerioStatic, serie: Serie) {
    return $('.liste-albums > li')
      .filter((index, elem) => $(elem).find('.numa').text() === '')
      .map((index, elem) => new Album($(elem), $, serie))
      .get() as unknown as Album[];
  }
}
