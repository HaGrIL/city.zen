import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, Events } from 'ionic-angular';

import { BookingPage } from '../booking/booking';
import { Subscription } from 'rxjs/Subscription';
import { ClientService } from '../../providers/client.service';
import { Constants } from '../../models/constants.models';
import { Appointment } from '../../models/appointment.models';
import { Helper } from '../../models/helper.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
  providers: [ClientService]
})
export class RequestsPage {
  private requests: string = "pending";
  private currency: string;
  private loading: Loading;
  private isLoading: boolean;
  private loadingShown: Boolean = false;
  private pageNo: number = 1;
  private allDone = false;
  private refresher: any;
  private infiniteScroll: any;
  private subscriptions: Array<Subscription> = [];
  private toShow: Array<Appointment> = [];
  private upcoming: Array<Appointment> = [];
  private complete: Array<Appointment> = [];

  constructor(public navCtrl: NavController, private service: ClientService, private events: Events,
    private loadingCtrl: LoadingController, private translate: TranslateService) {
    // this.translate.get('loading_requests').subscribe(value => {
    //   this.presentLoading(value);
    // });
    this.loadRequests();
    this.currency = Helper.getSetting("currency");
  }

  onSegmentChange() {
    setTimeout(() => {
      this.toShow = this.requests == "pending" ? this.upcoming : this.complete;
    }, 100);
  }

  doRefresh(refresher) {
    if (this.isLoading) refresher.complete();
    this.refresher = refresher;
    this.pageNo = 1;
    this.upcoming = new Array();
    this.complete = new Array();
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    let subscription: Subscription = this.service.appointments(window.localStorage.getItem(Constants.KEY_TOKEN), this.pageNo).subscribe(res => {
      let appointments: Array<Appointment> = res.data;
      this.allDone = (!appointments || !appointments.length);
      this.dismissLoading();
      let upcoming = new Array<Appointment>();
      let complete = new Array<Appointment>();
      for (let ap of appointments) {
        ap.statusToShow = ap.status;
        if (ap.statusToShow == "complete") {
          ap.statusToShow = "completed";
        }
        ap.provider.priceToShow = this.currency + ap.provider.price;
        if (ap.status == 'complete' || ap.status == 'rejected' || ap.status == 'cancelled')
          complete.push(ap);
        else
          upcoming.push(ap);
      }
      if (upcoming.length || complete.length) {
        this.upcoming = this.upcoming.concat(upcoming);
        this.complete = this.complete.concat(complete);
        this.onSegmentChange();
      }
      if (this.infiniteScroll) this.infiniteScroll.complete();
      if (this.refresher) this.refresher.complete();
    }, err => {
      console.log('appointments', err);
      this.dismissLoading();
      if (this.infiniteScroll) this.infiniteScroll.complete();
      if (this.refresher) this.refresher.complete();
    });
    this.subscriptions.push(subscription);
  }

  doInfinite(infiniteScroll: any) {
    this.infiniteScroll = infiniteScroll;
    if (!this.allDone) {
      this.pageNo = this.pageNo + 1;
      this.loadRequests();
    } else {
      infiniteScroll.complete();
    }
  }

  ionViewWillLeave() {
    this.events.publish('cango:exit', false);
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dismissLoading();
  }

  ionViewDidEnter() {
    this.events.publish('cango:exit', true);
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

  requestDetail(appointment) {
    this.navCtrl.push(BookingPage, { appointment: appointment });
  }

}
