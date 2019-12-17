import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Loading, AlertController } from 'ionic-angular';
import { CategoryPage } from '../category/category';
import { MyLocation } from '../../models/my-location.models';
import { Constants } from '../../models/constants.models';
import { SelectareaPage } from '../selectarea/selectarea';
import { ClientService } from '../../providers/client.service';
import { Category } from '../../models/category.models';
import { Subscription } from 'rxjs/Subscription';
import { Diagnostic } from '@ionic-native/diagnostic';
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ClientService]
})
export class HomePage {
  private loading: Loading;
  private loadingShown: Boolean = false;
  private selectedLocation: MyLocation;
  private categories: Array<Category>;
  private categoriesAll = new Array<Category>();
  private subscriptions: Array<Subscription> = [];

  constructor(public navCtrl: NavController, private service: ClientService, private geolocation: Geolocation,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController, private locationAccuracy: LocationAccuracy,
    private diagnostic: Diagnostic, private alertCtrl: AlertController, private translate: TranslateService) {
    this.selectedLocation = JSON.parse(window.localStorage.getItem(Constants.KEY_LOCATION));
    this.categories = JSON.parse(window.localStorage.getItem(Constants.KEY_CATEGORY));
    if (this.categories)
      this.categoriesAll = this.categories;
    else
      this.translate.get('loading_categories').subscribe(value => {
        this.presentLoading(value);
      });
    this.refreshCategories();
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dismissLoading();
  }

  ionViewDidEnter() {
    let newSelectedLocation: MyLocation = JSON.parse(window.localStorage.getItem(Constants.KEY_LOCATION));
    this.selectedLocation = newSelectedLocation;
    console.log(newSelectedLocation, '===============')

    if (!this.selectedLocation) {
      this.translate.get('select_location_text').subscribe(value => {
        this.showToast(value);
      });
      this.checkForLocation(false);
    }
  }

  refreshCategories() {
    let subscription: Subscription = this.service.categoryParent(window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe(res => {
      this.dismissLoading();
      let cats: Array<Category> = res.data;
      this.categories = cats;
      this.categoriesAll = this.categories;
      window.localStorage.setItem(Constants.KEY_CATEGORY, JSON.stringify(this.categories));
    }, err => {
      this.dismissLoading();
      console.log('cat_err', err);
    });
    this.subscriptions.push(subscription);
  }

  checkForLocation(select) {
    this.diagnostic.isLocationEnabled().then((isAvailable) => {
      if (isAvailable) {
        if (select) {
          this.navCtrl.push(SelectareaPage);
        } else {
          this.geolocation.getCurrentPosition().then((resp) => {
            this.selectedLocation = new MyLocation();
            this.translate.get('home').subscribe(value => {
              this.selectedLocation.name = value;
            });
            this.selectedLocation.lat = String(resp.coords.latitude);
            this.selectedLocation.lng = String(resp.coords.longitude);
            window.localStorage.setItem(Constants.KEY_LOCATION, JSON.stringify(this.selectedLocation));
            this.translate.get('current_location_success').subscribe(value => {
              this.showToast(value);
            });
          }).catch((error) => {
            console.log('Error getting location', error);
            this.translate.get('current_location_error').subscribe(value => {
              this.showToast(value);
            });
          });
        }
      } else {
        this.alertLocationServices();
      }
    }).catch((e) => {
      console.error(e);
      this.alertLocationServices();
    });
  }

  alertLocationServices() {
    this.translate.get(['location_services_title', 'location_services_message', 'okay']).subscribe(text => {
      let alert = this.alertCtrl.create({
        title: text['location_services_title'],
        subTitle: text['location_services_message'],
        buttons: [{
          text: text['okay'],
          role: 'cancel',
          handler: () => {
            this.locationAccuracy.canRequest().then((canRequest: boolean) => {
              if (canRequest) {
                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
                  console.log('Request successful');
                }, error => {
                  console.log('Error requesting location permissions', error);
                });
              }
            });
          }
        }]
      });
      alert.present();
    })
  }

  subCatPage(cat: Category) {
    if (this.selectedLocation) {
      this.navCtrl.push(CategoryPage, { cat: cat });
    } else {
      this.translate.get('err_select_location').subscribe(value => {
        this.showToast(value);
      });
    }
  }

  getItems(searchbar: any) {
    this.filterCategories(searchbar.srcElement.value);
  }

  filterCategories(query) {
    let filtered = new Array<Category>();
    if (query && query.length) {
      for (let cat of this.categoriesAll) {
        if (cat.title.toLowerCase().indexOf(query.toLowerCase()) > -1) {
          filtered.push(cat);
        }
      }
      this.categories = filtered;
    } else {
      this.categories = this.categoriesAll;
    }
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
