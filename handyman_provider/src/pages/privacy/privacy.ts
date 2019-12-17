import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { APP_CONFIG, AppConfig } from '../../app/app.config';

//import { ListofplumberPage } from '../listofplumber/listofplumber';
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html'
})
export class PrivacyPage {
  private toShow = "";
  private heading = "";

  constructor(@Inject(APP_CONFIG) private config: AppConfig, public navCtrl: NavController, navParam: NavParams) {
    this.toShow = navParam.get("toShow");
    this.heading = navParam.get("heading");
  }
}
