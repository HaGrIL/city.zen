import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { ChatscreenPage } from '../chatscreen/chatscreen';
import { Appointment } from '../../models/appointment.models';
import { ClientService } from '../../providers/client.service';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from '../../models/constants.models';
import { User } from '../../models/user.models';
import { Chat } from '../../models/chat.models';
import { Helper } from '../../models/helper.models';
import { TranslateService } from '@ngx-translate/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import * as firebase from 'firebase/app';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { MyLocation } from '../../models/my-location.models';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
  providers: [ClientService]
})
export class BookingPage {
  private appointment: Appointment;
  private loading: Loading;
  private isLoading = false;
  private loadingShown = false;
  private statusLevel = 1;
  private statusText = "Job Pending";
  private statusLevel1Time: string;
  private statusLevel2Time: string;;
  private statusLevel3Time: string;
  private subscriptions: Array<Subscription> = [];
  private geoSubscription: Subscription;

  constructor(public navCtrl: NavController, navParam: NavParams, private service: ClientService,
    private locationAccuracy: LocationAccuracy, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private geolocation: Geolocation, private callNumber: CallNumber,
    private translate: TranslateService, private diagnostic: Diagnostic, private alertCtrl: AlertController) {
    this.appointment = navParam.get("appointment");
    this.setStatus();
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    if (this.geoSubscription) {
      this.geoSubscription.unsubscribe();
      this.geoSubscription = null;
    }
    this.dismissLoading();
  }

  ionViewDidEnter() {
    if (status == "onway") {
      this.checkAndWatchLocation();
    } else if (this.geoSubscription) {
      this.geoSubscription.unsubscribe();
      this.geoSubscription = null;
    }
  }

  updateJobStatus(status) {
    if (status == "onway") {
      this.checkAndWatchLocation();
    } else if (this.geoSubscription) {
      this.geoSubscription.unsubscribe();
      this.geoSubscription = null;
    }
    this.translate.get('updating').subscribe(value => {
      this.presentLoading(value);
    });
    let subscription: Subscription = this.service.appointmentUpdate(window.localStorage.getItem(Constants.KEY_TOKEN), this.appointment.id, status).subscribe(res => {
      this.dismissLoading();
      this.appointment = res;
      this.setStatus();
      window.localStorage.setItem("refreshappointments", "true");
    }, err => {
      console.log('update_status', err);
      this.dismissLoading();
      if (err && err.status && err.status == 403) {
        this.translate.get(['err_quota_title', 'err_quota_message']).subscribe(text => {
          this.presentErrorAlert(text['err_quota_title'], text['err_quota_message']);
        });
      }
    });
    this.subscriptions.push(subscription);
  }

  checkAndWatchLocation() {
    this.diagnostic.isLocationEnabled().then((isAvailable) => {
      if (isAvailable) {
        this.watchLocation();
      } else {
        this.alertLocationServices();
      }
    }).catch((e) => {
      console.error(e);
      this.alertLocationServices();
    });
  }

  navigate() {
    if (this.appointment.address.latitude && this.appointment.address.longitude)
      window.open("http://maps.google.com/maps?q=loc:" + this.appointment.address.latitude + "," + this.appointment.address.longitude + " (Appointment)", "_system");
  }

  setStatus() {
    if (this.appointment) {
      switch (this.appointment.status) {
        case "pending": {
          this.statusLevel = 1;
          this.translate.get('updating').subscribe(value => {
            this.statusText = value;
          });
          break;
        }
        case "accepted": {
          this.statusLevel = 1;
          this.translate.get('job_accepted').subscribe(value => {
            this.statusText = value;
          });
          break;
        }
        case "onway": {
          this.statusLevel = 2;
          this.translate.get('job_goingto').subscribe(value => {
            this.statusText = value;
          });
          break;
        }
        case "ongoing": {
          this.statusLevel = 2;
          this.translate.get('job_ongoing').subscribe(value => {
            this.statusText = value;
          });
          break;
        }
        case "complete": {
          this.statusLevel = 3;
          this.translate.get('job_complete').subscribe(value => {
            this.statusText = value;
          });
          break;
        }
        case "cancelled": {
          this.statusLevel = 1;
          this.translate.get('job_cancelled').subscribe(value => {
            this.statusText = value;
          });
          break;
        }
        case "rejected": {
          this.statusLevel = 1;
          this.translate.get('job_rejected').subscribe(value => {
            this.statusText = value;
          });
          break;
        }
      }
      let acceptedTime = Helper.getLogTimeForStatus("accepted", this.appointment.logs);
      if (acceptedTime && acceptedTime.length) {
        this.translate.get('job_accepted_on').subscribe(value => {
          this.statusLevel1Time = value + acceptedTime;
        });
      }
      if (!this.statusLevel1Time || !this.statusLevel1Time.length) {
        if (this.appointment.status == "cancelled") {
          this.translate.get('job_cancelled_on').subscribe(value => {
            this.statusLevel1Time = value + acceptedTime;
          });
        } else if (this.appointment.status == "rejected") {
          this.translate.get('job_rejected_on').subscribe(value => {
            this.statusLevel1Time = value + acceptedTime;
          });
        } else {
          this.statusLevel1Time = this.appointment.updated_at;
        }
      }
      this.translate.get('job_started_on').subscribe(value => {
        let onwaytime = Helper.getLogTimeForStatus("onway", this.appointment.logs);
        if (onwaytime && onwaytime.length) {
          this.statusLevel2Time = value + onwaytime;
        } else {
          this.statusLevel2Time = value + Helper.getLogTimeForStatus("ongoing", this.appointment.logs);
        }
      });
      this.translate.get('job_completed_on').subscribe(value => {
        this.statusLevel3Time = value + Helper.getLogTimeForStatus("complete", this.appointment.logs);
      });
      console.log(this.appointment.logs);
    }
  }

  callUser() {
    this.callNumber.callNumber(this.appointment.user.mobile_number, true).then(res => console.log('Launched dialer!', res)).catch(err => console.log('Error launching dialer', err));
  }

  chatscreen() {
    let newUserMe: User = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
    let chat = new Chat();
    chat.chatId = this.appointment.user.id;
    chat.chatImage = this.appointment.user.image_url;
    chat.chatName = this.appointment.user.name;
    chat.chatStatus = this.appointment.user.email;
    chat.myId = newUserMe.id;
    this.navCtrl.push(ChatscreenPage, { chat: chat });
  }

  watchLocation() {
    this.geoSubscription = this.geolocation.watchPosition().subscribe(position => {
      if ((position as Geoposition).coords != undefined) {
        var geoposition = (position as Geoposition);
        console.log('Latitude: ' + geoposition.coords.latitude + ' - Longitude: ' + geoposition.coords.longitude);
        let location = new MyLocation();
        location.lat = String(geoposition.coords.latitude);
        location.lng = String(geoposition.coords.longitude);
        window.localStorage.setItem(Constants.KEY_LOCATION, JSON.stringify(location));
        let refLocation = firebase.database().ref().child("handyman_provider").child(String(this.appointment.provider.user_id));
        refLocation.set(location, function (error) {
          if (error) {
            console.log(error);
          }
        });
      } else {
        var positionError = (position as any);
        console.log('Error ' + positionError.code + ': ' + positionError.message);
      }
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
            console.log('okay clicked');
            this.locationAccuracy.canRequest().then((canRequest: boolean) => {
              if (canRequest) {
                // the accuracy option will be ignored by iOS
                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => console.log('Request successful'), error => console.log('Error requesting location permissions', error));
              }
            });
          }
        }]
      });
      alert.present();
    })
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

  private presentErrorAlert(title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ["Dismiss"]
    });
    alert.present();
  }

}
