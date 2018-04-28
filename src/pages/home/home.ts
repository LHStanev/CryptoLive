import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { AlertProvider } from '../../providers/alert/alert';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	public currencyInfoNew;
  public currencyInfoOld;
  public dailyInfo;
	public responseSuccess = false;
	public inputVal;
  public intervalIsOn = null;

  constructor(
  	public navCtrl: NavController,
  	public http: HttpProvider,
    public alert: AlertProvider) {

  }

  getData(input) {
    if(null != this.intervalIsOn) {
      clearInterval(this.intervalIsOn);
    }
    this.http.getCurrencyInfo(input).subscribe(
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
    let data =this.http.getCurrencyPrice(input)
          .subscribe(
            data => {
                if(this.currencyInfoNew) {
                this.currencyInfoOld = this.currencyInfoNew;
          }
          this.currencyInfoNew = data;
          this.responseSuccess = true;
      },
      () => console.log('error')
      );
  }
}
