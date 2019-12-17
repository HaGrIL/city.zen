import {Component, Inject} from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Loading, App } from 'ionic-angular';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { Address } from '../../models/address.models';
import { ProviderProfile } from '../../models/provider-profile.models';
import { ClientService } from '../../providers/client.service';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from '../../models/constants.models';
import { AppointmentRequest } from '../../models/appointment-request.models';
import { TabsPage } from '../tabs/tabs';
import { Appointment } from '../../models/appointment.models';
import { TranslateService } from '@ngx-translate/core';
import {APP_CONFIG, AppConfig} from "../../app/app.config";
import {User} from "../../models/user.models";

@Component({
  selector: 'page-booknow',
  templateUrl: 'booknow.html',
  providers: [ClientService]
})
export class BooknowPage {
  gaming: string = "nes";
  where: string = "nes";

  private address: Address;
  private profile: ProviderProfile;
  private dates: Array<Date> = [];
  private subscriptions: Array<Subscription> = [];
  private dateSelected: Date;
  private timeRangeSelected;
  private loading: Loading;
  private loadingShown = false;
  private appointment: Appointment;
  private category_id;
  private notes: string;
  isShowPayment = false;
  isPaymentClosed = false;
  paymentUrl: SafeUrl;
  private weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  private timeRange = [{ time_value: "09:00 - 11:00", time_from: "09:00", time_to: "11:00" },
  { time_value: "11:00 - 13:00", time_from: "11:00", time_to: "13:00" },
  { time_value: "13:00 - 15:00", time_from: "13:00", time_to: "15:00" },
  { time_value: "15:00 - 17:00", time_from: "15:00", time_to: "17:00" },
  { time_value: "17:00 - 19:00", time_from: "17:00", time_to: "19:00" },
  { time_value: "19:00 - 21:00", time_from: "19:00", time_to: "21:00" }];

  constructor(public navCtrl: NavController, navParam: NavParams, private service: ClientService,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController, private app: App, private translate: TranslateService,
              @Inject(APP_CONFIG) private config: AppConfig,
              private clientService: ClientService
  ) {
    this.profile = navParam.get("profile");
    this.address = navParam.get("address");
    this.appointment = navParam.get("appointment");
    console.log(this.profile, 'profile');
    this.category_id = navParam.get("category_id");
    for (let i = 0; i < 7; i++) {
      let d = new Date();
      d.setDate(d.getDate() + i);
      this.dates.push(d);
    }
    this.markSelected(this.dates[0]);
    this.timeRangeSelected = this.timeRange[0];

    if (this.appointment) {
      this.markSelected(new Date(this.appointment.date));
      let trtc = this.appointment.time_from_formatted + " - " + this.appointment.time_to_formatted;
      for (let tr of this.timeRange) {
        if (tr.time_value == trtc) {
          this.timeRangeSelected = tr;
          break;
        }
      }
    }
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dismissLoading();
  }

  compareFn(tr1, tr2): boolean {
    return tr1 && tr2 ? tr1.time_value == tr2.time_value : tr1 === tr2;
  }

  markSelected(date) {
    this.dateSelected = date;
  }

  proceed() {
    let now = new Date();
    let selected = new Date(this.dateSelected.getFullYear() + '-' + ((this.dateSelected.getMonth() + 1) < 10 ? '0' + (this.dateSelected.getMonth() + 1) : (this.dateSelected.getMonth() + 1)) + '-' + ((this.dateSelected.getDate()) < 10 ? '0' + (this.dateSelected.getDate()) : (this.dateSelected.getDate())) + ' ' + this.timeRangeSelected.time_from + ':00');
    if (selected > now) {
      if (this.appointment) {
        this.updateAppointment();
      } else {
        this.createAppointment();
      }
    } else {
      this.translate.get("err_time_passed").subscribe(value => {
        this.showToast(value);
      });
    }
  }

  updateAppointment() {
    this.translate.get("appointment_updating").subscribe(value => {
      this.presentLoading(value);
    });
    let car = new AppointmentRequest();
    car.time_from = this.timeRangeSelected.time_from;
    car.time_to = this.timeRangeSelected.time_to;
    car.date = this.dateSelected.getFullYear() + '-' + ((this.dateSelected.getMonth() + 1) < 10 ? '0' + (this.dateSelected.getMonth() + 1) : (this.dateSelected.getMonth() + 1)) + '-' + ((this.dateSelected.getDate()) < 10 ? '0' + (this.dateSelected.getDate()) : (this.dateSelected.getDate()));
    let subscription: Subscription = this.service.appointmentUpdate(window.localStorage.getItem(Constants.KEY_TOKEN), this.appointment.id, car).subscribe(res => {
      this.dismissLoading();
      this.translate.get("appointment_updating_success").subscribe(value => {
        this.showToast(value);
      });
      this.app.getRootNav().setRoot(TabsPage);
    }, err => {
      this.translate.get("appointment_updating_fail").subscribe(value => {
        this.showToast(value);
      });
      this.dismissLoading();
      console.log('update', err);
    });
    this.subscriptions.push(subscription);
  }

  getPaymentUrl(orderId: number, phone: string, price: number, client_id: number | string) {
    let baseUrl = this.config.paymentUrl;
    let centPrice = +price * 100;
    return `${baseUrl}?phone=${phone}&amount=${centPrice}&order_id=${orderId}&client_id=${client_id}`;
  }


  showPayment() {
    this.isShowPayment = true;
  }

  closePayment() {
    this.isShowPayment = false;
    this.isPaymentClosed = true;
    this.translate.get("appointment_creating_success").subscribe(value => {
      this.showToast(value);
    });
    this.app.getRootNav().setRoot(TabsPage)
  }

  createAppointment() {
    this.translate.get("appointment_creating").subscribe(value => {
      this.presentLoading(value);
    });
    let car = new AppointmentRequest();
    car.address_id = this.address.id;
    car.provider_id = Number(this.profile.id);
    car.category_id = this.category_id;
    car.time_from = this.timeRangeSelected.time_from;
    car.time_to = this.timeRangeSelected.time_to;
    car.notes = this.notes;
    car.date = this.dateSelected.getFullYear() + '-' + ((this.dateSelected.getMonth() + 1) < 10 ? '0' + (this.dateSelected.getMonth() + 1) : (this.dateSelected.getMonth() + 1)) + '-' + ((this.dateSelected.getDate()) < 10 ? '0' + (this.dateSelected.getDate()) : (this.dateSelected.getDate()));
    let subscription: Subscription = this.service.createAppointment(window.localStorage.getItem(Constants.KEY_TOKEN), car).subscribe((res: any) => {
      this.dismissLoading();
      let currUser: User = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
      this.paymentUrl = this.getPaymentUrl(res.id, currUser.mobile_number, this.profile.price, this.profile.user_id);
      // this.translate.get("appointment_creating_success").subscribe(value => {
      //   this.showToast(value);
      // });
      this.showPayment();
      // this.app.getRootNav().setRoot(TabsPage);
    }, err => {
      this.translate.get("appointment_creating_fail").subscribe(value => {
        this.showToast(value);
      });
      this.dismissLoading();
      console.log('book', err);
    });
    this.subscriptions.push(subscription);
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
