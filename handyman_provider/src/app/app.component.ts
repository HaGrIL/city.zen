import { Component, Inject, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SigninPage } from '../pages/signin/signin';
import { ClientService } from '../providers/client.service';
import { APP_CONFIG, AppConfig } from './app.config';
import { Constants } from '../models/constants.models';
import firebase from 'firebase';
import { TabsPage } from '../pages/tabs/tabs';
import { Message } from '../models/message.models';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { User } from '../models/user.models';
import { OneSignal } from '@ionic-native/onesignal';
import { MyNotification } from '../models/notifications.models';
import { Globalization } from '@ionic-native/globalization';
import { TranslateService } from '../../node_modules/@ngx-translate/core';

@Component({
  templateUrl: 'app.html',
  providers: [ClientService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  private userMe: User;
  private db: SQLiteObject;
  rtlSide: string = "left";

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private platform: Platform,
    private oneSignal: OneSignal, private statusBar: StatusBar, private splashScreen: SplashScreen,
    clientService: ClientService, events: Events, private sqlite: SQLite, private globalization: Globalization, public translate: TranslateService) {
    // window.localStorage.setItem(Constants.KEY_LOCATION, "{\"name\":\"Laxmi Nagar, New Delhi, Delhi, India\",\"lat\":28.636736,\"lng\":77.27480700000001}");
    // window.localStorage.setItem(Constants.KEY_USER, "{\"id\":2,\"name\":\"Test Provider\",\"email\":\"test@pro.com\",\"image_url\":\"https://firebasestorage.googleapis.com/v0/b/handyman-47f5a.appspot.com/o/Sat%20Feb%2009%202019%2016%3A43%3A59%20GMT%2B0530%20(India%20Standard%20Time)?alt=media&token=6dfe1aa6-7e80-4052-9ffa-09ff140196c9\",\"mobile_number\":\"+919999999991\",\"mobile_verified\":0,\"active\":1,\"confirmation_code\":null,\"confirmed\":1,\"fcm_registration_id\":\"660c825e-d5cd-405c-9162-25ad3b808156\",\"created_at\":\"2019-02-09 10:58:48\",\"updated_at\":\"2019-02-09 11:14:02\",\"deleted_at\":null}");
    // window.localStorage.setItem(Constants.KEY_TOKEN, "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQxYThkMWNmYmRjMjhiMTFjY2UwZWIxOTJhOGJlMzUxY2MyY2U2NjE4NzQzZWRlMTA3NjMzZDU4MmFlMDQ3YzhjYjFjNTc3NGQ1NjQ1ZDI0In0.eyJhdWQiOiIxIiwianRpIjoiZDFhOGQxY2ZiZGMyOGIxMWNjZTBlYjE5MmE4YmUzNTFjYzJjZTY2MTg3NDNlZGUxMDc2MzNkNTgyYWUwNDdjOGNiMWM1Nzc0ZDU2NDVkMjQiLCJpYXQiOjE1NDk3MDk5MzYsIm5iZiI6MTU0OTcwOTkzNiwiZXhwIjoxNTgxMjQ1OTM2LCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.uKqQ9-414uKBH9FyV6VCvaCpeEb7u6jdS3Egey-tv8zEa8j_gH0KOpSjY24WuDqTxJFB_5FStywpm2x2XTIisOLv-xvI8o_9B3rbwmOFpDJ56w9dYZPdAXiQd6GithPfW49O0AjrdmnE5SIoFY7r2jkynS38MPoFsAWVvdDwdcQQyy5gTW5gHlNP3EAxePyqiWIip-npakctON8IZZc7eGbmHf7JdCA6blrYZN3va3ezxs79kJ2WkBpkT6xbR2qSfS49G2Ci8ZtMQFPBE9VY9rYcq7ZxIQ8PVvrhGVL-7IEZWH_pYOLZYv51FQGIY-HfyK9r1EG4HPP20t5zoRCafUCdNeMq-F2h3GxyPGVaNBzuDf81Y1sfzYNyuJKkuWVq4Bw4ORCZctCMuqsJcZQZ08LstG4K__38UxYfEEmRDu73f2fMLrd6JEWrbgqkgGyE76UTPDvjDqIRapCcl6SCJULs8n25f180LMvt3kAs67cFi-sJa520CKZ1Ud-HymcAWCZ5hLp0oj7BSYdAiMSCCpxJLzJDd1kDio9EIplETryA9dhJ7trXWYgogBtTAYSMVx4pxVlmQu5jnjiraN764A04Sm6dq311Z6GZayiTYMuIVMUXyjZHX5CJmarc9lLwxPwY5LaZQ-SKXyaErHtOvmSrnL74pdpzBFYOpPV49q0");
    // window.localStorage.setItem(Constants.KEY_PROFILE, "{\"id\":1,\"primary_category_id\":1,\"user_id\":2,\"is_verified\":0,\"document_url\":\"https://firebasestorage.googleapis.com/v0/b/handyman-47f5a.appspot.com/o/Sat%20Feb%2009%202019%2016%3A43%3A19%20GMT%2B0530%20(India%20Standard%20Time)?alt=media&token=27963b27-e5eb-48b9-8c74-28461dad863a\",\"image_url\":null,\"price\":100,\"price_type\":\"hour\",\"address\":\"Shahdara, Delhi, India\",\"longitude\":77.29257710000002,\"latitude\":28.69875679999999,\"about\":\"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\",\"created_at\":\"2019-02-09 10:57:03\",\"updated_at\":\"2019-02-09 11:21:01\",\"ratings\":null,\"primary_category\":{\"id\":1,\"title\":\"Plumber\",\"image_url\":null,\"parent_id\":null,\"created_at\":\"2019-02-09 11:10:34\",\"updated_at\":\"2019-02-09 11:10:34\",\"secondary_image_url\":null},\"subcategories\":[{\"id\":5,\"title\":\"Tap\",\"image_url\":null,\"parent_id\":1,\"created_at\":\"2019-02-09 11:11:30\",\"updated_at\":\"2019-02-09 11:11:30\",\"secondary_image_url\":null,\"pivot\":{\"provider_id\":1,\"category_id\":5}}],\"user\":{\"id\":2,\"name\":\"Test Provider\",\"email\":\"test@pro.com\",\"image_url\":\"https://firebasestorage.googleapis.com/v0/b/handyman-47f5a.appspot.com/o/Sat%20Feb%2009%202019%2016%3A43%3A59%20GMT%2B0530%20(India%20Standard%20Time)?alt=media&token=6dfe1aa6-7e80-4052-9ffa-09ff140196c9\",\"mobile_number\":\"+919999999991\",\"mobile_verified\":0,\"active\":1,\"confirmation_code\":null,\"confirmed\":1,\"fcm_registration_id\":\"660c825e-d5cd-405c-9162-25ad3b808156\",\"created_at\":\"2019-02-09 10:58:48\",\"updated_at\":\"2019-02-09 11:14:02\",\"deleted_at\":null}}");
    this.initializeApp();

    clientService.getSettings().subscribe(res => {
      console.log('setting_setup_success');
      window.localStorage.setItem(Constants.KEY_SETTING, JSON.stringify(res));
    }, err => {
      console.log('setting_setup_error', err);
    });

    events.subscribe('user:login', () => {
      this.registerInboxUpdates();
    });
    events.subscribe('language:selection', (language) => {
      this.globalize(language);
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
      this.splashScreen.hide();
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

  getSideOfCurLang() {
    this.rtlSide = this.platform.dir() === 'rtl' ? "right" : "left";
    return this.rtlSide;
  }

  getSuitableLanguage(language) {
    window.localStorage.setItem("locale", language);
    language = language.substring(0, 2).toLowerCase();
    console.log('check for: ' + language);
    return this.config.availableLanguages.some(x => x.code == language) ? language : 'en';
  }

  markDelivered(msg: Message) {
    msg.delivered = true;
    let chatRef = firebase.database().ref(Constants.REF_CHAT).child(msg.chatId);
    chatRef.child(msg.id).child("delivered").set(true);
    if (this.db) this.db.executeSql('UPDATE message SET delivered=? WHERE id=?', [1, msg.id]).then(res => console.log('updateDeliveryC', res)).catch(e => console.log(e));
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
    console.log("newUserMe", newUserMe);
    if (newUserMe && (!this.userMe || (this.userMe && this.userMe.id != newUserMe.id))) {
      console.log("newUserMeAssigned");
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
