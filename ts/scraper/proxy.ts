import * as fs from 'fs';
import * as rp from 'request-promise';
import * as cheerio from 'cheerio';
import * as _ from 'lodash';
import { Utils } from '../utils';
import { Message } from './message';

const transform = function (body) {
  return cheerio.load(body);
};

export class Proxy {
  proxyList : { url: string,
                port: string }[];

  constructor() {
  }

  async getFreeProxyList(timeout : number) {
    Message.searchingFreeProxiesList(timeout);
    this.proxyList = await rp.get(`https://proxyscrape.com/proxies/HTTP_${timeout}ms_Timeout_Proxies.txt`)
      .then(response => response.trim().split('\r\n')
        .map(p => ({ url: p.split(':')[0], port: p.split(':')[1] })));

    Message.foundFreeProxiesList(this.proxyList, timeout);
  }

  private getRandomProxy() {
    const indexProxy = _.random(this.proxyList.length - 1);
    return this.proxyList[indexProxy];
  }

  async requestProxy(url) {
    const proxy = this.getRandomProxy();
    const proxiedRequest = rp.defaults({ proxy: `http://${proxy.url}:${proxy.port}` });
    url = encodeURI(url);
    try {
      const request = await proxiedRequest({ url, transform });
      return request;
    } catch (error) {
      Message.retryRequest(url);
      await Utils.setTimeoutPromise(_.random(2000, 5000));
      return this.requestProxy(url);
    }
  }
}
