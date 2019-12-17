webpackJsonp([0],{

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OtpPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_firebase__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var OtpPage = /** @class */ (function () {
    function OtpPage(params, navCtrl, platform, alertCtrl, loadingCtrl, app, translate, toastCtrl, firebase, clientService, events) {
        this.params = params;
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.app = app;
        this.translate = translate;
        this.toastCtrl = toastCtrl;
        this.firebase = firebase;
        this.clientService = clientService;
        this.events = events;
        this.loadingShown = false;
        this.captchanotvarified = true;
        this.buttonDisabled = true;
        this.otp = '';
        this.captchaVerified = false;
        this.minutes = 0;
        this.seconds = 0;
        this.totalSeconds = 0;
        this.intervalCalled = false;
        this.resendCode = false;
        this.otpNotSent = true;
        this.phoneNumberFull = params.get('phoneNumberFull');
    }
    OtpPage.prototype.ionViewDidEnter = function () {
        if (!(this.platform.is('cordova'))) {
            this.makeCaptcha();
        }
        this.sendOTP();
    };
    OtpPage.prototype.loginUser = function (token) {
        var _this = this;
        this.translate.get('just_moment').subscribe(function (value) {
            _this.presentLoading(value);
        });
        this.clientService.login({ token: token, role: "customer" }).subscribe(function (res) {
            _this.dismissLoading();
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].KEY_USER, JSON.stringify(res.user));
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].KEY_TOKEN, res.token);
            _this.events.publish('user:login');
            _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_2__tabs_tabs__["a" /* TabsPage */]);
        }, function (err) {
            console.log(err);
            _this.dismissLoading();
            _this.presentErrorAlert('Something went wrong');
        });
    };
    OtpPage.prototype.getUserToken = function (user) {
        var _this = this;
        user.getIdToken(false).then(function (res) {
            console.log('user_token_success', res);
            _this.loginUser(res);
        }).catch(function (err) {
            console.log('user_token_failure', err);
        });
    };
    OtpPage.prototype.sendOTP = function () {
        this.resendCode = false;
        this.otpNotSent = true;
        if (this.platform.is('cordova')) {
            this.sendOtpPhone(this.phoneNumberFull);
        }
        else {
            this.sendOtpBrowser(this.phoneNumberFull);
        }
        if (this.intervalCalled) {
            clearInterval(this.timer);
        }
    };
    OtpPage.prototype.createTimer = function () {
        this.intervalCalled = true;
        this.totalSeconds--;
        if (this.totalSeconds == 0) {
            this.otpNotSent = true;
            this.resendCode = true;
            clearInterval(this.timer);
        }
        else {
            this.seconds = (this.totalSeconds % 60);
            if (this.totalSeconds >= this.seconds) {
                this.minutes = (this.totalSeconds - this.seconds) / 60;
            }
            else {
                this.minutes = 0;
            }
        }
    };
    OtpPage.prototype.createInterval = function () {
        var _this = this;
        this.totalSeconds = 120;
        this.createTimer();
        this.timer = setInterval(function () {
            _this.createTimer();
        }, 1000);
    };
    OtpPage.prototype.sendOtpPhone = function (phone) {
        var _this = this;
        this.translate.get('sending_otp').subscribe(function (value) {
            _this.presentLoading(value);
        });
        this.firebase.verifyPhoneNumber(phone, 60).then(function (credential) {
            console.log("otp_send_success", credential);
            _this.verfificationId = credential.verificationId;
            if (_this.platform.is('ios')) {
                _this.verfificationId = credential;
            }
            _this.translate.get('sending_otp_success').subscribe(function (value) {
                _this.showToast(value);
            });
            _this.otpNotSent = false;
            _this.dismissLoading();
            _this.createInterval();
        }).catch(function (error) {
            console.log("otp_send_fail", error);
            _this.otpNotSent = true;
            _this.resendCode = true;
            _this.dismissLoading();
            _this.translate.get('otp_send_fail').subscribe(function (value) {
                _this.showToast(value);
            });
            // if (error.message) {
            //   this.showToast(error.message);
            // } else {
            //   this.translate.get('otp_send_fail').subscribe(value => {
            //     this.showToast(value);
            //   });
            // }
        });
    };
    OtpPage.prototype.sendOtpBrowser = function (phone) {
        var component = this;
        this.dismissLoading();
        this.presentLoading("Sending otp");
        __WEBPACK_IMPORTED_MODULE_3_firebase_app__["auth"]().signInWithPhoneNumber(phone, this.recaptchaVerifier).then(function (confirmationResult) {
            console.log("otp_send_success", confirmationResult);
            component.otpNotSent = false;
            component.result = confirmationResult;
            component.dismissLoading();
            component.showToast("OTP Sent");
            if (component.intervalCalled) {
                clearInterval(component.timer);
            }
            component.createInterval();
        }).catch(function (error) {
            console.log("otp_send_fail", error);
            component.resendCode = true;
            component.dismissLoading();
            if (error.message) {
                component.showToast(error.message);
            }
            else {
                component.showToast("OTP Sending failed");
            }
        });
    };
    OtpPage.prototype.verify = function () {
        this.otpNotSent = true;
        if (this.platform.is('cordova')) {
            this.verifyOtpPhone();
        }
        else {
            this.verifyOtpBrowser();
        }
    };
    OtpPage.prototype.verifyOtpPhone = function () {
        var _this = this;
        console.log(this.verfificationId, this.otp, 'this.verfificationId, this.otp');
        var credential = __WEBPACK_IMPORTED_MODULE_3_firebase_app__["auth"].PhoneAuthProvider.credential(this.verfificationId, this.otp);
        this.translate.get('verifying_otp').subscribe(function (value) {
            _this.presentLoading(value);
        });
        __WEBPACK_IMPORTED_MODULE_3_firebase_app__["auth"]().signInAndRetrieveDataWithCredential(credential).then(function (info) {
            console.log('otp_verify_success', info);
            _this.dismissLoading();
            _this.translate.get('verifying_otp_success').subscribe(function (value) {
                _this.showToast(value);
            });
            _this.getUserToken(info.user);
        }, function (error) {
            console.log('otp_verify_fail', error);
            _this.translate.get('verifying_otp_fail').subscribe(function (value) {
                _this.showToast(value);
            });
            // if (error.message) {
            //   this.showToast(error.message);
            // } else {
            //   this.translate.get('verifying_otp_fail').subscribe(value => {
            //     this.showToast(value);
            //   });
            // }
            _this.dismissLoading();
        });
    };
    OtpPage.prototype.verifyOtpBrowser = function () {
        var component = this;
        this.presentLoading("Verifying otp");
        this.result.confirm(this.otp).then(function (response) {
            console.log('otp_verify_success', response);
            component.dismissLoading();
            component.showToast("OTP Verified");
            component.getUserToken(response.user);
        }).catch(function (error) {
            console.log('otp_verify_fail', error);
            if (error.message) {
                component.showToast(error.message);
            }
            else {
                component.showToast("OTP Verification failed");
            }
            component.dismissLoading();
        });
    };
    OtpPage.prototype.makeCaptcha = function () {
        var component = this;
        this.recaptchaVerifier = new __WEBPACK_IMPORTED_MODULE_3_firebase_app__["auth"].RecaptchaVerifier('recaptcha-container', {
            // 'size': 'normal',
            'size': 'invisible',
            'callback': function (response) {
                component.captchanotvarified = true;
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
        this.recaptchaVerifier.render();
    };
    OtpPage.prototype.tabs = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__tabs_tabs__["a" /* TabsPage */]);
    };
    OtpPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    OtpPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    OtpPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    OtpPage.prototype.presentErrorAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: "Error",
            subTitle: msg,
            buttons: ["Dismiss"]
        });
        alert.present();
    };
    OtpPage.prototype.makeExitAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Application exit prevented!');
                    }
                }, {
                    text: 'Close App',
                    handler: function () {
                        _this.platform.exitApp(); // Close this application
                    }
                }]
        });
        alert.present();
    };
    OtpPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-otp',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/otp/otp.html"*/'<ion-header class="bg-transparent">\n    <ion-navbar>\n        <ion-title><span>{{minutes}}:{{seconds}} left</span></ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div id="recaptcha-container"></div>\n    <h1 text-center>{{\'verification_code\' | translate}}<small>{{\'plese_type_the_verification_code\' | translate}} <br>\n            {{\'sent_to\' | translate}} {{phoneNumberFull}}</small></h1>\n\n    <div class="form">\n        <ion-input placeholder="{{\'enter_otp\' | translate}}" [(ngModel)]="otp"></ion-input>\n        <button ion-button round full class="btn" (click)="verify()" [disabled]="otpNotSent || otp==\'\'">Confirm</button>\n        <p text-center>\n            {{\'dint_received_code\' | translate}}\n            <strong (click)="sendOTP()">\n                {{\'resend_now\' | translate}}\n            </strong>\n        </p>\n    </div>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/otp/otp.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_4__ionic_native_firebase__["a" /* Firebase */], __WEBPACK_IMPORTED_MODULE_5__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_firebase__["a" /* Firebase */], __WEBPACK_IMPORTED_MODULE_5__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */]])
    ], OtpPage);
    return OtpPage;
}());

//# sourceMappingURL=otp.js.map

/***/ }),

/***/ 129:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Chat; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_models__ = __webpack_require__(25);

var Chat = /** @class */ (function () {
    function Chat() {
    }
    Chat.prototype.fromRow = function (arg0) {
        this.chatId = arg0.chatId;
        this.myId = arg0.myId;
        this.dateTimeStamp = arg0.dateTimeStamp;
        this.timeDiff = __WEBPACK_IMPORTED_MODULE_0__helper_models__["a" /* Helper */].getTimeDiff(new Date(Number(this.dateTimeStamp)));
        this.lastMessage = arg0.lastMessage;
        this.chatName = arg0.chatName;
        this.chatImage = arg0.chatImage;
        this.chatStatus = arg0.chatStatus;
        this.isGroup = arg0.isGroup == 1;
        this.isRead = arg0.isRead == 1;
    };
    return Chat;
}());

//# sourceMappingURL=chat.models.js.map

/***/ }),

/***/ 13:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClientService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_app_config__ = __webpack_require__(28);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var ClientService = /** @class */ (function () {
    function ClientService(config, http) {
        this.config = config;
        this.http = http;
    }
    ClientService.prototype.sortCountries = function (allCountries, sortCountries) {
        return allCountries.filter(function (country) {
            if (sortCountries.indexOf(country.name) > -1) {
                return country;
            }
        });
    };
    ClientService.prototype.getCountries = function () {
        var _this = this;
        return this.http.get('./assets/json/countries.json').concatMap(function (data) {
            var indiaIndex = -1;
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name == "India") {
                        indiaIndex = i;
                        break;
                    }
                }
            }
            if (indiaIndex != -1)
                data.unshift(data.splice(indiaIndex, 1)[0]);
            data = _this.sortCountries(data, ['Bulgaria', 'Ukraine', 'Hungary']);
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.getSettings = function () {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.get(this.config.apiBase + "settings", { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.forgetPassword = function (resetRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post(this.config.apiBase + "forgot-password", JSON.stringify(resetRequest), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.login = function (loginTokenRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post(this.config.apiBase + "login", JSON.stringify(loginTokenRequest), { headers: myHeaders }).concatMap(function (data) {
            console.log(data, 'LOGIN========');
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.loginSocial = function (socialLoginRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post(this.config.apiBase + "social/login", JSON.stringify(socialLoginRequest), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.signUp = function (signUpRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post(this.config.apiBase + "register", JSON.stringify(signUpRequest), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.verifyMobile = function (verifyRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post(this.config.apiBase + "verify-mobile", JSON.stringify(verifyRequest), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.checkUser = function (checkUserRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post(this.config.apiBase + "check-user", JSON.stringify(checkUserRequest), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.categoryParent = function (token) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get(this.config.apiBase + "category", { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.categoryChildren = function (token, parentId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get(this.config.apiBase + "category?category_id=" + parentId, { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.providers = function (token, catId, lat, lang, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get(this.config.apiBase + "customer/providers?category=" + catId + "&lat=" + lat + "&long=" + lang + "&page=" + pageNo, { headers: myHeaders }).concatMap(function (data) {
            for (var _i = 0, _a = data.data; _i < _a.length; _i++) {
                var p = _a[_i];
                p.distance = Number(p.distance / 1000).toFixed(2);
                p.ratings = Number(p.ratings).toFixed(2);
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.submitSupport = function (token, supportRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post(this.config.apiBase + "support", supportRequest, { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.createAppointment = function (token, appointmentRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post(this.config.apiBase + "customer/appointment", appointmentRequest, { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.addresses = function (token) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get(this.config.apiBase + "customer/address", { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.addAddress = function (token, addressRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post(this.config.apiBase + "customer/address", addressRequest, { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.deleteAddress = function (token, addressId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.delete(this.config.apiBase + "customer/address/" + addressId, { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.updateAddress = function (token, addressId, addressRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put(this.config.apiBase + "customer/address/" + addressId + "/update", addressRequest, { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.updateUser = function (token, requestBody) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put(this.config.apiBase + "user", requestBody, { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.providerReviews = function (token, profileId) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get(this.config.apiBase + "customer/providers/" + profileId + "/ratings", { headers: myHeaders }).concatMap(function (data) {
            for (var _i = 0, _a = data.data; _i < _a.length; _i++) {
                var review = _a[_i];
                review.created_at = _this.formatDate(new Date(review.created_at));
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.appointments = function (token, pageNo) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get(this.config.apiBase + "customer/appointment?page=" + pageNo, { headers: myHeaders }).concatMap(function (data) {
            for (var _i = 0, _a = data.data; _i < _a.length; _i++) {
                var ap = _a[_i];
                ap.created_at = _this.formatTime(new Date(ap.created_at));
                ap.updated_at = _this.formatTime(new Date(ap.updated_at));
                for (var _b = 0, _c = ap.logs; _b < _c.length; _b++) {
                    var log = _c[_b];
                    log.updated_at = _this.formatTime(new Date(log.updated_at));
                    log.created_at = _this.formatTime(new Date(log.created_at));
                }
                ap.date_formatted = _this.formatDate(new Date(ap.date));
                ap.time_from_formatted = ap.time_from.substr(0, ap.time_from.lastIndexOf(":"));
                ap.time_to_formatted = ap.time_to.substr(0, ap.time_to.lastIndexOf(":"));
                ap.provider.distance = Number(ap.provider.distance).toFixed(2);
                ap.provider.ratings = Number(ap.provider.ratings).toFixed(2);
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.appointmentCancel = function (token, apId) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post(this.config.apiBase + "customer/appointment/" + apId + '/cancel/', {}, { headers: myHeaders }).concatMap(function (data) {
            data.updated_at = _this.formatTime(new Date(data.updated_at));
            data.created_at = _this.formatTime(new Date(data.created_at));
            for (var _i = 0, _a = data.logs; _i < _a.length; _i++) {
                var log = _a[_i];
                log.updated_at = _this.formatTime(new Date(log.updated_at));
                log.created_at = _this.formatTime(new Date(log.created_at));
            }
            data.provider.distance = Number(data.provider.distance).toFixed(2);
            data.provider.ratings = Number(data.provider.ratings).toFixed(2);
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.appointmentUpdate = function (token, apId, updateRequest) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put(this.config.apiBase + "provider/appointment/" + apId, JSON.stringify(updateRequest), { headers: myHeaders }).concatMap(function (data) {
            data.updated_at = _this.formatTime(new Date(data.updated_at));
            data.created_at = _this.formatTime(new Date(data.created_at));
            for (var _i = 0, _a = data.logs; _i < _a.length; _i++) {
                var log = _a[_i];
                log.updated_at = _this.formatTime(new Date(log.updated_at));
                log.created_at = _this.formatTime(new Date(log.created_at));
            }
            data.provider.distance = Number(data.provider.distance).toFixed(2);
            data.provider.ratings = Number(data.provider.ratings).toFixed(2);
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.rateProvider = function (token, pId, rateRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post(this.config.apiBase + "customer/providers/" + pId + "/ratings", JSON.stringify(rateRequest), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.formatTime = function (date) {
        var locale = window.localStorage.getItem("locale");
        if (!locale)
            locale = "en-US";
        var options = {
            weekday: "short", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        return date.toLocaleTimeString(locale, options);
    };
    ClientService.prototype.formatDate = function (date) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return date.getDate() + " " + months[date.getMonth()];
    };
    ClientService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], ClientService);
    return ClientService;
}());

//# sourceMappingURL=client.service.js.map

/***/ }),

/***/ 130:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PlumberprofilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__chatscreen_chatscreen__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_chat_models__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__manageaddress_manageaddress__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_call_number__ = __webpack_require__(70);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var PlumberprofilePage = /** @class */ (function () {
    function PlumberprofilePage(navCtrl, params, service, loadingCtrl, toastCtrl, callNumber) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.callNumber = callNumber;
        this.plumber = "about";
        this.loadingShown = false;
        this.reviews = [];
        this.subscriptions = [];
        this.profile = params.get("profile");
        this.category_id = params.get("category_id");
        this.loadReviews();
    }
    PlumberprofilePage.prototype.loadReviews = function () {
        var _this = this;
        var subscription = this.service.providerReviews(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_TOKEN), String(this.profile.id)).subscribe(function (res) {
            var reviews = res.data;
            _this.reviews = _this.reviews.concat(reviews);
        }, function (err) {
            console.log('review_list', err);
        });
        this.subscriptions.push(subscription);
    };
    PlumberprofilePage.prototype.booknow = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__manageaddress_manageaddress__["a" /* ManageaddressPage */], { profile: this.profile, category_id: this.category_id });
    };
    PlumberprofilePage.prototype.callProvider = function () {
        this.callNumber.callNumber(this.profile.user.mobile_number, true).then(function (res) { return console.log('Launched dialer!', res); }).catch(function (err) { return console.log('Error launching dialer', err); });
    };
    PlumberprofilePage.prototype.chatscreen = function () {
        var newUserMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_USER));
        var chat = new __WEBPACK_IMPORTED_MODULE_5__models_chat_models__["a" /* Chat */]();
        chat.chatId = this.profile.user.id;
        chat.chatImage = this.profile.user.image_url;
        chat.chatName = this.profile.user.name;
        chat.chatStatus = this.profile.primary_category.title;
        chat.myId = newUserMe.id;
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__chatscreen_chatscreen__["a" /* ChatscreenPage */], { chat: chat });
    };
    PlumberprofilePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-plumberprofile',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/plumberprofile/plumberprofile.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            <!-- <span>\n                <ion-icon name="md-share"></ion-icon>\n            </span> -->\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content *ngIf="profile" class="bg-light">\n    <div class="bg-light profile-box">\n        <div class="profile">\n            <div class="profile-img">\n                <img *ngIf="profile && profile.user.image_url" data-src="{{profile.user.image_url}}">\n                <img *ngIf="!profile || !profile.user.image_url" src="assets/imgs/empty_dp.png">\n            </div>\n            <p class="retaing text-green" text-right>\n                {{profile.ratings}}\n                <span class="text-grey">\n                    <ion-icon name="star" class="text-green"></ion-icon>\n                    ({{profile.ratingscount}})\n                </span>\n            </p>\n            <h2 text-center>\n                    {{profile.user.name}}\n                <ion-icon *ngIf="profile.is_verified == 1" name="checkmark-circle"></ion-icon>\n                <span class="text-grey"> |\n                    {{profile.primary_category.title}}\n                </span>\n            </h2>\n            <ion-row>\n                <ion-col col-6>\n                    <h3 text-center>{{profile.priceToShow}}</h3>\n                    <p text-center>per {{profile.price_type}}</p>\n                </ion-col>\n                <ion-col col-6>\n                    <h3 text-center> {{profile.distance}} m</h3>\n                    <p text-center>{{\'away_from_you\' | translate}}</p>\n                </ion-col>\n            </ion-row>\n            <ion-row class="btn-box" justify-content-center="">\n                <ion-col col-4>\n                    <button ion-button icon-start full class="btn" (click)="booknow()">\n                        <ion-icon name="md-checkmark-circle"></ion-icon>\n                        {{\'book_now\' | translate}}\n                    </button>\n                </ion-col>\n                <!--<ion-col col-4>-->\n                    <!--<button ion-button icon-start full class="btn message-btn text-thime" (click)="chatscreen()">-->\n                        <!--<ion-icon name="md-text"></ion-icon>-->\n                        <!--{{\'message\' | translate}}-->\n                    <!--</button>-->\n                <!--</ion-col>-->\n                <!--<ion-col col-4>-->\n                    <!--<button ion-button icon-start full class="btn message-btn text-thime" (click)="callProvider()">-->\n                        <!--<ion-icon name="md-call"></ion-icon>-->\n                        <!--{{\'call\' | translate}}-->\n                    <!--</button>-->\n                <!--</ion-col>-->\n            </ion-row>\n        </div>\n        <ion-segment [(ngModel)]="plumber">\n            <ion-segment-button value="about">\n                {{\'about\' | translate}}\n            </ion-segment-button>\n            <ion-segment-button value="reviews">\n                {{\'reviews\' | translate}}\n            </ion-segment-button>\n        </ion-segment>\n    </div>\n    <div class="tab">\n        <div [ngSwitch]="plumber" class="tab-container">\n            <ion-list *ngSwitchCase="\'about\'">\n                <p>{{profile.about}}</p>\n                <div *ngIf="profile.subcategories && profile.subcategories.length" class="services">\n                    <h6 class="text-thime">\n                        {{\'services\' | translate}}\n                    </h6>\n                    <p *ngFor="let service of profile.subcategories">{{service.title}}</p>\n                </div>\n            </ion-list>\n\n            <ion-list *ngSwitchCase="\'reviews\'" no-lines class="reviews">\n                <div class="empty-view" *ngIf="(!reviews || !reviews.length)">\n                    <div style="text-align:center">\n                        <img src="assets/imgs/empty_reviews.png" alt="no offers" />\n                        <span style="color:#9E9E9E; font-weight:bold;">{{\'no_reviews_to_show\' | translate}}</span>\n                    </div>\n                </div>\n                <ion-item *ngFor="let review of reviews">\n                    <div class="reviews-details">\n                        <div class="review-img">\n                            <img *ngIf="review.user && review.user.image_url" data-src="{{review.user.image_url}}">\n                            <img *ngIf="!review.user || !review.user.image_url" src="assets/imgs/empty_dp.png">\n                        </div>\n                        <h2 class="text-ellipsis">\n                            {{review.user.name}}\n                            <br>\n                            <small class="text-green">\n                                {{review.rating}}\n                                <ion-icon name="star" class="text-green"></ion-icon>\n                            </small>\n                        </h2>\n                        <p class="text-ellipsis">{{review.created_at}} </p>\n                    </div>\n                    <p>{{review.review}}</p>\n                </ion-item>\n            </ion-list>\n            <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n                <ion-infinite-scroll-content></ion-infinite-scroll-content>\n            </ion-infinite-scroll>\n        </div>\n    </div>\n\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/plumberprofile/plumberprofile.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_7__ionic_native_call_number__["a" /* CallNumber */]])
    ], PlumberprofilePage);
    return PlumberprofilePage;
}());

//# sourceMappingURL=plumberprofile.js.map

/***/ }),

/***/ 131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ManageaddressPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__booknow_booknow__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__addaddress_addaddress__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ManageaddressPage = /** @class */ (function () {
    function ManageaddressPage(navCtrl, params, service, loadingCtrl, translate) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.translate = translate;
        this.edit = false;
        this.isLoading = false;
        this.loadingShown = false;
        this.addresses = new Array();
        this.subscriptions = [];
        this.profile = params.get("profile");
        this.edit = params.get('edit');
        this.category_id = params.get('category_id');
        this.translate.get(this.edit ? "address_manage" : "address_select").subscribe(function (value) {
            _this.title = value;
        });
        if (window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_ADDRESS_LIST) == null) {
            this.translate.get("loading_address").subscribe(function (value) {
                _this.presentLoading(value);
            });
            this.getAddresses();
        }
    }
    ManageaddressPage.prototype.ionViewDidEnter = function () {
        var addresses = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_ADDRESS_LIST));
        if (addresses != null) {
            this.addresses = addresses;
        }
    };
    ManageaddressPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    ManageaddressPage.prototype.getAddresses = function () {
        var _this = this;
        this.isLoading = true;
        var subscription = this.service.addresses(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN)).subscribe(function (res) {
            _this.dismissLoading();
            _this.addresses = res;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_ADDRESS_LIST, JSON.stringify(_this.addresses));
            _this.isLoading = false;
        }, function (err) {
            _this.isLoading = false;
            _this.dismissLoading();
            console.log('address_list_err', err);
        });
        this.subscriptions.push(subscription);
    };
    ManageaddressPage.prototype.onAddressClick = function (address) {
        if (this.edit) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__addaddress_addaddress__["a" /* AddAddressPage */], { address: address });
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__booknow_booknow__["a" /* BooknowPage */], { address: address, profile: this.profile, category_id: this.category_id });
        }
    };
    ManageaddressPage.prototype.onAddNewClick = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__addaddress_addaddress__["a" /* AddAddressPage */]);
    };
    ManageaddressPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    ManageaddressPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    ManageaddressPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-manageaddress',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/manageaddress/manageaddress.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{title}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <!--    <img src="../../assets/imgs/19.png">-->\n    <h2>{{\'saved_address\' | translate}}</h2>\n    <div class="empty-view" *ngIf="!isLoading && (!addresses || !addresses.length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_address.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold;">\n                {{\'no_addresses_to_show\' | translate}}\n            </span>\n        </div>\n    </div>\n    <ion-list no-lines>\n        <ion-item *ngFor="let address of addresses" (click)="onAddressClick(address)">\n            <h3>{{address.title}}</h3>\n            <p class="text-grey">\n                <ion-icon name="ios-pin"></ion-icon> {{address.address}}\n            </p>\n            <ion-icon name="md-create" item-end></ion-icon>\n        </ion-item>\n    </ion-list>\n</ion-content>\n<ion-footer>\n    <ion-item class="add-item" (click)="onAddNewClick()">\n        <h2 class="text-thime" text-center>\n            <ion-icon name="md-add-circle"></ion-icon>{{\'add_new\' | translate}}\n        </h2>\n    </ion-item>\n</ion-footer>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/manageaddress/manageaddress.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__["c" /* TranslateService */]])
    ], ManageaddressPage);
    return ManageaddressPage;
}());

//# sourceMappingURL=manageaddress.js.map

/***/ }),

/***/ 132:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BooknowPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_appointment_request_models__ = __webpack_require__(370);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_app_config__ = __webpack_require__(28);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};








var BooknowPage = /** @class */ (function () {
    function BooknowPage(navCtrl, navParam, service, loadingCtrl, toastCtrl, app, translate, config, clientService) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.app = app;
        this.translate = translate;
        this.config = config;
        this.clientService = clientService;
        this.gaming = "nes";
        this.where = "nes";
        this.dates = [];
        this.subscriptions = [];
        this.loadingShown = false;
        this.isShowPayment = false;
        this.isPaymentClosed = false;
        this.weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        this.timeRange = [{ time_value: "09:00 - 11:00", time_from: "09:00", time_to: "11:00" },
            { time_value: "11:00 - 13:00", time_from: "11:00", time_to: "13:00" },
            { time_value: "13:00 - 15:00", time_from: "13:00", time_to: "15:00" },
            { time_value: "15:00 - 17:00", time_from: "15:00", time_to: "17:00" },
            { time_value: "17:00 - 19:00", time_from: "17:00", time_to: "19:00" },
            { time_value: "19:00 - 21:00", time_from: "19:00", time_to: "21:00" }];
        this.profile = navParam.get("profile");
        this.address = navParam.get("address");
        this.appointment = navParam.get("appointment");
        console.log(this.profile, 'profile');
        this.category_id = navParam.get("category_id");
        for (var i = 0; i < 7; i++) {
            var d = new Date();
            d.setDate(d.getDate() + i);
            this.dates.push(d);
        }
        this.markSelected(this.dates[0]);
        this.timeRangeSelected = this.timeRange[0];
        if (this.appointment) {
            this.markSelected(new Date(this.appointment.date));
            var trtc = this.appointment.time_from_formatted + " - " + this.appointment.time_to_formatted;
            for (var _i = 0, _a = this.timeRange; _i < _a.length; _i++) {
                var tr = _a[_i];
                if (tr.time_value == trtc) {
                    this.timeRangeSelected = tr;
                    break;
                }
            }
        }
    }
    BooknowPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    BooknowPage.prototype.compareFn = function (tr1, tr2) {
        return tr1 && tr2 ? tr1.time_value == tr2.time_value : tr1 === tr2;
    };
    BooknowPage.prototype.markSelected = function (date) {
        this.dateSelected = date;
    };
    BooknowPage.prototype.proceed = function () {
        var _this = this;
        var now = new Date();
        var selected = new Date(this.dateSelected.getFullYear() + '-' + ((this.dateSelected.getMonth() + 1) < 10 ? '0' + (this.dateSelected.getMonth() + 1) : (this.dateSelected.getMonth() + 1)) + '-' + ((this.dateSelected.getDate()) < 10 ? '0' + (this.dateSelected.getDate()) : (this.dateSelected.getDate())) + ' ' + this.timeRangeSelected.time_from + ':00');
        if (selected > now) {
            if (this.appointment) {
                this.updateAppointment();
            }
            else {
                this.createAppointment();
            }
        }
        else {
            this.translate.get("err_time_passed").subscribe(function (value) {
                _this.showToast(value);
            });
        }
    };
    BooknowPage.prototype.updateAppointment = function () {
        var _this = this;
        this.translate.get("appointment_updating").subscribe(function (value) {
            _this.presentLoading(value);
        });
        var car = new __WEBPACK_IMPORTED_MODULE_4__models_appointment_request_models__["a" /* AppointmentRequest */]();
        car.time_from = this.timeRangeSelected.time_from;
        car.time_to = this.timeRangeSelected.time_to;
        car.date = this.dateSelected.getFullYear() + '-' + ((this.dateSelected.getMonth() + 1) < 10 ? '0' + (this.dateSelected.getMonth() + 1) : (this.dateSelected.getMonth() + 1)) + '-' + ((this.dateSelected.getDate()) < 10 ? '0' + (this.dateSelected.getDate()) : (this.dateSelected.getDate()));
        var subscription = this.service.appointmentUpdate(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.appointment.id, car).subscribe(function (res) {
            _this.dismissLoading();
            _this.translate.get("appointment_updating_success").subscribe(function (value) {
                _this.showToast(value);
            });
            _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
        }, function (err) {
            _this.translate.get("appointment_updating_fail").subscribe(function (value) {
                _this.showToast(value);
            });
            _this.dismissLoading();
            console.log('update', err);
        });
        this.subscriptions.push(subscription);
    };
    BooknowPage.prototype.getPaymentUrl = function (orderId, phone, price, client_id) {
        var baseUrl = this.config.paymentUrl;
        var centPrice = +price * 100;
        return baseUrl + "?phone=" + phone + "&amount=" + centPrice + "&order_id=" + orderId + "&client_id=" + client_id;
    };
    BooknowPage.prototype.showPayment = function () {
        this.isShowPayment = true;
    };
    BooknowPage.prototype.closePayment = function () {
        var _this = this;
        this.isShowPayment = false;
        this.isPaymentClosed = true;
        this.translate.get("appointment_creating_success").subscribe(function (value) {
            _this.showToast(value);
        });
        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
    };
    BooknowPage.prototype.createAppointment = function () {
        var _this = this;
        this.translate.get("appointment_creating").subscribe(function (value) {
            _this.presentLoading(value);
        });
        var car = new __WEBPACK_IMPORTED_MODULE_4__models_appointment_request_models__["a" /* AppointmentRequest */]();
        car.address_id = this.address.id;
        car.provider_id = Number(this.profile.id);
        car.category_id = this.category_id;
        car.time_from = this.timeRangeSelected.time_from;
        car.time_to = this.timeRangeSelected.time_to;
        car.notes = this.notes;
        car.date = this.dateSelected.getFullYear() + '-' + ((this.dateSelected.getMonth() + 1) < 10 ? '0' + (this.dateSelected.getMonth() + 1) : (this.dateSelected.getMonth() + 1)) + '-' + ((this.dateSelected.getDate()) < 10 ? '0' + (this.dateSelected.getDate()) : (this.dateSelected.getDate()));
        var subscription = this.service.createAppointment(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN), car).subscribe(function (res) {
            _this.dismissLoading();
            var currUser = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_USER));
            _this.paymentUrl = _this.getPaymentUrl(res.id, currUser.mobile_number, _this.profile.price, _this.profile.user_id);
            // this.translate.get("appointment_creating_success").subscribe(value => {
            //   this.showToast(value);
            // });
            _this.showPayment();
            // this.app.getRootNav().setRoot(TabsPage);
        }, function (err) {
            _this.translate.get("appointment_creating_fail").subscribe(function (value) {
                _this.showToast(value);
            });
            _this.dismissLoading();
            console.log('book', err);
        });
        this.subscriptions.push(subscription);
    };
    BooknowPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    BooknowPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    BooknowPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    BooknowPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-booknow',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/booknow/booknow.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'book_now\' | translate}}\n            <span (click)="proceed()">\n                <ion-icon name="md-checkmark"></ion-icon>\n            </span>\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <iframe *ngIf="isShowPayment" [src]="paymentUrl | safe"  style="width:100%;height:100%" scrolling="yes" ></iframe>\n    <ion-icon (click)="closePayment()" *ngIf="isShowPayment" class="close" name="close"></ion-icon>\n    <div *ngIf="!isShowPayment">\n        <ion-list *ngIf="!appointment && profile" class="profile bg-thime">\n            <ion-item class=" bg-thime">\n                <ion-avatar item-start>\n                    <img *ngIf="profile && profile.user.image_url" data-src="{{profile.user.image_url}}">\n                    <img *ngIf="!profile || !profile.user.image_url" src="assets/imgs/empty_dp.png">\n                </ion-avatar>\n                <h2 class="text-white">{{profile.user.name}} <span> | {{profile.primary_category.title}}</span></h2>\n            </ion-item>\n        </ion-list>\n        <ion-scroll scrollX="true" style="height: 120px;; white-space: nowrap;" class=" bg-thime">\n            <div *ngFor="let d of dates" [ngClass]="(dateSelected == d) ? \'select-date active\' : \'select-date\'" (click)="markSelected(d)">\n                <p text-center>{{ weekDays[d.getDay()]}}</p>\n                <h2 text-center>{{ d.getDate()}}</h2>\n            </div>\n        </ion-scroll>\n\n        <div class="form">\n            <ion-list no-lines>\n                <ion-item class="select-box">\n                    <ion-label class="text-thime">{{\'when\' | translate}}</ion-label>\n                    <ion-select [(ngModel)]="timeRangeSelected" [compareWith]="compareFn">\n                        <ion-option *ngFor="let tr of timeRange" [value]="tr">{{tr.time_value}}</ion-option>\n                    </ion-select>\n                </ion-item>\n\n                <ion-item *ngIf="!appointment && address">\n                    <ion-label class="text-grey" floating>{{\'address_title\' | translate}}</ion-label>\n                    <ion-input type="text" [readonly]="true" [(ngModel)]="address.title"></ion-input>\n                </ion-item>\n                <ion-item *ngIf="!appointment && address">\n                    <ion-label class="text-grey" floating>{{\'full_address\' | translate}}</ion-label>\n                    <ion-input type="text" [readonly]="true" [(ngModel)]="address.address"></ion-input>\n                </ion-item>\n                <ion-item *ngIf="!appointment">\n                    <ion-label class="text-grey" floating>{{\'appointment_notes\' | translate}}</ion-label>\n                    <ion-input type="text" [(ngModel)]="notes"></ion-input>\n                </ion-item>\n            </ion-list>\n        </div>\n    </div>\n</ion-content>\n<ion-footer *ngIf="!isShowPayment">\n    <button class="btn" ion-button round full margin-top (click)="proceed()">{{\'confirm\' | translate}}</button>\n</ion-footer>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/booknow/booknow.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */]]
        }),
        __param(7, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_7__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__["c" /* TranslateService */], Object, __WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */]])
    ], BooknowPage);
    return BooknowPage;
}());

//# sourceMappingURL=booknow.js.map

/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyLocation; });
var MyLocation = /** @class */ (function () {
    function MyLocation() {
    }
    return MyLocation;
}());

//# sourceMappingURL=my-location.models.js.map

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectareaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_google_maps__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_my_location_models__ = __webpack_require__(133);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SelectareaPage = /** @class */ (function () {
    function SelectareaPage(navCtrl, menuCtrl, zone, maps, platform, geolocation, toastCtrl) {
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.zone = zone;
        this.maps = maps;
        this.platform = platform;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.query = '';
        this.places = [];
        this.ignoreClick = false;
        this.menuCtrl.enable(false, 'myMenu');
        this.searchDisabled = true;
        this.saveDisabled = true;
    }
    SelectareaPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        if (!this.initialized) {
            var mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(function () {
                _this.autocompleteService = new google.maps.places.AutocompleteService();
                _this.placesService = new google.maps.places.PlacesService(_this.maps.map);
                _this.searchDisabled = false;
                _this.maps.map.addListener('click', function (event) {
                    if (event && event.latLng) {
                        _this.onMapClick(new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()));
                    }
                });
                _this.initialized = true;
                _this.detect();
            }).catch(function (err) {
                console.log(err);
                _this.close();
            });
            mapLoaded.catch(function (err) {
                console.log(err);
                _this.close();
            });
        }
    };
    SelectareaPage.prototype.onMapClick = function (pos) {
        var _this = this;
        if (pos && !this.ignoreClick) {
            if (!this.marker) {
                this.marker = new google.maps.Marker({ position: pos, map: this.maps.map });
                this.marker.setClickable(true);
                this.marker.addListener('click', function (event) {
                    console.log("markerevent", event);
                    _this.showToast(_this.location.name);
                });
            }
            else {
                this.marker.setPosition(pos);
            }
            this.maps.map.panTo(pos);
            var geocoder = new google.maps.Geocoder();
            var request = { location: pos };
            geocoder.geocode(request, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    _this.saveDisabled = false;
                    _this.location = new __WEBPACK_IMPORTED_MODULE_5__models_my_location_models__["a" /* MyLocation */]();
                    _this.location.name = results[0].formatted_address;
                    _this.location.lat = String(pos.lat());
                    _this.location.lng = String(pos.lng());
                    _this.showToast(_this.location.name);
                }
            });
        }
    };
    SelectareaPage.prototype.selectPlace = function (place) {
        var _this = this;
        this.query = place.description;
        this.ignoreClick = true;
        setTimeout(function () {
            _this.ignoreClick = false;
            console.log(_this.query);
        }, 2000);
        this.places = [];
        var myLocation = new __WEBPACK_IMPORTED_MODULE_5__models_my_location_models__["a" /* MyLocation */]();
        myLocation.name = place.name;
        this.placesService.getDetails({ placeId: place.place_id }, function (details) {
            _this.zone.run(function () {
                myLocation.name = (details.formatted_address && details.formatted_address.length) ? details.formatted_address : details.name;
                myLocation.lat = details.geometry.location.lat();
                myLocation.lng = details.geometry.location.lng();
                _this.saveDisabled = false;
                var lc = { lat: myLocation.lat, lng: myLocation.lng };
                _this.maps.map.setCenter(lc);
                _this.location = myLocation;
                var pos = new google.maps.LatLng(Number(lc.lat), Number(lc.lng));
                if (!_this.marker)
                    _this.marker = new google.maps.Marker({ position: pos, map: _this.maps.map });
                else
                    _this.marker.setPosition(pos);
                _this.maps.map.panTo(pos);
            });
        });
    };
    SelectareaPage.prototype.searchPlace = function () {
        var _this = this;
        this.saveDisabled = true;
        if (this.query.length > 0 && !this.searchDisabled) {
            var config = {
                types: ['geocode'],
                input: this.query
            };
            this.autocompleteService.getPlacePredictions(config, function (predictions, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {
                    _this.places = [];
                    predictions.forEach(function (prediction) {
                        _this.places.push(prediction);
                    });
                }
            });
        }
        else {
            this.places = [];
        }
    };
    SelectareaPage.prototype.detect = function () {
        var _this = this;
        this.geolocation.getCurrentPosition().then(function (position) {
            _this.onMapClick(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        }).catch(function (err) {
            console.log("getCurrentPosition", err);
            _this.showToast("Location detection failed");
        });
    };
    SelectareaPage.prototype.save = function () {
        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_LOCATION, JSON.stringify(this.location));
        this.close();
    };
    SelectareaPage.prototype.close = function () {
        this.navCtrl.pop();
    };
    SelectareaPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 5000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ViewChild */])('map'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__angular_core__["t" /* ElementRef */])
    ], SelectareaPage.prototype, "mapElement", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ViewChild */])('pleaseConnect'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__angular_core__["t" /* ElementRef */])
    ], SelectareaPage.prototype, "pleaseConnect", void 0);
    SelectareaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["m" /* Component */])({
            selector: 'page-selectarea',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/selectarea/selectarea.html"*/'<ion-header>\n    <ion-navbar color="primary">\n        <ion-buttons left>\n            <button ion-button (click)="close()">{{\'cancel\' | translate}}</button>\n        </ion-buttons>\n        <ion-buttons right>\n            <button [disabled]="saveDisabled" ion-button (click)="save()">{{\'save\' | translate}}</button>\n        </ion-buttons>\n    </ion-navbar>\n\n    <ion-toolbar>\n        <ion-row>\n            <ion-col col-11>\n                <ion-searchbar [(ngModel)]="query" (ionInput)="searchPlace()"></ion-searchbar>\n            </ion-col>\n            <ion-col col-1>\n                <ion-icon name="md-locate" (click)="detect()"></ion-icon>\n            </ion-col>\n        </ion-row>\n    </ion-toolbar>\n\n    <ion-list>\n        <ion-item *ngFor="let place of places" (touchstart)="selectPlace(place)">{{place.description}}</ion-item>\n    </ion-list>\n\n</ion-header>\n\n<ion-content>\n\n    <div #pleaseConnect id="please-connect">\n        <p>{{\'please_connect_to_the_internet\' | translate}}</p>\n    </div>\n\n    <div #map id="map">\n        <ion-spinner></ion-spinner>\n    </div>\n\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/selectarea/selectarea.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["h" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_1__angular_core__["M" /* NgZone */], __WEBPACK_IMPORTED_MODULE_3__providers_google_maps__["a" /* GoogleMaps */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["l" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["n" /* ToastController */]])
    ], SelectareaPage);
    return SelectareaPage;
}());

//# sourceMappingURL=selectarea.js.map

/***/ }),

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GoogleMaps; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__connectivity_service__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_config__ = __webpack_require__(28);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



var GoogleMaps = /** @class */ (function () {
    function GoogleMaps(config, connectivityService) {
        this.config = config;
        this.connectivityService = connectivityService;
        this.mapInitialised = false;
    }
    GoogleMaps.prototype.init = function (mapElement, pleaseConnect) {
        this.mapElement = mapElement;
        this.pleaseConnect = pleaseConnect;
        return this.loadGoogleMaps();
    };
    GoogleMaps.prototype.loadGoogleMaps = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (typeof google == "undefined" || typeof google.maps == "undefined") {
                console.log("Google maps JavaScript needs to be loaded.");
                _this.disableMap();
                if (_this.connectivityService.isOnline()) {
                    window['mapInit'] = function () {
                        _this.initMap().then(function () {
                            resolve(true);
                        });
                        _this.enableMap();
                    };
                    var script = document.createElement("script");
                    script.id = "googleMaps";
                    if (_this.config.googleApiKey) {
                        script.src = 'https://maps.google.com/maps/api/js?key=' + _this.config.googleApiKey + '&callback=mapInit&libraries=places';
                    }
                    else {
                        script.src = 'https://maps.google.com/maps/api/js?callback=mapInit';
                    }
                    document.body.appendChild(script);
                }
            }
            else {
                if (_this.connectivityService.isOnline()) {
                    _this.initMap();
                    _this.enableMap();
                }
                else {
                    _this.disableMap();
                }
                resolve(true);
            }
            _this.addConnectivityListeners();
        });
    };
    GoogleMaps.prototype.initMap = function () {
        var _this = this;
        this.mapInitialised = true;
        return new Promise(function (resolve) {
            var latLng = new google.maps.LatLng(39.9334, 32.8597);
            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            _this.map = new google.maps.Map(_this.mapElement, mapOptions);
            resolve(true);
        });
    };
    GoogleMaps.prototype.disableMap = function () {
        if (this.pleaseConnect) {
            this.pleaseConnect.style.display = "block";
        }
    };
    GoogleMaps.prototype.enableMap = function () {
        if (this.pleaseConnect) {
            this.pleaseConnect.style.display = "none";
        }
    };
    GoogleMaps.prototype.addConnectivityListeners = function () {
        var _this = this;
        this.connectivityService.watchOnline().subscribe(function () {
            setTimeout(function () {
                if (typeof google == "undefined" || typeof google.maps == "undefined") {
                    _this.loadGoogleMaps();
                }
                else {
                    if (!_this.mapInitialised) {
                        _this.initMap();
                    }
                    _this.enableMap();
                }
            }, 2000);
        });
        this.connectivityService.watchOffline().subscribe(function () {
            _this.disableMap();
        });
    };
    GoogleMaps = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1__connectivity_service__["a" /* Connectivity */]])
    ], GoogleMaps);
    return GoogleMaps;
}());

//# sourceMappingURL=google-maps.js.map

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PrivacyPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_config__ = __webpack_require__(28);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



var PrivacyPage = /** @class */ (function () {
    function PrivacyPage(config, navCtrl, navParam) {
        this.config = config;
        this.navCtrl = navCtrl;
        this.toShow = "";
        this.heading = "";
        this.toShow = navParam.get("toShow");
        this.heading = navParam.get("heading");
    }
    PrivacyPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-privacy',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/privacy/privacy.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            {{heading}}\n        </ion-title>\n    </ion-navbar>\n    <div class="logo-box bg-thime">\n        <div class="logo">\n            <img src="assets/imgs/cityzen-massage-app.png">\n            <h1 class="text-white">{{config.appName}}</h1>\n        </div>\n    </div>\n</ion-header>s\n\n<ion-content>\n    <div class="text">\n        <!-- <h2 class="text-thime">{{\'our_privacy_policy\' | translate}}</h2> -->\n        <div [innerHTML]="toShow"></div>\n    </div>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/privacy/privacy.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], PrivacyPage);
    return PrivacyPage;
}());

//# sourceMappingURL=privacy.js.map

/***/ }),

/***/ 150:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 150;

/***/ }),

/***/ 194:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 194;

/***/ }),

/***/ 237:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_signup_request_models__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__otp_otp__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SignupPage = /** @class */ (function () {
    function SignupPage(params, navCtrl, clientService, translate, loadingCtrl, toastCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.clientService = clientService;
        this.translate = translate;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingShown = false;
        this.signUpRequest = new __WEBPACK_IMPORTED_MODULE_3__models_signup_request_models__["a" /* SignUpRequest */]('', '', '', '');
        var code = params.get('code');
        var phone = params.get('phone');
        var name = params.get('name');
        var email = params.get('email');
        if (code && code.length) {
            this.countryCode = code;
        }
        if (phone && phone.length) {
            this.phoneNumber = phone;
        }
        if (name && name.length) {
            this.signUpRequest.name = name;
        }
        if (email && email.length) {
            this.signUpRequest.email = email;
        }
        this.getCountries();
    }
    SignupPage.prototype.getCountries = function () {
        var _this = this;
        this.clientService.getCountries().subscribe(function (data) {
            _this.countries = data;
        }, function (err) {
            console.log(err);
        });
    };
    SignupPage.prototype.requestSignUp = function () {
        var _this = this;
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!this.signUpRequest.name.length) {
            this.translate.get('err_valid_name').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (this.signUpRequest.email.length <= 5 || !reg.test(this.signUpRequest.email)) {
            this.translate.get('err_valid_email').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.countryCode || !this.countryCode.length || !this.phoneNumber || !this.phoneNumber.length) {
            this.translate.get('err_valid_phone').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else {
            this.alertPhone();
        }
    };
    SignupPage.prototype.alertPhone = function () {
        var _this = this;
        this.translate.get(['alert_phone', 'no', 'yes']).subscribe(function (text) {
            _this.phoneNumberFull = "+" + _this.countryCode + _this.phoneNumber;
            var alert = _this.alertCtrl.create({
                title: _this.phoneNumberFull,
                message: text['alert_phone'],
                buttons: [{
                        text: text['no'],
                        role: 'cancel',
                        handler: function () {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: text['yes'],
                        handler: function () {
                            _this.signUpRequest.password = String(Math.floor(100000 + Math.random() * 900000));
                            _this.signUpRequest.mobile_number = _this.phoneNumberFull;
                            _this.signUp();
                        }
                    }]
            });
            alert.present();
        });
    };
    SignupPage.prototype.signUp = function () {
        var _this = this;
        this.translate.get('signing_up').subscribe(function (value) {
            _this.presentLoading(value);
        });
        this.clientService.signUp(this.signUpRequest).subscribe(function (res) {
            console.log(res);
            _this.dismissLoading();
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__otp_otp__["a" /* OtpPage */], { phoneNumberFull: res.user.mobile_number });
        }, function (err) {
            console.log(err);
            _this.dismissLoading();
            var errMsg = 'Unable to register with provided credentials';
            if (err && err.errors) {
                if (err.errors.email) {
                    errMsg = err.errors.email[0];
                }
                else if (err.errors.password) {
                    errMsg = err.errors.password[0];
                }
                else if (err.errors.mobile_number) {
                    errMsg = err.errors.mobile_number[0];
                }
            }
            _this.presentErrorAlert(errMsg);
        });
    };
    SignupPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    SignupPage.prototype.presentErrorAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: "Error",
            subTitle: msg,
            buttons: ["Dismiss"]
        });
        alert.present();
    };
    SignupPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    SignupPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    SignupPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-signup',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/signup/signup.html"*/'<ion-header class="bg-transparent">\n    <ion-navbar>\n        <ion-title>{{\'sign_up\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="form">\n        <ion-list no-lines>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-person" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'enter_full_name\' | translate}}</ion-label>\n                <ion-input type="text" [(ngModel)]="signUpRequest.name"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-mail" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'enter_email_id\' | translate}}</ion-label>\n                <ion-input type="email" [(ngModel)]="signUpRequest.email"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-globe" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label floating>{{\'select_country\' | translate}}</ion-label>\n                <ion-select [(ngModel)]="countryCode" interface="popover" multiple="false" class="text-thime">\n                    <ion-option [value]="country.callingCodes[0]" *ngFor="let country of countries">{{country.name}}</ion-option>\n                </ion-select>\n            </ion-item>\n            <ion-item>\n                <ion-avatar item-start style="margin-bottom: 3px; margin-right: 28px;">\n                    <ion-icon name="md-phone-portrait" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'mobile_number\' | translate}}</ion-label>\n                <ion-input type="tel" [(ngModel)]="phoneNumber"></ion-input>\n            </ion-item>\n        </ion-list>\n\n        <button class="btn" ion-button round full margin-top margin-bottom (click)="requestSignUp()">{{\'sign_up_now\' | translate}}</button>\n        <!-- <p class="text-thime" text-center (click)="forgotpassword()">Forgot Password</p> -->\n\n        <!--\n        <p class="text-grey" text-center style="margin-top: 30px;"><small>By signing up, you are agree to our <ins>terms\n                    & condition</ins></small></p>\n-->\n\n    </div>\n</ion-content>\n<ion-footer>\n    <p class="text-grey" text-center style="margin-top: 30px;"><small> {{\'by_signing_up\' | translate}}<ins>{{\'terms_condition\' | translate}}</ins></small></p>\n</ion-footer>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/signup/signup.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], SignupPage);
    return SignupPage;
}());

//# sourceMappingURL=signup.js.map

/***/ }),

/***/ 239:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RequestsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__booking_booking__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_helper_models__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var RequestsPage = /** @class */ (function () {
    function RequestsPage(navCtrl, service, events, loadingCtrl, translate) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.events = events;
        this.loadingCtrl = loadingCtrl;
        this.translate = translate;
        this.requests = "pending";
        this.loadingShown = false;
        this.pageNo = 1;
        this.allDone = false;
        this.subscriptions = [];
        this.toShow = [];
        this.upcoming = [];
        this.complete = [];
        // this.translate.get('loading_requests').subscribe(value => {
        //   this.presentLoading(value);
        // });
        this.loadRequests();
        this.currency = __WEBPACK_IMPORTED_MODULE_5__models_helper_models__["a" /* Helper */].getSetting("currency");
    }
    RequestsPage.prototype.onSegmentChange = function () {
        var _this = this;
        setTimeout(function () {
            _this.toShow = _this.requests == "pending" ? _this.upcoming : _this.complete;
        }, 100);
    };
    RequestsPage.prototype.doRefresh = function (refresher) {
        if (this.isLoading)
            refresher.complete();
        this.refresher = refresher;
        this.pageNo = 1;
        this.upcoming = new Array();
        this.complete = new Array();
        this.loadRequests();
    };
    RequestsPage.prototype.loadRequests = function () {
        var _this = this;
        this.isLoading = true;
        var subscription = this.service.appointments(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.pageNo).subscribe(function (res) {
            var appointments = res.data;
            _this.allDone = (!appointments || !appointments.length);
            _this.dismissLoading();
            var upcoming = new Array();
            var complete = new Array();
            for (var _i = 0, appointments_1 = appointments; _i < appointments_1.length; _i++) {
                var ap = appointments_1[_i];
                ap.statusToShow = ap.status;
                if (ap.statusToShow == "complete") {
                    ap.statusToShow = "completed";
                }
                ap.provider.priceToShow = _this.currency + ap.provider.price;
                if (ap.status == 'complete' || ap.status == 'rejected' || ap.status == 'cancelled')
                    complete.push(ap);
                else
                    upcoming.push(ap);
            }
            if (upcoming.length || complete.length) {
                _this.upcoming = _this.upcoming.concat(upcoming);
                _this.complete = _this.complete.concat(complete);
                _this.onSegmentChange();
            }
            if (_this.infiniteScroll)
                _this.infiniteScroll.complete();
            if (_this.refresher)
                _this.refresher.complete();
        }, function (err) {
            console.log('appointments', err);
            _this.dismissLoading();
            if (_this.infiniteScroll)
                _this.infiniteScroll.complete();
            if (_this.refresher)
                _this.refresher.complete();
        });
        this.subscriptions.push(subscription);
    };
    RequestsPage.prototype.doInfinite = function (infiniteScroll) {
        this.infiniteScroll = infiniteScroll;
        if (!this.allDone) {
            this.pageNo = this.pageNo + 1;
            this.loadRequests();
        }
        else {
            infiniteScroll.complete();
        }
    };
    RequestsPage.prototype.ionViewWillLeave = function () {
        this.events.publish('cango:exit', false);
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    RequestsPage.prototype.ionViewDidEnter = function () {
        this.events.publish('cango:exit', true);
    };
    RequestsPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    RequestsPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    RequestsPage.prototype.requestDetail = function (appointment) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__booking_booking__["a" /* BookingPage */], { appointment: appointment });
    };
    RequestsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-requests',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/requests/requests.html"*/'<ion-header class="bg-thime">\n    <ion-navbar>\n        <ion-title>{{\'requests\' | translate}}</ion-title>\n    </ion-navbar>\n\n    <ion-segment [(ngModel)]="requests" (ionChange)="onSegmentChange()">\n        <ion-segment-button value="pending">\n            {{\'pending\' | translate}}\n        </ion-segment-button>\n        <ion-segment-button value="completed">\n            {{\'completed\' | translate}}\n        </ion-segment-button>\n    </ion-segment>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content pullingIcon="arrow-dropdown" pullingText="{{\'pull_refresh\' | translate}}"\n            refreshingSpinner="circles" refreshingText="Refreshing...">\n        </ion-refresher-content>\n    </ion-refresher>\n    <div class="empty-view" *ngIf="!loadingShown && (!toShow || !toShow.length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_appointment.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold;">{{\'no_requests_to_show\' | translate}}</span>\n        </div>\n    </div>\n    <div>\n        <ion-list no-lines>\n            <ion-item *ngFor="let ap of toShow" [class]="ap.status + \' item item-block item-md\'"\n                (click)="requestDetail(ap)">\n                <ion-avatar item-start>\n                    <img *ngIf="ap.provider && ap.provider.user.image_url" data-src="{{ap.provider.user.image_url}}">\n                    <img *ngIf="!ap.provider || !ap.provider.user.image_url" src="assets/imgs/empty_dp.png">\n                </ion-avatar>\n                <h2>\n                    <span class="text-ellipsis name">\n                        {{ap.provider.user.name}}\n                    </span>\n                    <ion-icon *ngIf="ap.provider.is_verified == 1" name="checkmark-circle"></ion-icon>\n                    <span class="text-light-grey small">\n                        |\n                        {{ap.provider.primary_category.title}}\n                    </span>\n                    <span class="ml-auto small">\n                        {{ap.statusToShow}}\n                    </span>\n                </h2>\n                <p class="text-grey">\n                    <span class="text-ellipsis">{{ap.provider.priceToShow}} / {{ap.provider.price_type}}</span>\n                    <span class="ml-auto text-ellipsis">{{ap.date_formatted}},\n                        {{ap.time_from_formatted}}-{{ap.time_to_formatted}}</span>\n                </p>\n            </ion-item>\n        </ion-list>\n        <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n            <ion-infinite-scroll-content></ion-infinite-scroll-content>\n        </ion-infinite-scroll>\n    </div>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/requests/requests.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__["c" /* TranslateService */]])
    ], RequestsPage);
    return RequestsPage;
}());

//# sourceMappingURL=requests.js.map

/***/ }),

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BookingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__chatscreen_chatscreen__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__rate_rate__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_chat_models__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__plumberprofile_plumberprofile__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__booknow_booknow__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_helper_models__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_call_number__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__track_track__ = __webpack_require__(251);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var BookingPage = /** @class */ (function () {
    function BookingPage(navCtrl, navParam, service, loadingCtrl, toastCtrl, callNumber, translate) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.callNumber = callNumber;
        this.translate = translate;
        this.loadingShown = false;
        this.isLoading = false;
        this.statusLevel = 1;
        this.statusText = "Job Pending";
        this.canRate = false;
        this.subscriptions = [];
        this.appointment = navParam.get("appointment");
        this.canRate = (this.appointment && this.appointment.status == 'complete' && window.localStorage.getItem("rated" + this.appointment.id) == null);
        this.setStatus();
    }
    BookingPage.prototype.cancelJob = function () {
        var _this = this;
        this.translate.get('just_moment').subscribe(function (value) {
            _this.presentLoading(value);
        });
        var subscription = this.service.appointmentCancel(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.appointment.id).subscribe(function (res) {
            console.log(res);
            _this.dismissLoading();
            _this.appointment = res;
            _this.setStatus();
        }, function (err) {
            console.log('cancel_err', err);
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    BookingPage.prototype.updateJobStatus = function (status) {
        var _this = this;
        if (this.appointment.status == 'cancelled')
            return;
        this.translate.get('updating').subscribe(function (value) {
            _this.presentLoading(value);
        });
        var subscription = this.service.appointmentUpdate(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.appointment.id, { status: status }).subscribe(function (res) {
            console.log(res);
            _this.dismissLoading();
            _this.appointment = res;
            _this.setStatus();
        }, function (err) {
            console.log('update_status', err);
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    BookingPage.prototype.setStatus = function () {
        var _this = this;
        if (this.appointment) {
            switch (this.appointment.status) {
                case "pending": {
                    this.statusLevel = 1;
                    this.translate.get('updating').subscribe(function (value) {
                        _this.statusText = value;
                    });
                    break;
                }
                case "accepted": {
                    this.statusLevel = 1;
                    this.translate.get('job_accepted').subscribe(function (value) {
                        _this.statusText = value;
                    });
                    break;
                }
                case "onway": {
                    this.statusLevel = 2;
                    this.translate.get('job_onway').subscribe(function (value) {
                        _this.statusText = value;
                    });
                    break;
                }
                case "ongoing": {
                    this.statusLevel = 2;
                    this.translate.get('job_ongoing').subscribe(function (value) {
                        _this.statusText = value;
                    });
                    break;
                }
                case "complete": {
                    this.statusLevel = 3;
                    this.translate.get('job_complete').subscribe(function (value) {
                        _this.statusText = value;
                    });
                    break;
                }
                case "cancelled": {
                    this.statusLevel = 1;
                    this.translate.get('job_cancelled').subscribe(function (value) {
                        _this.statusText = value;
                    });
                    break;
                }
                case "rejected": {
                    this.statusLevel = 1;
                    this.translate.get('job_rejected').subscribe(function (value) {
                        _this.statusText = value;
                    });
                    break;
                }
            }
            var acceptedTime_1 = __WEBPACK_IMPORTED_MODULE_9__models_helper_models__["a" /* Helper */].getLogTimeForStatus("accepted", this.appointment.logs);
            if (acceptedTime_1 && acceptedTime_1.length) {
                this.translate.get('job_accepted_on').subscribe(function (value) {
                    _this.statusLevel1Time = value + acceptedTime_1;
                });
            }
            if (!this.statusLevel1Time || !this.statusLevel1Time.length) {
                if (this.appointment.status == "cancelled") {
                    this.translate.get('job_cancelled_on').subscribe(function (value) {
                        _this.statusLevel1Time = value + acceptedTime_1;
                    });
                }
                else if (this.appointment.status == "rejected") {
                    this.translate.get('job_rejected_on').subscribe(function (value) {
                        _this.statusLevel1Time = value + acceptedTime_1;
                    });
                }
                else {
                    this.statusLevel1Time = this.appointment.updated_at;
                }
            }
            this.translate.get('job_started_on').subscribe(function (value) {
                var onwaytime = __WEBPACK_IMPORTED_MODULE_9__models_helper_models__["a" /* Helper */].getLogTimeForStatus("onway", _this.appointment.logs);
                if (onwaytime && onwaytime.length) {
                    _this.statusLevel2Time = value + onwaytime;
                }
                else {
                    _this.statusLevel2Time = value + __WEBPACK_IMPORTED_MODULE_9__models_helper_models__["a" /* Helper */].getLogTimeForStatus("ongoing", _this.appointment.logs);
                }
            });
            this.translate.get('job_completed_on').subscribe(function (value) {
                _this.statusLevel3Time = value + __WEBPACK_IMPORTED_MODULE_9__models_helper_models__["a" /* Helper */].getLogTimeForStatus("complete", _this.appointment.logs);
            });
            this.canRate = (this.appointment && this.appointment.status == 'complete' && window.localStorage.getItem("rated" + this.appointment.id) == null);
        }
    };
    BookingPage.prototype.callProvider = function () {
        this.callNumber.callNumber(this.appointment.provider.user.mobile_number, true).then(function (res) { return console.log('Launched dialer!', res); }).catch(function (err) { return console.log('Error launching dialer', err); });
    };
    BookingPage.prototype.trackProvider = function () {
        var _this = this;
        if (this.appointment.status == "onway") {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__track_track__["a" /* TrackPage */], { appointment: this.appointment });
        }
        else {
            this.translate.get("track_unavialable").subscribe(function (value) {
                _this.showToast(value);
            });
        }
    };
    BookingPage.prototype.chatscreen = function () {
        var newUserMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_USER));
        var chat = new __WEBPACK_IMPORTED_MODULE_6__models_chat_models__["a" /* Chat */]();
        chat.chatId = this.appointment.provider.user.id;
        chat.chatImage = this.appointment.provider.user.image_url;
        chat.chatName = this.appointment.provider.user.name;
        chat.chatStatus = this.appointment.provider.user.email;
        chat.myId = newUserMe.id;
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__chatscreen_chatscreen__["a" /* ChatscreenPage */], { chat: chat });
    };
    BookingPage.prototype.rate = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__rate_rate__["a" /* RatePage */], { appointment: this.appointment });
    };
    BookingPage.prototype.reschedule = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__booknow_booknow__["a" /* BooknowPage */], { appointment: this.appointment });
    };
    BookingPage.prototype.viewProfile = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__plumberprofile_plumberprofile__["a" /* PlumberprofilePage */], { profile: this.appointment.provider });
    };
    BookingPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    BookingPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    BookingPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    BookingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-booking',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/booking/booking.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'job_detail\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n\n    <ion-list class="profile">\n        <ion-item>\n            <ion-avatar item-start (click)="viewProfile()">\n                <img *ngIf="appointment.provider && appointment.provider.user.image_url"\n                    data-src="{{appointment.provider.user.image_url}}">\n                <img *ngIf="!appointment.provider || !appointment.provider.user.image_url"\n                    src="assets/imgs/empty_dp.png">\n            </ion-avatar>\n            <h2 class="">\n                <strong class="text-ellipsis">{{appointment.provider.user.name}}</strong>\n                <ion-icon *ngIf="appointment.provider.is_verified == 1" name="checkmark-circle"></ion-icon>\n                <span> | {{appointment.provider.primary_category.title}}</span>\n                <ion-icon name="md-call" class="text-thime" (click)="callProvider()"></ion-icon>\n                <ion-icon name="md-text" class="text-thime" (click)="chatscreen()"></ion-icon>\n            </h2>\n            <div class="details">\n                <p *ngIf="appointment.category" class="">\n                    <small>Job Task</small>\n                    <span class="text-ellipsis">{{appointment.category.title}}</span>\n                </p>\n                <ion-row>\n                    <ion-col col-6>\n                        <p class="">\n                            <small>{{\'booking_for\' | translate}}</small>\n                            <span class="text-ellipsis">\n                                {{appointment.date_formatted}},\n                                {{appointment.time_from_formatted}}-{{appointment.time_to_formatted}}\n                            </span>\n                        </p>\n                    </ion-col>\n                    <ion-col col-6>\n                        <p class="job-fess">\n                            <small>{{\'job_fees\' | translate}}</small>\n                            <span class="text-ellipsis">\n                                {{appointment.provider.priceToShow}} / {{appointment.provider.price_type}}\n                            </span>\n                        </p>\n                    </ion-col>\n                </ion-row>\n                <p class="job-fess">\n                    <small>{{\'address\' | translate}}</small>\n                    <span class="">{{appointment.address.address}}</span>\n                </p>\n            </div>\n        </ion-item>\n    </ion-list>\n    <div *ngIf="appointment.status==\'pending\'||appointment.status==\'accepted\'" class="btn-container">\n        <ion-row>\n            <ion-col col-4>\n                <button ion-button icon-start full (click)="cancelJob()">\n                    <ion-icon name="md-close"></ion-icon>\n                    {{\'cancel\' | translate}}\n                </button>\n            </ion-col>\n            <ion-col col-4>\n                <button ion-button icon-start full (click)="reschedule()">\n                    <ion-icon name="md-refresh"></ion-icon>{{\'reschedule\' | translate}}\n                </button>\n            </ion-col>\n            <ion-col col-4>\n                <button ion-button icon-start full (click)="viewProfile()">\n                    <ion-icon name="md-person"></ion-icon>{{\'view_profile\' | translate}}\n                </button>\n            </ion-col>\n        </ion-row>\n    </div>\n    <div *ngIf="!(appointment.status==\'pending\'||appointment.status==\'accepted\')" class="btn-container">\n        <ion-row>\n            <ion-col>\n                <button ion-button icon-start full>\n                    <ion-icon name="md-checkmark"></ion-icon>\n                    {{statusText}}\n                </button>\n            </ion-col>\n        </ion-row>\n    </div>\n    <div class="job-status">\n        <h2>{{\'job_status\' | translate}}</h2>\n        <ion-list no-lines>\n            <ion-item [ngClass]="statusLevel==1 ? \'active\' : \'disable\'">\n                <span item-start class="circle"></span>\n                <div class="text">\n                    <h4 class="text-ellipsis">{{\'job_\'+appointment.status | translate}}\n                        <small *ngIf="statusLevel1Time">{{statusLevel1Time}}</small>\n                    </h4>\n                </div>\n            </ion-item>\n            <ion-item [ngClass]="statusLevel==2 ? \'active\' : \'disable\'">\n                <span item-start class="circle"></span>\n                <div class="text">\n                    <h4 class="text-ellipsis">{{\'job_in_process\' | translate}}\n                        <small *ngIf="statusLevel2Time">{{statusLevel2Time}}</small>\n                    </h4>\n                    <h2 *ngIf="statusLevel==2" (click)="trackProvider()">{{\'view_in_map\' | translate}}</h2>\n                </div>\n            </ion-item>\n            <ion-item [ngClass]="statusLevel==3 ? \'active\' : \'disable\'">\n                <span item-start class="circle"></span>\n                <div class="text">\n                    <h4 class="text-ellipsis">\n                        {{\'job_completed\' | translate}}\n                        <small>\n                            {{statusLevel3Time}}\n                        </small>\n                    </h4>\n                </div>\n            </ion-item>\n        </ion-list>\n    </div>\n</ion-content>\n<ion-footer *ngIf="canRate">\n    <button class="btn" ion-button round full margin-top (click)="rate()">{{\'review_now\' | translate}}</button>\n</ion-footer>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/booking/booking.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_4__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_11__ionic_native_call_number__["a" /* CallNumber */], __WEBPACK_IMPORTED_MODULE_10__ngx_translate_core__["c" /* TranslateService */]])
    ], BookingPage);
    return BookingPage;
}());

//# sourceMappingURL=booking.js.map

/***/ }),

/***/ 246:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RatePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_rate_request_models__ = __webpack_require__(369);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tabs_tabs__ = __webpack_require__(34);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var RatePage = /** @class */ (function () {
    function RatePage(navCtrl, navParam, service, loadingCtrl, toastCtrl, app) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.app = app;
        this.loadingShown = false;
        this.rateRequest = new __WEBPACK_IMPORTED_MODULE_4__models_rate_request_models__["a" /* RateRequest */]();
        this.subscriptions = [];
        this.appointment = navParam.get("appointment");
        this.rateRequest.rating = 3;
    }
    RatePage.prototype.setRating = function (rating) {
        this.rateRequest.rating = rating;
    };
    RatePage.prototype.submitRating = function () {
        var _this = this;
        if (!this.rateRequest.review || !this.rateRequest.review.length) {
            this.showToast("Write a short review.");
        }
        else {
            this.presentLoading("Submitting review");
            var subscription = this.service.rateProvider(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.appointment.provider_id, this.rateRequest).subscribe(function (res) {
                console.log(res);
                window.localStorage.setItem("rated" + _this.appointment.id, "done");
                _this.dismissLoading();
                _this.showToast("Review submitted");
                _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
            }, function (err) {
                console.log('submit_rating', err);
                _this.dismissLoading();
            });
            this.subscriptions.push(subscription);
        }
    };
    RatePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    RatePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    RatePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    RatePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-rate',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/rate/rate.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'rate_us\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-card class="slip">\n        <div text-center>\n            <h4 class="text-dark">{{\'we_hope_you_had\' | translate}}</h4>\n            <p class="text-light">{{appointment.updated_at}}</p>\n            <!-- <h1 class="text-theme">{{appointment.provider.price}} / {{appointment.provider.price_type}}</h1> -->\n            <!-- <h4 class="text-dark">Payment has been donevia<br>your Vroom Wallet</h4> -->\n        </div>\n    </ion-card>\n    <ion-card class="rate">\n        <div text-center>\n            <p>{{\'kindly_rate_and_review_your_experience_with\' | translate}}</p>\n            <div class="driver">\n                <ion-item>\n                    <ion-avatar item-start>\n                        <img *ngIf="appointment.provider && appointment.provider.user.image_url" data-src="{{appointment.provider.user.image_url}}">\n                        <img *ngIf="!appointment.provider || !appointment.provider.user.image_url" src="assets/imgs/empty_dp.png">\n                    </ion-avatar>\n                    <h2>{{appointment.provider.user.name}}\n                        <ion-icon name="ios-checkmark-circle" class="text-theme"></ion-icon>\n                    </h2>\n                    <p>{{appointment.provider.primary_category.title}}</p>\n                </ion-item>\n                <p class="icons">\n                    <ion-icon name="ios-star" [ngClass]="rateRequest.rating>=1 ? \'active\' : \'\'" (click)="setRating(1)"></ion-icon>\n                    <ion-icon name="ios-star" [ngClass]="rateRequest.rating>=2 ? \'active\' : \'\'" (click)="setRating(2)"></ion-icon>\n                    <ion-icon name="ios-star" [ngClass]="rateRequest.rating>=3 ? \'active\' : \'\'" (click)="setRating(3)"></ion-icon>\n                    <ion-icon name="ios-star" [ngClass]="rateRequest.rating>=4 ? \'active\' : \'\'" (click)="setRating(4)"></ion-icon>\n                    <ion-icon name="ios-star" [ngClass]="rateRequest.rating==5 ? \'active\' : \'\'" (click)="setRating(5)"></ion-icon>\n                </p>\n                <!--<div class="form">-->\n                    <!--<ion-list no-lines>-->\n                        <!--<ion-item>-->\n                            <!--<ion-textarea type="text" [(ngModel)]="rateRequest.review" placeholder="Leave a feedback"></ion-textarea>-->\n                        <!--</ion-item>-->\n                    <!--</ion-list>-->\n                <!--</div>-->\n                <p padding-top>\n                    <button class="btn text-white" ion-button round block (click)="submitRating()">\n                        {{\'submit_rating\' | translate}}\n                    </button>\n                </p>\n            </div>\n        </div>\n    </ion-card>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/rate/rate.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */]])
    ], RatePage);
    return RatePage;
}());

//# sourceMappingURL=rate.js.map

/***/ }),

/***/ 248:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddAddressPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_address_models__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_address_create_request_models__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_my_location_models__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__selectarea_selectarea__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var AddAddressPage = /** @class */ (function () {
    function AddAddressPage(navCtrl, navParam, service, loadingCtrl, toastCtrl, translate, alertCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.alertCtrl = alertCtrl;
        this.gaming = "nes";
        this.where = "nes";
        this.loadingShown = false;
        this.subscriptions = [];
        this.address = navParam.get("address");
        this.translate.get(this.address ? "address_edit" : "address_new").subscribe(function (value) {
            _this.title = value;
        });
        this.addressLocation = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_LOCATION));
        if (!this.addressLocation) {
            this.addressLocation = new __WEBPACK_IMPORTED_MODULE_6__models_my_location_models__["a" /* MyLocation */]();
            this.translate.get("search_location").subscribe(function (value) {
                _this.addressLocation.name = value;
            });
        }
        if (!this.address) {
            this.address = new __WEBPACK_IMPORTED_MODULE_2__models_address_models__["a" /* Address */]();
            this.address.id = -1;
            this.address.latitude = this.addressLocation.lat;
            this.address.longitude = this.addressLocation.lng;
        }
    }
    AddAddressPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.addressLocation = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_LOCATION));
        if (this.addressLocation) {
            this.address.address = this.addressLocation.name;
        }
        else {
            this.addressLocation = new __WEBPACK_IMPORTED_MODULE_6__models_my_location_models__["a" /* MyLocation */]();
            this.translate.get("search_location").subscribe(function (value) {
                _this.addressLocation.name = value;
            });
        }
        this.address.latitude = this.addressLocation.lat;
        this.address.longitude = this.addressLocation.lng;
    };
    AddAddressPage.prototype.onPickLocationClick = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__selectarea_selectarea__["a" /* SelectareaPage */]);
    };
    AddAddressPage.prototype.onSaveClick = function () {
        var _this = this;
        if (!this.address.title || !this.address.title.length) {
            this.translate.get("err_address_title").subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.address.address || !this.address.address.length) {
            this.translate.get("err_address_full").subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (!this.address.latitude || !this.address.longitude) {
            this.translate.get("err_address_coordinates").subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else {
            var addressRequest = new __WEBPACK_IMPORTED_MODULE_4__models_address_create_request_models__["a" /* AddressCreateRequest */]();
            addressRequest.title = this.address.title;
            addressRequest.address = this.address.address;
            addressRequest.lat = this.address.latitude;
            addressRequest.lng = this.address.longitude;
            addressRequest.latitude = this.address.latitude;
            addressRequest.longitude = this.address.longitude;
            if (this.address.id == -1) {
                this.createAddress(addressRequest);
            }
            else {
                this.updateAddress(addressRequest);
            }
        }
    };
    AddAddressPage.prototype.createAddress = function (addressRequest) {
        var _this = this;
        this.translate.get("address_creating").subscribe(function (value) {
            _this.presentLoading(value);
        });
        var subscription = this.service.addAddress(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_TOKEN), addressRequest).subscribe(function (res) {
            _this.dismissLoading();
            var addresses = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_ADDRESS_LIST));
            if (!addresses)
                addresses = new Array();
            addresses.push(res);
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_ADDRESS_LIST, JSON.stringify(addresses));
            _this.navCtrl.pop();
        }, function (err) {
            _this.dismissLoading();
            console.log('address_add_err', err);
        });
        this.subscriptions.push(subscription);
    };
    AddAddressPage.prototype.updateAddress = function (addressRequest) {
        var _this = this;
        this.translate.get("address_updating").subscribe(function (value) {
            _this.presentLoading(value);
        });
        var subscription = this.service.updateAddress(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.address.id, addressRequest).subscribe(function (res) {
            _this.dismissLoading();
            var addresses = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_ADDRESS_LIST));
            if (!addresses)
                addresses = new Array();
            var index = -1;
            for (var i = 0; i < addresses.length; i++) {
                if (addresses[i].id == res.id) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                addresses.splice(index, 1);
            }
            addresses.unshift(res);
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_ADDRESS_LIST, JSON.stringify(addresses));
            _this.navCtrl.pop();
        }, function (err) {
            _this.dismissLoading();
            console.log('address_update_err', err);
        });
        this.subscriptions.push(subscription);
    };
    AddAddressPage.prototype.deleteAddress = function () {
        var _this = this;
        this.translate.get("just_moment").subscribe(function (value) {
            _this.presentLoading(value);
        });
        var subscription = this.service.deleteAddress(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.address.id).subscribe(function (res) {
            _this.dismissLoading();
            var addresses = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_ADDRESS_LIST));
            if (!addresses)
                addresses = new Array();
            var index = -1;
            for (var i = 0; i < addresses.length; i++) {
                if (addresses[i].id == _this.address.id) {
                    index = i;
                    break;
                }
            }
            if (index != -1) {
                addresses.splice(index, 1);
            }
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_ADDRESS_LIST, JSON.stringify(addresses));
            _this.navCtrl.pop();
        }, function (err) {
            _this.dismissLoading();
            console.log('address_delete_err', err);
        });
        this.subscriptions.push(subscription);
    };
    AddAddressPage.prototype.confirmDelete = function () {
        var _this = this;
        this.translate.get(['address_delete_title', 'address_delete_message', 'no', 'yes']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['address_delete_title'],
                message: text['address_delete_message'],
                buttons: [{
                        text: text['no'],
                        role: 'cancel',
                        handler: function () {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: text['yes'],
                        handler: function () {
                            _this.deleteAddress();
                        }
                    }]
            });
            alert.present();
        });
    };
    AddAddressPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    AddAddressPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    AddAddressPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    AddAddressPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-addaddress',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/addaddress/addaddress.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{title}}\n            <span>\n                <ion-icon *ngIf="address.id && address.id!=-1" name="md-trash" (click)="confirmDelete()"></ion-icon>\n            </span>\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div class="form">\n        <ion-list no-lines>\n            <ion-item>\n                <ion-label class="text-grey" floating>{{\'address_title\' | translate}}</ion-label>\n                <ion-input type="text" [(ngModel)]="address.title"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label class="text-grey" floating>{{\'full_address\' | translate}}</ion-label>\n                <ion-input type="text" [(ngModel)]="address.address"></ion-input>\n            </ion-item>\n            <ion-item (click)="onPickLocationClick()" class="select_address">\n                <h3>{{\'location\' | translate}}</h3>\n                <p class="text-grey">\n                    <ion-icon name="ios-pin"></ion-icon> {{addressLocation.name}}\n                </p>\n            </ion-item>\n        </ion-list>\n    </div>\n</ion-content>\n\n<ion-footer>\n    <ion-item class="add-item" (click)="onSaveClick()">\n        <h2 class="text-thime" text-center>\n            <ion-icon name="md-add-circle"></ion-icon>{{\'save\' | translate}}\n        </h2>\n    </ion-item>\n</ion-footer>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/addaddress/addaddress.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], AddAddressPage);
    return AddAddressPage;
}());

//# sourceMappingURL=addaddress.js.map

/***/ }),

/***/ 249:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Connectivity; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_network__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var Connectivity = /** @class */ (function () {
    function Connectivity(platform, network) {
        this.platform = platform;
        this.network = network;
        this.onDevice = this.platform.is('cordova');
    }
    Connectivity.prototype.isOnline = function () {
        if (this.onDevice && this.network.type) {
            return this.network.type != 'none';
        }
        else {
            return navigator.onLine;
        }
    };
    Connectivity.prototype.isOffline = function () {
        if (this.onDevice && this.network.type) {
            return this.network.type == 'none';
        }
        else {
            return !navigator.onLine;
        }
    };
    Connectivity.prototype.watchOnline = function () {
        return this.network.onConnect();
    };
    Connectivity.prototype.watchOffline = function () {
        return this.network.onDisconnect();
    };
    Connectivity = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_network__["a" /* Network */]])
    ], Connectivity);
    return Connectivity;
}());

//# sourceMappingURL=connectivity-service.js.map

/***/ }),

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Helper; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_javascript_time_ago__ = __webpack_require__(349);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_javascript_time_ago_locale_en__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_javascript_time_ago_locale_en___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_javascript_time_ago_locale_en__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants_models__ = __webpack_require__(9);



var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.getChatChild = function (userId, myId) {
        //example: userId="9" and myId="5" -->> chat child = "5-9"
        var values = [userId, myId];
        values.sort(function (one, two) { return (one > two ? -1 : 1); });
        return values[0] + "-" + values[1];
    };
    Helper.getTimeDiff = function (date) {
        __WEBPACK_IMPORTED_MODULE_0_javascript_time_ago__["a" /* default */].addLocale(__WEBPACK_IMPORTED_MODULE_1_javascript_time_ago_locale_en___default.a);
        return new __WEBPACK_IMPORTED_MODULE_0_javascript_time_ago__["a" /* default */]('en-US').format(date);
    };
    Helper.getSetting = function (settingKey) {
        var settings = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__constants_models__["a" /* Constants */].KEY_SETTING));
        var toReturn;
        if (settings) {
            for (var _i = 0, settings_1 = settings; _i < settings_1.length; _i++) {
                var s = settings_1[_i];
                if (s.key == settingKey) {
                    toReturn = s.value;
                    break;
                }
            }
        }
        if (!toReturn)
            toReturn = "";
        return toReturn;
    };
    Helper.getLogTimeForStatus = function (status, logs) {
        var toReturn = "";
        if (status && logs) {
            for (var _i = 0, logs_1 = logs; _i < logs_1.length; _i++) {
                var log = logs_1[_i];
                if (log.status == status) {
                    toReturn = log.created_at;
                    break;
                }
            }
        }
        return toReturn;
    };
    return Helper;
}());

//# sourceMappingURL=helper.models.js.map

/***/ }),

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TrackPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_google_maps__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_diagnostic__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_location_accuracy__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var TrackPage = /** @class */ (function () {
    function TrackPage(navCtrl, menuCtrl, alertCtrl, navParam, translate, maps, platform, diagnostic, locationAccuracy, geolocation, toastCtrl) {
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.alertCtrl = alertCtrl;
        this.translate = translate;
        this.maps = maps;
        this.platform = platform;
        this.diagnostic = diagnostic;
        this.locationAccuracy = locationAccuracy;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.menuCtrl.enable(false, 'myMenu');
        this.appointment = navParam.get("appointment");
    }
    TrackPage.prototype.ionViewDidEnter = function () {
        var component = this;
        this.refLocation = __WEBPACK_IMPORTED_MODULE_2_firebase__["database"]().ref().child("handyman_provider").child(String(this.appointment.provider.user_id));
        this.refLocation.on('value', function (snapshot) {
            var providerLocation = snapshot.val();
            component.checkAndSetLocation(providerLocation);
        });
    };
    TrackPage.prototype.ionViewWillLeave = function () {
        if (this.refLocation) {
            this.refLocation.off();
        }
    };
    TrackPage.prototype.checkAndSetLocation = function (location) {
        var _this = this;
        console.log('inlocation', location);
        if (this.maps.map) {
            var center = new google.maps.LatLng(Number(location.lat), Number(location.lng));
            var posBonds_1 = new google.maps.LatLngBounds();
            if (this.posMe)
                posBonds_1.extend(this.posMe);
            posBonds_1.extend(center);
            if (!this.markerProvider) {
                this.markerProvider = new google.maps.Marker({
                    position: center,
                    map: this.maps.map,
                    title: this.appointment.provider.user.name,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });
                this.markerProvider.setClickable(true);
                this.addInfoWindow(this.markerProvider, "<h4>" + this.appointment.provider.user.name + "</h4>");
            }
            else {
                this.markerProvider.setPosition(center);
            }
            setTimeout(function () {
                _this.maps.map.panTo(posBonds_1.getCenter());
            }, 200);
        }
    };
    TrackPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        if (!this.initialized) {
            var mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(function () {
                _this.initialized = true;
                _this.plotMarkers();
            }).catch(function (err) {
                console.log(err);
                _this.navCtrl.pop();
            });
            mapLoaded.catch(function (err) {
                console.log(err);
                _this.navCtrl.pop();
            });
        }
    };
    TrackPage.prototype.plotMarkers = function () {
        var _this = this;
        var posBonds = new google.maps.LatLngBounds();
        this.posMe = new google.maps.LatLng(Number(this.appointment.address.latitude), Number(this.appointment.address.longitude));
        posBonds.extend(this.posMe);
        if (!this.markerMe) {
            this.markerMe = new google.maps.Marker({
                position: this.posMe,
                map: this.maps.map,
                title: 'You are here!',
                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            });
            this.markerMe.setClickable(true);
            this.addInfoWindow(this.markerMe, "<h4>You are here!</h4>");
        }
        else {
            this.markerMe.setPosition(this.posMe);
        }
        setTimeout(function () {
            _this.maps.map.panTo(posBonds.getCenter());
        }, 200);
    };
    TrackPage.prototype.addInfoWindow = function (marker, content) {
        var _this = this;
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(_this.maps.map, marker);
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ViewChild */])('map'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__angular_core__["t" /* ElementRef */])
    ], TrackPage.prototype, "mapElement", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ViewChild */])('pleaseConnect'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__angular_core__["t" /* ElementRef */])
    ], TrackPage.prototype, "pleaseConnect", void 0);
    TrackPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["m" /* Component */])({
            selector: 'page-track',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/track/track.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            <span class="profile">\n                <img *ngIf="appointment.provider && appointment.provider.user && appointment.provider.user.image_url"\n                    data-src="{{appointment.provider.user.image_url}}">\n                <img *ngIf="!appointment.provider || !appointment.provider.user || !appointment.provider.user.image_url"\n                    src="assets/imgs/empty_dp.png">\n            </span>\n            {{appointment.provider.user.name}}\n            <!-- <small> | {{chat.chatStatus}}</small> -->\n            <!-- <span><ion-icon name="md-more"></ion-icon></span> -->\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div #pleaseConnect id="please-connect">\n        <p>{{\'please_connect_to_the_internet\' | translate}}</p>\n    </div>\n    <div #map id="map">\n        <ion-spinner></ion-spinner>\n    </div>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/track/track.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["h" /* MenuController */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_3__providers_google_maps__["a" /* GoogleMaps */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_diagnostic__["a" /* Diagnostic */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_location_accuracy__["a" /* LocationAccuracy */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["n" /* ToastController */]])
    ], TrackPage);
    return TrackPage;
}());

//# sourceMappingURL=track.js.map

/***/ }),

/***/ 252:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificatinonsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NotificatinonsPage = /** @class */ (function () {
    function NotificatinonsPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.notifications = new Array();
        console.log("NotificationPage");
    }
    NotificatinonsPage.prototype.ionViewDidEnter = function () {
        var notifications = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].KEY_NOTIFICATIONS));
        if (notifications)
            this.notifications = notifications;
    };
    NotificatinonsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-notificatinons',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/notificatinons/notificatinons.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'notis\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div class="empty-view" *ngIf="(!notifications || !notifications.length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_notification.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold;">\n                {{\'empty_notifications\' | translate}}\n            </span>\n        </div>\n    </div>\n    <ion-list *ngIf="notifications && notifications.length" no-lines>\n        <ion-item *ngFor="let item of notifications">\n            <ion-label>\n                <h2>{{item.title}}</h2>\n                <p>{{item.detail}}</p>\n            </ion-label>\n            <ion-note item-end>{{item.time}}</ion-note>\n        </ion-item>\n    </ion-list>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/notificatinons/notificatinons.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], NotificatinonsPage);
    return NotificatinonsPage;
}());

//# sourceMappingURL=notificatinons.js.map

/***/ }),

/***/ 253:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__category_category__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_my_location_models__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__selectarea_selectarea__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_diagnostic__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_geolocation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_location_accuracy__ = __webpack_require__(137);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, service, geolocation, loadingCtrl, toastCtrl, locationAccuracy, diagnostic, alertCtrl, translate) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.service = service;
        this.geolocation = geolocation;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.locationAccuracy = locationAccuracy;
        this.diagnostic = diagnostic;
        this.alertCtrl = alertCtrl;
        this.translate = translate;
        this.loadingShown = false;
        this.categoriesAll = new Array();
        this.subscriptions = [];
        this.selectedLocation = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_LOCATION));
        this.categories = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_CATEGORY));
        if (this.categories)
            this.categoriesAll = this.categories;
        else
            this.translate.get('loading_categories').subscribe(function (value) {
                _this.presentLoading(value);
            });
        this.refreshCategories();
    }
    HomePage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    HomePage.prototype.ionViewDidEnter = function () {
        var _this = this;
        var newSelectedLocation = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_LOCATION));
        this.selectedLocation = newSelectedLocation;
        console.log(newSelectedLocation, '===============');
        if (!this.selectedLocation) {
            this.translate.get('select_location_text').subscribe(function (value) {
                _this.showToast(value);
            });
            this.checkForLocation(false);
        }
    };
    HomePage.prototype.refreshCategories = function () {
        var _this = this;
        var subscription = this.service.categoryParent(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_TOKEN)).subscribe(function (res) {
            _this.dismissLoading();
            var cats = res.data;
            _this.categories = cats;
            _this.categoriesAll = _this.categories;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_CATEGORY, JSON.stringify(_this.categories));
        }, function (err) {
            _this.dismissLoading();
            console.log('cat_err', err);
        });
        this.subscriptions.push(subscription);
    };
    HomePage.prototype.checkForLocation = function (select) {
        var _this = this;
        this.diagnostic.isLocationEnabled().then(function (isAvailable) {
            if (isAvailable) {
                if (select) {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__selectarea_selectarea__["a" /* SelectareaPage */]);
                }
                else {
                    _this.geolocation.getCurrentPosition().then(function (resp) {
                        _this.selectedLocation = new __WEBPACK_IMPORTED_MODULE_3__models_my_location_models__["a" /* MyLocation */]();
                        _this.translate.get('home').subscribe(function (value) {
                            _this.selectedLocation.name = value;
                        });
                        _this.selectedLocation.lat = String(resp.coords.latitude);
                        _this.selectedLocation.lng = String(resp.coords.longitude);
                        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_LOCATION, JSON.stringify(_this.selectedLocation));
                        _this.translate.get('current_location_success').subscribe(function (value) {
                            _this.showToast(value);
                        });
                    }).catch(function (error) {
                        console.log('Error getting location', error);
                        _this.translate.get('current_location_error').subscribe(function (value) {
                            _this.showToast(value);
                        });
                    });
                }
            }
            else {
                _this.alertLocationServices();
            }
        }).catch(function (e) {
            console.error(e);
            _this.alertLocationServices();
        });
    };
    HomePage.prototype.alertLocationServices = function () {
        var _this = this;
        this.translate.get(['location_services_title', 'location_services_message', 'okay']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['location_services_title'],
                subTitle: text['location_services_message'],
                buttons: [{
                        text: text['okay'],
                        role: 'cancel',
                        handler: function () {
                            _this.locationAccuracy.canRequest().then(function (canRequest) {
                                if (canRequest) {
                                    _this.locationAccuracy.request(_this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(function () {
                                        console.log('Request successful');
                                    }, function (error) {
                                        console.log('Error requesting location permissions', error);
                                    });
                                }
                            });
                        }
                    }]
            });
            alert.present();
        });
    };
    HomePage.prototype.subCatPage = function (cat) {
        var _this = this;
        if (this.selectedLocation) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__category_category__["a" /* CategoryPage */], { cat: cat });
        }
        else {
            this.translate.get('err_select_location').subscribe(function (value) {
                _this.showToast(value);
            });
        }
    };
    HomePage.prototype.getItems = function (searchbar) {
        this.filterCategories(searchbar.srcElement.value);
    };
    HomePage.prototype.filterCategories = function (query) {
        var filtered = new Array();
        if (query && query.length) {
            for (var _i = 0, _a = this.categoriesAll; _i < _a.length; _i++) {
                var cat = _a[_i];
                if (cat.title.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                    filtered.push(cat);
                }
            }
            this.categories = filtered;
        }
        else {
            this.categories = this.categoriesAll;
        }
    };
    HomePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    HomePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    HomePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/home/home.html"*/'<ion-header class="bg-transparent ">\n    <ion-navbar>\n        <ion-title>\n            <ion-icon name="pin" class="text-white pin-icon"></ion-icon>\n            <span class="city" style="margin-left: 0 !important;" (click)="checkForLocation(true)">\n                <ion-label class="my_address text-white" *ngIf="selectedLocation">{{\'location_for_service\' | translate}}<br>{{selectedLocation.name}}</ion-label>\n                <ion-label *ngIf="!selectedLocation" class="text-white">{{\'select_location\' | translate}}</ion-label>\n            </span>\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div class="banner" *ngIf="!isShowPayment">\n        <!--<img src="assets/imgs/banner.jpg">-->\n        <h1 class="text-white">{{\'how_can_we_help_you_today\' | translate}}</h1>\n    </div>\n    <!--<ion-searchbar (ionInput)="getItems($event)" placeholder="{{\'search_for_service\' | translate}}"></ion-searchbar>-->\n\n    <div *ngIf="categories && categories.length">\n        <ion-item *ngFor="let cat of categories" (click)="subCatPage(cat)">\n            <div class="menu-item">\n                <img data-src="{{cat.image_url}}">\n                <p class="text-ellipsis cat-title">{{cat.title}}</p>\n            </div>\n        </ion-item>\n    </div>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/home/home.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_6__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_6__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_9__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_10__ionic_native_location_accuracy__["a" /* LocationAccuracy */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_diagnostic__["a" /* Diagnostic */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__["c" /* TranslateService */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoryPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__listofplumber_listofplumber__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CategoryPage = /** @class */ (function () {
    function CategoryPage(navCtrl, params, service, loadingCtrl, toastCtrl, translate) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.loadingShown = false;
        this.isLoading = false;
        this.subscriptions = [];
        this.parentCategory = params.get("cat");
        if (this.parentCategory) {
            this.translate.get('loading_categories_sub').subscribe(function (value) {
                _this.presentLoading(value);
            });
            this.loadChildCategories(this.parentCategory.id);
        }
    }
    CategoryPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    CategoryPage.prototype.loadChildCategories = function (parentId) {
        var _this = this;
        this.isLoading = true;
        var subscription = this.service.categoryChildren(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_TOKEN), parentId).subscribe(function (res) {
            _this.isLoading = false;
            _this.dismissLoading();
            var cats = res.data;
            _this.subCategories = cats;
        }, function (err) {
            _this.isLoading = false;
            _this.dismissLoading();
            console.log('cat_sub_err', err);
        });
        this.subscriptions.push(subscription);
    };
    CategoryPage.prototype.subCatDetail = function (cat) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__listofplumber_listofplumber__["a" /* ListofplumberPage */], { cat: cat });
    };
    CategoryPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    CategoryPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    CategoryPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    CategoryPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-category',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/category/category.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            <span>\n                <!-- <ion-icon name="md-search"></ion-icon> -->\n            </span>\n        </ion-title>\n    </ion-navbar>\n    <div class="logo-box bg-thime">\n        <div *ngIf="parentCategory" class="logo" text-center>\n            <img data-src="{{parentCategory.secondary_image_url}}">\n            <p class="text-white">{{parentCategory.title}}</p>\n        </div>\n    </div>\n</ion-header>\n\n<ion-content>\n    <div class="empty-view" *ngIf="!isLoading && (!subCategories || !subCategories.length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_category.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold;">\n                {{\'empty_categories_sub\' | translate}}\n            </span>\n        </div>\n    </div>\n<ion-list *ngIf="subCategories && subCategories.length" no-lines>\n    <ion-item *ngFor="let cat of subCategories" (click)="subCatDetail(cat)">\n        <h2><span class="text-ellipsis">{{cat.title}}</span>\n            <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n        </h2>\n    </ion-item>\n</ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/category/category.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */]])
    ], CategoryPage);
    return CategoryPage;
}());

//# sourceMappingURL=category.js.map

/***/ }),

/***/ 255:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListofplumberPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__plumberprofile_plumberprofile__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_helper_models__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ListofplumberPage = /** @class */ (function () {
    function ListofplumberPage(navCtrl, params, service, loadingCtrl, toastCtrl, translate) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.loadingShown = false;
        this.isLoading = false;
        this.doneAll = false;
        this.pageNo = 1;
        this.subscriptions = [];
        this.providers = [];
        this.category = params.get("cat");
        this.currency = __WEBPACK_IMPORTED_MODULE_5__models_helper_models__["a" /* Helper */].getSetting("currency");
        if (this.category && this.category.id) {
            this.selectedLocation = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_LOCATION));
            this.translate.get('loading_providers').subscribe(function (value) {
                _this.presentLoading(value);
            });
            this.getProviders();
        }
    }
    ListofplumberPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    ListofplumberPage.prototype.getProviders = function () {
        var _this = this;
        this.isLoading = true;
        var subscription = this.service.providers(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_TOKEN), String(this.category.id), this.selectedLocation.lat, this.selectedLocation.lng, String(this.pageNo)).subscribe(function (res) {
            _this.isLoading = false;
            _this.dismissLoading();
            for (var _i = 0, _a = res.data; _i < _a.length; _i++) {
                var p = _a[_i];
                p.priceToShow = _this.currency + p.price;
            }
            _this.doneAll = (!res.data || !res.data.length);
            _this.providers = _this.providers.concat(res.data);
            if (_this.infiniteScroll) {
                _this.infiniteScroll.complete();
            }
        }, function (err) {
            _this.isLoading = false;
            _this.dismissLoading();
            if (_this.infiniteScroll) {
                _this.infiniteScroll.complete();
            }
            console.log('prov_list_err', err);
        });
        this.subscriptions.push(subscription);
    };
    ListofplumberPage.prototype.doInfinite = function (infiniteScroll) {
        if (this.doneAll) {
            infiniteScroll.complete();
        }
        else {
            this.infiniteScroll = infiniteScroll;
            this.pageNo = this.pageNo + 1;
            this.getProviders();
        }
    };
    ListofplumberPage.prototype.profileDetail = function (proProf) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__plumberprofile_plumberprofile__["a" /* PlumberprofilePage */], { profile: proProf, category_id: this.category.id });
    };
    ListofplumberPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    ListofplumberPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    ListofplumberPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    ListofplumberPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-listofplumber',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/listofplumber/listofplumber.html"*/'<ion-header class="bg-thime">\n    <ion-navbar>\n        <ion-title>\n            {{category.title}}\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content *ngIf="providers" class="bg-light">\n    <div class="empty-view" *ngIf="!isLoading && (!providers || !providers.length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_provider.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold;">\n                    {{\'empty_providers\' | translate}}\n            </span>\n        </div>\n    </div>\n    <ion-list no-lines>\n        <ion-item *ngFor="let profile of providers" class="" (click)="profileDetail(profile)">\n            <ion-avatar item-start>\n                <img *ngIf="profile && profile.user.image_url" data-src="{{profile.user.image_url}}">\n                <img *ngIf="!profile || !profile.user.image_url" src="assets/imgs/empty_dp.png">\n            </ion-avatar>\n            <h2>\n                <span class="text-ellipsis">\n                    {{profile.user.name}}\n                </span>\n                <ion-icon *ngIf="profile.is_verified == 1" name="checkmark-circle"></ion-icon>\n                <span class="text-grey small">\n                    | {{profile.primary_category.title}}\n                </span>\n                <span class="ml-auto small text-green">{{profile.ratings}} \n                    <ion-icon name="md-star"></ion-icon>\n                    <small class="text-grey">({{profile.ratingscount}})</small>\n                </span>\n            </h2>\n            <p class="text-grey">\n                <span class="text-ellipsis">\n                    {{profile.priceToShow}} / per {{profile.price_type}}\n                </span>\n                <span class="ml-auto text-ellipsis">{{profile.distance}} {{\'m_away\' | translate}}</span></p>\n        </ion-item>\n    </ion-list>\n    <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n        <ion-infinite-scroll-content></ion-infinite-scroll-content>\n    </ion-infinite-scroll>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/listofplumber/listofplumber.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__["c" /* TranslateService */]])
    ], ListofplumberPage);
    return ListofplumberPage;
}());

//# sourceMappingURL=listofplumber.js.map

/***/ }),

/***/ 256:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AccountPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__manageaddress_manageaddress__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contact_contact__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__privacy_privacy__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__about_about__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__faqs_faqs__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__signin_signin__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_firebase_service__ = __webpack_require__(382);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__managelanguage_managelanguage__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__models_helper_models__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__angular_common_http__ = __webpack_require__(122);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var AccountPage = /** @class */ (function () {
    function AccountPage(navCtrl, app, alertCtrl, service, loadingCtrl, translate, toastCtrl, firebaseService, events, http) {
        this.navCtrl = navCtrl;
        this.app = app;
        this.alertCtrl = alertCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.translate = translate;
        this.toastCtrl = toastCtrl;
        this.firebaseService = firebaseService;
        this.events = events;
        this.http = http;
        this.loadingShown = false;
        this.userMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].KEY_USER));
    }
    AccountPage.prototype.ionViewWillLeave = function () {
        this.events.publish('cango:exit', false);
    };
    AccountPage.prototype.ionViewDidEnter = function () {
        this.events.publish('cango:exit', true);
    };
    AccountPage.prototype.pickPicker = function () {
        if (this.progress)
            return;
        var fileInput = document.getElementById("profile-image");
        fileInput.click();
    };
    AccountPage.prototype.upload = function ($event, isImage) {
        var _this = this;
        var file = $event.target.files[0];
        if (file) {
            if (isImage && !file.type.includes("image")) {
                this.translate.get("err_choose_image").subscribe(function (value) {
                    _this.showToast(value);
                });
                return;
            }
            this.progress = true;
            this.translate.get(isImage ? "uploading_image" : "uploading_doc").subscribe(function (value) {
                _this.presentLoading(value);
            });
            this.firebaseService.uploadFile(file).then(function (url) {
                _this.dismissLoading();
                _this.progress = false;
                if (isImage) {
                    _this.userMe.image_url = String(url);
                    _this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].KEY_TOKEN), { image_url: String(url) }).subscribe(function (res) {
                        console.log(res);
                        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].KEY_USER, JSON.stringify(res));
                    }, function (err) {
                        console.log('update_user', err);
                    });
                }
            }).catch(function (err) {
                _this.dismissLoading();
                _this.progress = false;
                console.log(err);
                _this.translate.get("uploading_fail").subscribe(function (value) {
                    _this.presentErrorAlert(value);
                });
            });
        }
    };
    AccountPage.prototype.manageaddress = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__manageaddress_manageaddress__["a" /* ManageaddressPage */], { edit: true });
    };
    AccountPage.prototype.contact = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__contact_contact__["a" /* ContactPage */]);
    };
    AccountPage.prototype.privacy = function () {
        var _this = this;
        var terms = __WEBPACK_IMPORTED_MODULE_13__models_helper_models__["a" /* Helper */].getSetting("privacy_policy");
        if (terms && terms.length) {
            this.translate.get('privacy_policy').subscribe(function (value) {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__privacy_privacy__["a" /* PrivacyPage */], { toShow: terms, heading: value });
            });
        }
    };
    AccountPage.prototype.about = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__about_about__["a" /* AboutPage */]);
    };
    AccountPage.prototype.faqs = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__faqs_faqs__["a" /* FaqsPage */]);
    };
    AccountPage.prototype.chooseLanguage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__managelanguage_managelanguage__["a" /* ManagelanguagePage */]);
    };
    AccountPage.prototype.alertLogout = function () {
        var _this = this;
        this.translate.get(['logout_title', 'logout_message', 'no', 'yes']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['logout_title'],
                message: text['logout_message'],
                buttons: [{
                        text: text['no'],
                        role: 'cancel',
                        handler: function () {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: text['yes'],
                        handler: function () {
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].KEY_USER);
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].KEY_TOKEN);
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].KEY_NOTIFICATIONS);
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].KEY_ADDRESS_LIST);
                            _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_7__signin_signin__["a" /* SigninPage */]);
                        }
                    }]
            });
            alert.present();
        });
    };
    AccountPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    AccountPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    AccountPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    AccountPage.prototype.presentErrorAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: "Error",
            subTitle: msg,
            buttons: ["Dismiss"]
        });
        alert.present();
    };
    AccountPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-account',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/account/account.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'account\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-list no-lines>\n        <ion-item class="profile">\n            <ion-avatar item-start (click)="pickPicker(1)">\n                <img *ngIf="userMe && userMe.image_url" data-src="{{userMe.image_url}}">\n                <img *ngIf="!userMe || !userMe.image_url" src="assets/imgs/empty_dp.png">\n                <ion-icon name="md-camera"></ion-icon>\n                <input id="profile-image" style="display: none" (change)="upload($event, true)" type="file">\n            </ion-avatar>\n            <h2>\n                <span class="text-ellipsis">\n                    {{userMe.name}}\n                </span>\n            </h2>\n            <p class="text-grey">{{userMe.mobile_number}}</p>\n        </ion-item>\n\n        <ion-item class="" (click)="manageaddress()">\n            <h2>\n                <ion-icon name="ios-pin" class="mr-auto text-thime"></ion-icon> <span class="text-ellipsis">\n                    {{\'manage_address\' | translate}}</span>\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n            </h2>\n        </ion-item>\n        <ion-item class="" (click)="contact()">\n            <h2>\n                <ion-icon name="ios-mail" class="mr-auto text-thime"></ion-icon> <span class="text-ellipsis">{{\'contact_us\'\n                    | translate}}</span>\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n            </h2>\n        </ion-item>\n        <ion-item class="" (click)="privacy()">\n            <h2>\n                <ion-icon name="md-lock" class="mr-auto text-thime"></ion-icon> <span class="text-ellipsis">\n                    {{\'privacy_policy\' | translate}}</span>\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n            </h2>\n        </ion-item>\n        <ion-item class="" (click)="about()">\n            <h2>\n                <ion-icon class="mr-auto text-thime"> <img src="assets/imgs/about-icon.png"></ion-icon> <span\n                    class="text-ellipsis">\n                    {{\'about_us\' | translate}}</span>\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n            </h2>\n        </ion-item>\n        <ion-item class="" (click)="chooseLanguage()">\n            <h2>\n                <ion-icon name="md-globe" class="mr-auto text-thime"></ion-icon> <span class="text-ellipsis">\n                    {{\'change_language\' | translate}}</span>\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n            </h2>\n        </ion-item>\n    </ion-list>\n    <ion-list no-lines (click)="alertLogout()">\n        <ion-item class="sign-out">\n            <h2 text-center>\n                <strong class="text-ellipsis text-thime" text-center>{{\'Sign out\' | translate}}</strong>\n            </h2>\n        </ion-item>\n    </ion-list>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/account/account.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_9__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_10__providers_firebase_service__["a" /* FirebaseClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_9__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_11__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_10__providers_firebase_service__["a" /* FirebaseClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_14__angular_common_http__["a" /* HttpClient */]])
    ], AccountPage);
    return AccountPage;
}());

//# sourceMappingURL=account.js.map

/***/ }),

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_support_request_models__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_call_number__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_helper_models__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ContactPage = /** @class */ (function () {
    function ContactPage(navCtrl, service, callNumber, loadingCtrl, toastCtrl, translate) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.callNumber = callNumber;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.loadingShown = false;
        this.subscriptions = [];
        this.userMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].KEY_USER));
        this.supportRequest = new __WEBPACK_IMPORTED_MODULE_3__models_support_request_models__["a" /* SupportRequest */](this.userMe.name, this.userMe.email, "");
    }
    ContactPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    ContactPage.prototype.dialSupport = function () {
        var phoneNumber = __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].getSetting("support_phone");
        if (phoneNumber) {
            this.callNumber.callNumber(phoneNumber, true).then(function (res) { return console.log('Launched dialer!', res); }).catch(function (err) { return console.log('Error launching dialer', err); });
        }
    };
    ContactPage.prototype.submitSupport = function () {
        var _this = this;
        if (!this.supportRequest.message || !this.supportRequest.message.length) {
            this.translate.get("err_valid_support_msg").subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else {
            this.translate.get("supporting").subscribe(function (value) {
                _this.presentLoading(value);
            });
            var subscription = this.service.submitSupport(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.supportRequest).subscribe(function (res) {
                _this.dismissLoading();
                _this.translate.get("supporting_success").subscribe(function (value) {
                    _this.showToast(value);
                });
                _this.navCtrl.pop();
            }, function (err) {
                _this.navCtrl.pop();
                _this.dismissLoading();
                console.log('support', err);
            });
            this.subscriptions.push(subscription);
        }
    };
    ContactPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    ContactPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    ContactPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    ContactPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-contact',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/contact/contact.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'contact_us\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <!--    <img src="../../assets/imgs/20.png">-->\n    <!--<div class="call-now bg-thime">-->\n        <!--<h6 text-center class=" text-white">{{\'call_to_speak_with_us\' | translate}}</h6>-->\n        <!--<button class="btn text-thime" ion-button round full margin-top margin-bottom icon-start (click)="dialSupport()">-->\n            <!--<ion-icon name="md-call" padding-right></ion-icon><strong>{{\'call_now\' | translate}}</strong>-->\n        <!--</button>-->\n    <!--</div>-->\n    <h5 text-center margin-top margin-bottom padding-bottom class="text-thime">{{\'or_write_us_your_issue\' | translate}}</h5>\n\n    <div class="form">\n        <ion-list no-lines padding-bottom>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-person" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'your_name\' | translate}}</ion-label>\n                <ion-input type="text" [readonly]="true" [(ngModel)]="userMe.name"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-avatar item-start style="margin-bottom: 3px; margin-right: 28px;">\n                    <ion-icon name="md-phone-portrait" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'mobile_number\' | translate}}</ion-label>\n                <ion-input type="text" [readonly]="true" [(ngModel)]="userMe.mobile_number"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-avatar item-start style="margin-bottom: 3px; margin-right: 28px;">\n                    <ion-icon name="md-mail" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey">{{\'your_message\' | translate}}</ion-label>\n                <ion-textarea type="text" rows="1" maxLength="500" (keyup)="resize()" class="placeholder-color" [(ngModel)]="supportRequest.message" placeholder="Type your message here"></ion-textarea>\n            </ion-item>\n        </ion-list>\n    </div>\n</ion-content>\n<ion-footer>\n    <button class="btn" ion-button round full margin-top (click)="submitSupport()">{{\'submit\' | translate}}</button>\n</ion-footer>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/contact/contact.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_4__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_call_number__["a" /* CallNumber */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__["c" /* TranslateService */]])
    ], ContactPage);
    return ContactPage;
}());

//# sourceMappingURL=contact.js.map

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_config__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_helper_models__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var AboutPage = /** @class */ (function () {
    function AboutPage(config, navCtrl) {
        this.config = config;
        this.navCtrl = navCtrl;
        this.aboutUs = "";
        this.aboutUs = __WEBPACK_IMPORTED_MODULE_3__models_helper_models__["a" /* Helper */].getSetting("about_us");
    }
    AboutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-about',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/about/about.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            {{\'about_us\' | translate}}\n        </ion-title>\n    </ion-navbar>\n    <div class="logo-box bg-thime">\n        <div class="logo">\n            <img src="assets/imgs/cityzen-massage-app.png">\n            <h1 class="text-white">{{config.appName}}</h1>\n        </div>\n    </div>\n</ion-header>\n\n<ion-content>\n    <div class="text">\n        <h2 class="text-thime">{{\'about_us\' | translate}}</h2>\n        <div [innerHTML]="aboutUs"></div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/about/about.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], AboutPage);
    return AboutPage;
}());

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 259:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FaqsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FaqsPage = /** @class */ (function () {
    function FaqsPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    FaqsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-faqs',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/faqs/faqs.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>FAQs & Terms</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-list no-lines>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">About Services</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">Sign in & Sign up</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">Payment Policy</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">Searching Service</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">Ratings</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">Chatting</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n    </ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/faqs/faqs.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], FaqsPage);
    return FaqsPage;
}());

//# sourceMappingURL=faqs.js.map

/***/ }),

/***/ 260:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ManagelanguagePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__signin_signin__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_app_config__ = __webpack_require__(28);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var ManagelanguagePage = /** @class */ (function () {
    function ManagelanguagePage(config, events, app) {
        this.config = config;
        this.events = events;
        this.app = app;
        this.defaultLanguageCode = "en";
        var defaultLang = window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].KEY_DEFAULT_LANGUAGE);
        if (defaultLang)
            this.defaultLanguageCode = defaultLang;
    }
    ManagelanguagePage.prototype.onLanguageClick = function (language) {
        this.defaultLanguageCode = language.code;
    };
    ManagelanguagePage.prototype.languageConfirm = function () {
        this.events.publish('language:selection', this.defaultLanguageCode);
        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].KEY_DEFAULT_LANGUAGE, this.defaultLanguageCode);
        var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].KEY_USER));
        this.app.getRootNav().setRoot(user ? __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */] : __WEBPACK_IMPORTED_MODULE_4__signin_signin__["a" /* SigninPage */]);
    };
    ManagelanguagePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-managelanguage',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/managelanguage/managelanguage.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'choose_language\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-list no-lines>\n        <ion-item *ngFor="let language of config.availableLanguages" (click)="onLanguageClick(language)">\n            <h3>{{language.name}}</h3>\n            <ion-icon *ngIf="defaultLanguageCode == language.code" name="md-globe" item-end></ion-icon>\n        </ion-item>\n    </ion-list>\n</ion-content>\n<ion-footer>\n    <ion-item class="add-item" (click)="languageConfirm()">\n        <h2 class="text-thime" text-center>\n            {{\'confirm\' | translate}}\n        </h2>\n    </ion-item>\n</ion-footer>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/managelanguage/managelanguage.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */]])
    ], ManagelanguagePage);
    return ManagelanguagePage;
}());

//# sourceMappingURL=managelanguage.js.map

/***/ }),

/***/ 261:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__chatscreen_chatscreen__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_chat_models__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_sqlite__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ChatPage = /** @class */ (function () {
    function ChatPage(navCtrl, sqlite) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.chats = new Array();
        this.loadedOnce = true;
        this.userMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_USER));
        sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then(function (db) {
            _this.db = db;
            db.executeSql('CREATE TABLE IF NOT EXISTS chat(chatId TEXT PRIMARY KEY, myId TEXT, dateTimeStamp TEXT, lastMessage TEXT, chatName TEXT, chatImage TEXT, chatStatus TEXT, isGroup INT, isRead INT)', []).then(function (res) {
                console.log('ExecutedTABLE', res);
                db.executeSql('SELECT * FROM chat WHERE myId = ? AND isGroup = ? ORDER BY dateTimeStamp DESC', [_this.userMe.id, 0]).then(function (res) {
                    _this.chats = new Array();
                    for (var i = 0; i < res.rows.length; i++) {
                        var chat = new __WEBPACK_IMPORTED_MODULE_3__models_chat_models__["a" /* Chat */]();
                        chat.fromRow(res.rows.item(i));
                        _this.chats.push(chat);
                    }
                    _this.loadedOnce = true;
                }).catch(function (e) { return console.log(e); });
            }).catch(function (e) {
                console.log(e);
            });
        }).catch(function (e) { console.log(e); });
    }
    ChatPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        if (this.db && !this.loadedOnce) {
            this.db.executeSql('SELECT * FROM chat WHERE myId = ? AND isGroup = ? ORDER BY dateTimeStamp DESC', [this.userMe.id, 0]).then(function (res) {
                var chats = new Array();
                for (var i = 0; i < res.rows.length; i++) {
                    var chat = new __WEBPACK_IMPORTED_MODULE_3__models_chat_models__["a" /* Chat */]();
                    chat.fromRow(res.rows.item(i));
                    chats.push(chat);
                }
                _this.chats = chats;
            }).catch(function (e) { return console.log(e); });
        }
        if (this.loadedOnce)
            this.loadedOnce = false;
    };
    ChatPage.prototype.chatscreen = function (chat) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__chatscreen_chatscreen__["a" /* ChatscreenPage */], { chat: chat });
    };
    ChatPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-chat',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/chat/chat.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'chat\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div class="empty-view" *ngIf="(!chats || !chats.length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_category.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold;">\n                {{\'no_chats_to_show\' | translate}}\n            </span>\n        </div>\n    </div>\n    <ion-list no-lines>\n        <ion-item *ngFor="let chat of chats" (click)="chatscreen(chat)">\n            <ion-avatar item-start>\n                <img *ngIf="chat.chatImage && chat.chatImage.length" data-src="{{chat.chatImage}}">\n                <img *ngIf="!chat.chatImage || !chat.chatImage.length" src="assets/imgs/empty_dp.png">\n            </ion-avatar>\n            <h2><span class="text-ellipsis">{{chat.chatName}}</span>\n                <span class="text-light-grey small">&nbsp; | {{chat.chatStatus}}</span>\n                <span class="ml-auto small">{{chat.timeDiff}}</span>\n            </h2>\n            <p class="text-grey text-ellipsis">{{chat.lastMessage}}</p>\n        </ion-item>\n    </ion-list>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/chat/chat.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_sqlite__["a" /* SQLite */]])
    ], ChatPage);
    return ChatPage;
}());

//# sourceMappingURL=chat.js.map

/***/ }),

/***/ 265:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(266);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(279);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 279:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createTranslateLoader */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(319);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_about_about__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_account_account__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_booking_booking__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_booknow_booknow__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_category_category__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_chat_chat__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_chatscreen_chatscreen__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_contact_contact__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_faqs_faqs__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_forgotpassword_forgotpassword__ = __webpack_require__(387);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_home_home__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_listofplumber_listofplumber__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_manageaddress_manageaddress__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_notificatinons_notificatinons__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_privacy_privacy__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_plumberprofile_plumberprofile__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_requests_requests__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_signup_signup__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_signin_signin__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_otp_otp__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ionic_native_status_bar__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ionic_native_splash_screen__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ionic_native_facebook__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ionic_native_google_plus__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__app_config__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__angular_common_http__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_rate_rate__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__ionic_native_geolocation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__ionic_native_network__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__providers_connectivity_service__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__providers_google_maps__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_selectarea_selectarea__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__ionic_native_sqlite__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__ionic_native_onesignal__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__pages_addaddress_addaddress__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__ionic_native_call_number__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__ionic_native_globalization__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__ngx_translate_http_loader__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__ionic_native_diagnostic__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__ionic_native_location_accuracy__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__pages_track_track__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__pages_managelanguage_managelanguage__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__ionic_native_paypal_ngx__ = __webpack_require__(390);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__pages_booknow_url_satinaizer_pipe__ = __webpack_require__(391);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




















































function createTranslateLoader(http) {
    return new __WEBPACK_IMPORTED_MODULE_43__ngx_translate_http_loader__["a" /* TranslateHttpLoader */](http, './assets/i18n/', '.json');
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_account_account__["a" /* AccountPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_booking_booking__["a" /* BookingPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_booknow_booknow__["a" /* BooknowPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_category_category__["a" /* CategoryPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_chat_chat__["a" /* ChatPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_chatscreen_chatscreen__["a" /* ChatscreenPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_faqs_faqs__["a" /* FaqsPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_forgotpassword_forgotpassword__["a" /* ForgotpasswordPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_listofplumber_listofplumber__["a" /* ListofplumberPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_manageaddress_manageaddress__["a" /* ManageaddressPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_notificatinons_notificatinons__["a" /* NotificatinonsPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_privacy_privacy__["a" /* PrivacyPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_plumberprofile_plumberprofile__["a" /* PlumberprofilePage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_requests_requests__["a" /* RequestsPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_signin_signin__["a" /* SigninPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_otp_otp__["a" /* OtpPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_rate_rate__["a" /* RatePage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_selectarea_selectarea__["a" /* SelectareaPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_addaddress_addaddress__["a" /* AddAddressPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_track_track__["a" /* TrackPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_managelanguage_managelanguage__["a" /* ManagelanguagePage */],
                __WEBPACK_IMPORTED_MODULE_49__pages_booknow_url_satinaizer_pipe__["a" /* SafePipe */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_30__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_42__ngx_translate_core__["b" /* TranslateModule */].forRoot({
                    loader: {
                        provide: __WEBPACK_IMPORTED_MODULE_42__ngx_translate_core__["a" /* TranslateLoader */],
                        useFactory: createTranslateLoader,
                        deps: [__WEBPACK_IMPORTED_MODULE_30__angular_common_http__["a" /* HttpClient */]]
                    }
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_account_account__["a" /* AccountPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_booking_booking__["a" /* BookingPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_booknow_booknow__["a" /* BooknowPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_category_category__["a" /* CategoryPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_chat_chat__["a" /* ChatPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_chatscreen_chatscreen__["a" /* ChatscreenPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_faqs_faqs__["a" /* FaqsPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_forgotpassword_forgotpassword__["a" /* ForgotpasswordPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_listofplumber_listofplumber__["a" /* ListofplumberPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_manageaddress_manageaddress__["a" /* ManageaddressPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_notificatinons_notificatinons__["a" /* NotificatinonsPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_privacy_privacy__["a" /* PrivacyPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_plumberprofile_plumberprofile__["a" /* PlumberprofilePage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_requests_requests__["a" /* RequestsPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_signin_signin__["a" /* SigninPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_otp_otp__["a" /* OtpPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_rate_rate__["a" /* RatePage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_selectarea_selectarea__["a" /* SelectareaPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_addaddress_addaddress__["a" /* AddAddressPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_track_track__["a" /* TrackPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_managelanguage_managelanguage__["a" /* ManagelanguagePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_25__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_26__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_32__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_33__ionic_native_network__["a" /* Network */],
                __WEBPACK_IMPORTED_MODULE_34__providers_connectivity_service__["a" /* Connectivity */],
                __WEBPACK_IMPORTED_MODULE_35__providers_google_maps__["a" /* GoogleMaps */],
                __WEBPACK_IMPORTED_MODULE_27__ionic_native_facebook__["a" /* Facebook */], __WEBPACK_IMPORTED_MODULE_28__ionic_native_google_plus__["a" /* GooglePlus */],
                __WEBPACK_IMPORTED_MODULE_37__ionic_native_sqlite__["a" /* SQLite */],
                __WEBPACK_IMPORTED_MODULE_38__ionic_native_onesignal__["a" /* OneSignal */],
                __WEBPACK_IMPORTED_MODULE_40__ionic_native_call_number__["a" /* CallNumber */],
                __WEBPACK_IMPORTED_MODULE_42__ngx_translate_core__["c" /* TranslateService */],
                __WEBPACK_IMPORTED_MODULE_41__ionic_native_globalization__["a" /* Globalization */],
                __WEBPACK_IMPORTED_MODULE_44__ionic_native_diagnostic__["a" /* Diagnostic */],
                __WEBPACK_IMPORTED_MODULE_45__ionic_native_location_accuracy__["a" /* LocationAccuracy */],
                __WEBPACK_IMPORTED_MODULE_48__ionic_native_paypal_ngx__["a" /* PayPal */],
                { provide: __WEBPACK_IMPORTED_MODULE_29__app_config__["a" /* APP_CONFIG */], useValue: __WEBPACK_IMPORTED_MODULE_29__app_config__["b" /* BaseAppConfig */] },
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 28:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APP_CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BaseAppConfig; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);

var APP_CONFIG = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* InjectionToken */]("app.config");
var BaseAppConfig = {
    appName: "Cityzen Wellness App",
    apiBase: "http://157.230.30.139/public/api/",
    googleApiKey: "AIzaSyDEH-VISwD1jkXSVdmWNB_xAS0CVVMlUe4",
    oneSignalAppId: "2422a396-85fd-4e7b-868f-df169f7e1c0c",
    oneSignalGPSenderId: "",
    paymentUrl: 'https://payments.cityzen.center',
    availableLanguages: [
        {
            code: 'en',
            name: 'English'
        },
        {
            code: 'ua',
            name: 'Ukrainian'
        },
        {
            code: 'bg',
            name: 'Български'
        },
        {
            code: 'ar',
            name: 'عربى'
        },
        {
            code: 'hu',
            name: 'Magyar'
        },
        {
            code: 'cz',
            name: 'Czech'
        },
    ],
    firebaseConfig: {
        webApplicationId: "436254256867-e6r3okpcmd92pqfveu29r22mmnm52aku.apps.googleusercontent.com",
        apiKey: "AIzaSyCPM9s28GeKplJ6iM2DEprHHPyuWkAPEUk",
        authDomain: "cityzen-wellness-app.firebaseapp.com",
        databaseURL: "https://cityzen-wellness-app.firebaseio.com/",
        projectId: "cityzen-wellness-app",
        storageBucket: "gs://cityzen-wellness-app.appspot.com/",
        messagingSenderId: "436254256867"
    },
};
//# sourceMappingURL=app.config.js.map

/***/ }),

/***/ 319:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_signin_signin__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_firebase__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_sqlite__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_onesignal__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_globalization__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__models_notification_models__ = __webpack_require__(386);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




//import { TabsPage } from '../pages/tabs/tabs';











var MyApp = /** @class */ (function () {
    function MyApp(config, platform, events, oneSignal, globalization, alertCtrl, translate, statusBar, splashScreen, clientService, sqlite) {
        var _this = this;
        this.config = config;
        this.platform = platform;
        this.oneSignal = oneSignal;
        this.globalization = globalization;
        this.alertCtrl = alertCtrl;
        this.translate = translate;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.clientService = clientService;
        this.sqlite = sqlite;
        this.showedAlert = false;
        this.rtlSide = "left";
        this.initializeApp();
        this.refreshSettings();
        events.subscribe('user:login', function () {
            _this.registerInboxUpdates();
        });
        events.subscribe('language:selection', function (language) {
            _this.globalize(language);
        });
        this.clientService.appointments(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_TOKEN), 1).subscribe(function (appoints) {
            console.log(appoints, 'appoints');
        });
    }
    MyApp.prototype.markDelivered = function (msg) {
        msg.delivered = true;
        var chatRef = __WEBPACK_IMPORTED_MODULE_6_firebase___default.a.database().ref(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].REF_CHAT).child(msg.chatId);
        chatRef.child(msg.id).child("delivered").set(true);
        if (this.db)
            this.db.executeSql('UPDATE message SET delivered=? WHERE id=?', [1, msg.id]).then(function (res) { return console.log('updateDeliveryC', res); }).catch(function (e) { return console.log(e); });
    };
    MyApp.prototype.getSuitableLanguage = function (language) {
        window.localStorage.setItem("locale", language);
        language = language.substring(0, 2).toLowerCase();
        console.log('check for: ' + language);
        return this.config.availableLanguages.some(function (x) { return x.code == language; }) ? language : 'en';
    };
    MyApp.prototype.checkChatAndMessage = function (msg) {
        var _this = this;
        if (this.db && this.userMe) {
            var isMeSender = msg.senderId == this.userMe.id;
            this.db.executeSql('INSERT OR IGNORE INTO chat VALUES(?,?,?,?,?,?,?,?,?)', [isMeSender ? msg.recipientId : msg.senderId, this.userMe.id, String(new Date().getTime()), msg.body, isMeSender ? msg.recipientName : msg.senderName, isMeSender ? msg.recipientImage : msg.senderImage, isMeSender ? msg.recipientStatus : msg.senderStatus, 0, 0]).then(function (res) {
                console.log('insertC', res);
                _this.db.executeSql('INSERT OR IGNORE INTO message VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [msg.id, msg.chatId, msg.senderId, msg.recipientId, msg.recipientStatus, msg.recipientImage, msg.recipientName, msg.senderStatus, msg.senderImage, msg.senderName, msg.body, msg.dateTimeStamp, 1, 1])
                    .then(function (res) { return console.log('insertM', res); })
                    .catch(function (e) { return console.log(e); });
            }).catch(function (e) { return console.log(e); });
            this.db.executeSql('UPDATE chat SET isRead=?, chatImage=?, chatName=?, chatStatus=?, lastMessage=?, dateTimeStamp=? WHERE chatId=?', [0, isMeSender ? msg.recipientImage : msg.senderImage, isMeSender ? msg.recipientName : msg.senderName, isMeSender ? msg.recipientName : msg.senderStatus, msg.body, msg.dateTimeStamp, isMeSender ? msg.recipientId : msg.senderId])
                .then(function (res) { console.log('updateC', res); })
                .catch(function (e) { return console.log(e); });
        }
    };
    MyApp.prototype.registerInboxUpdates = function () {
        var inboxRef = __WEBPACK_IMPORTED_MODULE_6_firebase___default.a.database().ref(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].REF_INBOX);
        var newUserMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_USER));
        if (newUserMe && (!this.userMe || (this.userMe && this.userMe.id != newUserMe.id))) {
            this.userMe = newUserMe;
            var component_1 = this;
            inboxRef.child(this.userMe.id).on("value", function (snapshot) {
                var inMsg = snapshot.val();
                console.log("inMsg", inMsg);
                if (inMsg) {
                    component_1.markDelivered(inMsg);
                    component_1.checkChatAndMessage(inMsg);
                }
            }, function (errorObject) {
                console.log("The read failed", errorObject);
            });
        }
        if (!newUserMe)
            inboxRef.off();
    };
    MyApp.prototype.refreshSettings = function () {
        this.clientService.getSettings().subscribe(function (res) {
            console.log('setting_setup_success', res);
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_SETTING, JSON.stringify(res));
        }, function (err) {
            console.log('setting_setup_error', err);
        });
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
            __WEBPACK_IMPORTED_MODULE_6_firebase___default.a.initializeApp({
                apiKey: _this.config.firebaseConfig.apiKey,
                authDomain: _this.config.firebaseConfig.authDomain,
                databaseURL: _this.config.firebaseConfig.databaseURL,
                projectId: _this.config.firebaseConfig.projectId,
                storageBucket: _this.config.firebaseConfig.storageBucket,
                messagingSenderId: _this.config.firebaseConfig.messagingSenderId
            });
            _this.statusBar.styleDefault();
            _this.userMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_USER));
            _this.nav.setRoot(_this.userMe ? __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__["a" /* TabsPage */] : __WEBPACK_IMPORTED_MODULE_4__pages_signin_signin__["a" /* SigninPage */]);
            _this.registerInboxUpdates();
            if (_this.platform.is('cordova')) {
                _this.initOneSignal();
            }
            var defaultLang = window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_DEFAULT_LANGUAGE);
            _this.globalize(defaultLang);
            _this.sqlite.create({
                name: 'ionicdb.db',
                location: 'default'
            }).then(function (db) {
                _this.db = db;
                db.executeSql('CREATE TABLE IF NOT EXISTS chat(chatId TEXT PRIMARY KEY, myId TEXT, dateTimeStamp TEXT, lastMessage TEXT, chatName TEXT, chatImage TEXT, chatStatus TEXT, isGroup INT, isRead INT)', []).then(function (res) {
                    console.log('ExecutedTABLE', res);
                    db.executeSql('CREATE TABLE IF NOT EXISTS message(id TEXT PRIMARY KEY, chatId TEXT, senderId TEXT, recipientId TEXT, recipientStatus TEXT, recipientImage TEXT, recipientName TEXT, senderStatus TEXT, senderImage TEXT, senderName TEXT, body TEXT, dateTimeStamp TEXT, delivered INT, sent INT)', []).then(function (res) {
                        console.log('ExecutedTABLE', res);
                    }).catch(function (e) {
                        console.log(e);
                    });
                }).catch(function (e) {
                    console.log(e);
                });
            }).catch(function (e) { console.log(e); });
        });
    };
    MyApp.prototype.confirmExitApp = function () {
        var _this = this;
        this.translate.get(['exit_title', 'exit_message', 'no', 'yes']).subscribe(function (text) {
            _this.showedAlert = true;
            _this.confirmAlert = _this.alertCtrl.create({
                title: text['exit_title'],
                message: text['exit_message'],
                buttons: [
                    {
                        text: text['no'],
                        handler: function () {
                            _this.showedAlert = false;
                            return;
                        }
                    },
                    {
                        text: text['yes'],
                        handler: function () {
                            _this.platform.exitApp();
                        }
                    }
                ]
            });
            _this.confirmAlert.present();
        });
    };
    MyApp.prototype.globalize = function (languagePriority) {
        var _this = this;
        console.log("globalaizing...");
        if (this.platform.is('cordova')) {
            console.log("cordova detected");
            if (languagePriority && languagePriority.length) {
                console.log(languagePriority);
                this.translate.use(languagePriority);
                this.setDirectionAccordingly(languagePriority);
            }
            else {
                this.globalization.getPreferredLanguage().then(function (result) {
                    console.log("language detected:----" + JSON.stringify(result));
                    var suitableLang = _this.getSuitableLanguage(result.value);
                    console.log(suitableLang);
                    _this.translate.use(suitableLang);
                    _this.setDirectionAccordingly(suitableLang);
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_DEFAULT_LANGUAGE, suitableLang);
                }).catch(function (e) {
                    console.log(e);
                    _this.translate.use(languagePriority && languagePriority.length ? languagePriority : 'en');
                    _this.setDirectionAccordingly(languagePriority && languagePriority.length ? languagePriority : 'en');
                });
            }
        }
        else {
            console.log("cordova not detected");
            this.translate.use(languagePriority && languagePriority.length ? languagePriority : 'en');
            this.setDirectionAccordingly(languagePriority && languagePriority.length ? languagePriority : 'en');
            // this.translate.use('ar');
            // this.setDirectionAccordingly('ar');
        }
    };
    MyApp.prototype.setDirectionAccordingly = function (lang) {
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
    };
    MyApp.prototype.initOneSignal = function () {
        var _this = this;
        if (this.config.oneSignalAppId && this.config.oneSignalAppId.length && this.config.oneSignalGPSenderId && this.config.oneSignalGPSenderId.length) {
            this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
            this.oneSignal.handleNotificationReceived().subscribe(function (data) {
                console.log(data);
                if (data && data.payload && data.payload.additionalData && data.payload.additionalData.msgs) {
                    var inMsgs = data.payload.additionalData.msgs;
                    for (var _i = 0, inMsgs_1 = inMsgs; _i < inMsgs_1.length; _i++) {
                        var msg = inMsgs_1[_i];
                        _this.markDelivered(msg);
                        _this.checkChatAndMessage(msg);
                    }
                }
                else {
                    var notifications = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_NOTIFICATIONS));
                    if (!notifications)
                        notifications = new Array();
                    notifications.push(new __WEBPACK_IMPORTED_MODULE_14__models_notification_models__["a" /* MyNotification */](data.payload.title, data.payload.body, _this.formatDate(new Date())));
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_NOTIFICATIONS, JSON.stringify(notifications));
                }
                var noti_ids_processed = JSON.parse(window.localStorage.getItem("noti_ids_processed"));
                if (!noti_ids_processed)
                    noti_ids_processed = new Array();
                noti_ids_processed.push(data.payload.notificationID);
                window.localStorage.setItem("noti_ids_processed", JSON.stringify(noti_ids_processed));
            });
            this.oneSignal.handleNotificationOpened().subscribe(function (data) {
                var noti_ids_processed = JSON.parse(window.localStorage.getItem("noti_ids_processed"));
                if (!noti_ids_processed)
                    noti_ids_processed = new Array();
                var index = noti_ids_processed.indexOf(data.notification.payload.notificationID);
                if (index == -1) {
                    if (data && data.notification.payload && data.notification.payload.additionalData && data.notification.payload.additionalData.msgs) {
                        var inMsgs = data.notification.payload.additionalData.msgs;
                        for (var _i = 0, inMsgs_2 = inMsgs; _i < inMsgs_2.length; _i++) {
                            var msg = inMsgs_2[_i];
                            _this.markDelivered(msg);
                            _this.checkChatAndMessage(msg);
                        }
                    }
                    else {
                        var notifications = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_NOTIFICATIONS));
                        if (!notifications)
                            notifications = new Array();
                        notifications.push(new __WEBPACK_IMPORTED_MODULE_14__models_notification_models__["a" /* MyNotification */](data.notification.payload.title, data.notification.payload.body, _this.formatDate(new Date())));
                        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_NOTIFICATIONS, JSON.stringify(notifications));
                    }
                }
                else {
                    noti_ids_processed.splice(index, 1);
                    window.localStorage.setItem("noti_ids_processed", JSON.stringify(noti_ids_processed));
                }
            });
            this.oneSignal.endInit();
        }
    };
    MyApp.prototype.formatDate = function (date) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/app/app.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_8__providers_client_service__["a" /* ClientService */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_11__ionic_native_onesignal__["a" /* OneSignal */], __WEBPACK_IMPORTED_MODULE_12__ionic_native_globalization__["a" /* Globalization */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_13__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_8__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_10__ionic_native_sqlite__["a" /* SQLite */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 339:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignUpRequest; });
var SignUpRequest = /** @class */ (function () {
    function SignUpRequest(name, email, password, mobile_number) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.mobile_number = mobile_number;
        this.role = "customer";
    }
    return SignUpRequest;
}());

//# sourceMappingURL=signup-request.models.js.map

/***/ }),

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__requests_requests__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__notificatinons_notificatinons__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__account_account__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__chat_chat__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_firebase__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_onesignal__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_client_service__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var TabsPage = /** @class */ (function () {
    function TabsPage(oneSignal, service) {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_1__requests_requests__["a" /* RequestsPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_2__notificatinons_notificatinons__["a" /* NotificatinonsPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_4__account_account__["a" /* AccountPage */];
        this.tab5Root = __WEBPACK_IMPORTED_MODULE_5__chat_chat__["a" /* ChatPage */];
        var userMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].KEY_USER));
        oneSignal.getIds().then(function (id) {
            if (id && id.userId) {
                __WEBPACK_IMPORTED_MODULE_7_firebase___default.a.database().ref(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].REF_USERS_FCM_IDS).child(userMe.id).set(id.userId);
                service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].KEY_TOKEN), { fcm_registration_id: id.userId }).subscribe(function (res) {
                    console.log(res);
                }, function (err) {
                    console.log('update_user', err);
                });
            }
        });
    }
    TabsPage.prototype.ionViewDidEnter = function () {
        this.tabRef.select(2);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('myTabs'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["m" /* Tabs */])
    ], TabsPage.prototype, "tabRef", void 0);
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/tabs/tabs.html"*/'<ion-tabs #myTabs>\n    <ion-tab [root]="tab1Root" tabTitle="{{\'requests\' | translate}}" tabIcon="md-calendar" tabsHideOnSubPages="true">\n    </ion-tab>\n    <ion-tab [root]="tab2Root" tabTitle="{{\'notis\' | translate}}" tabIcon="md-notifications"\n        tabsHideOnSubPages="true"></ion-tab>\n    <ion-tab [root]="tab3Root" tabTitle="{{\'categories\' | translate}}" tabIcon="md-apps" tabsHideOnSubPages="true">\n    </ion-tab>\n    <ion-tab [root]="tab4Root" tabTitle="{{\'account\' | translate}}" tabIcon="md-person" tabsHideOnSubPages="true">\n    </ion-tab>\n    <ion-tab [root]="tab5Root" tabTitle="{{\'chat\' | translate}}" tabIcon="md-chatboxes" tabsHideOnSubPages="true">\n    </ion-tab>\n</ion-tabs>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/tabs/tabs.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_10__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_8__ionic_native_onesignal__["a" /* OneSignal */], __WEBPACK_IMPORTED_MODULE_10__providers_client_service__["a" /* ClientService */]])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 368:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Message; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_models__ = __webpack_require__(25);

var Message = /** @class */ (function () {
    function Message() {
    }
    Message.prototype.fromRow = function (arg0) {
        this.senderName = arg0.senderName;
        this.senderImage = arg0.senderImage;
        this.senderStatus = arg0.senderStatus;
        this.recipientName = arg0.recipientName;
        this.recipientImage = arg0.recipientImage;
        this.recipientStatus = arg0.recipientStatus;
        this.recipientId = arg0.recipientId;
        this.senderId = arg0.senderId;
        this.chatId = arg0.chatId;
        this.id = arg0.id;
        this.body = arg0.body;
        this.dateTimeStamp = arg0.dateTimeStamp;
        this.timeDiff = __WEBPACK_IMPORTED_MODULE_0__helper_models__["a" /* Helper */].getTimeDiff(new Date(Number(this.dateTimeStamp)));
        this.delivered = arg0.delivered == 1;
        this.sent = arg0.sent == 1;
    };
    return Message;
}());

//# sourceMappingURL=message.models.js.map

/***/ }),

/***/ 369:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RateRequest; });
var RateRequest = /** @class */ (function () {
    function RateRequest() {
    }
    return RateRequest;
}());

//# sourceMappingURL=rate-request.models.js.map

/***/ }),

/***/ 370:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppointmentRequest; });
var AppointmentRequest = /** @class */ (function () {
    function AppointmentRequest() {
    }
    return AppointmentRequest;
}());

//# sourceMappingURL=appointment-request.models.js.map

/***/ }),

/***/ 379:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Address; });
var Address = /** @class */ (function () {
    function Address() {
    }
    return Address;
}());

//# sourceMappingURL=address.models.js.map

/***/ }),

/***/ 380:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddressCreateRequest; });
var AddressCreateRequest = /** @class */ (function () {
    function AddressCreateRequest() {
    }
    return AddressCreateRequest;
}());

//# sourceMappingURL=address-create-request.models.js.map

/***/ }),

/***/ 381:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SupportRequest; });
var SupportRequest = /** @class */ (function () {
    function SupportRequest(name, email, message) {
        this.name = name;
        this.email = email;
        this.message = message;
    }
    return SupportRequest;
}());

//# sourceMappingURL=support-request.models.js.map

/***/ }),

/***/ 382:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FirebaseClient; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_firebase__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_firebase__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var FirebaseClient = /** @class */ (function () {
    function FirebaseClient() {
    }
    FirebaseClient.prototype.uploadBlob = function (blob) {
        return new Promise(function (resolve, reject) {
            var storageRef = __WEBPACK_IMPORTED_MODULE_1_firebase__["storage"]().ref();
            storageRef.child(new Date().toString()).put(blob).then(function (snapshot) {
                console.log(snapshot);
                __WEBPACK_IMPORTED_MODULE_1_firebase__["storage"]().ref(snapshot.metadata.fullPath).getDownloadURL().then(function (url) { return resolve(url); }).catch(function (err) { return reject(err); });
            }, function (err) {
                reject(err);
            });
        });
    };
    FirebaseClient.prototype.uploadFile = function (file) {
        return new Promise(function (resolve, reject) {
            var storageRef = __WEBPACK_IMPORTED_MODULE_1_firebase__["storage"]().ref();
            storageRef.child(new Date().toString()).put(file).then(function (snapshot) {
                console.log(snapshot);
                __WEBPACK_IMPORTED_MODULE_1_firebase__["storage"]().ref(snapshot.metadata.fullPath).getDownloadURL().then(function (url) { return resolve(url); }).catch(function (err) { return reject(err); });
            }, function (err) {
                reject(err);
            });
        });
    };
    FirebaseClient.prototype.uploadImage = function (imageURI) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var storageRef = __WEBPACK_IMPORTED_MODULE_1_firebase__["storage"]().ref();
            var imageRef = storageRef.child('image').child('imageName');
            _this.encodeImageUri(imageURI, function (image64) {
                imageRef.putString(image64, 'data_url').then(function (snapshot) {
                    resolve(snapshot.downloadURL);
                }, function (err) {
                    reject(err);
                });
            });
        });
    };
    FirebaseClient.prototype.encodeImageUri = function (imageUri, callback) {
        var c = document.createElement('canvas');
        var ctx = c.getContext("2d");
        var img = new Image();
        img.onload = function () {
            var aux = this;
            c.width = aux.width;
            c.height = aux.height;
            ctx.drawImage(img, 0, 0);
            var dataURL = c.toDataURL("image/jpeg");
            callback(dataURL);
        };
        img.src = imageUri;
    };
    FirebaseClient = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
    ], FirebaseClient);
    return FirebaseClient;
}());

//# sourceMappingURL=firebase.service.js.map

/***/ }),

/***/ 386:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyNotification; });
var MyNotification = /** @class */ (function () {
    function MyNotification(title, detail, time) {
        this.title = title;
        this.detail = detail;
        this.time = time;
    }
    return MyNotification;
}());

//# sourceMappingURL=notification.models.js.map

/***/ }),

/***/ 387:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ForgotpasswordPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tabs_tabs__ = __webpack_require__(34);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ForgotpasswordPage = /** @class */ (function () {
    function ForgotpasswordPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ForgotpasswordPage.prototype.tabs = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__tabs_tabs__["a" /* TabsPage */]);
    };
    ForgotpasswordPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-forgotpassword',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/forgotpassword/forgotpassword.html"*/'<ion-header class="bg-transparent">\n    <ion-navbar>\n        <ion-title>{{\'forgot_password\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n\n<ion-content>\n    <div class="form">\n        <p class="text-grey" text-center>{{\'enter_your_rgisterd_email_address\' | translate}}<br>{{\'well_send_password_reset_info_on_mail\' | translate}}</p>\n        <ion-list no-lines>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-mail" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'enter_email_id\' | translate}}</ion-label>\n                <ion-input type="text" value=""></ion-input>\n            </ion-item>\n        </ion-list>\n        <button class="btn" ion-button round full margin-top margin-bottom (click)="tabs()">{{\'submit\' | translate}}</button>\n\n        <div class="fixed-bottom">\n            <p class="text-grey" text-center><small>{{\'by_signing_up\' | translate}}<ins>{{\'terms_condition\' | translate}}</ins></small></p>\n        </div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/forgotpassword/forgotpassword.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], ForgotpasswordPage);
    return ForgotpasswordPage;
}());

//# sourceMappingURL=forgotpassword.js.map

/***/ }),

/***/ 391:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SafePipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(37);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SafePipe = /** @class */ (function () {
    function SafePipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SafePipe.prototype.transform = function (url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };
    SafePipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["S" /* Pipe */])({
            name: 'safe'
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */]])
    ], SafePipe);
    return SafePipe;
}());

//# sourceMappingURL=url-satinaizer.pipe.js.map

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SigninPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__signup_signup__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_facebook__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_google_plus__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase_auth__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_app_config__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_client_service__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__otp_otp__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__privacy_privacy__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__models_helper_models__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};














var SigninPage = /** @class */ (function () {
    function SigninPage(config, navCtrl, loadingCtrl, toastCtrl, alertCtrl, service, translate, facebook, google, platform, app, events) {
        this.config = config;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.service = service;
        this.translate = translate;
        this.facebook = facebook;
        this.google = google;
        this.platform = platform;
        this.app = app;
        this.events = events;
        this.loadingShown = false;
        this.getCountries();
    }
    SigninPage.prototype.getCountries = function () {
        var _this = this;
        this.service.getCountries().subscribe(function (data) {
            _this.countries = data;
        }, function (err) {
            console.log(err);
        });
    };
    SigninPage.prototype.privacy = function () {
        var _this = this;
        var terms = __WEBPACK_IMPORTED_MODULE_13__models_helper_models__["a" /* Helper */].getSetting("terms");
        if (terms && terms.length) {
            this.translate.get('terms_conditions').subscribe(function (value) {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__privacy_privacy__["a" /* PrivacyPage */], { toShow: terms, heading: value });
            });
        }
    };
    SigninPage.prototype.alertPhone = function () {
        var _this = this;
        this.translate.get(['alert_phone', 'no', 'yes']).subscribe(function (text) {
            _this.phoneNumberFull = "+" + _this.countryCode + _this.phoneNumber;
            var alert = _this.alertCtrl.create({
                title: _this.phoneNumberFull,
                message: text['alert_phone'],
                buttons: [{
                        text: text['no'],
                        role: 'cancel',
                        handler: function () {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: text['yes'],
                        handler: function () {
                            _this.checkIfExists();
                        }
                    }]
            });
            alert.present();
        });
    };
    SigninPage.prototype.checkIfExists = function () {
        var _this = this;
        this.translate.get('just_moment').subscribe(function (value) {
            _this.presentLoading(value);
        });
        this.service.checkUser({ mobile_number: this.phoneNumberFull, role: "customer" }).subscribe(function (res) {
            console.log(res, 'CHECK USER');
            _this.dismissLoading();
            _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_8__otp_otp__["a" /* OtpPage */], { phoneNumberFull: _this.phoneNumberFull });
        }, function (err) {
            console.log(err);
            _this.dismissLoading();
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__signup_signup__["a" /* SignupPage */], { code: _this.countryCode, phone: _this.phoneNumber });
        });
    };
    SigninPage.prototype.getFireUserToken = function (user) {
        var _this = this;
        user.getIdToken(false).then(function (token) {
            console.log('fire_token', token);
            _this.requestSignSocialIn({ token: token }, user);
        }).catch(function (err) {
            console.log('fire_token_err', err);
        });
    };
    SigninPage.prototype.requestSignSocialIn = function (socialRequest, user) {
        var _this = this;
        console.log('fire_user', user);
        this.translate.get('verifying_user').subscribe(function (value) {
            _this.presentLoading(value);
        });
        this.service.loginSocial(socialRequest).subscribe(function (res) {
            _this.dismissLoading();
            if (res.user.mobile_verified == 1) {
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].KEY_USER, JSON.stringify(res.user));
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].KEY_TOKEN, res.token);
                _this.events.publish('user:login');
                _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_10__tabs_tabs__["a" /* TabsPage */]);
            }
            else {
                _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_8__otp_otp__["a" /* OtpPage */], { phoneNumberFull: res.user.mobile_number });
            }
        }, function (err) {
            _this.dismissLoading();
            console.log(err);
            if (user && user.displayName && user.email) {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__signup_signup__["a" /* SignupPage */], { name: user.displayName, email: user.email });
            }
            else {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__signup_signup__["a" /* SignupPage */]);
            }
        });
    };
    SigninPage.prototype.signInFacebook = function () {
        var _this = this;
        this.translate.get('logging_facebook').subscribe(function (value) {
            _this.presentLoading(value);
        });
        if (this.platform.is('cordova')) {
            this.fbOnPhone();
        }
        else {
            this.fbOnBrowser();
        }
    };
    SigninPage.prototype.signInGoogle = function () {
        var _this = this;
        this.translate.get('logging_google').subscribe(function (value) {
            _this.presentLoading(value);
        });
        if (this.platform.is('cordova')) {
            this.googleOnPhone();
        }
        else {
            this.googleOnBrowser();
        }
    };
    SigninPage.prototype.fbOnPhone = function () {
        var _this = this;
        this.facebook.login(["public_profile", 'email']).then(function (response) {
            // this.presentLoading('Facebook signup success, authenticating with firebase');
            console.log("fb_success", response);
            var facebookCredential = __WEBPACK_IMPORTED_MODULE_5_firebase_auth__["auth"].FacebookAuthProvider.credential(response.authResponse.accessToken);
            __WEBPACK_IMPORTED_MODULE_5_firebase_auth__["auth"]().signInAndRetrieveDataWithCredential(facebookCredential).then(function (success) {
                _this.dismissLoading();
                console.log("fb_fire_success", success);
                _this.getFireUserToken(success.user);
            }).catch(function (error) {
                console.log("fb_fire_error", error);
                _this.showToast("Error in Facebook login");
                _this.dismissLoading();
            });
        }).catch(function (error) {
            console.log("fb_error", error);
            _this.showToast("Error in Facebook login");
            _this.dismissLoading();
        });
    };
    SigninPage.prototype.fbOnBrowser = function () {
        var _this = this;
        var provider = new __WEBPACK_IMPORTED_MODULE_5_firebase_auth__["auth"].FacebookAuthProvider();
        provider.addScope('user_birthday');
        provider.addScope('user_friends');
        provider.addScope('email');
        provider.addScope('public_profile');
        __WEBPACK_IMPORTED_MODULE_5_firebase_auth__["auth"]().signInWithPopup(provider).then(function (result) {
            console.log("fb_fire_success", result);
            _this.dismissLoading();
            _this.getFireUserToken(result.user);
        }).catch(function (error) {
            console.log("fb_fire_error", error);
            _this.dismissLoading();
            _this.showToast("Facebook login unsuccessfull");
        });
    };
    SigninPage.prototype.googleOnPhone = function () {
        var _this = this;
        this.google.login({
            'webClientId': this.config.firebaseConfig.webApplicationId,
            'offline': false,
            'scopes': 'profile email'
        }).then(function (res) {
            console.log('google_success', res);
            var googleCredential = __WEBPACK_IMPORTED_MODULE_5_firebase_auth__["auth"].GoogleAuthProvider.credential(res.idToken);
            __WEBPACK_IMPORTED_MODULE_5_firebase_auth__["auth"]().signInAndRetrieveDataWithCredential(googleCredential).then(function (response) {
                console.log('google_fire_success', response);
                _this.dismissLoading();
                _this.getFireUserToken(response.user);
            }).catch(function (error) {
                console.log('google_fire_error', error);
                _this.dismissLoading();
            });
        }).catch(function (err) {
            console.log('google_fail', err);
            _this.dismissLoading();
        });
    };
    SigninPage.prototype.googleOnBrowser = function () {
        var _this = this;
        try {
            var provider = new __WEBPACK_IMPORTED_MODULE_5_firebase_auth__["auth"].GoogleAuthProvider();
            __WEBPACK_IMPORTED_MODULE_5_firebase_auth__["auth"]().signInWithPopup(provider).then(function (result) {
                _this.dismissLoading();
                console.log('google_fire_success', result);
                _this.getFireUserToken(result.user);
            }).catch(function (error) {
                console.log('google_fire_error', error);
                _this.dismissLoading();
            });
        }
        catch (err) {
            this.dismissLoading();
            console.log(err);
        }
    };
    SigninPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    SigninPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    SigninPage.prototype.presentErrorAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: "Error",
            subTitle: msg,
            buttons: ["Dismiss"]
        });
        alert.present();
    };
    SigninPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    SigninPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-signin',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/signin/signin.html"*/'<ion-content>\n    <div class="logo-box bg-thime">\n        <div class="logo">\n            <img src="assets/imgs/cityzen-massage-app.png">\n            <h1 class="text-white">{{config.appName}}</h1>\n        </div>\n    </div>\n\n    <p class="text-grey" text-center>{{\'sign_in_or_sign_up_to_continue\' | translate}}</p>\n\n    <div class="form">\n        <ion-list inset padding-bottom>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-globe" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label floating>{{\'select_country\' | translate}}</ion-label>\n                <ion-select [(ngModel)]="countryCode" multiple="false" class="text-thime">\n                    <ion-option [value]="country.callingCodes[0]" *ngFor="let country of countries">{{country.name}}\n                    </ion-option>\n                </ion-select>\n                <!-- <ion-icon name="ios-arrow-down-outline" item-end class="text-thime"></ion-icon> -->\n            </ion-item>\n\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-phone-portrait" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label floating>{{\'enter_phone_number\' | translate}}</ion-label>\n                <ion-input placeholder="" [(ngModel)]="phoneNumber" type="tel"></ion-input>\n            </ion-item>\n        </ion-list>\n        <button class="btn" ion-button round full margin-top margin-bottom\n            (click)="alertPhone()">{{\'continue\' | translate}}</button>\n        <div class="social">\n            <p class="text-light-grey" text-center>{{\'or_continue_with\' | translate}}</p>\n\n            <ion-row>\n                <ion-col col-6>\n                    <button class="btn text-thime" ion-button round full margin-top margin-bottom\n                        (click)="signInFacebook()">{{\'facebook\' | translate}}\n                    </button>\n                </ion-col>\n                <ion-col col-6>\n                    <button class="btn google" ion-button round full margin-top margin-bottom\n                        (click)="signInGoogle()">{{\'google\' | translate}}\n                    </button>\n                </ion-col>\n            </ion-row>\n        </div>\n    </div>\n    <p class="text-grey" text-center (click)="privacy()">\n        <small>\n            {{\'by_signing_up\' | translate}}\n            <ins>{{\'terms_condition\' | translate}}</ins>\n        </small>\n    </p>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/signin/signin.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_7__providers_client_service__["a" /* ClientService */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_7__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_11__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_facebook__["a" /* Facebook */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_google_plus__["a" /* GooglePlus */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */]])
    ], SigninPage);
    return SigninPage;
}());

//# sourceMappingURL=signin.js.map

/***/ }),

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatscreenPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_helper_models__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_message_models__ = __webpack_require__(368);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_sqlite__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_onesignal__ = __webpack_require__(68);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ChatscreenPage = /** @class */ (function () {
    function ChatscreenPage(navCtrl, navParam, sqlite, toastCtrl, oneSignal) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.oneSignal = oneSignal;
        this.chatCreated = false;
        this.timeoutTaskId = -1;
        this.messages = new Array();
        this.chat = navParam.get('chat');
        this.userMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].KEY_USER));
        this.chatChild = __WEBPACK_IMPORTED_MODULE_4__models_helper_models__["a" /* Helper */].getChatChild(String(this.userMe.id), this.chat.chatId);
        sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then(function (db) {
            _this.db = db;
            db.executeSql('CREATE TABLE IF NOT EXISTS message(id TEXT PRIMARY KEY, chatId TEXT, senderId TEXT, recipientId TEXT, recipientStatus TEXT, recipientImage TEXT, recipientName TEXT, senderStatus TEXT, senderImage TEXT, senderName TEXT, body TEXT, dateTimeStamp TEXT, delivered INT, sent INT)', []).then(function (res) {
                console.log('ExecutedTABLE', res);
                db.executeSql('SELECT * FROM message WHERE chatId = ?', [_this.chatChild]).then(function (res) {
                    _this.messages = new Array();
                    for (var i = 0; i < res.rows.length; i++) {
                        var msg = new __WEBPACK_IMPORTED_MODULE_5__models_message_models__["a" /* Message */]();
                        msg.fromRow(res.rows.item(i));
                        _this.messages.push(msg);
                    }
                    if (_this.messages.length)
                        _this.lastMessage = _this.messages[_this.messages.length - 1];
                }).catch(function (e) { return console.log(e); });
            }).catch(function (e) {
                console.log(e);
            });
        }).catch(function (e) { console.log(e); });
        var component = this;
        this.inboxRef = __WEBPACK_IMPORTED_MODULE_3_firebase__["database"]().ref(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].REF_INBOX);
        this.chatRef = __WEBPACK_IMPORTED_MODULE_3_firebase__["database"]().ref(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].REF_CHAT).child(this.chatChild);
        this.chatRef.limitToLast(1).on("child_added", function (snapshot, prevChildKey) {
            var newMessage = snapshot.val();
            if (newMessage) {
                newMessage.timeDiff = __WEBPACK_IMPORTED_MODULE_4__models_helper_models__["a" /* Helper */].getTimeDiff(new Date(Number(newMessage.dateTimeStamp)));
                component.addMessage(newMessage);
                component.markDelivered(newMessage);
                component.scrollList();
            }
        }, function (error) {
            console.error("child_added", error);
        });
        this.chatRef.on("child_changed", function (snapshot) {
            var newMessage = snapshot.val();
            if (newMessage && newMessage.delivered) {
                _this.db.executeSql('UPDATE message SET delivered=? WHERE id=?', [1, newMessage.id]).then(function (res) { return console.log('updateDeliveryC', res); }).catch(function (e) { return console.log(e); });
                for (var i = component.messages.length - 1; i >= 0; i--) {
                    if (newMessage.id == component.messages[i].id) {
                        component.messages[i].delivered = true;
                        break;
                    }
                }
            }
        }, function (error) {
            console.error("child_changed", error);
        });
        __WEBPACK_IMPORTED_MODULE_3_firebase__["database"]().ref(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].REF_USERS_FCM_IDS).child(this.chat.chatId).once("value", function (snap) {
            component.userPlayerId = snap.val();
        });
    }
    ChatscreenPage.prototype.ionViewDidEnter = function () {
        this.scrollList();
    };
    ChatscreenPage.prototype.ionViewWillLeave = function () {
        if (this.db && this.chatCreated && this.lastMessage) {
            var isMeSender = this.lastMessage.senderId == this.userMe.id;
            this.db.executeSql('UPDATE chat SET isRead=?, chatImage=?, chatName=?, chatStatus=?, lastMessage=?, dateTimeStamp=? WHERE chatId=?', [1, isMeSender ? this.lastMessage.recipientImage : this.lastMessage.senderImage, isMeSender ? this.lastMessage.recipientName : this.lastMessage.senderName, isMeSender ? this.lastMessage.recipientStatus : this.lastMessage.senderStatus, this.lastMessage.body, this.lastMessage.dateTimeStamp, this.lastMessage.chatId]).then(function (res) { console.log('updateC', res); }).catch(function (e) { return console.log(e); });
        }
    };
    ChatscreenPage.prototype.scrollList = function () {
        this.content.scrollToBottom(300); //300ms animation speed
    };
    ChatscreenPage.prototype.notifyMessages = function (msgs) {
        var notificationObj = {
            include_player_ids: [this.userPlayerId],
            headings: { en: "New messages" },
            contents: { en: "You have " + msgs.length + " new " + (msgs.length > 1 ? "messages" : "message") },
            data: { msgs: msgs }
        };
        this.oneSignal.postNotification(notificationObj).then(function (res) { return console.log(res); }).catch(function (err) { return console.log(err); });
    };
    ChatscreenPage.prototype.markDelivered = function (msg) {
        var _this = this;
        if (msg.senderId != this.userMe.id) {
            msg.delivered = true;
            this.chatRef.child(msg.id).child("delivered").set(true);
            //TODO: update in local db as well.
        }
        else {
            if (this.timeoutTaskId != -1)
                clearTimeout(this.timeoutTaskId);
            this.timeoutTaskId = setTimeout(function () {
                var messagesPendingToNotify = new Array();
                for (var i = _this.messages.length - 1; i >= 0; i--) {
                    if (_this.messages[i].senderId == _this.userMe.id && !_this.messages[i].delivered) {
                        _this.db.executeSql('UPDATE message SET delivered=? WHERE id=?', [1, _this.messages[i].id]).then(function (res) { return console.log('updateDeliveryC', res); }).catch(function (e) { return console.log(e); });
                        messagesPendingToNotify.push(_this.messages[i]);
                        _this.messages[i].delivered = true;
                    }
                }
                if (messagesPendingToNotify.length && _this.userPlayerId) {
                    _this.notifyMessages(messagesPendingToNotify);
                }
            }, 2000);
        }
    };
    ChatscreenPage.prototype.addMessage = function (msg) {
        this.messages = this.messages.concat(msg);
        if (this.db) {
            this.checkCreateChat(msg);
            this.db.executeSql('INSERT OR IGNORE INTO message VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [msg.id, msg.chatId, msg.senderId, msg.recipientId, msg.recipientStatus, msg.recipientImage, msg.recipientName, msg.senderStatus, msg.senderImage, msg.senderName, msg.body, msg.dateTimeStamp, 0, 1]).then(function (res) { return console.log('insertM', res); }).catch(function (e) { return console.log(e); });
        }
        if (this.chat && msg) {
            this.lastMessage = msg;
            var isMeSender = msg.senderId == this.userMe.id;
            this.chat.chatImage = isMeSender ? msg.recipientImage : msg.senderImage;
            this.chat.chatName = isMeSender ? msg.recipientName : msg.senderName;
            this.chat.chatStatus = isMeSender ? msg.recipientStatus : msg.senderStatus;
        }
    };
    ChatscreenPage.prototype.checkCreateChat = function (msg) {
        var _this = this;
        if (this.chatCreated)
            return;
        this.db.executeSql('INSERT OR IGNORE INTO chat VALUES(?,?,?,?,?,?,?,?,?)', [msg.senderId == this.userMe.id ? msg.recipientId : msg.senderId, this.userMe.id, String(new Date().getTime()), msg.body, msg.senderName, msg.senderImage, msg.senderStatus, 0, 0]).then(function (res) {
            console.log('insertC', res);
            _this.chatCreated = true;
        }).catch(function (e) {
            console.log(e);
            _this.chatCreated = false;
        });
    };
    ChatscreenPage.prototype.updateMessage = function (msg) {
        if (this.db) {
            this.db.executeSql('UPDATE message SET recipientStatus=?, recipientImage=?, recipientName=?, senderStatus=?, senderImage=?, senderName=?, delivered=? WHERE id=?', [msg.recipientStatus, msg.recipientImage, msg.recipientName, msg.senderStatus, msg.senderImage, msg.senderName, 1, msg.id]).then(function (res) { return console.log('updateM', res); }).catch(function (e) { return console.log(e); });
        }
        for (var i = this.messages.length - 1; i >= 0; i--) {
            if (this.messages[i].id == msg.id) {
                this.messages[i] = msg;
                break;
            }
        }
    };
    ChatscreenPage.prototype.send = function () {
        if (!this.newMessageText || !this.newMessageText.length) {
            this.showToast("Type a message!");
        }
        else {
            var toSend = new __WEBPACK_IMPORTED_MODULE_5__models_message_models__["a" /* Message */]();
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
    };
    ChatscreenPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('content'),
        __metadata("design:type", Object)
    ], ChatscreenPage.prototype, "content", void 0);
    ChatscreenPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-chatscreen',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/chatscreen/chatscreen.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            <span class="profile">\n                <img *ngIf="chat.chatImage && chat.chatImage.length" data-src="{{chat.chatImage}}">\n                <img *ngIf="!chat.chatImage || !chat.chatImage.length" src="assets/imgs/empty_dp.png">\n            </span>\n            {{chat.chatName}}\n            <!-- <small> | {{chat.chatStatus}}</small> -->\n            <!-- <span><ion-icon name="md-more"></ion-icon></span> -->\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content #content class="bg-light">\n    <ion-card *ngFor="let msg of messages" [ngClass]="(userMe.id == msg.senderId) ? \'send\' : \'received\'">\n        <h2>{{msg.body}}</h2>\n        <p>{{msg.timeDiff}}</p>\n    </ion-card>\n</ion-content>\n<ion-footer>\n    <div class="fixed-bottom">\n        <ion-row>\n            <!-- <ion-col col-2 class="">\n                <p class="bg-thime" text-center (click)="booknow()">{{\'book\' | translate}}</p>\n            </ion-col> -->\n            <ion-col col-10>\n                <ion-list class="" no-lines>\n                    <ion-item>\n                        <ion-textarea type="text" [(ngModel)]="newMessageText" placeholder="Type your message"></ion-textarea>\n                        <!-- <h3 item-end>\n                            <ion-icon><img src="assets/imgs/add-icon.png"></ion-icon>\n                            <ion-icon name="md-mic"></ion-icon>\n                        </h3> -->\n                    </ion-item>\n                </ion-list>\n            </ion-col>\n            <ion-col col-2 class="">\n                <p class="bg-thime" text-center (mousedown)="send(); $event.preventDefault()">\n                    <ion-icon name="md-send"></ion-icon>\n                </p>\n            </ion-col>\n        </ion-row>\n    </div>\n</ion-footer>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_customer/src/pages/chatscreen/chatscreen.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_sqlite__["a" /* SQLite */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_7__ionic_native_onesignal__["a" /* OneSignal */]])
    ], ChatscreenPage);
    return ChatscreenPage;
}());

//# sourceMappingURL=chatscreen.js.map

/***/ }),

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Constants; });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.KEY_USER = 'key_user_hc';
    Constants.KEY_TOKEN = 'key_token_hc';
    Constants.KEY_SETTING = 'key_setting_hc';
    Constants.KEY_LOCATION = 'key_location_hc';
    Constants.KEY_CATEGORY = 'key_category_hc';
    Constants.KEY_NOTIFICATIONS = 'key_notifications_hc';
    Constants.KEY_ADDRESS_LIST = 'key_address_list_hc';
    Constants.KEY_DEFAULT_LANGUAGE = 'key_default_language';
    Constants.REF_USERS = "handyman/users";
    Constants.REF_CHAT = "handyman/chats";
    Constants.REF_INBOX = "handyman/inbox";
    Constants.REF_USERS_FCM_IDS = "handyman/user_fcm_ids";
    return Constants;
}());

//# sourceMappingURL=constants.models.js.map

/***/ })

},[265]);
//# sourceMappingURL=main.js.map