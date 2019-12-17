import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';

import { RequestsPage } from '../requests/requests';
import { NotificationsPage } from '../notifications/notifications';
import { ReviewPage } from '../review/review';
import { AccountPage } from '../account/account';
import { ChatslistPage } from '../chatslist/chatslist';
import { Tabs, NavController } from 'ionic-angular';
import { Constants } from '../../models/constants.models';
import { MyprofilePage } from '../myprofile/myprofile';
import firebase from 'firebase';
import { OneSignal } from '@ionic-native/onesignal';
import { User } from '../../models/user.models';
import { ClientService } from '../../providers/client.service';
import { Profile } from '../../models/profile.models';

@Component({
  templateUrl: 'tabs.html',
  providers: [ClientService]
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = RequestsPage;
  tab2Root = NotificationsPage;
  tab3Root = ReviewPage;
  tab4Root = AccountPage;
  tab5Root = ChatslistPage;

  constructor(oneSignal: OneSignal, private navCtrl: NavController, service: ClientService) {
    let userMe: User = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
    oneSignal.getIds().then((id) => {
      if (id && id.userId) {
        firebase.database().ref(Constants.REF_USERS_FCM_IDS).child(userMe.id).set(id.userId);
        service.updateUser(window.localStorage.getItem(Constants.KEY_TOKEN), { fcm_registration_id: id.userId }).subscribe(res => {
          console.log(res);
        }, err => {
          console.log('update_user', err);
        });
      }
    });
  }

  ionViewDidEnter() {
    this.tabRef.select(2);
    setTimeout(() => {
      let profile: Profile = JSON.parse(window.localStorage.getItem(Constants.KEY_PROFILE));
      if (!profile || !profile.primary_category) {
        // this.navCtrl.push(MyprofilePage, { create_edit: true });
      }
    }, 1000);
  }
}
