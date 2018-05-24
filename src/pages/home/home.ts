import {Component, Input} from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { AlertProvider } from '../../providers/alert/alert';

import { listCurrencies } from "../../data/listCurrencies";



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    @Input() textInput: string;
	currencyInfoNew;
    currencyInfoOld;
    dailyInfo;
	responseSuccess = false;
	inputVal;
    intervalIsOn = null;
    showList: boolean;
    showCard: boolean;
    list: [];
    data: any;  //Information about the currency sought after

  constructor(
  	public navCtrl: NavController,
  	public http: HttpProvider,
    public alert: AlertProvider) { }

    // Lifecycle events

    ionViewDidLeave() {
      this.data.unsubscribe();
      clearInterval(this.intervalIsOn);
      this.showCard = false;
      this.textInput = '';
    }


  getData(input) {
    if(null != this.intervalIsOn) {
      clearInterval(this.intervalIsOn);
    }
    this.data = this.http.getCurrencyInfo(input).subscribe(
  		next => {
        this.inputVal = input;
  			if(next.Response === 'Error') {
          this.responseSuccess = false;
  				this.alert.presentAlert('Error', 'Could not find "' + input + '", please try again.');
  			} else {
          this.dailyInfo = next;
          this.getCurrentPrice(input);
          this.intervalIsOn = setInterval( () => {
            this.getCurrentPrice(input);
          }, 5000); 
  			}
  		},
  		err => {
  			console.log(err);
  		}
  		);
  }

  getCurrentPrice(input) {
    this.http.getCurrencyPrice(input)
          .subscribe(
            data => {
                console.log(data);
                if(this.currencyInfoNew) {
                this.currencyInfoOld = this.currencyInfoNew;
          }
          this.currencyInfoNew = data;
          this.responseSuccess = true;
      },
      () => console.log('error')
      );
  }

  getItems (e) {
      this.showCard = false;
      this.list = listCurrencies;
      let input = e.target.value;

      if( input && input !== '') {
          this.list = this.list.filter( (item) => {
              return (item[0].toLowerCase().indexOf(input.toLowerCase()) !== -1 ||
                  item[1].toLowerCase().indexOf(input.toLowerCase()) !== -1 );
          });
          this.showList = true;
      } else {
          this.showList = false;
      }
  }

  copyValue(currency) {
     this.showList = false;
     this.getData(currency);
     this.showCard = true;
  }
}
