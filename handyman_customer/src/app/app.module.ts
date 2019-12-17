import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { BookingPage } from '../pages/booking/booking';
import { BooknowPage } from '../pages/booknow/booknow';
import { CategoryPage } from '../pages/category/category';
import { ChatPage } from '../pages/chat/chat';
import { ChatscreenPage } from '../pages/chatscreen/chatscreen';
import { ContactPage } from '../pages/contact/contact';
import { FaqsPage } from '../pages/faqs/faqs';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { HomePage } from '../pages/home/home';
import { ListofplumberPage } from '../pages/listofplumber/listofplumber';
import { ManageaddressPage } from '../pages/manageaddress/manageaddress';
import { NotificatinonsPage } from '../pages/notificatinons/notificatinons';
import { PrivacyPage } from '../pages/privacy/privacy';
import { PlumberprofilePage } from '../pages/plumberprofile/plumberprofile';
import { RequestsPage } from '../pages/requests/requests';
import { SignupPage } from '../pages/signup/signup';
import { SigninPage } from '../pages/signin/signin';
import { TabsPage } from '../pages/tabs/tabs';
import { OtpPage } from '../pages/otp/otp';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook } from '@ionic-native/facebook'
import { GooglePlus } from '@ionic-native/google-plus';
import { APP_CONFIG, BaseAppConfig } from "./app.config";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RatePage } from '../pages/rate/rate';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Connectivity } from '../providers/connectivity-service';
import { GoogleMaps } from '../providers/google-maps';
import { SelectareaPage } from '../pages/selectarea/selectarea';
import { SQLite } from '@ionic-native/sqlite';
import { OneSignal } from '@ionic-native/onesignal';
import { AddAddressPage } from '../pages/addaddress/addaddress';
import { CallNumber } from '@ionic-native/call-number';
import { Globalization } from '@ionic-native/globalization';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { TrackPage } from '../pages/track/track';
import { ManagelanguagePage } from '../pages/managelanguage/managelanguage';
import { PayPal  } from '@ionic-native/paypal/ngx';
import {SafePipe} from "../pages/booknow/url-satinaizer.pipe";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AccountPage,
    BookingPage,
    BooknowPage,
    CategoryPage,
    ChatPage,
    ChatscreenPage,
    ContactPage,
    FaqsPage,
    ForgotpasswordPage,
    HomePage,
    ListofplumberPage,
    ManageaddressPage,
    NotificatinonsPage,
    PrivacyPage,
    PlumberprofilePage,
    RequestsPage,
    SignupPage,
    SigninPage,
    TabsPage,
    OtpPage,
    RatePage,
    SelectareaPage,
    AddAddressPage,
    TrackPage,
    ManagelanguagePage,
    SafePipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AccountPage,
    BookingPage,
    BooknowPage,
    CategoryPage,
    ChatPage,
    ChatscreenPage,
    ContactPage,
    FaqsPage,
    ForgotpasswordPage,
    HomePage,
    ListofplumberPage,
    ManageaddressPage,
    NotificatinonsPage,
    PrivacyPage,
    PlumberprofilePage,
    RequestsPage,
    SignupPage,
    SigninPage,
    TabsPage,
    OtpPage,
    RatePage,
    SelectareaPage,
    AddAddressPage,
    TrackPage,
    ManagelanguagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Network,
    Connectivity,
    GoogleMaps,
    Facebook, GooglePlus,
    SQLite,
    OneSignal,
    CallNumber,
    TranslateService,
    Globalization,
    Diagnostic,
    LocationAccuracy,
    PayPal,
    { provide: APP_CONFIG, useValue: BaseAppConfig },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
