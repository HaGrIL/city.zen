import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MyNotification } from '../../models/notifications.models';
import { Constants } from '../../models/constants.models';

//import { ListofplumberPage } from '../listofplumber/listofplumber';
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage {
  private notifications: Array<MyNotification>;

  constructor(public navCtrl: NavController) {
    console.log("NotificationPage");
  }

  ionViewDidEnter() {
    this.notifications = JSON.parse(window.localStorage.getItem(Constants.KEY_NOTIFICATIONS));
    if (this.notifications == null) this.notifications = new Array<MyNotification>();
  }
}
