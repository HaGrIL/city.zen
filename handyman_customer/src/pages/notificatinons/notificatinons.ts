import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { MyNotification } from '../../models/notification.models';
import { Constants } from '../../models/constants.models';

@Component({
  selector: 'page-notificatinons',
  templateUrl: 'notificatinons.html'
})
export class NotificatinonsPage {
  private notifications = new Array<MyNotification>();

  constructor(public navCtrl: NavController) {
    console.log("NotificationPage");
  }

  ionViewDidEnter() {
    let notifications = JSON.parse(window.localStorage.getItem(Constants.KEY_NOTIFICATIONS));
    if (notifications) this.notifications = notifications;
  }
}
