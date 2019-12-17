import { Component } from '@angular/core';
import { NavController, Loading, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { PlumberprofilePage } from '../plumberprofile/plumberprofile';
import { Category } from '../../models/category.models';
import { ClientService } from '../../providers/client.service';
import { Subscription } from 'rxjs/Subscription';
import { MyLocation } from '../../models/my-location.models';
import { Constants } from '../../models/constants.models';
import { ProviderProfile } from '../../models/provider-profile.models';
import { Helper } from '../../models/helper.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-listofplumber',
  templateUrl: 'listofplumber.html',
  providers: [ClientService]
})
export class ListofplumberPage {
  private loading: Loading;
  private loadingShown = false;
  private isLoading = false;
  private doneAll = false;
  private pageNo = 1;
  private category: Category;
  private selectedLocation: MyLocation;
  private subscriptions: Array<Subscription> = [];
  private providers: Array<ProviderProfile> = [];
  private infiniteScroll: any;
  private currency: string;

  constructor(public navCtrl: NavController, params: NavParams, private service: ClientService,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController, private translate: TranslateService) {
    this.category = params.get("cat");
    this.currency = Helper.getSetting("currency");
    if (this.category && this.category.id) {
      this.selectedLocation = JSON.parse(window.localStorage.getItem(Constants.KEY_LOCATION));
      this.translate.get('loading_providers').subscribe(value => {
        this.presentLoading(value);
      });
      this.getProviders();
    }
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dismissLoading();
  }

  getProviders() {
    this.isLoading = true;
    let subscription: Subscription = this.service.providers(window.localStorage.getItem(Constants.KEY_TOKEN),
      String(this.category.id),
      this.selectedLocation.lat,
      this.selectedLocation.lng,
      String(this.pageNo)).subscribe(res => {
        this.isLoading = false;
        this.dismissLoading();
        for (let p of res.data) {
          p.priceToShow = this.currency + p.price;
        }
        this.doneAll = (!res.data || !res.data.length);
        this.providers = this.providers.concat(res.data);
        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
        }
      }, err => {
        this.isLoading = false;
        this.dismissLoading();
        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
        }
        console.log('prov_list_err', err);
      });
    this.subscriptions.push(subscription);
  }

  doInfinite(infiniteScroll: any) {
    if (this.doneAll) {
      infiniteScroll.complete();
    } else {
      this.infiniteScroll = infiniteScroll;
      this.pageNo = this.pageNo + 1;
      this.getProviders();
    }
  }

  profileDetail(proProf: ProviderProfile) {
    this.navCtrl.push(PlumberprofilePage, { profile: proProf, category_id: this.category.id });
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

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

}
