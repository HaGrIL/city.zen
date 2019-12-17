import { Component } from '@angular/core';
import { NavController, Loading, NavParams, LoadingController } from 'ionic-angular';
import { ClientService } from '../../providers/client.service';
import { Subscription } from 'rxjs/Subscription';
import { Address } from '../../models/address.models';
import { Constants } from '../../models/constants.models';
import { BooknowPage } from '../booknow/booknow';
import { AddAddressPage } from '../addaddress/addaddress';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-manageaddress',
  templateUrl: 'manageaddress.html',
  providers: [ClientService]
})
export class ManageaddressPage {
  private edit = false;
  private loading: Loading;
  private isLoading = false;
  private loadingShown = false;
  private title: string;
  private addresses = new Array<Address>();
  private subscriptions: Array<Subscription> = [];
  private profile;
  private category_id;

  constructor(public navCtrl: NavController, params: NavParams, private service: ClientService,
    private loadingCtrl: LoadingController, private translate: TranslateService) {
    this.profile = params.get("profile");
    this.edit = params.get('edit');
    this.category_id = params.get('category_id');
    this.translate.get(this.edit ? "address_manage" : "address_select").subscribe(value => {
      this.title = value;
    });
    if (window.localStorage.getItem(Constants.KEY_ADDRESS_LIST) == null) {
      this.translate.get("loading_address").subscribe(value => {
        this.presentLoading(value);
      });
      this.getAddresses();
    }
  }

  ionViewDidEnter() {
    let addresses = JSON.parse(window.localStorage.getItem(Constants.KEY_ADDRESS_LIST));
    if (addresses != null) {
      this.addresses = addresses;
    }
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dismissLoading();
  }

  getAddresses() {
    this.isLoading = true;
    let subscription: Subscription = this.service.addresses(window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe(res => {
      this.dismissLoading();
      this.addresses = res;
      window.localStorage.setItem(Constants.KEY_ADDRESS_LIST, JSON.stringify(this.addresses));
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.dismissLoading();
      console.log('address_list_err', err);
    });
    this.subscriptions.push(subscription);
  }

  onAddressClick(address) {
    if (this.edit) {
      this.navCtrl.push(AddAddressPage, { address: address });
    } else {
      this.navCtrl.push(BooknowPage, { address: address, profile: this.profile, category_id: this.category_id });
    }
  }

  onAddNewClick() {
    this.navCtrl.push(AddAddressPage);
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
