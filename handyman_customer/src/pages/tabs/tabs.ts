import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { RequestsPage } from '../requests/requests';
import { NotificatinonsPage } from '../notificatinons/notificatinons';
import { HomePage } from '../home/home';
import { AccountPage } from '../account/account';
import { ChatPage } from '../chat/chat';
import { Tabs } from 'ionic-angular';
import firebase from 'firebase';
import { OneSignal } from '@ionic-native/onesignal';
import { Constants } from '../../models/constants.models';
import { User } from '../../models/user.models';
import { ClientService } from '../../providers/client.service';

@Component({
  templateUrl: 'tabs.html',
  providers: [ClientService]
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = RequestsPage;
  tab2Root = NotificatinonsPage;
  tab3Root = HomePage;
  tab4Root = AccountPage;
  tab5Root = ChatPage;

  constructor(oneSignal: OneSignal, service: ClientService) {
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
  }

}
