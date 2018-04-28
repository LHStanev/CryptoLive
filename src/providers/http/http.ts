import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpProvider {

  constructor(public http: HttpClient) {
  }

  getFavourites(from, to):Observable<any> {
  	return this.http.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + from + '&tsyms=' + to);
  }

  getCurrencyInfo(currency: string):Observable<any> {
  	currency = currency.toUpperCase();
  	return this.http.get('https://min-api.cryptocompare.com/data/histoday?fsym='+currency+'&tsym=USD&limit=1&aggregate=1');
  }
  getCurrencyPrice(currency: string) {
    currency = currency.toUpperCase();
    return this.http.get('https://min-api.cryptocompare.com/data/price?fsym='+currency+'&tsyms=USD')
  }
}
