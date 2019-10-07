import * as cheerio from 'cheerio';
import lodash from 'lodash';
import axiosHttpsProxyFix from 'axios-https-proxy-fix';
import {Utils} from './utils';

export interface ProxyType {
  host: string;
  port: number;
}

export class ProxyFetcher {

  private static _availableProxies: ProxyType[] = [];

  static async updateProxyList(timeout: 5000 | 10000 = 5000) {
    console.log(`🔍  searching for free proxies`);

    this._availableProxies = await axiosHttpsProxyFix
      .get(`https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=${timeout}`)
      .then(response => response.data.trim().split('\r\n')
        .map((p: string) => ({host: p.split(':')[0], port: parseInt(p.split(':')[1], 10)})));

    console.log(`→ found ${this._availableProxies.length} free proxies`);
  }

  static async requestProxy(urlRaw: string, timeout: number) {
    const url = encodeURI(urlRaw);
    const proxy = this._pickProxy();

    return Utils.promiseWithTimeout(axiosHttpsProxyFix.get(url, {proxy}), timeout)
      .then((result: any) => cheerio.load(result.data))
      .catch((error) => {
        if (this._availableProxies.includes(proxy)){
          this._availableProxies.splice(this._availableProxies.indexOf(proxy), 1);
          console.log(`- proxies: ${this._availableProxies.length}`);
        }
        throw new Error(error);
      });
  }

  private static _pickProxy() {
    const indexProxy = lodash.random(this._availableProxies.length - 1);
    return this._availableProxies[indexProxy];
  }

}
