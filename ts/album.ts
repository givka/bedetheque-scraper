export class Album {
  public id: number;

  public titre: string;

  public scenario: string;

  public dessin: string;

  public couleurs: string;

  public date: string;

  public editeur: string;

  public pages: string;

  public cover: string;

  public extrait: string;

  public verso: string;

  public voteAverage : number;

  public voteCount : number;

  constructor(page : Cheerio, $: CheerioAPI) {
    this.id = parseInt(page.children().first().attr('name'), 10);
    this.titre = page.find('.album-main .titre').attr('title');
    this.cover = this.findCover(page);
    this.extrait = this.findExtrait(page);
    this.verso = this.findVerso(page);
    this.voteAverage = this.findVoteAverage(page, $);
    this.voteCount = this.findVoteCount(page, $);

    this.addDetails(page, $);
  }

  private findVoteAverage(page : Cheerio, $: CheerioAPI) {
    const voteAverage = page.find('.ratingblock  strong').text();
    return voteAverage ? parseFloat(voteAverage) : null;
  }

  private findVoteCount(page : Cheerio, $: CheerioAPI) {
    if (this.voteAverage === null) { return null; }
    const voteCount = page.find('.ratingblock p').text();
    return voteCount ? parseInt(voteCount.match(/\(([0-9]+) vote/)[1], 10) : null;
  }

  private addDetails(page, $) {
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

    switch (key) {
      case 'scénario':
        this.scenario = value;
        break;
      case 'dessin':
        this.dessin = value;
        break;
      case 'couleurs':
        this.couleurs = value;
        break;
      case 'dépot légal':
        this.date = value.slice(0, 7);
        break;
      case 'editeur':
        this.editeur = value;
        break;
      case 'planches':
        this.pages = value;
        break;
      default:
        break;
    }
  }

  private findCover(page) {
    const cover = page.find('.sous-couv .browse-couvertures').attr('href');
    return cover ? cover.replace('https://www.bedetheque.com/cache/thb_couv/', '')
      .replace('https://www.bedetheque.com/media/Couvertures/', '')
      : null;
  }

  private findExtrait(page) {
    const extrait = page.find('.sous-couv .browse-planches').attr('href');
    return extrait ? extrait.replace('https://www.bedetheque.com/media/Planches/', '')
      : null;
  }

  private findVerso(page) {
    const verso = page.find('.sous-couv .browse-versos').attr('href');
    return verso ? verso.replace('https://www.bedetheque.com/media/Versos/', '')
      : null;
  }
}

