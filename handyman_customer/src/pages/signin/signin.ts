import { Component, Inject } from '@angular/core';
import { NavController, Loading, LoadingController, ToastController, AlertController, Platform, App, Events } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import * as firebase from 'firebase/auth';
import { APP_CONFIG, AppConfig } from '../../app/app.config';
import { ClientService } from '../../providers/client.service';
import { OtpPage } from '../otp/otp';
import { Constants } from '../../models/constants.models';
import { TabsPage } from '../tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
import { PrivacyPage } from '../privacy/privacy';
import { Helper } from '../../models/helper.models';
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
  providers: [ClientService]
})

export class SigninPage {
  countries: any;
  phoneNumber: string;
  countryCode: string;
  phoneNumberFull: string;
  private loading: Loading;
  private loadingShown: Boolean = false;

  constructor(@Inject(APP_CONFIG) public config: AppConfig, public navCtrl: NavController, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private alertCtrl: AlertController, private service: ClientService, private translate: TranslateService,
    public facebook: Facebook, public google: GooglePlus, public platform: Platform, private app: App, private events: Events) {
    this.getCountries();
  }

  getCountries() {
    this.service.getCountries().subscribe(data => {
      this.countries = data;
    }, err => {
      console.log(err);
    })
  }

  privacy() {
    let terms: string = Helper.getSetting("terms");
    if (terms && terms.length) {
      this.translate.get('terms_conditions').subscribe(value => {
        this.navCtrl.push(PrivacyPage, { toShow: terms, heading: value });
      });
    }
  }

  alertPhone() {
    this.translate.get(['alert_phone', 'no', 'yes']).subscribe(text => {
      this.phoneNumberFull = "+" + this.countryCode + this.phoneNumber;
      let alert = this.alertCtrl.create({
        title: this.phoneNumberFull,
        message: text['alert_phone'],
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
            this.checkIfExists();
          }
        }]
      });
      alert.present();
    });
  }

  checkIfExists() {
    this.translate.get('just_moment').subscribe(value => {
      this.presentLoading(value);
    });
    this.service.checkUser({ mobile_number: this.phoneNumberFull, role: "customer" }).subscribe(res => {
      console.log(res, 'CHECK USER');
      this.dismissLoading();
      this.app.getRootNav().setRoot(OtpPage, { phoneNumberFull: this.phoneNumberFull });
    }, err => {
      console.log(err);
      this.dismissLoading();
      this.navCtrl.push(SignupPage, { code: this.countryCode, phone: this.phoneNumber });
    });
  }

  getFireUserToken(user) {
    user.getIdToken(false).then(token => {
      console.log('fire_token', token);
      this.requestSignSocialIn({ token: token }, user);
    }).catch(err => {
      console.log('fire_token_err', err);
    });
  }

  requestSignSocialIn(socialRequest, user) {
    console.log('fire_user', user);
    this.translate.get('verifying_user').subscribe(value => {
      this.presentLoading(value);
    });
    this.service.loginSocial(socialRequest).subscribe(res => {
      this.dismissLoading();
      if (res.user.mobile_verified == 1) {
        window.localStorage.setItem(Constants.KEY_USER, JSON.stringify(res.user));
        window.localStorage.setItem(Constants.KEY_TOKEN, res.token);
        this.events.publish('user:login');
        this.app.getRootNav().setRoot(TabsPage);
      } else {
        this.app.getRootNav().setRoot(OtpPage, { phoneNumberFull: res.user.mobile_number });
      }
    }, err => {
      this.dismissLoading();
      console.log(err);
      if (user && user.displayName && user.email) {
        this.navCtrl.push(SignupPage, { name: user.displayName, email: user.email });
      } else {
        this.navCtrl.push(SignupPage);
      }
    });
  }

  signInFacebook() {
    this.translate.get('logging_facebook').subscribe(value => {
      this.presentLoading(value);
    });
    if (this.platform.is('cordova')) {
      this.fbOnPhone();
    } else {
      this.fbOnBrowser();
    }
  }

  signInGoogle() {
    this.translate.get('logging_google').subscribe(value => {
      this.presentLoading(value);
    });
    if (this.platform.is('cordova')) {
      this.googleOnPhone();
    } else {
      this.googleOnBrowser();
    }
  }

  fbOnPhone() {
    this.facebook.login(["public_profile", 'email']).then(response => {
      // this.presentLoading('Facebook signup success, authenticating with firebase');
      console.log("fb_success", response);
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential).then((success) => {
        this.dismissLoading();
        console.log("fb_fire_success", success);
        this.getFireUserToken(success.user);
      }).catch((error) => {
        console.log("fb_fire_error", error);
        this.showToast("Error in Facebook login");
        this.dismissLoading();
      });
    }).catch((error) => {
      console.log("fb_error", error);
      this.showToast("Error in Facebook login");
      this.dismissLoading();
    });
  }

  fbOnBrowser() {
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    provider.addScope('user_friends');
    provider.addScope('email');
    provider.addScope('public_profile');
    firebase.auth().signInWithPopup(provider).then((result) => {
      console.log("fb_fire_success", result);
      this.dismissLoading();
      this.getFireUserToken(result.user);
    }).catch((error) => {
      console.log("fb_fire_error", error);
      this.dismissLoading();
      this.showToast("Facebook login unsuccessfull");
    });
  }

  googleOnPhone() {
    this.google.login({
      'webClientId': this.config.firebaseConfig.webApplicationId,
      'offline': false,
      'scopes': 'profile email'
    }).then(res => {
      console.log('google_success', res);
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
      firebase.auth().signInAndRetrieveDataWithCredential(googleCredential).then(response => {
        console.log('google_fire_success', response);
        this.dismissLoading();
        this.getFireUserToken(response.user);
      }).catch(error => {
        console.log('google_fire_error', error);
        this.dismissLoading();
      });
    }).catch(err => {
      console.log('google_fail', err);
      this.dismissLoading();
    });
  }

  googleOnBrowser() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
        this.dismissLoading();
        console.log('google_fire_success', result);
        this.getFireUserToken(result.user);
      }).catch((error) => {
        console.log('google_fire_error', error);
        this.dismissLoading();
      });
    } catch (err) {
      this.dismissLoading();
      console.log(err);
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

  private presentErrorAlert(msg: string) {
    let alert = this.alertCtrl.create({
      title: "Error",
      subTitle: msg,
      buttons: ["Dismiss"]
    });
    alert.present();
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
