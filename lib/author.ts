import { Utils } from './utils';

// image: https://www.bedetheque.com/media/Photos/${image}
export class Author{
  id: number | null;
  image: string | null;
  name: string;
  birthDate: string | null;
  deathDate: string | null;
  seriesIdScenario: number[];
  seriesIdDrawing: number[];
  seriesIdBoth: number[];

  constructor($: CheerioAPI) {
    const info = $('.auteur-info').text();

    let match = info.match(/Identifiant :([0-9]+)/);
    this.id = match ? parseInt(match[1], 10) : null;

    this.name = $('.auteur-nom').text();
    this.image = this.getImage($);

    match = info.match(/Naissance :le ([0-9]+\/[0-9]+\/[0-9]+)/);
    this.birthDate = match ? match[1] : null;

    match = info.match(/Décès :le ([0-9]+\/[0-9]+\/[0-9]+)/);
    this.deathDate = match ? match[1] : null;

    const series = $('table')
    .filter((i, e) => $(e).find('thead #tri0').text() === 'Séries principales')
    .find('tbody tr')
    .filter((i, e) => $(e).find('img').attr('src') ===
    'https://www.bdgest.com/skin/flags/France.png');

    this.seriesIdBoth = this.getSeriesId($, series, true, true);
    this.seriesIdScenario = this.getSeriesId($, series, true, false);
    this.seriesIdDrawing = this.getSeriesId($, series, false, true);

    console.log(this);

  }

  private getSeriesId($:CheerioAPI, series: Cheerio, isScen: boolean, isDraw: boolean) {
    return series.filter((i, e) => {
      const icons =  $(e).find('.parution i');
      const scen = isScen ? icons.hasClass('icon-scen') : !icons.hasClass('icon-scen');
      const draw = isDraw ? icons.hasClass('icon-dess') : !icons.hasClass('icon-dess');
      return scen && draw;
    })
    .map((i, e) => $(e).find('.serie a').attr('href'))
    .get()
    .map(url => Utils.urlToSerieID(url));
  }

  private getImage($: CheerioAPI) {
    const image = $('.auteur-image img').attr('src');
    return image !== 'https://www.bdgest.com/skin/nophoto.png'
    ? image.replace('https://www.bedetheque.com/media/Photos/', '')
    : null;
  }
}
