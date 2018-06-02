import {Component, Input, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertProvider } from '../../providers/alert/alert';

import { listCurrencies } from "../../data/listCurrencies";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit{
  @Input() textInputLeft: string;
  @Input() textInputRight: string;
  favourites: any;
  currentSide: string;
  showList: boolean;
  list: any;
  constructor(
  	public navCtrl: NavController,
  	public storage: Storage,
  	public alert: AlertProvider) {
  }

  ngOnInit () {
  	// this.storage.clear();
  	this.storage.get('favourites').then(
  		res => {
  			if(null !== res && res.indexOf(',') !== -1) {
  				this.favourites = res.split(',');
  			} else if(null !== res && res.indexOf(',') == -1) {
  				this.favourites = [res];
  			}
  		},
  		() => {
  			this.storage.set('favourites', '');
  		});
  }

  // Add new pair of currencies
  // Need to check how many pairs are already in the list
  //Options are: none(null), one(string), more than one(array)
  addToFavourites(first, second) {
  	let firstStr = first.toString();
  	let secondStr = second.toString();
	
  		if( (firstStr !== '' && secondStr !== '') && firstStr != secondStr ) {
  			this.storage.get('favourites').then(
  			res => {
  				let pair = firstStr + '/' + secondStr;

  				if(null != res && res.indexOf(',') !== -1) {
  					// there is more than one pair in favourites
	  				let dataStorage = res.split(',');
	  				let found = false;

	  				for(let p of dataStorage) {
	  					if(p == pair ) {
	  						found = true;
	  					}
	  				}
	  				if(found == false) {
	  					this.storage.set('favourites', res + ',' + pair)
	  				.then(res => this.favourites = res.split(','));
  					} else {
  						this.alert.presentAlert('Error', 'You already have this pair in favourites.');
  					}
  				} else if(null != res && res.indexOf(',') == -1) {
  					//there is just one pair in favourites

  					if(res.toString() === pair) {
  						this.alert.presentAlert('Error', 'You already have this pair in favourites.');
  					} else {
  						this.storage.set('favourites', res.toString() + ',' + pair)
	  					.then(res => {
	  					this.favourites = res.split(',');
	  					});
  					}	
  				} else {
  					//the list is empty
  					this.storage.set('favourites', pair).then(
  						res => this.favourites = res.split(','));
  				}

  			},
  			err => {
  				console.log('error');
  			});
  		} else {
  			this.alert.presentAlert('Oops', 'Please choose two currencies first.');
  		}

  		this.textInputLeft = '';
  		this.textInputRight = '';
  }

  //remove pair from list (need to check how many pairs are there before and after the deletion)
  // options are: one(string), more than one(array)

  removePair(pair) {
  	this.storage.get('favourites').then(
  		res => {
  			if(res.indexOf(',') !== -1) {
  				let dataStorage = res.split(',');
	  			for (let p in dataStorage) {
	  				if(dataStorage[p] == pair) {
	  					dataStorage.splice(p, 1);
	  				}
	  			}
	  			if(dataStorage.length>1) {
	  				//there are more than one pairs in the list
	  				this.storage.set('favourites', dataStorage.toString())
  			.then( res => this.favourites = res.split(','));
	  			} else {
            this.storage.set('favourites', dataStorage.toString())
        .then( res => this.favourites = [res]);
          } 
  			}
        else {
          //there is just one pair before removal
          this.storage.remove('favourites');
          this.favourites = null;
          } 
  		});
  }

  getItems(event, side) {
      //need this in the copyValue method
      this.currentSide = side;
      this.list = listCurrencies;
      let input = event.target.value;
      if(null !== input && '' !== input) {
          this.list = this.list.filter( (item) => {
             return (item[0].toLowerCase().indexOf(input.toLowerCase()) !== -1 ||
                 item[1].toLowerCase().indexOf(input.toLowerCase()) !== -1)
          });
          this.showList = true;
      } else {
          this.showList = false;
      }

  }

    copyValue(currency) {

      switch (this.currentSide) {
          case 'left':
              this.textInputLeft = currency;
              break;
          case 'right':
              this.textInputRight = currency;
              break;
      }

        this.showList = false;
    }
}