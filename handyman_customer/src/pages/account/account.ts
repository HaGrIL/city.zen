import { Component } from '@angular/core';
import { NavController, App, AlertController, Loading, LoadingController, ToastController, Events } from 'ionic-angular';

import { ManageaddressPage } from '../manageaddress/manageaddress';
import { ContactPage } from '../contact/contact';
import { PrivacyPage } from '../privacy/privacy';
import { AboutPage } from '../about/about';
import { FaqsPage } from '../faqs/faqs';
import { SigninPage } from '../signin/signin';
import { Constants } from '../../models/constants.models';
import { User } from '../../models/user.models';
import { ClientService } from '../../providers/client.service';
import { FirebaseClient } from '../../providers/firebase.service';
import { TranslateService } from '@ngx-translate/core';
import { ManagelanguagePage } from '../managelanguage/managelanguage';
import { Helper } from '../../models/helper.models';
import {AuthResponse} from "../../models/auth-response.models";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  providers: [ClientService, FirebaseClient]
})
export class AccountPage {
  private userMe: User;
  private progress: boolean;
  private loading: Loading;
  private loadingShown = false;

  constructor(public navCtrl: NavController, private app: App, private alertCtrl: AlertController,
    private service: ClientService, private loadingCtrl: LoadingController, private translate: TranslateService,
    private toastCtrl: ToastController, private firebaseService: FirebaseClient, private events: Events,  private http: HttpClient) {
    this.userMe = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
  }

  ionViewWillLeave() {
    this.events.publish('cango:exit', false);
  }

  ionViewDidEnter() {
    this.events.publish('cango:exit', true);
  }

  pickPicker() {
    if (this.progress)
      return;
    let fileInput = document.getElementById("profile-image");
    fileInput.click();
  }

  upload($event, isImage: boolean) {
    let file: File = $event.target.files[0];
    if (file) {
      if (isImage && !file.type.includes("image")) {
        this.translate.get("err_choose_image").subscribe(value => {
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
          this.userMe.image_url = String(url);
          this.service.updateUser(window.localStorage.getItem(Constants.KEY_TOKEN), { image_url: String(url) }).subscribe(res => {
            console.log(res);
            window.localStorage.setItem(Constants.KEY_USER, JSON.stringify(res));
          }, err => {
            console.log('update_user', err);
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

  manageaddress() {
    this.navCtrl.push(ManageaddressPage, { edit: true });
  }
  contact() {
    this.navCtrl.push(ContactPage);
  }
  privacy() {
    let terms: string = Helper.getSetting("privacy_policy");
    if (terms && terms.length) {
      this.translate.get('privacy_policy').subscribe(value => {
        this.navCtrl.push(PrivacyPage, { toShow: terms, heading: value });
      });
    }
  }
  about() {
    this.navCtrl.push(AboutPage);
  }
  faqs() {
    this.navCtrl.push(FaqsPage);
  }
  chooseLanguage() {
    this.navCtrl.push(ManagelanguagePage);
  }
  alertLogout() {
    this.translate.get(['logout_title', 'logout_message', 'no', 'yes']).subscribe(text => {
      let alert = this.alertCtrl.create({
        title: text['logout_title'],
        message: text['logout_message'],
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
            window.localStorage.removeItem(Constants.KEY_USER);
            window.localStorage.removeItem(Constants.KEY_TOKEN);
            window.localStorage.removeItem(Constants.KEY_NOTIFICATIONS);
            window.localStorage.removeItem(Constants.KEY_ADDRESS_LIST);
            this.app.getRootNav().setRoot(SigninPage);
          }
        }]
      });
      alert.present();
    });
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
