import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { Storage } from '@ionic/storage';
import { AlertProvider } from '../../providers/alert/alert';

@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html'
})
export class FavouritesPage{

  public favCurrenciesNew = [];
  public favCurrenciesOld;
  public arrPairs = [];
  public outputData = [];
  public data: any;
  public interval: any;

  constructor(
  	public navCtrl: NavController,
  	public http: HttpProvider,
  	private storage: Storage,
    public alert: AlertProvider) {
  }

  //Lifecycle events

    ionViewWillEnter () {

  	this.storage.get('favourites').then(
  		(favs) => {
        if(null !== favs) {
          let arrCurrencies = favs.split(',');
          let listLeft = ''; //list of currencies converting from
          let listRight = ''; //list of currencies converting to

          for ( let pairNumber = 0; pairNumber < arrCurrencies.length; pairNumber++) {
            let arr = arrCurrencies[pairNumber].split('/');
            this.arrPairs[pairNumber] = [];
            this.arrPairs[pairNumber].push(arr[0]);
            this.arrPairs[pairNumber].push(arr[1]);

            if(listLeft.indexOf(arr[0]) == -1) {
              listLeft = listLeft + ',' + arr[0];
            }
            if(listRight.indexOf(arr[1]) == -1) {
              listRight = listRight + ',' + arr[1];
            }
        }
        listLeft = listLeft.substr(1);
        listRight = listRight.substr(1);
        this.getData(listLeft, listRight);
        this.interval = setInterval( () => { this.getData( listLeft,listRight) }, 5000);
        } else {
            this.alert.presentAlert('Oops', 'You have no favourites yet. Go to settings and add some.');
        }

    },
    () => this.alert.presentAlert('Oops', 'Cannot access phone memory, please try again later') );
  }

    ionViewDidLeave() {
      if ( undefined !== this.data) {
          this.data.unsubscribe();
      }
      clearInterval(this.interval);
      console.log('Unsubscribed');
  }



  // Get data from API
  getData(from, to) {	
  	this.data = this.http.getFavourites(from, to).subscribe(
  		next => {
            console.log(next);
            if(this.favCurrenciesNew.length !== 0) {
  				this.favCurrenciesOld = this.favCurrenciesNew;
  				this.favCurrenciesNew = [];
  			}
  			// Iterate through the array with pairs and assign a value to each one
  			for( let pair of this.arrPairs ) {
                if(next[pair[0]] && next[pair[0]][pair[1]] ) {
                    this.favCurrenciesNew.push( [pair[0] + '/' + pair[1], next[pair[0]][pair[1]]] )
                }
            }

  		},
  		err => {
  			this.alert.presentAlert('Oops', err);
  		});
  }

  stringifyArray(array) {
  	let stringified = '';

  	for (let c of array) {
  		stringified += c +',';
  	}
  	stringified = stringified.substring(0, stringified.length-1);
  	return stringified;
  }

  generateArray(obj){
    return Object.keys(obj).map((key)=>{ return {key:key, value:obj[key]}});
  }

}