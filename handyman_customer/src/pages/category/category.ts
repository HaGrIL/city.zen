import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, ToastController } from 'ionic-angular';

import { ListofplumberPage } from '../listofplumber/listofplumber';
import { Category } from '../../models/category.models';
import { Subscription } from 'rxjs/Subscription';
import { ClientService } from '../../providers/client.service';
import { Constants } from '../../models/constants.models';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
  providers: [ClientService]
})
export class CategoryPage {
  private loading: Loading;
  private loadingShown: Boolean = false;
  private isLoading = false;
  private parentCategory: Category;
  private subCategories: Array<Category>;
  private subscriptions: Array<Subscription> = [];

  constructor(public navCtrl: NavController, params: NavParams, private service: ClientService,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController, private translate: TranslateService) {
    this.parentCategory = params.get("cat");
    if (this.parentCategory) {
      this.translate.get('loading_categories_sub').subscribe(value => {
        this.presentLoading(value);
      });
      this.loadChildCategories(this.parentCategory.id);
    }
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dismissLoading();
  }

  loadChildCategories(parentId: number) {
    this.isLoading = true;
    let subscription: Subscription = this.service.categoryChildren(window.localStorage.getItem(Constants.KEY_TOKEN), parentId).subscribe(res => {
      this.isLoading = false;
      this.dismissLoading();
      let cats: Array<Category> = res.data;
      this.subCategories = cats;
    }, err => {
      this.isLoading = false;
      this.dismissLoading();
      console.log('cat_sub_err', err);
    });
    this.subscriptions.push(subscription);
  }

  subCatDetail(cat) {
    this.navCtrl.push(ListofplumberPage, { cat: cat });
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
