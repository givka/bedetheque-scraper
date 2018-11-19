import * as fs from 'fs';
import * as rp from 'request-promise';
import * as cheerio from 'cheerio';
import * as _ from 'lodash';
import { Utils } from './utils';

const transform = function (body) {
  return cheerio.load(body);
};

export class Proxy {
  proxyList : { url: string,
                port: string }[];

  constructor() {
    this.proxyList = fs
      .readFileSync('proxies.txt', 'utf8')
      .split('\r\n')
      .map(p => ({ url: p.split(':')[0], port: p.split(':')[1] }));
  }

  private getRandomProxy() {
    const indexProxy = _.random(this.proxyList.length - 1);
    return this.proxyList[indexProxy];
  }

  async requestProxy(url) {
    const proxy = this.getRandomProxy();
    const proxiedRequest = rp.defaults({ proxy: `http://${proxy.url}:${proxy.port}` });
    console.log(`FETCH ${url}`);

    try {
      const request = await proxiedRequest({ url, transform });
      console.log(`DONE ${url}`);
      return request;
    } catch (error) {
      console.log(`EROOR ${url}`);
      await Utils.setTimeoutPromise(_.random(2000, 5000));
      return this.requestProxy(url);
    }
  }
}
