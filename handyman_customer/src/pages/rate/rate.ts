import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Loading, App } from 'ionic-angular';
import { Appointment } from '../../models/appointment.models';
import { Subscription } from 'rxjs/Subscription';
import { ClientService } from '../../providers/client.service';
import { Constants } from '../../models/constants.models';
import { RateRequest } from '../../models/rate-request.models';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-rate',
  templateUrl: 'rate.html',
  providers: [ClientService]
})
export class RatePage {
  private appointment: Appointment;
  private loading: Loading;
  private loadingShown = false;
  private rateRequest = new RateRequest();
  private subscriptions: Array<Subscription> = [];

  constructor(public navCtrl: NavController, navParam: NavParams, private service: ClientService,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController, private app: App) {
    this.appointment = navParam.get("appointment");
    this.rateRequest.rating = 3;
  }

  setRating(rating) {
    this.rateRequest.rating = rating;
  }

  submitRating() {
    if (!this.rateRequest.review || !this.rateRequest.review.length) {
      this.showToast("Write a short review.");
    } else {
      this.presentLoading("Submitting review");
      let subscription: Subscription = this.service.rateProvider(window.localStorage.getItem(Constants.KEY_TOKEN), this.appointment.provider_id, this.rateRequest).subscribe(res => {
        console.log(res);
        window.localStorage.setItem("rated" + this.appointment.id, "done");
        this.dismissLoading();
        this.showToast("Review submitted");
        this.app.getRootNav().setRoot(TabsPage);
      }, err => {
        console.log('submit_rating', err);
        this.dismissLoading();
      });
      this.subscriptions.push(subscription);
    }
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
