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

  private static _goodProxies: ProxyType[] = [];

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
      .then((result: any) => {
        if (!this._goodProxies.includes(proxy)) this._addGoodProxy(proxy);
        return cheerio.load(result.data);
      })
      .catch((error) => {
        if (this._availableProxies.includes(proxy)) this._removeProxy(proxy);
        throw new Error(error);
      });
  }

  private static _addGoodProxy(proxy: ProxyType) {
    // check if it has already been removed.
    if (!this._availableProxies.includes(proxy)) return;

    this._goodProxies.push(proxy);
    console.log(`+ proxy:   ${this._goodProxies.length}/${this._availableProxies.length} healthy`);
  }

  private static _removeProxy(proxy: ProxyType) {
    // check if it was a good proxy.
    if (this._goodProxies.includes(proxy))
      this._goodProxies.splice(this._goodProxies.indexOf(proxy), 1);

    this._availableProxies.splice(this._availableProxies.indexOf(proxy), 1);
    console.log(`- proxy:   ${this._goodProxies.length}/${this._availableProxies.length} healthy`);
  }

  private static _pickProxy() {
    const list = this._goodProxies.length != 0 ? this._goodProxies : this._availableProxies;
    const indexProxy = lodash.random(list.length - 1);
    return list[indexProxy];
  }

}
