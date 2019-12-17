import { Component, ViewChild, Inject } from '@angular/core';
import { Nav, Platform, AlertController, Events, ModalController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { TabsPage } from '../pages/tabs/tabs';
import { SigninPage } from '../pages/signin/signin';
import { APP_CONFIG, AppConfig } from "./app.config";
import firebase from 'firebase';
import { Constants } from '../models/constants.models';
import { ClientService } from '../providers/client.service';
import { TabsPage } from '../pages/tabs/tabs';
import { User } from '../models/user.models';
import { Message } from '../models/message.models';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { OneSignal } from '@ionic-native/onesignal';
import { Globalization } from '@ionic-native/globalization';
import { TranslateService } from '@ngx-translate/core';
import { MyNotification } from '../models/notification.models';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';

@Component({
  templateUrl: 'app.html',
  providers: [ClientService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  private userMe: User;
  private db: SQLiteObject;
  private showedAlert = false;
  private confirmAlert: any;
  rtlSide: string = "left";


  constructor(@Inject(APP_CONFIG) private config: AppConfig, private platform: Platform,
    events: Events, private oneSignal: OneSignal, private globalization: Globalization, private alertCtrl: AlertController,
    public translate: TranslateService, private statusBar: StatusBar, private splashScreen: SplashScreen,
    private clientService: ClientService, private sqlite: SQLite) {
    this.initializeApp();

    this.refreshSettings();
    events.subscribe('user:login', () => {
      this.registerInboxUpdates();
    });
    events.subscribe('language:selection', (language) => {
      this.globalize(language);
    });
    this.clientService.appointments(window.localStorage.getItem(Constants.KEY_TOKEN), 1).subscribe(appoints => {
      console.log(appoints, 'appoints');
    })
  }

  markDelivered(msg: Message) {
    msg.delivered = true;
    let chatRef = firebase.database().ref(Constants.REF_CHAT).child(msg.chatId);
    chatRef.child(msg.id).child("delivered").set(true);
    if (this.db) this.db.executeSql('UPDATE message SET delivered=? WHERE id=?', [1, msg.id]).then(res => console.log('updateDeliveryC', res)).catch(e => console.log(e));
  }

  getSuitableLanguage(language) {
    window.localStorage.setItem("locale", language);
    language = language.substring(0, 2).toLowerCase();
    console.log('check for: ' + language);
    return this.config.availableLanguages.some(x => x.code == language) ? language : 'en';
  }

  checkChatAndMessage(msg: Message) {
    if (this.db && this.userMe) {
      let isMeSender = msg.senderId == this.userMe.id;
      this.db.executeSql('INSERT OR IGNORE INTO chat VALUES(?,?,?,?,?,?,?,?,?)',
        [isMeSender ? msg.recipientId : msg.senderId, this.userMe.id, String(new Date().getTime()), msg.body, isMeSender ? msg.recipientName : msg.senderName, isMeSender ? msg.recipientImage : msg.senderImage, isMeSender ? msg.recipientStatus : msg.senderStatus, 0, 0]).then(res => {
          console.log('insertC', res);
          this.db.executeSql('INSERT OR IGNORE INTO message VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [msg.id, msg.chatId, msg.senderId, msg.recipientId, msg.recipientStatus, msg.recipientImage, msg.recipientName, msg.senderStatus, msg.senderImage, msg.senderName, msg.body, msg.dateTimeStamp, 1, 1])
            .then(res => console.log('insertM', res))
            .catch(e => console.log(e));
        }).catch(e => console.log(e));

      this.db.executeSql('UPDATE chat SET isRead=?, chatImage=?, chatName=?, chatStatus=?, lastMessage=?, dateTimeStamp=? WHERE chatId=?',
        [0, isMeSender ? msg.recipientImage : msg.senderImage, isMeSender ? msg.recipientName : msg.senderName, isMeSender ? msg.recipientName : msg.senderStatus, msg.body, msg.dateTimeStamp, isMeSender ? msg.recipientId : msg.senderId])
        .then(res => { console.log('updateC', res); })
        .catch(e => console.log(e));
    }
  }

  registerInboxUpdates() {
    let inboxRef = firebase.database().ref(Constants.REF_INBOX);
    let newUserMe: User = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
    if (newUserMe && (!this.userMe || (this.userMe && this.userMe.id != newUserMe.id))) {
      this.userMe = newUserMe;
      const component = this;
      inboxRef.child(this.userMe.id).on("value", function (snapshot) {
        let inMsg = snapshot.val() as Message;
        console.log("inMsg", inMsg);
        if (inMsg) {
          component.markDelivered(inMsg);
          component.checkChatAndMessage(inMsg);
        }
      }, function (errorObject) {
        console.log("The read failed", errorObject);
      });
    }
    if (!newUserMe) inboxRef.off();
  }

  refreshSettings() {
    this.clientService.getSettings().subscribe(res => {
      console.log('setting_setup_success', res);
      window.localStorage.setItem(Constants.KEY_SETTING, JSON.stringify(res));
    }, err => {
      console.log('setting_setup_error', err);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      firebase.initializeApp({
        apiKey: this.config.firebaseConfig.apiKey,
        authDomain: this.config.firebaseConfig.authDomain,
        databaseURL: this.config.firebaseConfig.databaseURL,
        projectId: this.config.firebaseConfig.projectId,
        storageBucket: this.config.firebaseConfig.storageBucket,
        messagingSenderId: this.config.firebaseConfig.messagingSenderId
      });
      this.statusBar.styleDefault();
      this.userMe = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
      this.nav.setRoot(this.userMe ? TabsPage : SigninPage);
      this.registerInboxUpdates();
      if (this.platform.is('cordova')) {
        this.initOneSignal();
      }
      let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
      this.globalize(defaultLang);

      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.db = db;
        db.executeSql('CREATE TABLE IF NOT EXISTS chat(chatId TEXT PRIMARY KEY, myId TEXT, dateTimeStamp TEXT, lastMessage TEXT, chatName TEXT, chatImage TEXT, chatStatus TEXT, isGroup INT, isRead INT)', []).then(res => {
          console.log('ExecutedTABLE', res);
          db.executeSql('CREATE TABLE IF NOT EXISTS message(id TEXT PRIMARY KEY, chatId TEXT, senderId TEXT, recipientId TEXT, recipientStatus TEXT, recipientImage TEXT, recipientName TEXT, senderStatus TEXT, senderImage TEXT, senderName TEXT, body TEXT, dateTimeStamp TEXT, delivered INT, sent INT)', []).then(res => {
            console.log('ExecutedTABLE', res);
          }).catch(e => {
            console.log(e);
          });
        }).catch(e => {
          console.log(e);
        });
      }).catch(e => { console.log(e); });
    });
  }

  confirmExitApp() {
    this.translate.get(['exit_title', 'exit_message', 'no', 'yes']).subscribe(text => {
      this.showedAlert = true;
      this.confirmAlert = this.alertCtrl.create({
        title: text['exit_title'],
        message: text['exit_message'],
        buttons: [
          {
            text: text['no'],
            handler: () => {
              this.showedAlert = false;
              return;
            }
          },
          {
            text: text['yes'],
            handler: () => {
              this.platform.exitApp();
            }
          }
        ]
      });
      this.confirmAlert.present();
    });
  }

  globalize(languagePriority) {
    console.log("globalaizing...");
    if (this.platform.is('cordova')) {
      console.log("cordova detected");
      if (languagePriority && languagePriority.length) {
        console.log(languagePriority);
        this.translate.use(languagePriority);
        this.setDirectionAccordingly(languagePriority);
      } else {
        this.globalization.getPreferredLanguage().then(result => {
          console.log("language detected:----" + JSON.stringify(result));
          let suitableLang = this.getSuitableLanguage(result.value);
          console.log(suitableLang);
          this.translate.use(suitableLang);
          this.setDirectionAccordingly(suitableLang);
          window.localStorage.setItem(Constants.KEY_DEFAULT_LANGUAGE, suitableLang);
        }).catch(e => {
          console.log(e);
          this.translate.use(languagePriority && languagePriority.length ? languagePriority : 'en');
          this.setDirectionAccordingly(languagePriority && languagePriority.length ? languagePriority : 'en');
        });
      }
    } else {
      console.log("cordova not detected");
      this.translate.use(languagePriority && languagePriority.length ? languagePriority : 'en');
      this.setDirectionAccordingly(languagePriority && languagePriority.length ? languagePriority : 'en');
      // this.translate.use('ar');
      // this.setDirectionAccordingly('ar');
    }
  }

  setDirectionAccordingly(lang: string) {
    switch (lang) {
      case 'ar': {
        this.platform.setDir('ltr', false);
        this.platform.setDir('rtl', true);
        this.rtlSide = "right";
        break;
      }
      default: {
        this.platform.setDir('rtl', false);
        this.platform.setDir('ltr', true);
        this.rtlSide = "left";
        break;
      }
    }
    // this.translate.use('ar');
    // this.platform.setDir('ltr', false);
    // this.platform.setDir('rtl', true);
  }

  initOneSignal() {
    if (this.config.oneSignalAppId && this.config.oneSignalAppId.length && this.config.oneSignalGPSenderId && this.config.oneSignalGPSenderId.length) {
      this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
      this.oneSignal.handleNotificationReceived().subscribe((data) => {
        console.log(data);
        if (data && data.payload && data.payload.additionalData && data.payload.additionalData.msgs) {
          let inMsgs: Array<Message> = data.payload.additionalData.msgs;
          for (let msg of inMsgs) {
            this.markDelivered(msg);
            this.checkChatAndMessage(msg);
          }
        } else {
          let notifications: Array<MyNotification> = JSON.parse(window.localStorage.getItem(Constants.KEY_NOTIFICATIONS));
          if (!notifications) notifications = new Array<MyNotification>();
          notifications.push(new MyNotification(data.payload.title, data.payload.body, this.formatDate(new Date())));
          window.localStorage.setItem(Constants.KEY_NOTIFICATIONS, JSON.stringify(notifications));
        }
        let noti_ids_processed: Array<string> = JSON.parse(window.localStorage.getItem("noti_ids_processed"));
        if (!noti_ids_processed) noti_ids_processed = new Array<string>();
        noti_ids_processed.push(data.payload.notificationID);
        window.localStorage.setItem("noti_ids_processed", JSON.stringify(noti_ids_processed));
      });
      this.oneSignal.handleNotificationOpened().subscribe((data) => {
        let noti_ids_processed: Array<string> = JSON.parse(window.localStorage.getItem("noti_ids_processed"));
        if (!noti_ids_processed) noti_ids_processed = new Array<string>();
        let index = noti_ids_processed.indexOf(data.notification.payload.notificationID);
        if (index == -1) {
          if (data && data.notification.payload && data.notification.payload.additionalData && data.notification.payload.additionalData.msgs) {
            let inMsgs: Array<Message> = data.notification.payload.additionalData.msgs;
            for (let msg of inMsgs) {
              this.markDelivered(msg);
              this.checkChatAndMessage(msg);
            }
          } else {
            let notifications: Array<MyNotification> = JSON.parse(window.localStorage.getItem(Constants.KEY_NOTIFICATIONS));
            if (!notifications) notifications = new Array<MyNotification>();
            notifications.push(new MyNotification(data.notification.payload.title, data.notification.payload.body, this.formatDate(new Date())));
            window.localStorage.setItem(Constants.KEY_NOTIFICATIONS, JSON.stringify(notifications));
          }
        } else {
          noti_ids_processed.splice(index, 1);
          window.localStorage.setItem("noti_ids_processed", JSON.stringify(noti_ids_processed));
        }
      });
      this.oneSignal.endInit();
    }
  }

  private formatDate(date: Date): string {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }


}
