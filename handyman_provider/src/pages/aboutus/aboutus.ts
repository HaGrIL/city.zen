import { Component, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { APP_CONFIG, AppConfig } from '../../app/app.config';
import { Setting } from '../../models/setting.models';
import { Constants } from '../../models/constants.models';
import { Helper } from '../../models/helper.models';

 //import { ListofplumberPage } from '../listofplumber/listofplumber';
@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html'
})
export class AboutusPage {
  private aboutUs = "";

  constructor(@Inject(APP_CONFIG) private config: AppConfig, public navCtrl: NavController) {
    this.aboutUs = Helper.getSetting("about_us");
  }
}
