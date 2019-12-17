import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, ToastController, AlertController, NavParams } from 'ionic-angular';

import { SelectservicePage } from '../selectservice/selectservice';
import { Constants } from '../../models/constants.models';
import { User } from '../../models/user.models';
import { Profile } from '../../models/profile.models';
import { ClientService } from '../../providers/client.service';
import { Category } from '../../models/category.models';
import { Subscription } from 'rxjs/Subscription';
import { MyLocation } from '../../models/my-location.models';
import { SelectareaPage } from '../selectarea/selectarea';
import { FirebaseClient } from '../../providers/firebase.service';
import { ProfileUpdateRequest } from '../../models/profile-update-request.models';
import { TranslateService } from '@ngx-translate/core';
import {ReviewPage} from "../review/review";

@Component({
  selector: 'page-myprofile',
  templateUrl: 'myprofile.html',
  providers: [ClientService, FirebaseClient]
})
export class MyprofilePage {
  private loading: Loading;
  private loadingShown = false;
  private selectionPagePushed = false;
  private user: User;
  private location: MyLocation;
  private profile: Profile;
  private progress: boolean;
  private categories: Array<Category>;
  private subscriptions: Array<Subscription> = [];
  private level = 0;

  constructor(private navCtrl: NavController, private service: ClientService,
    public alertCtrl: AlertController, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private firebaseService: FirebaseClient,
    private translate: TranslateService, navParam: NavParams) {
    let create_edit = navParam.get("create_edit");
    if (create_edit) {
      this.translate.get('create_edit_profile').subscribe(value => {
        this.showToast(value);
      });
    }
    this.user = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
    this.profile = JSON.parse(window.localStorage.getItem(Constants.KEY_PROFILE));
    this.categories = JSON.parse(window.localStorage.getItem(Constants.KEY_CATEGORY));
    this.location = JSON.parse(window.localStorage.getItem(Constants.KEY_LOCATION));
    if (!this.categories) {
      this.translate.get('just_moment').subscribe(value => {
        this.presentLoading(value);
      });
    }
    if (!this.profile) {
      this.profile = new Profile();
      this.profile.primary_category = new Category();
      this.profile.subcategories = new Array<Category>();
      this.profile.price_type = "hour";
      this.profile.about = "";
      this.profile.user = this.user;
    }
    if (!this.profile.primary_category) {
      this.profile.primary_category = new Category();
    }
    if (!this.profile.subcategories) {
      this.profile.subcategories = new Array<Category>();
    }
    this.refreshProfile();
    this.refreshCategories();
  }

  ionViewDidEnter() {
    let newSelectedLocation: MyLocation = JSON.parse(window.localStorage.getItem(Constants.KEY_LOCATION));
    this.location = newSelectedLocation;
    if (this.selectionPagePushed) {
      this.selectionPagePushed = false;
      let subCategories: Array<Category> = JSON.parse(window.localStorage.getItem("temp_sub_cats"));
      window.localStorage.removeItem("temp_sub_cats");
      if (subCategories && subCategories.length) {
        this.profile.subcategories = subCategories;
      }
    }
  }

  refreshProfile() {
    let subscription: Subscription = this.service.getProfile(window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe(res => {
      if (res && res.primary_category && res.primary_category_id) {
        this.profile = res;
        window.localStorage.setItem(Constants.KEY_PROFILE, JSON.stringify(this.profile));
      } else {
        window.localStorage.removeItem(Constants.KEY_PROFILE);
        this.profile = new Profile();
        this.profile.primary_category = new Category();
        this.profile.subcategories = new Array<Category>();
        this.profile.price_type = "hour";
        this.profile.about = "";
        this.profile.user = this.user;
      }
    }, err => {
      console.log('profile_get_err', err);
    });
    this.subscriptions.push(subscription);
  }

  refreshCategories() {
    let subscription: Subscription = this.service.categoryParent(window.localStorage.getItem(Constants.KEY_TOKEN)).subscribe(res => {
      this.dismissLoading();
      let cats: Array<Category> = res.data;
      this.categories = cats;
      console.log(cats);
      window.localStorage.setItem(Constants.KEY_CATEGORY, JSON.stringify(this.categories));
    }, err => {
      this.dismissLoading();
      console.log('cat_err', err);
    });
    this.subscriptions.push(subscription);
  }

  pickLocation() {
    this.navCtrl.push(SelectareaPage);
  }

  compareFn(tr1: Category, tr2: Category): boolean {
    return tr1 && tr2 ? tr1.id == tr2.id : tr1 === tr2;
  }

  selectservice() {
    if (this.profile.primary_category) {
      this.selectionPagePushed = true;
      if (this.profile.subcategories) {
        for (let subCat of this.profile.subcategories) {
          subCat.selected = true;
        }
      }
      this.navCtrl.push(SelectservicePage, { cat: this.profile.primary_category, cats: this.profile.subcategories });
    }
  }

  pickPicker(num) {
    if (this.progress)
      return;
    let fileInput = document.getElementById(num == 1 ? "profile-image" : "profile-doc");
    fileInput.click();
  }

  upload($event, isImage: boolean) {
    let file: File = $event.target.files[0];
    if (file) {
      if (isImage && !file.type.includes("image")) {
        this.translate.get('err_choose_image').subscribe(value => {
          this.showToast(value);
        });
        return;
      }
      this.progress = true;
      this.translate.get(isImage ? "uploading_image" : "uploading_doc").subscribe(value => {
        this.presentLoading(value);
      });
      this.firebaseService.uploadFile(file).then(url => {
        this.dismissLoading();
        this.progress = false;
        if (isImage) {
          this.profile.user.image_url = String(url);
          this.service.updateUser(window.localStorage.getItem(Constants.KEY_TOKEN), { image_url: String(url) }).subscribe(res => {
            console.log(res);
            window.localStorage.setItem(Constants.KEY_USER, JSON.stringify(res));
          }, err => {
            console.log('update_user', err);
          });
        } else {
          this.profile.document_url = String(url);
          this.translate.get('document_uploaded').subscribe(value => {
            this.showToast(value);
          });
        }
      }).catch(err => {
        this.dismissLoading();
        this.progress = false;
        console.log(err);
        this.translate.get("uploading_fail").subscribe(value => {
          this.presentErrorAlert(value);
        });
      })
    }
  }

  save() {
    // Uncomment if it's need =======================

    if (!this.location) {
      this.translate.get('err_select_location').subscribe(value => {
        this.showToast(value);
      });
      return;
    }
    if (!this.profile.about || !this.profile.about.length) {
      this.translate.get('err_empty_about').subscribe(value => {
        this.showToast(value);
      });
      return;
    }
    if (!this.profile.price || this.profile.price <= 0) {
      this.translate.get('err_empty_price').subscribe(value => {
        this.showToast(value);
      });
      return;
    }
    if (!this.profile.document_url || !this.profile.document_url.length) {
      this.translate.get('err_empty_doc').subscribe(value => {
        this.showToast(value);
      });
      return;
    }
    if (!this.profile.primary_category) {
      this.translate.get('err_service_cat').subscribe(value => {
        this.showToast(value);
      });
      return;
    }
    if (!this.profile.subcategories || !this.profile.subcategories.length) {
      this.translate.get('err_services').subscribe(value => {
        this.showToast(value);
      });
      return;
    }

    let profileRequest = new ProfileUpdateRequest();
    profileRequest.address =  this.location ? this.location.name : '';
    profileRequest.latitude = this.location ? this.location.lat : '';
    profileRequest.longitude = this.location ? this.location.lng : '';
    profileRequest.about = this.profile ? this.profile.about : '';
    profileRequest.price = this.profile ? this.profile.price : 0;
    profileRequest.price_type = this.profile ? this.profile.price_type : '';
    profileRequest.document_url = this.profile ? this.profile.document_url: '';
    profileRequest.primary_category_id = this.profile ? this.profile.primary_category.id : undefined;
    profileRequest.sub_categories = new Array<number>();
    if (this.profile) {
      for (let cat of this.profile.subcategories) {
        profileRequest.sub_categories.push(cat.id);
      }
    }

    this.translate.get('profile_updating').subscribe(value => {
      this.presentLoading(value);
    });
    console.log('update_request', profileRequest);
    let subscription: Subscription = this.service.updateProfile(window.localStorage.getItem(Constants.KEY_TOKEN), profileRequest).subscribe(res => {
      window.localStorage.setItem(Constants.KEY_PROFILE, JSON.stringify(res));
      this.dismissLoading();
      // this.navCtrl.pop();
      this.navCtrl.popTo(ReviewPage);

    }, err => {
      this.dismissLoading();
      console.log("profile_update_err", err);
      this.translate.get('profile_updating_fail').subscribe(value => {
        this.presentErrorAlert(value);
      });
      this.navCtrl.popTo(ReviewPage);
    });
    this.subscriptions.push(subscription);
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

  private showToast(message: string) {
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

  private presentErrorAlert(msg: string) {
    let alert = this.alertCtrl.create({
      title: "Error",
      subTitle: msg,
      buttons: ["Dismiss"]
    });
    alert.present();
  }

}
