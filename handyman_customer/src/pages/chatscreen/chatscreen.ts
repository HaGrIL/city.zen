import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { BooknowPage } from '../booknow/booknow';
import { Chat } from '../../models/chat.models';
import { User } from '../../models/user.models';
import { Constants } from '../../models/constants.models';
import * as firebase from 'firebase';
import { Helper } from '../../models/helper.models';
import { Message } from '../../models/message.models';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { OneSignal } from '@ionic-native/onesignal';

@Component({
  selector: 'page-chatscreen',
  templateUrl: 'chatscreen.html'
})
export class ChatscreenPage {
  @ViewChild('content') content: any;
  private chat: Chat;
  private userMe: User;
  private chatChild: string;
  private userPlayerId: string;
  private newMessageText: string;
  private db: SQLiteObject;
  private chatRef: firebase.database.Reference;
  private inboxRef: firebase.database.Reference;
  private chatCreated = false;
  private timeoutTaskId = -1;
  private messages = new Array<Message>();
  private lastMessage: Message;

  constructor(public navCtrl: NavController, navParam: NavParams, sqlite: SQLite, private toastCtrl: ToastController, private oneSignal: OneSignal) {
    this.chat = navParam.get('chat');
    this.userMe = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
    this.chatChild = Helper.getChatChild(String(this.userMe.id), this.chat.chatId)

    sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.db = db;
      db.executeSql('CREATE TABLE IF NOT EXISTS message(id TEXT PRIMARY KEY, chatId TEXT, senderId TEXT, recipientId TEXT, recipientStatus TEXT, recipientImage TEXT, recipientName TEXT, senderStatus TEXT, senderImage TEXT, senderName TEXT, body TEXT, dateTimeStamp TEXT, delivered INT, sent INT)', []).then(res => {
        console.log('ExecutedTABLE', res);
        db.executeSql('SELECT * FROM message WHERE chatId = ?', [this.chatChild]).then(res => {
          this.messages = new Array<Message>();
          for (var i = 0; i < res.rows.length; i++) {
            let msg = new Message();
            msg.fromRow(res.rows.item(i));
            this.messages.push(msg);
          }
          if (this.messages.length) this.lastMessage = this.messages[this.messages.length - 1];
        }).catch(e => console.log(e));
      }).catch(e => {
        console.log(e);
      });
    }).catch(e => { console.log(e); });

    const component = this;
    this.inboxRef = firebase.database().ref(Constants.REF_INBOX);
    this.chatRef = firebase.database().ref(Constants.REF_CHAT).child(this.chatChild);
    this.chatRef.limitToLast(1).on("child_added", function (snapshot, prevChildKey) {
      var newMessage = snapshot.val() as Message;
      if (newMessage) {
        newMessage.timeDiff = Helper.getTimeDiff(new Date(Number(newMessage.dateTimeStamp)));
        component.addMessage(newMessage);
        component.markDelivered(newMessage);
        component.scrollList();
      }
    }, function (error) {
      console.error("child_added", error);
    });

    this.chatRef.on("child_changed",  (snapshot) => {
      var newMessage = snapshot.val() as Message;
      if (newMessage && newMessage.delivered) {
        this.db.executeSql('UPDATE message SET delivered=? WHERE id=?', [1, newMessage.id]).then(res => console.log('updateDeliveryC', res)).catch(e => console.log(e));
        for (let i = component.messages.length - 1; i >= 0; i--) {
          if (newMessage.id == component.messages[i].id) {
            component.messages[i].delivered = true;
            break;
          }
        }
      }
    }, function (error) {
      console.error("child_changed", error);
    });

    firebase.database().ref(Constants.REF_USERS_FCM_IDS).child(this.chat.chatId).once("value", function (snap) {
      component.userPlayerId = snap.val();
    });
  }

  ionViewDidEnter() {
    this.scrollList();
  }

  ionViewWillLeave() {
    if (this.db && this.chatCreated && this.lastMessage) {
      let isMeSender = this.lastMessage.senderId == this.userMe.id;
      this.db.executeSql('UPDATE chat SET isRead=?, chatImage=?, chatName=?, chatStatus=?, lastMessage=?, dateTimeStamp=? WHERE chatId=?',
        [1, isMeSender ? this.lastMessage.recipientImage : this.lastMessage.senderImage, isMeSender ? this.lastMessage.recipientName : this.lastMessage.senderName, isMeSender ? this.lastMessage.recipientStatus : this.lastMessage.senderStatus, this.lastMessage.body, this.lastMessage.dateTimeStamp, this.lastMessage.chatId]).then(res => { console.log('updateC', res); }).catch(e => console.log(e));
    }
  }

  scrollList() {
    this.content.scrollToBottom(300);//300ms animation speed
  }

  notifyMessages(msgs: Array<Message>) {
    let notificationObj = {
      include_player_ids: [this.userPlayerId],
      headings: { en: "New messages" },
      contents: { en: "You have " + msgs.length + " new " + (msgs.length > 1 ? "messages" : "message") },
      data: { msgs: msgs }
    };
    this.oneSignal.postNotification(notificationObj).then(res => console.log(res)).catch(err => console.log(err));
  }

  markDelivered(msg: Message) {
    if (msg.senderId != this.userMe.id) {
      msg.delivered = true;
      this.chatRef.child(msg.id).child("delivered").set(true);
      //TODO: update in local db as well.
    } else {
      if (this.timeoutTaskId != -1)
        clearTimeout(this.timeoutTaskId);
      this.timeoutTaskId = setTimeout(() => {
        let messagesPendingToNotify = new Array<Message>();
        for (let i = this.messages.length - 1; i >= 0; i--) {
          if (this.messages[i].senderId == this.userMe.id && !this.messages[i].delivered) {
            this.db.executeSql('UPDATE message SET delivered=? WHERE id=?', [1, this.messages[i].id]).then(res => console.log('updateDeliveryC', res)).catch(e => console.log(e));
            messagesPendingToNotify.push(this.messages[i]);
            this.messages[i].delivered = true;
          }
        }
        if (messagesPendingToNotify.length && this.userPlayerId) {
          this.notifyMessages(messagesPendingToNotify);
        }
      }, 2000);
    }
  }

  addMessage(msg: Message) {
    this.messages = this.messages.concat(msg);
    if (this.db) {
      this.checkCreateChat(msg);
      this.db.executeSql('INSERT OR IGNORE INTO message VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [msg.id, msg.chatId, msg.senderId, msg.recipientId, msg.recipientStatus, msg.recipientImage, msg.recipientName, msg.senderStatus, msg.senderImage, msg.senderName, msg.body, msg.dateTimeStamp, 0, 1]).then(res => console.log('insertM', res)).catch(e => console.log(e));
    }
    if (this.chat && msg) {
      this.lastMessage = msg;
      let isMeSender = msg.senderId == this.userMe.id;
      this.chat.chatImage = isMeSender ? msg.recipientImage : msg.senderImage;
      this.chat.chatName = isMeSender ? msg.recipientName : msg.senderName;
      this.chat.chatStatus = isMeSender ? msg.recipientStatus : msg.senderStatus;
    }
  }

  checkCreateChat(msg) {
    if (this.chatCreated)
      return;
    this.db.executeSql('INSERT OR IGNORE INTO chat VALUES(?,?,?,?,?,?,?,?,?)',
      [msg.senderId == this.userMe.id ? msg.recipientId : msg.senderId, this.userMe.id, String(new Date().getTime()), msg.body, msg.senderName, msg.senderImage, msg.senderStatus, 0, 0]).then(res => {
        console.log('insertC', res);
        this.chatCreated = true;
      }).catch(e => {
        console.log(e);
        this.chatCreated = false;
      });
  }

  updateMessage(msg: Message) {
    if (this.db) {
      this.db.executeSql('UPDATE message SET recipientStatus=?, recipientImage=?, recipientName=?, senderStatus=?, senderImage=?, senderName=?, delivered=? WHERE id=?',
        [msg.recipientStatus, msg.recipientImage, msg.recipientName, msg.senderStatus, msg.senderImage, msg.senderName, 1, msg.id]).then(res => console.log('updateM', res)).catch(e => console.log(e));
    }
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].id == msg.id) {
        this.messages[i] = msg;
        break;
      }
    }
  }

  send() {
    if (!this.newMessageText || !this.newMessageText.length) {
      this.showToast("Type a message!");
    } else {
      let toSend = new Message();
      toSend.chatId = this.chatChild;
      toSend.body = this.newMessageText;
      toSend.dateTimeStamp = String(new Date().getTime());
      toSend.delivered = false;
      toSend.sent = true;
      toSend.recipientId = this.chat.chatId;
      toSend.recipientImage = this.chat.chatImage;
      toSend.recipientName = this.chat.chatName;
      toSend.recipientStatus = this.chat.chatStatus;
      toSend.senderId = this.userMe.id;
      toSend.senderName = this.userMe.name;
      toSend.senderImage = this.userMe.image_url ? this.userMe.image_url : "assets/imgs/empty_dp.png";
      toSend.senderStatus = this.userMe.email;
      toSend.id = this.chatRef.child(this.chatChild).push().key;

      this.chatRef.child(toSend.id).set(toSend);
      this.inboxRef.child(toSend.recipientId).set(toSend);
      this.newMessageText = '';
    }
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

}