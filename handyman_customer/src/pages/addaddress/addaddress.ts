import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Address } from '../../models/address.models';
import { ClientService } from '../../providers/client.service';
import { Subscription } from 'rxjs/Subscription';
import { AddressCreateRequest } from '../../models/address-create-request.models';
import { Constants } from '../../models/constants.models';
import { MyLocation } from '../../models/my-location.models';
import { SelectareaPage } from '../selectarea/selectarea';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-addaddress',
  templateUrl: 'addaddress.html',
  providers: [ClientService]
})
export class AddAddressPage {
  gaming: string = "nes";
  where: string = "nes";

  private address: Address;
  private title: string;
  private loading: Loading;
  private loadingShown = false;
  private addressLocation: MyLocation;
  private subscriptions: Array<Subscription> = [];

  constructor(public navCtrl: NavController, navParam: NavParams, private service: ClientService,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController,
    private translate: TranslateService, private alertCtrl: AlertController) {
    this.address = navParam.get("address");
    this.translate.get(this.address ? "address_edit" : "address_new").subscribe(value => {
      this.title = value;
    });
    this.addressLocation = JSON.parse(window.localStorage.getItem(Constants.KEY_LOCATION));
    if (!this.addressLocation) {
      this.addressLocation = new MyLocation();
      this.translate.get("search_location").subscribe(value => {
        this.addressLocation.name = value;
      });
    }
    if (!this.address) {
      this.address = new Address();
      this.address.id = -1;
      this.address.latitude = this.addressLocation.lat;
      this.address.longitude = this.addressLocation.lng;
    }
  }

  ionViewDidEnter() {
    this.addressLocation = JSON.parse(window.localStorage.getItem(Constants.KEY_LOCATION));
    if (this.addressLocation) {
      this.address.address = this.addressLocation.name;
    } else {
      this.addressLocation = new MyLocation();
      this.translate.get("search_location").subscribe(value => {
        this.addressLocation.name = value;
      });
    }
    this.address.latitude = this.addressLocation.lat;
    this.address.longitude = this.addressLocation.lng;
  }

  onPickLocationClick() {
    this.navCtrl.push(SelectareaPage);
  }

  onSaveClick() {
    if (!this.address.title || !this.address.title.length) {
      this.translate.get("err_address_title").subscribe(value => {
        this.showToast(value);
      });
    } else if (!this.address.address || !this.address.address.length) {
      this.translate.get("err_address_full").subscribe(value => {
        this.showToast(value);
      });
    } else if (!this.address.latitude || !this.address.longitude) {
      this.translate.get("err_address_coordinates").subscribe(value => {
        this.showToast(value);
      });
    } else {
      let addressRequest = new AddressCreateRequest();
      addressRequest.title = this.address.title;
      addressRequest.address = this.address.address;
      addressRequest.lat = this.address.latitude;
      addressRequest.lng = this.address.longitude;
      addressRequest.latitude = this.address.latitude;
      addressRequest.longitude = this.address.longitude;

      if (this.address.id == -1) {
        this.createAddress(addressRequest);
      } else {
        this.updateAddress(addressRequest);
      }
    }
  }

  createAddress(addressRequest) {
    this.translate.get("address_creating").subscribe(value => {
      this.presentLoading(value);
    });
    let subscription: Subscription = this.service.addAddress(window.localStorage.getItem(Constants.KEY_TOKEN), addressRequest).subscribe(res => {
      this.dismissLoading();
      let addresses: Array<Address> = JSON.parse(window.localStorage.getItem(Constants.KEY_ADDRESS_LIST));
      if (!addresses) addresses = new Array<Address>();
      addresses.push(res);
      window.localStorage.setItem(Constants.KEY_ADDRESS_LIST, JSON.stringify(addresses));
      this.navCtrl.pop();
    }, err => {
      this.dismissLoading();
      console.log('address_add_err', err);
    });
    this.subscriptions.push(subscription);
  }

  updateAddress(addressRequest) {
    this.translate.get("address_updating").subscribe(value => {
      this.presentLoading(value);
    });
    let subscription: Subscription = this.service.updateAddress(window.localStorage.getItem(Constants.KEY_TOKEN), this.address.id, addressRequest).subscribe(res => {
      this.dismissLoading();
      let addresses: Array<Address> = JSON.parse(window.localStorage.getItem(Constants.KEY_ADDRESS_LIST));
      if (!addresses) addresses = new Array<Address>();
      let index = -1
      for (let i = 0; i < addresses.length; i++) {
        if (addresses[i].id == res.id) {
          index = i;
          break;
        }
      }
      if (index != -1) {
        addresses.splice(index, 1);
      }
      addresses.unshift(res);
      window.localStorage.setItem(Constants.KEY_ADDRESS_LIST, JSON.stringify(addresses));
      this.navCtrl.pop();
    }, err => {
      this.dismissLoading();
      console.log('address_update_err', err);
    });
    this.subscriptions.push(subscription);
  }

  deleteAddress() {
    this.translate.get("just_moment").subscribe(value => {
      this.presentLoading(value);
    });
    let subscription: Subscription = this.service.deleteAddress(window.localStorage.getItem(Constants.KEY_TOKEN), this.address.id).subscribe(res => {
      this.dismissLoading();
      let addresses: Array<Address> = JSON.parse(window.localStorage.getItem(Constants.KEY_ADDRESS_LIST));
      if (!addresses) addresses = new Array<Address>();
      let index = -1
      for (let i = 0; i < addresses.length; i++) {
        if (addresses[i].id == this.address.id) {
          index = i;
          break;
        }
      }
      if (index != -1) {
        addresses.splice(index, 1);
      }
      window.localStorage.setItem(Constants.KEY_ADDRESS_LIST, JSON.stringify(addresses));
      this.navCtrl.pop();
    }, err => {
      this.dismissLoading();
      console.log('address_delete_err', err);
    });
    this.subscriptions.push(subscription);
  }

  confirmDelete() {
    this.translate.get(['address_delete_title', 'address_delete_message', 'no', 'yes']).subscribe(text => {
      let alert = this.alertCtrl.create({
        title: text['address_delete_title'],
        message: text['address_delete_message'],
        buttons: [{
          text: text['no'],
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: text['yes'],
          handler: () => {
            this.deleteAddress();
          }
        }]
      });
      alert.present();
    });
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  private presentLoading(message: string) {
    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.onDidDismiss(() => { });
    this.loading.present();
    this.loadingShown = true;
  }

  private dismissLoading() {
    if (this.loadingShown) {
      this.loadingShown = false;
      this.loading.dismiss();
    }
  }

}
