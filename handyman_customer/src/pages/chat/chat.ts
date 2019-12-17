import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ChatscreenPage } from '../chatscreen/chatscreen';
import { Chat } from '../../models/chat.models';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { User } from '../../models/user.models';
import { Constants } from '../../models/constants.models';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  private chats = new Array<Chat>();
  private loadedOnce = true;
  private db: SQLiteObject;
  private userMe: User;

  constructor(public navCtrl: NavController, sqlite: SQLite) {
    this.userMe = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
    sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.db = db;
      db.executeSql('CREATE TABLE IF NOT EXISTS chat(chatId TEXT PRIMARY KEY, myId TEXT, dateTimeStamp TEXT, lastMessage TEXT, chatName TEXT, chatImage TEXT, chatStatus TEXT, isGroup INT, isRead INT)', []).then(res => {
        console.log('ExecutedTABLE', res);
        db.executeSql('SELECT * FROM chat WHERE myId = ? AND isGroup = ? ORDER BY dateTimeStamp DESC', [this.userMe.id, 0]).then(res => {
          this.chats = new Array<Chat>();
          for (var i = 0; i < res.rows.length; i++) {
            let chat = new Chat();
            chat.fromRow(res.rows.item(i));
            this.chats.push(chat);
          }
          this.loadedOnce = true;
        }).catch(e => console.log(e));
      }).catch(e => {
        console.log(e);
      });
    }).catch(e => { console.log(e); });
  }

  ionViewDidEnter() {
    if (this.db && !this.loadedOnce) {
      this.db.executeSql('SELECT * FROM chat WHERE myId = ? AND isGroup = ? ORDER BY dateTimeStamp DESC', [this.userMe.id, 0]).then(res => {
        let chats = new Array<Chat>();
        for (var i = 0; i < res.rows.length; i++) {
          let chat = new Chat();
          chat.fromRow(res.rows.item(i));
          chats.push(chat);
        }
        this.chats = chats;
      }).catch(e => console.log(e));
    }
    if (this.loadedOnce) this.loadedOnce = false;
  }

  chatscreen(chat) {
    this.navCtrl.push(ChatscreenPage, { chat: chat });
  }

}
