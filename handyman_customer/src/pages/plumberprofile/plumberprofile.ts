import { Component } from '@angular/core';
import { NavController, Loading, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { BooknowPage } from '../booknow/booknow';
import { ChatscreenPage } from '../chatscreen/chatscreen';
import { ClientService } from '../../providers/client.service';
import { Subscription } from 'rxjs/Subscription';
import { ProviderProfile } from '../../models/provider-profile.models';
import { Constants } from '../../models/constants.models';
import { Chat } from '../../models/chat.models';
import { User } from '../../models/user.models';
import { ManageaddressPage } from '../manageaddress/manageaddress';
import { Review } from '../../models/review.models';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-plumberprofile',
  templateUrl: 'plumberprofile.html',
  providers: [ClientService]
})
export class PlumberprofilePage {
  plumber: string = "about";
  private loading: Loading;
  private loadingShown = false;
  private profile: ProviderProfile;
  private category_id: number;
  private reviews: Array<Review> = [];
  private subscriptions: Array<Subscription> = [];

  constructor(public navCtrl: NavController, params: NavParams, private service: ClientService,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController, private callNumber: CallNumber) {
    this.profile = params.get("profile");
    this.category_id = params.get("category_id");
    this.loadReviews();
  }

  loadReviews() {
    let subscription: Subscription = this.service.providerReviews(window.localStorage.getItem(Constants.KEY_TOKEN), String(this.profile.id)).subscribe(res => {
      let reviews: Array<Review> = res.data;
      this.reviews = this.reviews.concat(reviews);
    }, err => {
      console.log('review_list', err);
    });
    this.subscriptions.push(subscription);
  }

  booknow() {
    this.navCtrl.push(ManageaddressPage, { profile: this.profile, category_id: this.category_id });
  }

  callProvider() {
    this.callNumber.callNumber(this.profile.user.mobile_number, true).then(res => console.log('Launched dialer!', res)).catch(err => console.log('Error launching dialer', err));
  }

  chatscreen() {
    let newUserMe: User = JSON.parse(window.localStorage.getItem(Constants.KEY_USER));
    let chat = new Chat();
    chat.chatId = this.profile.user.id;
    chat.chatImage = this.profile.user.image_url;
    chat.chatName = this.profile.user.name;
    chat.chatStatus = this.profile.primary_category.title;
    chat.myId = newUserMe.id;
    this.navCtrl.push(ChatscreenPage, { chat: chat });
  }

}
