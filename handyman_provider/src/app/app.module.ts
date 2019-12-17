import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AboutusPage } from '../pages/aboutus/aboutus';
import { AccountPage } from '../pages/account/account';
import { AllreviewPage } from '../pages/allreview/allreview';
import { BookingPage } from '../pages/booking/booking';
import { ChatscreenPage } from '../pages/chatscreen/chatscreen';
import { ChatslistPage } from '../pages/chatslist/chatslist';
import { ConatctusPage } from '../pages/conatctus/conatctus';
import { FaqsPage } from '../pages/faqs/faqs';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { MyprofilePage } from '../pages/myprofile/myprofile';
import { NotificationsPage } from '../pages/notifications/notifications';
import { PackagesPage } from '../pages/packages/packages';
import { PrivacyPage } from '../pages/privacy/privacy';
import { PurchaseplanPage } from '../pages/purchaseplan/purchaseplan';
import { RequestsPage } from '../pages/requests/requests';
import { ReviewPage } from '../pages/review/review';
import { SelectservicePage } from '../pages/selectservice/selectservice';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Connectivity } from '../providers/connectivity-service';
import { GoogleMaps } from '../providers/google-maps';
import { APP_CONFIG, BaseAppConfig } from './app.config';
import { GooglePlus } from '@ionic-native/google-plus';
//import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OtpPage } from '../pages/otp/otp';
import { SelectareaPage } from '../pages/selectarea/selectarea';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SQLite } from '@ionic-native/sqlite';
import { OneSignal } from '@ionic-native/onesignal';
import { CallNumber } from '@ionic-native/call-number';
import { Globalization } from '@ionic-native/globalization';
import { TranslateService } from '../../node_modules/@ngx-translate/core';
import { Stripe } from '@ionic-native/stripe';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { ManagelanguagePage } from '../pages/managelanguage/managelanguage';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    AboutusPage,
    AccountPage,
    AllreviewPage,
    BookingPage,
    ChatscreenPage,
    ChatslistPage,
    ConatctusPage,
    FaqsPage,
    ForgotpasswordPage,
    MyprofilePage,
    NotificationsPage,
    PackagesPage,
    PrivacyPage,
    PurchaseplanPage,
    RequestsPage,
    ReviewPage,
    SelectservicePage,
    SigninPage,
    SignupPage,
    TabsPage,
    OtpPage,
    SelectareaPage,
    ManagelanguagePage
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
    AboutusPage,
    AccountPage,
    AllreviewPage,
    BookingPage,
    ChatscreenPage,
    ChatslistPage,
    ConatctusPage,
    FaqsPage,
    ForgotpasswordPage,
    MyprofilePage,
    NotificationsPage,
    PackagesPage,
    PrivacyPage,
    PurchaseplanPage,
    RequestsPage,
    ReviewPage,
    SelectservicePage,
    SigninPage,
    SignupPage,
    TabsPage,
    OtpPage,
    SelectareaPage,
    ManagelanguagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Network,
    Connectivity,
    GoogleMaps,
    GooglePlus,
    LocalNotifications,
    SQLite,
    OneSignal,
    CallNumber,
    TranslateService,
    Globalization,
    Stripe,
    Diagnostic,
    LocationAccuracy,
    { provide: APP_CONFIG, useValue: BaseAppConfig },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
