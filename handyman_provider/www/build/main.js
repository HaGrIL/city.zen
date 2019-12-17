webpackJsonp([0],{

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Constants; });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.KEY_USER = 'key_user_p';
    Constants.KEY_TOKEN = 'key_token_p';
    Constants.KEY_SETTING = 'key_setting_p';
    Constants.KEY_LOCATION = 'key_location_p';
    Constants.KEY_CATEGORY = 'key_category_p';
    Constants.KEY_PROFILE = 'key_profile_p';
    Constants.KEY_PLANS = 'key_plans_p';
    Constants.KEY_NOTIFICATIONS = 'key_notifications_p';
    Constants.KEY_DEFAULT_LANGUAGE = 'key_default_language_p';
    Constants.KEY_CARD_INFO = "key_card_info_p";
    Constants.KEY_RATING_SUMMARY = "key_rating_summary_p";
    Constants.REF_USERS = "handyman/users";
    Constants.REF_CHAT = "handyman/chats";
    Constants.REF_INBOX = "handyman/inbox";
    Constants.REF_USERS_FCM_IDS = "handyman/user_fcm_ids";
    return Constants;
}());

//# sourceMappingURL=constants.models.js.map

/***/ }),

/***/ 123:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OtpPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tabs_tabs__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_firebase__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__ = __webpack_require__(17);
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
        this.clientService.login({ token: token, role: "provider" }).subscribe(function (res) {
            _this.dismissLoading();
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].KEY_USER, JSON.stringify(res.user));
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].KEY_TOKEN, res.token);
            _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_2__tabs_tabs__["a" /* TabsPage */]);
            _this.events.publish('user:login');
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
            _this.translate.get('sending_otp_fail').subscribe(function (value) {
                _this.showToast(value);
            });
            // if (error.message) {
            //   this.showToast(error.message);
            // } else {
            //   this.translate.get('sending_otp_fail').subscribe(value => {
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
        console.log(this.platform.is('cordova'));
        if (this.platform.is('cordova')) {
            this.verifyOtpPhone();
        }
        else {
            this.verifyOtpBrowser();
        }
    };
    OtpPage.prototype.verifyOtpPhone = function () {
        var _this = this;
        var credential = __WEBPACK_IMPORTED_MODULE_3_firebase_app__["auth"].PhoneAuthProvider.credential(this.verfificationId, this.otp);
        this.translate.get('verifying_otp').subscribe(function (value) {
            _this.presentLoading(value);
        });
        __WEBPACK_IMPORTED_MODULE_3_firebase_app__["auth"]().signInWithCredential(credential).then(function (info) {
            console.log('otp_verify_success', info);
            _this.dismissLoading();
            _this.translate.get('verifying_otp_success').subscribe(function (value) {
                _this.showToast(value);
            });
            _this.getUserToken(info.user);
        }, function (error) {
            console.log('otp_verify_fail', error);
            // if (error.message) {
            //   this.showToast(error.message);
            // } else {
            //   this.translate.get('verifying_otp_fail').subscribe(value => {
            //     this.showToast(value);
            //   });
            // }
            _this.dismissLoading();
            _this.translate.get('verifying_otp_fail').subscribe(function (value) {
                _this.showToast(value);
            });
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
            selector: 'page-otp',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/otp/otp.html"*/'<ion-header class="bg-transparent">\n    <ion-navbar>\n        <ion-title><span>{{minutes}}:{{seconds}} left</span></ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div id="recaptcha-container"></div>\n    <h1 text-center>{{\'verification_code\' | translate}}<small>{{\'plese_type_the_verification_code\' | translate}}<br> {{\'sent_to\' | translate}} {{phoneNumberFull}}</small></h1>\n\n    <div class="form">\n        <ion-input type="number" placeholder="Enter OTP" [(ngModel)]="otp"></ion-input>\n        <button ion-button round full class="btn" (click)="verify()" [disabled]="otpNotSent || otp.length!=6">{{\'confirm\' | translate}}</button>\n        <p text-center>{{\'dint_received_code\' | translate}} <strong (click)="sendOTP()">{{\'resend_now\' | translate}}</strong></p>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/otp/otp.html"*/,
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

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatscreenPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase_app__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_sqlite__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_message_models__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_helper_models__ = __webpack_require__(29);
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
        this.userMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].KEY_USER));
        this.chatChild = __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].getChatChild(String(this.userMe.id), this.chat.chatId);
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
                        var msg = new __WEBPACK_IMPORTED_MODULE_4__models_message_models__["a" /* Message */]();
                        msg.fromRow(res.rows.item(i));
                        _this.messages.push(msg);
                    }
                    if (_this.messages.length)
                        _this.lastMessage = _this.messages[_this.messages.length - 1];
                }).catch(function (e) { return console.log(e); });
            }).catch(function (e) {
                console.log(e);
            });
        }).catch(function (e) {
            console.log(e);
        });
        var component = this;
        this.inboxRef = __WEBPACK_IMPORTED_MODULE_2_firebase_app__["database"]().ref(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].REF_INBOX);
        this.chatRef = __WEBPACK_IMPORTED_MODULE_2_firebase_app__["database"]().ref(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].REF_CHAT).child(this.chatChild);
        this.chatRef.limitToLast(1).on("child_added", function (snapshot, prevChildKey) {
            var newMessage = snapshot.val();
            if (newMessage) {
                newMessage.timeDiff = __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].getTimeDiff(new Date(Number(newMessage.dateTimeStamp)));
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
                this.db.executeSql('UPDATE message SET delivered=? WHERE id=?', [1, newMessage.id]).then(function (res) { return console.log('updateDeliveryC', res); }).catch(function (e) { return console.log(e); });
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
        __WEBPACK_IMPORTED_MODULE_2_firebase_app__["database"]().ref(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].REF_USERS_FCM_IDS).child(this.chat.chatId).once("value", function (snap) {
            component.userPlayerId = snap.val();
        });
    }
    ChatscreenPage.prototype.ionViewDidEnter = function () {
        this.scrollList();
    };
    ChatscreenPage.prototype.ionViewWillLeave = function () {
        if (this.db && this.chatCreated && this.lastMessage) {
            var isMeSender = this.lastMessage.senderId == this.userMe.id;
            this.db.executeSql('UPDATE chat SET isRead=?, chatImage=?, chatName=?, chatStatus=?, lastMessage=?, dateTimeStamp=? WHERE chatId=?', [1, isMeSender ? this.lastMessage.recipientImage : this.lastMessage.senderImage, isMeSender ? this.lastMessage.recipientName : this.lastMessage.senderName, isMeSender ? this.lastMessage.recipientStatus : this.lastMessage.senderStatus, this.lastMessage.body, this.lastMessage.dateTimeStamp, this.lastMessage.chatId]).then(function (res) {
                console.log('updateC', res);
            }).catch(function (e) { return console.log(e); });
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
            var toSend = new __WEBPACK_IMPORTED_MODULE_4__models_message_models__["a" /* Message */]();
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
            selector: 'page-chatscreen',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/chatscreen/chatscreen.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            <span class="profile">\n                <img *ngIf="chat.chatImage && chat.chatImage.length" data-src="{{chat.chatImage}}">\n                <img *ngIf="!chat.chatImage || !chat.chatImage.length" src="assets/imgs/empty_dp.png">\n            </span>\n            {{chat.chatName}}\n            <!-- <small> | {{chat.chatStatus}}</small> -->\n            <!-- <span><ion-icon name="md-more"></ion-icon></span> -->\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content #content class="bg-light">\n    <ion-card *ngFor="let msg of messages" [ngClass]="(userMe.id == msg.senderId) ? \'send\' : \'received\'">\n        <h2>{{msg.body}}</h2>\n        <p>{{msg.timeDiff}}</p>\n    </ion-card>\n</ion-content>\n<ion-footer>\n    <div class="fixed-bottom">\n        <ion-row>\n            <ion-col col-10>\n                <ion-list class="" no-lines>\n                    <ion-item>\n                        <ion-textarea type="text" [(ngModel)]="newMessageText" placeholder="Type your message">\n                        </ion-textarea>\n                        <!-- <h3 item-end>\n                            <ion-icon><img src="assets/imgs/add-icon.png"></ion-icon>\n                            <ion-icon name="md-mic"></ion-icon>\n                        </h3> -->\n                    </ion-item>\n                </ion-list>\n            </ion-col>\n            <ion-col col-2 class="">\n                <p class="bg-thime" text-center (mousedown)="send(); $event.preventDefault()">\n                    <ion-icon name="md-send"></ion-icon>\n                </p>\n            </ion-col>\n        </ion-row>\n    </div>\n</ion-footer>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/chatscreen/chatscreen.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_sqlite__["a" /* SQLite */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_7__ionic_native_onesignal__["a" /* OneSignal */]])
    ], ChatscreenPage);
    return ChatscreenPage;
}());

//# sourceMappingURL=chatscreen.js.map

/***/ }),

/***/ 129:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReviewPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__allreview_allreview__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_rating_models__ = __webpack_require__(367);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_rating_summary_models__ = __webpack_require__(243);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ReviewPage = /** @class */ (function () {
    function ReviewPage(navCtrl, service) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.rating = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_RATING_SUMMARY));
        if (!this.rating)
            this.rating = __WEBPACK_IMPORTED_MODULE_5__models_rating_models__["a" /* Rating */].getDefault();
    }
    ReviewPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        setTimeout(function () {
            _this.profileMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_PROFILE));
            if (_this.profileMe) {
                _this.service.getRatings(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN), _this.profileMe.id).subscribe(function (res) {
                    var ratingSummaries = __WEBPACK_IMPORTED_MODULE_6__models_rating_summary_models__["a" /* RatingSummary */].defaultArray();
                    for (var _i = 0, _a = res.summary; _i < _a.length; _i++) {
                        var ratingSummaryResult = _a[_i];
                        ratingSummaries[ratingSummaryResult.rounded_rating - 1].total = ratingSummaryResult.total;
                        ratingSummaries[ratingSummaryResult.rounded_rating - 1].percent = ((ratingSummaryResult.total / res.total_ratings) * 100);
                    }
                    res.summary = ratingSummaries;
                    _this.rating = res;
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_RATING_SUMMARY, JSON.stringify(res));
                }, function (err) {
                    console.log('rating_err', err);
                });
            }
        }, 1000);
    };
    ReviewPage.prototype.allreview = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__allreview_allreview__["a" /* AllreviewPage */]);
    };
    ReviewPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-review',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/review/review.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'reviews\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div *ngIf="rating" class="rating-box bg-thime">\n        <h6 class="text-white" text-center>{{\'your_current_rating\' | translate}}</h6>\n        <h2 class="text-white" text-center>{{rating.average_rating}}\n            <ion-icon name="md-star"></ion-icon>\n        </h2>\n        <div class="rating" *ngIf="rating.summary && rating.summary.length == 5">\n            <p class="text-white">\n                <span class="text-1">5<ion-icon name="md-star"></ion-icon></span>\n                <span class="rate-bar">\n                    <span class="rating-status" [style.width]="rating.summary[4].percent+\'%\'"></span>\n                </span>\n                <span class="text-2">{{rating.summary[4].total}}</span>\n            </p>\n            <p class="text-white">\n                <span class="text-1">4<ion-icon name="md-star"></ion-icon></span>\n                <span class="rate-bar">\n                    <span class="rating-status" [style.width]="rating.summary[3].percent+\'%\'"></span>\n                </span>\n                <span class="text-2">{{rating.summary[3].total}}</span>\n            </p>\n            <p class="text-white">\n                <span class="text-1">3<ion-icon name="md-star"></ion-icon></span>\n                <span class="rate-bar">\n                    <span class="rating-status" [style.width]="rating.summary[2].percent+\'%\'"></span>\n                </span>\n                <span class="text-2">{{rating.summary[2].total}}</span>\n            </p>\n            <p class="text-white">\n                <span class="text-1">2<ion-icon name="md-star"></ion-icon></span>\n                <span class="rate-bar">\n                    <span class="rating-status" [style.width]="rating.summary[1].percent+\'%\'"></span>\n                </span>\n                <span class="text-2">{{rating.summary[1].total}}</span>\n            </p>\n            <p class="text-white">\n                <span class="text-1">1<ion-icon name="md-star"></ion-icon></span>\n                <span class="rate-bar">\n                    <span class="rating-status" [style.width]="rating.summary[0].percent+\'%\'"></span>\n                </span>\n                <span class="text-2">{{rating.summary[0].total}}</span>\n            </p>\n        </div>\n        <div class="btn-container">\n            <button class="btn text-thime" ion-button round full (click)="allreview()">\n                {{\'read_all_reviews\' | translate}}\n            </button>\n        </div>\n    </div>\n    <ion-row *ngIf="rating" class="details ">\n        <ion-col col-6>\n            <button ion-button full class="btn">\n                <ion-icon name="md-star"></ion-icon>\n                <span>{{rating.total_ratings}} <small>{{\'people_reviewed\' | translate}}</small></span>\n            </button>\n        </ion-col>\n\n        <ion-col col-6>\n            <button ion-button full class="btn">\n                <ion-icon name="md-checkmark"></ion-icon>\n                <span>{{rating.total_completed}}<small>{{\'tasks_completed\' | translate}}</small></span>\n            </button>\n        </ion-col>\n    </ion-row>\n\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/review/review.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_4__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__providers_client_service__["a" /* ClientService */]])
    ], ReviewPage);
    return ReviewPage;
}());

//# sourceMappingURL=review.js.map

/***/ }),

/***/ 130:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PrivacyPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
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



//import { ListofplumberPage } from '../listofplumber/listofplumber';
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
            selector: 'page-privacy',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/privacy/privacy.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            {{heading}}\n        </ion-title>\n    </ion-navbar>\n    <div class="logo-box bg-thime">\n        <div class="logo">\n            <img src="assets/imgs/logo.png">\n            <h1 class="text-white">{{config.appName}}</h1>\n        </div>\n    </div>\n</ion-header>\n\n<ion-content>\n    <div class="text">\n        <!-- <h2 class="text-thime">{{\'our_privacy_policy\' | translate}}</h2> -->\n        <div [innerHTML]="toShow"></div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/privacy/privacy.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], PrivacyPage);
    return PrivacyPage;
}());

//# sourceMappingURL=privacy.js.map

/***/ }),

/***/ 142:
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
webpackEmptyAsyncContext.id = 142;

/***/ }),

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClientService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__ = __webpack_require__(336);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap__ = __webpack_require__(337);
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
    ClientService.prototype.getCountries = function () {
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
    ClientService.prototype.updateProfile = function (token, profileRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put(this.config.apiBase + "provider/profile", JSON.stringify(profileRequest), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.plans = function (token) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get(this.config.apiBase + "provider/plans", { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.planPurchase = function (adminToken, planId, token) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + adminToken });
        return this.http.post(this.config.apiBase + 'provider/plans/' + planId + '/payment/stripe', { token: token }, { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.planDetails = function (adminToken) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken });
        return this.http.get(this.config.apiBase + "provider/plan-details", { headers: myHeaders }).concatMap(function (data) {
            data.remaining_days_count = 0;
            if (data.subscription) {
                var dateStart = new Date(data.subscription.starts_on);
                var dateEnd = new Date(data.subscription.expires_on);
                var dateNow = new Date();
                data.remaining_days_count = dateNow > dateEnd ? 0 : Math.round((dateEnd.getTime() - dateNow.getTime()) / (1000 * 60 * 60 * 24));
                data.starts_at = _this.formatDate(dateStart);
                data.ends_at = _this.formatDate(dateEnd);
            }
            if (!data.leads_remaining_for_today)
                data.leads_remaining_for_today = 0;
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
    ClientService.prototype.getProfile = function (token) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get(this.config.apiBase + "provider/profile", { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.getRatings = function (token, userId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get(this.config.apiBase + "customer/providers/" + userId + "/rating-summary", { headers: myHeaders }).concatMap(function (data) {
            data.average_rating = Number(data.average_rating).toFixed(2);
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.getMyReviews = function (token, pageNo) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get(this.config.apiBase + "provider/ratings/?page=" + pageNo, { headers: myHeaders }).concatMap(function (data) {
            for (var _i = 0, _a = data.data; _i < _a.length; _i++) {
                var review = _a[_i];
                review.created_at = _this.formatDate(new Date(review.created_at));
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
    ClientService.prototype.appointments = function (token, pageNo) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get(this.config.apiBase + "provider/appointment?page=" + pageNo, { headers: myHeaders }).concatMap(function (data) {
            for (var _i = 0, _a = data.data; _i < _a.length; _i++) {
                var ap = _a[_i];
                ap.created_at = _this.formatTime(new Date(ap.created_at));
                ap.updated_at = _this.formatTime(new Date(ap.updated_at));
                for (var _b = 0, _c = ap.logs; _b < _c.length; _b++) {
                    var log = _c[_b];
                    log.updated_at = _this.formatTime(new Date(log.updated_at));
                    log.created_at = _this.formatTime(new Date(log.created_at));
                }
                ap.date = _this.formatDate(new Date(ap.date));
                ap.time_from = ap.time_from.substr(0, ap.time_from.lastIndexOf(":"));
                ap.time_to = ap.time_to.substr(0, ap.time_to.lastIndexOf(":"));
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.appointmentUpdate = function (token, apId, status) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put(this.config.apiBase + "provider/appointment/" + apId, { status: status }, { headers: myHeaders }).concatMap(function (data) {
            data.updated_at = _this.formatTime(new Date(data.updated_at));
            data.created_at = _this.formatTime(new Date(data.created_at));
            for (var _i = 0, _a = data.logs; _i < _a.length; _i++) {
                var log = _a[_i];
                log.updated_at = _this.formatTime(new Date(log.updated_at));
                log.created_at = _this.formatTime(new Date(log.created_at));
            }
            data.date = _this.formatDate(new Date(data.date));
            data.time_from = data.time_from.substr(0, data.time_from.lastIndexOf(":"));
            data.time_to = data.time_to.substr(0, data.time_to.lastIndexOf(":"));
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    ClientService.prototype.updateUser = function (token, requestBody) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put(this.config.apiBase + "user", requestBody, { headers: myHeaders }).concatMap(function (data) {
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

/***/ 186:
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
webpackEmptyAsyncContext.id = 186;

/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_signup_request_models__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__otp_otp__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(17);
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
            selector: 'page-signup',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/signup/signup.html"*/'<ion-header class="bg-transparent">\n    <ion-navbar>\n        <ion-title>{{\'sign_up\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="form">\n        <ion-list no-lines>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-person" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'enter_full_name\' | translate}}</ion-label>\n                <ion-input type="text" [(ngModel)]="signUpRequest.name"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-mail" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'enter_email_id\' | translate}}</ion-label>\n                <ion-input type="email" [(ngModel)]="signUpRequest.email"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-globe" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label floating>{{\'select_country\' | translate}}</ion-label>\n                <ion-select [(ngModel)]="countryCode" interface="popover" multiple="false" class="text-thime">\n                    <ion-option [value]="country.callingCodes[0]" *ngFor="let country of countries">{{country.name}}</ion-option>\n                </ion-select>\n            </ion-item>\n            <ion-item>\n                <ion-avatar item-start style="margin-bottom: 3px; margin-right: 28px;">\n                    <ion-icon name="md-phone-portrait" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'mobile_number\' | translate}}</ion-label>\n                <ion-input type="tel" [(ngModel)]="phoneNumber"></ion-input>\n            </ion-item>\n        </ion-list>\n\n        <button class="btn" ion-button round full margin-top margin-bottom (click)="requestSignUp()">{{\'sign_up_now\' | translate}}</button>\n        <!-- <p class="text-thime" text-center (click)="forgotpassword()">Forgot Password</p> -->\n\n\n\n    </div>\n</ion-content>\n<ion-footer>\n    <p class="text-grey" text-center style="margin-top: 30px;"><small> {{\'by_signing_up\' | translate}}<ins>{{\'terms_condition\' | translate}}</ins></small></p>\n</ion-footer>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/signup/signup.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], SignupPage);
    return SignupPage;
}());

//# sourceMappingURL=signup.js.map

/***/ }),

/***/ 232:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RequestsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__booking_booking__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(17);
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
    function RequestsPage(navCtrl, service, loadingCtrl, translate) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.translate = translate;
        this.requests = "upcoming";
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
    }
    RequestsPage.prototype.onSegmentChange = function () {
        var _this = this;
        setTimeout(function () {
            _this.toShow = _this.requests == "upcoming" ? _this.upcoming : _this.complete;
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
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    RequestsPage.prototype.ionViewDidEnter = function () {
        var dra = window.localStorage.getItem("refreshappointments");
        if (dra && dra == "true") {
            this.pageNo = 1;
            this.upcoming = new Array();
            this.complete = new Array();
            this.loadRequests();
        }
        window.localStorage.removeItem("refreshappointments");
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
            selector: 'page-requests',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/requests/requests.html"*/'<ion-header class="bg-thime">\n    <ion-navbar>\n        <ion-title>{{\'requests\' | translate}}</ion-title>\n    </ion-navbar>\n    <ion-segment [(ngModel)]="requests" (ionChange)="onSegmentChange()">\n        <ion-segment-button value="upcoming">\n            {{\'upcoming\' | translate}}\n        </ion-segment-button>\n        <ion-segment-button value="completed">\n            {{\'completed\' | translate}}\n        </ion-segment-button>\n    </ion-segment>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content pullingIcon="arrow-dropdown" pullingText="{{\'pull_refresh\' | translate}}" refreshingSpinner="circles" refreshingText="Refreshing...">\n        </ion-refresher-content>\n    </ion-refresher>\n    <div class="empty-view" *ngIf="!loadingShown && (!toShow || !toShow.length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_appointment.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold;">{{\'no_requests_to_show\' | translate}}</span>\n        </div>\n    </div>\n    <div>\n        <ion-list no-lines>\n            <ion-item *ngFor="let ap of toShow" [ngClass]="(ap.status == \'complete\' || ap.status == \'rejected\' || ap.status == \'cancelled\') ? \'accepted\' : \'upcoming\'" (click)="requestDetail(ap)">\n                <ion-avatar item-start>\n                    <img *ngIf="ap.user && ap.user.image_url" data-src="{{ap.user.image_url}}">\n                    <img *ngIf="!ap.user || !ap.user.image_url" src="assets/imgs/empty_dp.png">\n                </ion-avatar>\n                <h2>\n                    <span class="text-ellipsis">{{ap.user.name}} </span>\n                    <span class="ml-auto text-ellipsis">{{ap.date}}, {{ap.time_from}}-{{ap.time_to}}</span>\n                </h2>\n                <p class="text-grey text-ellipsis">\n                    <span *ngIf="ap.category" class="text-ellipsis">{{ap.category.title}}</span>\n                    <span class="ml-auto">{{\'view_order\' | translate}}</span>\n                </p>\n            </ion-item>\n        </ion-list>\n        <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n            <ion-infinite-scroll-content></ion-infinite-scroll-content>\n        </ion-infinite-scroll>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/requests/requests.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */]])
    ], RequestsPage);
    return RequestsPage;
}());

//# sourceMappingURL=requests.js.map

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BookingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__chatscreen_chatscreen__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_chat_models__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_helper_models__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_diagnostic__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_firebase_app__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_geolocation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_location_accuracy__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__models_my_location_models__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_call_number__ = __webpack_require__(128);
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
    function BookingPage(navCtrl, navParam, service, locationAccuracy, loadingCtrl, toastCtrl, geolocation, callNumber, translate, diagnostic, alertCtrl) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.locationAccuracy = locationAccuracy;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.geolocation = geolocation;
        this.callNumber = callNumber;
        this.translate = translate;
        this.diagnostic = diagnostic;
        this.alertCtrl = alertCtrl;
        this.isLoading = false;
        this.loadingShown = false;
        this.statusLevel = 1;
        this.statusText = "Job Pending";
        this.subscriptions = [];
        this.appointment = navParam.get("appointment");
        this.setStatus();
    }
    ;
    BookingPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        if (this.geoSubscription) {
            this.geoSubscription.unsubscribe();
            this.geoSubscription = null;
        }
        this.dismissLoading();
    };
    BookingPage.prototype.ionViewDidEnter = function () {
        if (status == "onway") {
            this.checkAndWatchLocation();
        }
        else if (this.geoSubscription) {
            this.geoSubscription.unsubscribe();
            this.geoSubscription = null;
        }
    };
    BookingPage.prototype.updateJobStatus = function (status) {
        var _this = this;
        if (status == "onway") {
            this.checkAndWatchLocation();
        }
        else if (this.geoSubscription) {
            this.geoSubscription.unsubscribe();
            this.geoSubscription = null;
        }
        this.translate.get('updating').subscribe(function (value) {
            _this.presentLoading(value);
        });
        var subscription = this.service.appointmentUpdate(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.appointment.id, status).subscribe(function (res) {
            _this.dismissLoading();
            _this.appointment = res;
            _this.setStatus();
            window.localStorage.setItem("refreshappointments", "true");
        }, function (err) {
            console.log('update_status', err);
            _this.dismissLoading();
            if (err && err.status && err.status == 403) {
                _this.translate.get(['err_quota_title', 'err_quota_message']).subscribe(function (text) {
                    _this.presentErrorAlert(text['err_quota_title'], text['err_quota_message']);
                });
            }
        });
        this.subscriptions.push(subscription);
    };
    BookingPage.prototype.checkAndWatchLocation = function () {
        var _this = this;
        this.diagnostic.isLocationEnabled().then(function (isAvailable) {
            if (isAvailable) {
                _this.watchLocation();
            }
            else {
                _this.alertLocationServices();
            }
        }).catch(function (e) {
            console.error(e);
            _this.alertLocationServices();
        });
    };
    BookingPage.prototype.navigate = function () {
        if (this.appointment.address.latitude && this.appointment.address.longitude)
            window.open("http://maps.google.com/maps?q=loc:" + this.appointment.address.latitude + "," + this.appointment.address.longitude + " (Appointment)", "_system");
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
                    this.translate.get('job_goingto').subscribe(function (value) {
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
            var acceptedTime_1 = __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].getLogTimeForStatus("accepted", this.appointment.logs);
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
                var onwaytime = __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].getLogTimeForStatus("onway", _this.appointment.logs);
                if (onwaytime && onwaytime.length) {
                    _this.statusLevel2Time = value + onwaytime;
                }
                else {
                    _this.statusLevel2Time = value + __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].getLogTimeForStatus("ongoing", _this.appointment.logs);
                }
            });
            this.translate.get('job_completed_on').subscribe(function (value) {
                _this.statusLevel3Time = value + __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].getLogTimeForStatus("complete", _this.appointment.logs);
            });
            console.log(this.appointment.logs);
        }
    };
    BookingPage.prototype.callUser = function () {
        this.callNumber.callNumber(this.appointment.user.mobile_number, true).then(function (res) { return console.log('Launched dialer!', res); }).catch(function (err) { return console.log('Error launching dialer', err); });
    };
    BookingPage.prototype.chatscreen = function () {
        var newUserMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_USER));
        var chat = new __WEBPACK_IMPORTED_MODULE_5__models_chat_models__["a" /* Chat */]();
        chat.chatId = this.appointment.user.id;
        chat.chatImage = this.appointment.user.image_url;
        chat.chatName = this.appointment.user.name;
        chat.chatStatus = this.appointment.user.email;
        chat.myId = newUserMe.id;
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__chatscreen_chatscreen__["a" /* ChatscreenPage */], { chat: chat });
    };
    BookingPage.prototype.watchLocation = function () {
        var _this = this;
        this.geoSubscription = this.geolocation.watchPosition().subscribe(function (position) {
            if (position.coords != undefined) {
                var geoposition = position;
                console.log('Latitude: ' + geoposition.coords.latitude + ' - Longitude: ' + geoposition.coords.longitude);
                var location_1 = new __WEBPACK_IMPORTED_MODULE_12__models_my_location_models__["a" /* MyLocation */]();
                location_1.lat = String(geoposition.coords.latitude);
                location_1.lng = String(geoposition.coords.longitude);
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_LOCATION, JSON.stringify(location_1));
                var refLocation = __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"]().ref().child("handyman_provider").child(String(_this.appointment.provider.user_id));
                refLocation.set(location_1, function (error) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
            else {
                var positionError = position;
                console.log('Error ' + positionError.code + ': ' + positionError.message);
            }
        });
    };
    BookingPage.prototype.alertLocationServices = function () {
        var _this = this;
        this.translate.get(['location_services_title', 'location_services_message', 'okay']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['location_services_title'],
                subTitle: text['location_services_message'],
                buttons: [{
                        text: text['okay'],
                        role: 'cancel',
                        handler: function () {
                            console.log('okay clicked');
                            _this.locationAccuracy.canRequest().then(function (canRequest) {
                                if (canRequest) {
                                    // the accuracy option will be ignored by iOS
                                    _this.locationAccuracy.request(_this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(function () { return console.log('Request successful'); }, function (error) { return console.log('Error requesting location permissions', error); });
                                }
                            });
                        }
                    }]
            });
            alert.present();
        });
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
    BookingPage.prototype.presentErrorAlert = function (title, msg) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: msg,
            buttons: ["Dismiss"]
        });
        alert.present();
    };
    BookingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-booking',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/booking/booking.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'job_detail\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-list class="profile">\n        <ion-item>\n            <ion-avatar item-start>\n                <img *ngIf="appointment.user && appointment.user.image_url" data-src="{{appointment.user.image_url}}">\n                <img *ngIf="!appointment.user || !appointment.user.image_url" src="assets/imgs/empty_dp.png">\n            </ion-avatar>\n            <h2 class="">\n                <strong class="text-ellipsis">{{appointment.user.name}}</strong>\n                <span class="callmsg">\n                    <ion-icon name="md-call" class="text-thime" (click)="callUser()"></ion-icon>\n                    <ion-icon name="md-text" class="text-thime" (click)="chatscreen()"></ion-icon>\n                </span>\n            </h2>\n            <div class="details">\n                <p *ngIf="appointment.category" class="">\n                    <small>Job Task</small>\n                    <span class="text-ellipsis">{{appointment.category.title}}</span>\n                </p>\n                <ion-row>\n                    <ion-col col-6>\n                        <p class="">\n                            <small>{{\'date\' | translate}}</small>\n                            <span class="text-ellipsis">\n                                {{appointment.date}}\n                            </span>\n                        </p>\n                    </ion-col>\n                    <ion-col col-6>\n                        <p class="job-fess">\n                            <small>{{\'time\' | translate}}</small>\n                            <span class="text-ellipsis">\n                                {{appointment.time_from}}-{{appointment.time_to}}\n                            </span>\n                        </p>\n                    </ion-col>\n                </ion-row>\n                <div class="location" (click)="navigate()">\n                    <p *ngIf="appointment.address" class="job-fess">\n                        <small>{{\'address\' | translate}}</small>\n                        <span class="">{{appointment.address.address}}</span>\n                    </p>\n                    <ion-icon name="md-navigate" class="text-thime"></ion-icon>\n                </div>\n                <p *ngIf="appointment.notes && appointment.notes.length" class="job-fess">\n                    <small>{{\'appointment_notes\' | translate}}</small>\n                    <span class="">{{appointment.notes}}</span>\n                </p>\n            </div>\n        </ion-item>\n    </ion-list>\n    <div class="btn-container">\n        <ion-row *ngIf="appointment.status==\'pending\'">\n            <ion-col col-6>\n                <button ion-button icon-start full class="" (click)="updateJobStatus(\'rejected\')">\n                    <ion-icon name="md-close"></ion-icon>{{\'cancel_job\' | translate}}\n                </button>\n            </ion-col>\n            <ion-col col-6>\n                <button ion-button icon-start full class="text-green" (click)="updateJobStatus(\'accepted\')">\n                    <ion-icon name="ios-checkmark-circle"></ion-icon>{{\'accept_job\' | translate}}\n                </button>\n            </ion-col>\n        </ion-row>\n        <ion-row\n            *ngIf="appointment.status==\'rejected\' || appointment.status==\'cancelled\' || appointment.status==\'complete\'">\n            <ion-col *ngIf="appointment.status==\'rejected\'">\n                <button ion-button icon-start full class="">\n                    <ion-icon name="md-close"></ion-icon>{{\'job_rejected\' | translate}}\n                </button>\n            </ion-col>\n            <ion-col *ngIf="appointment.status==\'cancelled\'">\n                <button ion-button icon-start full class="">\n                    <ion-icon name="md-close"></ion-icon>{{\'job_cancelled\' | translate}}\n                </button>\n            </ion-col>\n            <ion-col *ngIf="appointment.status==\'complete\'">\n                <button ion-button icon-start full class="text-green">\n                    <ion-icon name="ios-checkmark-circle"></ion-icon>{{\'job_completed\' | translate}}\n                </button>\n            </ion-col>\n        </ion-row>\n        <ion-row *ngIf="appointment.status==\'accepted\' || appointment.status==\'onway\' || appointment.status==\'ongoing\'">\n            <ion-col *ngIf="appointment.status==\'accepted\'">\n                <button ion-button icon-start full class="text-green" (click)="updateJobStatus(\'onway\')">\n                    <ion-icon name="ios-checkmark-circle"></ion-icon>{{\'gofor_job\' | translate}}\n                </button>\n            </ion-col>\n            <ion-col *ngIf="appointment.status==\'onway\'">\n                <button ion-button icon-start full class="text-green" (click)="updateJobStatus(\'ongoing\')">\n                    <ion-icon name="ios-checkmark-circle"></ion-icon>{{\'start_job\' | translate}}\n                </button>\n            </ion-col>\n            <ion-col *ngIf="appointment.status==\'ongoing\'" (click)="updateJobStatus(\'complete\')">\n                <button ion-button icon-start full class="text-green">\n                    <ion-icon name="ios-checkmark-circle"></ion-icon>{{\'mark_job_complete\' | translate}}\n                </button>\n            </ion-col>\n        </ion-row>\n    </div>\n    <div class="job-status">\n        <h2>{{\'job_status\' | translate}}</h2>\n        <ion-list no-lines>\n            <ion-item [ngClass]="statusLevel==1 ? \'active\' : \'disable\'">\n                <span item-start class="circle"></span>\n                <div class="text">\n                    <h4 class="text-ellipsis">{{\'job_\'+appointment.status | translate}}\n                        <small *ngIf="statusLevel1Time">{{statusLevel1Time}}</small>\n                    </h4>\n                </div>\n            </ion-item>\n            <ion-item [ngClass]="statusLevel==2 ? \'active\' : \'disable\'">\n                <span item-start class="circle"></span>\n                <div class="text">\n                    <h4 class="text-ellipsis">{{\'job_in_process\' | translate}}\n                        <small *ngIf="statusLevel2Time">{{statusLevel2Time}}</small>\n                    </h4>\n                </div>\n            </ion-item>\n            <ion-item [ngClass]="statusLevel==3 ? \'active\' : \'disable\'">\n                <span item-start class="circle"></span>\n                <div class="text">\n                    <h4 class="text-ellipsis">{{\'job_complete\' | translate}}\n                        <small *ngIf="statusLevel3Time">{{statusLevel3Time}}</small>\n                    </h4>\n                </div>\n            </ion-item>\n        </ion-list>\n    </div>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/booking/booking.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_location_accuracy__["a" /* LocationAccuracy */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_10__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_13__ionic_native_call_number__["a" /* CallNumber */],
            __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_8__ionic_native_diagnostic__["a" /* Diagnostic */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], BookingPage);
    return BookingPage;
}());

//# sourceMappingURL=booking.js.map

/***/ }),

/***/ 236:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Chat; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_models__ = __webpack_require__(29);

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

/***/ 240:
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

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificationsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



//import { ListofplumberPage } from '../listofplumber/listofplumber';
var NotificationsPage = /** @class */ (function () {
    function NotificationsPage(navCtrl) {
        this.navCtrl = navCtrl;
        console.log("NotificationPage");
    }
    NotificationsPage.prototype.ionViewDidEnter = function () {
        this.notifications = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].KEY_NOTIFICATIONS));
        if (this.notifications == null)
            this.notifications = new Array();
    };
    NotificationsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-notifications',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/notifications/notifications.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'notifications\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div class="empty-view" *ngIf="(!notifications || !notifications.length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_notification.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold;">\n                {{\'empty_notifications\' | translate}}\n            </span>\n        </div>\n    </div>\n    <ion-list *ngIf="notifications && notifications.length" no-lines>\n        <ion-item *ngFor="let item of notifications">\n            <ion-label>\n                <h2>{{item.title}}</h2>\n                <p>{{item.detail}}</p>\n            </ion-label>\n            <ion-note item-end>{{item.time}}</ion-note>\n        </ion-item>\n    </ion-list>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/notifications/notifications.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], NotificationsPage);
    return NotificationsPage;
}());

//# sourceMappingURL=notifications.js.map

/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AllreviewPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(17);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AllreviewPage = /** @class */ (function () {
    function AllreviewPage(navCtrl, service, loadingCtrl, translate) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.translate = translate;
        this.loadingShown = false;
        this.allDone = false;
        this.isLoading = true;
        this.pageNo = 1;
        this.subscriptions = [];
        this.reviews = [];
        this.translate.get('loading_reviews').subscribe(function (value) {
            _this.presentLoading(value);
        });
        this.loadReviews();
    }
    AllreviewPage.prototype.loadReviews = function () {
        var _this = this;
        this.isLoading = true;
        var subscription = this.service.getMyReviews(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.pageNo).subscribe(function (res) {
            var reviews = res.data;
            _this.allDone = (!reviews || !reviews.length);
            _this.dismissLoading();
            if (_this.infiniteScroll)
                _this.infiniteScroll.complete();
            _this.reviews = _this.reviews.concat(reviews);
            _this.isLoading = false;
        }, function (err) {
            console.log('reviews', err);
            _this.dismissLoading();
            if (_this.infiniteScroll)
                _this.infiniteScroll.complete();
            _this.isLoading = false;
        });
        this.subscriptions.push(subscription);
    };
    AllreviewPage.prototype.doInfinite = function (infiniteScroll) {
        this.infiniteScroll = infiniteScroll;
        if (!this.allDone) {
            this.pageNo = this.pageNo + 1;
            this.loadReviews();
        }
        else {
            infiniteScroll.complete();
        }
    };
    AllreviewPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    AllreviewPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    AllreviewPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    AllreviewPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-allreview',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/allreview/allreview.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'your_reviews\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div class="empty-view" *ngIf="!isLoading && (!reviews || !reviews.length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_reviews.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold;">\n                {{\'no_reviews_to_show\' | translate}}\n            </span>\n        </div>\n    </div>\n    <ion-list no-lines class="reviews">\n        <ion-item *ngFor="let review of reviews">\n            <div class="reviews-details">\n                <div class="review-img">\n                    <img *ngIf="review.user && review.user.image_url" data-src="{{review.user.image_url}}">\n                    <img *ngIf="!review.user || !review.user.image_url" src="assets/imgs/empty_dp.png">\n                </div>\n                <h2 class="text-ellipsis">\n                    {{review.user.name}}<br>\n                    <small class="text-green">\n                        {{review.rating}}\n                        <ion-icon name="star" class="text-green"></ion-icon>\n                    </small>\n                </h2>\n                <p class="text-ellipsis">{{review.created_at}} </p>\n            </div>\n            <p>{{review.review}}</p>\n        </ion-item>\n    </ion-list>\n    <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n        <ion-infinite-scroll-content></ion-infinite-scroll-content>\n    </ion-infinite-scroll>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/allreview/allreview.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */]])
    ], AllreviewPage);
    return AllreviewPage;
}());

//# sourceMappingURL=allreview.js.map

/***/ }),

/***/ 243:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RatingSummary; });
var RatingSummary = /** @class */ (function () {
    function RatingSummary(total, percent, rounded_rating) {
        this.total = total;
        this.percent = percent;
        this.rounded_rating = rounded_rating;
    }
    RatingSummary.defaultArray = function () {
        var ratingSummaries = new Array();
        for (var i = 0; i < 5; i++) {
            ratingSummaries.push(new RatingSummary(0, 0, i));
        }
        return ratingSummaries;
    };
    return RatingSummary;
}());

//# sourceMappingURL=rating-summary.models.js.map

/***/ }),

/***/ 244:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AccountPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__myprofile_myprofile__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__packages_packages__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__conatctus_conatctus__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__privacy_privacy__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__aboutus_aboutus__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__faqs_faqs__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__signin_signin__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_profile_models__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__models_category_models__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ngx_translate_core__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__managelanguage_managelanguage__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__models_helper_models__ = __webpack_require__(29);
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
    function AccountPage(navCtrl, alertCtrl, app, translate) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.app = app;
        this.translate = translate;
        this.profile = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_10__models_constants_models__["a" /* Constants */].KEY_PROFILE));
        if (!this.profile) {
            this.profile = new __WEBPACK_IMPORTED_MODULE_9__models_profile_models__["a" /* Profile */]();
            this.profile.primary_category = new __WEBPACK_IMPORTED_MODULE_11__models_category_models__["a" /* Category */]();
            this.profile.subcategories = new Array();
            this.profile.price_type = "hour";
            this.profile.about = "";
        }
        if (!this.profile.primary_category) {
            this.profile.primary_category = new __WEBPACK_IMPORTED_MODULE_11__models_category_models__["a" /* Category */]();
        }
        if (!this.profile.subcategories) {
            this.profile.subcategories = new Array();
        }
    }
    AccountPage.prototype.ionViewDidEnter = function () {
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_10__models_constants_models__["a" /* Constants */].KEY_USER));
    };
    AccountPage.prototype.myprofile = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__myprofile_myprofile__["a" /* MyprofilePage */]);
    };
    AccountPage.prototype.packages = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__packages_packages__["a" /* PackagesPage */]);
    };
    AccountPage.prototype.conatctus = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__conatctus_conatctus__["a" /* ConatctusPage */]);
    };
    AccountPage.prototype.privacy = function () {
        var _this = this;
        var terms = __WEBPACK_IMPORTED_MODULE_14__models_helper_models__["a" /* Helper */].getSetting("privacy_policy");
        if (terms && terms.length) {
            this.translate.get('privacy_policy').subscribe(function (value) {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__privacy_privacy__["a" /* PrivacyPage */], { toShow: terms, heading: value });
            });
        }
    };
    AccountPage.prototype.aboutus = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__aboutus_aboutus__["a" /* AboutusPage */]);
    };
    AccountPage.prototype.faqs = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__faqs_faqs__["a" /* FaqsPage */]);
    };
    AccountPage.prototype.chooseLanguage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_13__managelanguage_managelanguage__["a" /* ManagelanguagePage */]);
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
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_10__models_constants_models__["a" /* Constants */].KEY_USER);
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_10__models_constants_models__["a" /* Constants */].KEY_TOKEN);
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_10__models_constants_models__["a" /* Constants */].KEY_PROFILE);
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_10__models_constants_models__["a" /* Constants */].KEY_NOTIFICATIONS);
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_10__models_constants_models__["a" /* Constants */].KEY_CARD_INFO);
                            _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_8__signin_signin__["a" /* SigninPage */]);
                        }
                    }]
            });
            alert.present();
        });
    };
    AccountPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-account',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/account/account.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'account\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n<ion-content class="bg-light">\n    <ion-list no-lines>\n        <ion-item class="profile" (click)="myprofile()">\n            <ion-avatar item-start>\n                <img *ngIf="user && user.image_url" data-src="{{user.image_url}}">\n                <img *ngIf="!user || !user.image_url" src="assets/imgs/empty_dp.png">\n            </ion-avatar>\n            <h2>\n                <span *ngIf="user" class="text-ellipsis">{{user.name}}</span>\n                <span *ngIf="profile && profile.primary_category && profile.primary_category.title" class="small">|\n                    {{profile.primary_category.title}}</span>\n                <span *ngIf="profile && profile.is_verified==1"\n                    class="text-green ml-auto ">{{\'verified\' | translate}}</span>\n            </h2>\n            <p class="text-thime">{{\'view_profile\' | translate}}</p>\n        </ion-item>\n\n        <ion-item class="" (click)="packages()">\n            <h2>\n                <ion-icon name="md-clipboard" class="mr-auto text-thime"></ion-icon> <span class="text-ellipsis">\n                    {{\'your_plan\' | translate}}</span>\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n            </h2>\n        </ion-item>\n        <ion-item class="" (click)="conatctus()">\n            <h2>\n                <ion-icon name="ios-mail" class="mr-auto text-thime"></ion-icon> <span class="text-ellipsis">{{\'contact_us\'\n                    | translate}}</span>\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n            </h2>\n        </ion-item>\n        <ion-item class="" (click)="privacy()">\n            <h2>\n                <ion-icon name="md-lock" class="mr-auto text-thime"></ion-icon> <span class="text-ellipsis">{{\'privacy_policy\'\n                    | translate}}</span>\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n            </h2>\n        </ion-item>\n        <ion-item class="" (click)="aboutus()">\n            <h2>\n                <ion-icon class="mr-auto text-thime"> <img src="assets/imgs/about-icon.png"></ion-icon> <span\n                    class="text-ellipsis">{{\'about_us\'\n                    | translate}}</span>\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n            </h2>\n        </ion-item>\n        <ion-item class="" (click)="chooseLanguage()">\n            <h2>\n                <ion-icon name="md-globe" class="mr-auto text-thime"></ion-icon> <span class="text-ellipsis">\n                    {{\'change_language\' | translate}}</span>\n                <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n            </h2>\n        </ion-item>\n    </ion-list>\n    <ion-list no-lines>\n        <ion-item class="sign-out" (click)="alertLogout()">\n            <h2 text-center>\n                <strong class="text-ellipsis text-thime" text-center>{{\'sign_out\' | translate}}</strong>\n            </h2>\n        </ion-item>\n    </ion-list>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/account/account.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_12__ngx_translate_core__["c" /* TranslateService */]])
    ], AccountPage);
    return AccountPage;
}());

//# sourceMappingURL=account.js.map

/***/ }),

/***/ 245:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyprofilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__selectservice_selectservice__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_profile_models__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_category_models__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__selectarea_selectarea__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_firebase_service__ = __webpack_require__(368);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_profile_update_request_models__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ngx_translate_core__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__review_review__ = __webpack_require__(129);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var MyprofilePage = /** @class */ (function () {
    function MyprofilePage(navCtrl, service, alertCtrl, loadingCtrl, toastCtrl, firebaseService, translate, navParam) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.service = service;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.firebaseService = firebaseService;
        this.translate = translate;
        this.loadingShown = false;
        this.selectionPagePushed = false;
        this.subscriptions = [];
        this.level = 0;
        var create_edit = navParam.get("create_edit");
        if (create_edit) {
            this.translate.get('create_edit_profile').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_USER));
        this.profile = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_PROFILE));
        this.categories = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_CATEGORY));
        this.location = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_LOCATION));
        if (!this.categories) {
            this.translate.get('just_moment').subscribe(function (value) {
                _this.presentLoading(value);
            });
        }
        if (!this.profile) {
            this.profile = new __WEBPACK_IMPORTED_MODULE_4__models_profile_models__["a" /* Profile */]();
            this.profile.primary_category = new __WEBPACK_IMPORTED_MODULE_6__models_category_models__["a" /* Category */]();
            this.profile.subcategories = new Array();
            this.profile.price_type = "hour";
            this.profile.about = "";
            this.profile.user = this.user;
        }
        if (!this.profile.primary_category) {
            this.profile.primary_category = new __WEBPACK_IMPORTED_MODULE_6__models_category_models__["a" /* Category */]();
        }
        if (!this.profile.subcategories) {
            this.profile.subcategories = new Array();
        }
        this.refreshProfile();
        this.refreshCategories();
    }
    MyprofilePage.prototype.ionViewDidEnter = function () {
        var newSelectedLocation = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_LOCATION));
        this.location = newSelectedLocation;
        if (this.selectionPagePushed) {
            this.selectionPagePushed = false;
            var subCategories = JSON.parse(window.localStorage.getItem("temp_sub_cats"));
            window.localStorage.removeItem("temp_sub_cats");
            if (subCategories && subCategories.length) {
                this.profile.subcategories = subCategories;
            }
        }
    };
    MyprofilePage.prototype.refreshProfile = function () {
        var _this = this;
        var subscription = this.service.getProfile(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN)).subscribe(function (res) {
            if (res && res.primary_category && res.primary_category_id) {
                _this.profile = res;
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_PROFILE, JSON.stringify(_this.profile));
            }
            else {
                window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_PROFILE);
                _this.profile = new __WEBPACK_IMPORTED_MODULE_4__models_profile_models__["a" /* Profile */]();
                _this.profile.primary_category = new __WEBPACK_IMPORTED_MODULE_6__models_category_models__["a" /* Category */]();
                _this.profile.subcategories = new Array();
                _this.profile.price_type = "hour";
                _this.profile.about = "";
                _this.profile.user = _this.user;
            }
        }, function (err) {
            console.log('profile_get_err', err);
        });
        this.subscriptions.push(subscription);
    };
    MyprofilePage.prototype.refreshCategories = function () {
        var _this = this;
        var subscription = this.service.categoryParent(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN)).subscribe(function (res) {
            _this.dismissLoading();
            var cats = res.data;
            _this.categories = cats;
            console.log(cats);
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_CATEGORY, JSON.stringify(_this.categories));
        }, function (err) {
            _this.dismissLoading();
            console.log('cat_err', err);
        });
        this.subscriptions.push(subscription);
    };
    MyprofilePage.prototype.pickLocation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__selectarea_selectarea__["a" /* SelectareaPage */]);
    };
    MyprofilePage.prototype.compareFn = function (tr1, tr2) {
        return tr1 && tr2 ? tr1.id == tr2.id : tr1 === tr2;
    };
    MyprofilePage.prototype.selectservice = function () {
        if (this.profile.primary_category) {
            this.selectionPagePushed = true;
            if (this.profile.subcategories) {
                for (var _i = 0, _a = this.profile.subcategories; _i < _a.length; _i++) {
                    var subCat = _a[_i];
                    subCat.selected = true;
                }
            }
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__selectservice_selectservice__["a" /* SelectservicePage */], { cat: this.profile.primary_category, cats: this.profile.subcategories });
        }
    };
    MyprofilePage.prototype.pickPicker = function (num) {
        if (this.progress)
            return;
        var fileInput = document.getElementById(num == 1 ? "profile-image" : "profile-doc");
        fileInput.click();
    };
    MyprofilePage.prototype.upload = function ($event, isImage) {
        var _this = this;
        var file = $event.target.files[0];
        if (file) {
            if (isImage && !file.type.includes("image")) {
                this.translate.get('err_choose_image').subscribe(function (value) {
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
                    _this.profile.user.image_url = String(url);
                    _this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN), { image_url: String(url) }).subscribe(function (res) {
                        console.log(res);
                        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_USER, JSON.stringify(res));
                    }, function (err) {
                        console.log('update_user', err);
                    });
                }
                else {
                    _this.profile.document_url = String(url);
                    _this.translate.get('document_uploaded').subscribe(function (value) {
                        _this.showToast(value);
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
    MyprofilePage.prototype.save = function () {
        // Uncomment if it's need =======================
        var _this = this;
        if (!this.location) {
            this.translate.get('err_select_location').subscribe(function (value) {
                _this.showToast(value);
            });
            return;
        }
        if (!this.profile.about || !this.profile.about.length) {
            this.translate.get('err_empty_about').subscribe(function (value) {
                _this.showToast(value);
            });
            return;
        }
        if (!this.profile.price || this.profile.price <= 0) {
            this.translate.get('err_empty_price').subscribe(function (value) {
                _this.showToast(value);
            });
            return;
        }
        if (!this.profile.document_url || !this.profile.document_url.length) {
            this.translate.get('err_empty_doc').subscribe(function (value) {
                _this.showToast(value);
            });
            return;
        }
        if (!this.profile.primary_category) {
            this.translate.get('err_service_cat').subscribe(function (value) {
                _this.showToast(value);
            });
            return;
        }
        if (!this.profile.subcategories || !this.profile.subcategories.length) {
            this.translate.get('err_services').subscribe(function (value) {
                _this.showToast(value);
            });
            return;
        }
        var profileRequest = new __WEBPACK_IMPORTED_MODULE_9__models_profile_update_request_models__["a" /* ProfileUpdateRequest */]();
        profileRequest.address = this.location ? this.location.name : '';
        profileRequest.latitude = this.location ? this.location.lat : '';
        profileRequest.longitude = this.location ? this.location.lng : '';
        profileRequest.about = this.profile ? this.profile.about : '';
        profileRequest.price = this.profile ? this.profile.price : 0;
        profileRequest.price_type = this.profile ? this.profile.price_type : '';
        profileRequest.document_url = this.profile ? this.profile.document_url : '';
        profileRequest.primary_category_id = this.profile ? this.profile.primary_category.id : undefined;
        profileRequest.sub_categories = new Array();
        if (this.profile) {
            for (var _i = 0, _a = this.profile.subcategories; _i < _a.length; _i++) {
                var cat = _a[_i];
                profileRequest.sub_categories.push(cat.id);
            }
        }
        this.translate.get('profile_updating').subscribe(function (value) {
            _this.presentLoading(value);
        });
        console.log('update_request', profileRequest);
        var subscription = this.service.updateProfile(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN), profileRequest).subscribe(function (res) {
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_PROFILE, JSON.stringify(res));
            _this.dismissLoading();
            // this.navCtrl.pop();
            _this.navCtrl.popTo(__WEBPACK_IMPORTED_MODULE_11__review_review__["a" /* ReviewPage */]);
        }, function (err) {
            _this.dismissLoading();
            console.log("profile_update_err", err);
            _this.translate.get('profile_updating_fail').subscribe(function (value) {
                _this.presentErrorAlert(value);
            });
            _this.navCtrl.popTo(__WEBPACK_IMPORTED_MODULE_11__review_review__["a" /* ReviewPage */]);
        });
        this.subscriptions.push(subscription);
    };
    MyprofilePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    MyprofilePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    MyprofilePage.prototype.showToast = function (message) {
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
    MyprofilePage.prototype.presentErrorAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: "Error",
            subTitle: msg,
            buttons: ["Dismiss"]
        });
        alert.present();
    };
    MyprofilePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-myprofile',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/myprofile/myprofile.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'my_profile\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n<ion-content class="bg-light">\n    <div *ngIf="user" class="form box-shadow" padding-top>\n        <ion-list no-lines>\n            <ion-row class="profile">\n                <ion-col col-4>\n                    <div class="img-box" (click)="pickPicker(1)">\n                        <img *ngIf="profile && profile.user && profile.user.image_url"\n                            data-src="{{profile.user.image_url}}">\n                        <img *ngIf="!profile || !profile.user || !profile.user.image_url"\n                            src="assets/imgs/empty_dp.png">\n                        <ion-icon name="md-camera"></ion-icon>\n                        <input id="profile-image" style="display: none" (change)="upload($event, true)" type="file">\n                    </div>\n                </ion-col>\n                <ion-col col-8 padding-left>\n                    <ion-item>\n                        <ion-label floating>{{\'your_name\' | translate}}</ion-label>\n                        <ion-input disabled="true" [(ngModel)]="user.name"></ion-input>\n                    </ion-item>\n                </ion-col>\n            </ion-row>\n\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-mail" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'enter_email_id\' | translate}}</ion-label>\n                <ion-input disabled="true" [(ngModel)]="user.email"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-avatar item-start style="margin-bottom: 3px; margin-right: 28px;">\n                    <ion-icon name="md-phone-portrait" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'mobile_number\' | translate}}</ion-label>\n                <ion-input disabled="true" [(ngModel)]="user.mobile_number"></ion-input>\n            </ion-item>\n        </ion-list>\n    </div>\n\n    <div class="your-services box-shadow form">\n        <h6>{{\'your_services\' | translate}}</h6>\n        <ion-list no-lines style="padding-bottom: 10px">\n            <ion-item *ngIf="categories">\n                <ion-label class="text-grey" floating>{{\'select_job_category\' | translate}}</ion-label>\n                <ion-select [(ngModel)]="profile.primary_category" [compareWith]="compareFn"\n                    (ngModelChange)=\'catSelected()\' placeholder="Select category" multiple="false">\n                    <ion-option *ngFor="let cat of categories" [value]="cat">{{cat.title}}</ion-option>\n                </ion-select>\n            </ion-item>\n        </ion-list>\n        <p><span class="text-ellipsis" (click)="selectservice()">{{\'select_services_you_provides\' | translate}}</span>\n            <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n        </p>\n    </div>\n\n    <div class="your-services about box-shadow form">\n        <h6>{{\'charges_and_about\' | translate}}</h6>\n        <ion-list no-lines style="">\n            <ion-row>\n                <ion-col col-6>\n                    <ion-item>\n                        <ion-label class="text-grey" floating>{{\'your_charges\' | translate}}</ion-label>\n                        <ion-input type="number" [(ngModel)]="profile.price"></ion-input>\n                    </ion-item>\n                </ion-col>\n                <ion-col col-6>\n                    <ion-item style="margin-top: 27px;">\n                        <ion-label class="text-grey" floating>{{\'your_charges_in\' | translate}}</ion-label>\n                        <ion-select [(ngModel)]="profile.price_type">\n                            <ion-option value="hour">{{\'hourly\' | translate}}</ion-option>\n                            <ion-option value="visit">{{\'daily\' | translate}}</ion-option>\n                        </ion-select>\n                    </ion-item>\n                </ion-col>\n            </ion-row>\n            <ion-item>\n                <ion-label class="text-grey" floating>{{\'about_service_provider\' | translate}}</ion-label>\n                <ion-input placeholder="" [(ngModel)]="profile.about"></ion-input>\n            </ion-item>\n        </ion-list>\n    </div>\n\n    <div class="your-services box-shadow form" (click)="pickLocation()">\n        <h6>\n            {{\'your_location\' | translate}}\n            <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n        </h6>\n        <ion-label *ngIf="location">{{location.name}}</ion-label>\n        <p *ngIf="!location"><span class="text-ellipsis">{{\'select_your_location\' | translate}}</span></p>\n        <p><span class="text-ellipsis"></span></p>\n    </div>\n\n    <div class="verification box-shadow">\n        <h6>Document Verification</h6>\n        <h2 *ngIf="profile.is_verified==1" class="text-green"><small>{{\'status\' | translate}}</small>\n            {{\'verified_profile\' | translate}}</h2>\n        <h2 *ngIf="profile.is_verified!=1" class="text-black"><small>{{\'status\' | translate}}</small>\n            {{\'verification_pending\' | translate}}</h2>\n        <h3 *ngIf="profile.is_verified!=1" class="text-thime" (click)="pickPicker(2)">\n            <ion-icon name="md-download"></ion-icon> <span>{{\'upload_document\' | translate}} <small\n                    class="text-ellipsis">{{\'upload_message\' | translate}}</small></span>\n            <input id="profile-doc" style="display: none" (change)="upload($event, false)" type="file">\n        </h3>\n    </div>\n    <button class="btn" ion-button round full margin-top margin-bottom (click)="save()">{{\'save\' | translate}}</button>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/myprofile/myprofile.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_5__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_8__providers_firebase_service__["a" /* FirebaseClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_5__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_8__providers_firebase_service__["a" /* FirebaseClient */],
            __WEBPACK_IMPORTED_MODULE_10__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], MyprofilePage);
    return MyprofilePage;
}());

//# sourceMappingURL=myprofile.js.map

/***/ }),

/***/ 246:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectservicePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SelectservicePage = /** @class */ (function () {
    function SelectservicePage(navCtrl, params, service, loadingCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.loadingShown = false;
        this.isLoading = true;
        this.subscriptions = [];
        this.parentCategory = params.get("cat");
        this.subCategories = params.get("cats");
        if (this.parentCategory) {
            if (!this.subCategories)
                this.presentLoading("Loading sub categories");
            this.loadChildCategories(this.parentCategory.id);
        }
    }
    SelectservicePage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
        if (this.subCategories) {
            var catsSelected = new Array();
            for (var _i = 0, _a = this.subCategories; _i < _a.length; _i++) {
                var cat = _a[_i];
                if (cat.selected) {
                    catsSelected.push(cat);
                }
            }
            window.localStorage.setItem("temp_sub_cats", JSON.stringify(catsSelected));
        }
    };
    SelectservicePage.prototype.done = function () {
        if (this.subCategories) {
            var catsSelected = new Array();
            for (var _i = 0, _a = this.subCategories; _i < _a.length; _i++) {
                var cat = _a[_i];
                if (cat.selected) {
                    catsSelected.push(cat);
                }
            }
            if (catsSelected.length) {
                this.navCtrl.pop();
            }
            else {
                this.showToast("No services selected");
            }
        }
    };
    SelectservicePage.prototype.loadChildCategories = function (parentId) {
        var _this = this;
        this.isLoading = true;
        var subscription = this.service.categoryChildren(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN), parentId).subscribe(function (res) {
            _this.dismissLoading();
            var cats = res.data;
            if (_this.subCategories) {
                for (var _i = 0, _a = _this.subCategories; _i < _a.length; _i++) {
                    var selectedCat = _a[_i];
                    for (var _b = 0, cats_1 = cats; _b < cats_1.length; _b++) {
                        var newCat = cats_1[_b];
                        if (selectedCat.id == newCat.id) {
                            newCat.selected = true;
                            break;
                        }
                    }
                }
            }
            _this.subCategories = cats;
            _this.isLoading = false;
        }, function (err) {
            _this.dismissLoading();
            console.log('cat_sub_err', err);
            _this.isLoading = false;
        });
        this.subscriptions.push(subscription);
    };
    SelectservicePage.prototype.toggleSelection = function (subCat) {
        subCat.selected = !subCat.selected;
        console.log('selection_toggle', subCat);
    };
    SelectservicePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    SelectservicePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    SelectservicePage.prototype.showToast = function (message) {
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
    SelectservicePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-selectservice',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/selectservice/selectservice.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'select_services\' | translate}} <span>\n                <ion-icon name="md-done-all" (click)="done(cat)"></ion-icon>\n            </span></ion-title>\n    </ion-navbar>\n    <div class="logo-box bg-thime">\n        <div *ngIf="parentCategory" class="logo" text-center>\n            <img *ngIf="parentCategory.secondary_image_url" data-src="{{parentCategory.secondary_image_url}}">\n            <img *ngIf="!parentCategory.secondary_image_url && parentCategory.image_url"\n                data-src="{{parentCategory.image_url}}">\n            <img *ngIf="!parentCategory.secondary_image_url && !parentCategory.image_url"\n                src="assets/imgs/empty_category.png">\n            <p class="text-white">{{parentCategory.title}}</p>\n        </div>\n    </div>\n</ion-header>\n\n<ion-content>\n    <div class="empty-view" *ngIf="!isLoading && (!subCategories || !subCategories.length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_category.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold;">\n                {{\'no_subcats_to_show\' | translate}}\n            </span>\n        </div>\n    </div>\n    <ion-list *ngIf="subCategories && subCategories.length">\n        <ion-item *ngFor="let cat of subCategories">\n            <ion-label (click)="toggleSelection(cat)">{{cat.title}}</ion-label>\n            <ion-checkbox [checked]="cat.selected" (click)="toggleSelection(cat)"></ion-checkbox>\n        </ion-item>\n    </ion-list>\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/selectservice/selectservice.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */]])
    ], SelectservicePage);
    return SelectservicePage;
}());

//# sourceMappingURL=selectservice.js.map

/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Profile; });
var Profile = /** @class */ (function () {
    function Profile() {
    }
    return Profile;
}());

//# sourceMappingURL=profile.models.js.map

/***/ }),

/***/ 248:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Category; });
var Category = /** @class */ (function () {
    function Category() {
    }
    return Category;
}());

//# sourceMappingURL=category.models.js.map

/***/ }),

/***/ 249:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectareaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_google_maps__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_my_location_models__ = __webpack_require__(240);
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
            selector: 'page-selectarea',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/selectarea/selectarea.html"*/'<ion-header>\n    <ion-navbar color="primary">\n        <ion-buttons left>\n            <button ion-button (click)="close()">{{\'cancel\' | translate}}</button>\n        </ion-buttons>\n        <ion-buttons right>\n            <button [disabled]="saveDisabled" ion-button (click)="save()">{{\'save\' | translate}}</button>\n        </ion-buttons>\n    </ion-navbar>\n\n    <ion-toolbar>\n        <ion-row>\n            <ion-col col-11>\n                <ion-searchbar [(ngModel)]="query" (ionInput)="searchPlace()"></ion-searchbar>\n            </ion-col>\n            <ion-col col-1>\n                <ion-icon name="md-locate" (click)="detect()"></ion-icon>\n            </ion-col>\n        </ion-row>\n    </ion-toolbar>\n\n    <ion-list>\n        <ion-item *ngFor="let place of places" (touchstart)="selectPlace(place)">{{place.description}}</ion-item>\n    </ion-list>\n\n</ion-header>\n\n<ion-content>\n\n    <div #pleaseConnect id="please-connect">\n        <p>{{\'please_connect_to_the_internet\' | translate}}</p>\n    </div>\n\n    <div #map id="map">\n        <ion-spinner></ion-spinner>\n    </div>\n\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/selectarea/selectarea.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["h" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_1__angular_core__["M" /* NgZone */], __WEBPACK_IMPORTED_MODULE_3__providers_google_maps__["a" /* GoogleMaps */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["l" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["n" /* ToastController */]])
    ], SelectareaPage);
    return SelectareaPage;
}());

//# sourceMappingURL=selectarea.js.map

/***/ }),

/***/ 250:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GoogleMaps; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__connectivity_service__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_config__ = __webpack_require__(28);
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
    function GoogleMaps(config, connectivityService, geolocation) {
        this.config = config;
        this.connectivityService = connectivityService;
        this.geolocation = geolocation;
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
                        script.src = 'http://maps.google.com/maps/api/js?key=' + _this.config.googleApiKey + '&callback=mapInit&libraries=places';
                    }
                    else {
                        script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
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
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_3__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1__connectivity_service__["a" /* Connectivity */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */]])
    ], GoogleMaps);
    return GoogleMaps;
}());

//# sourceMappingURL=google-maps.js.map

/***/ }),

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Connectivity; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_network__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
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

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PackagesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__purchaseplan_purchaseplan__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_helper_models__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_plan_detail_models__ = __webpack_require__(381);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var PackagesPage = /** @class */ (function () {
    function PackagesPage(navCtrl, service, loadingCtrl, translate) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.translate = translate;
        this.loadingShown = false;
        this.subscriptions = [];
        this.myPlanDetail = __WEBPACK_IMPORTED_MODULE_7__models_plan_detail_models__["a" /* PlanDetail */].default();
        this.currency = __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].getSetting("currency");
        this.plans = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_PLANS));
        if (!this.plans)
            this.translate.get('loading_plans').subscribe(function (value) {
                _this.presentLoading(value);
            });
        this.refreshPackages();
    }
    PackagesPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        var subscription = this.service.planDetails(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_TOKEN)).subscribe(function (res) {
            _this.myPlanDetail = res;
        }, function (err) {
            console.log('plandetail', err);
        });
        this.subscriptions.push(subscription);
    };
    PackagesPage.prototype.refreshPackages = function () {
        var _this = this;
        var subscription = this.service.plans(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_TOKEN)).subscribe(function (res) {
            for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                var p = res_1[_i];
                p.priceToShow = _this.currency + p.price;
            }
            _this.plans = res;
            _this.dismissLoading();
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_PLANS, JSON.stringify(res));
        }, function (err) {
            console.log('packageslist', err);
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    PackagesPage.prototype.planDetail = function (plan) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__purchaseplan_purchaseplan__["a" /* PurchaseplanPage */], { plan: plan });
    };
    PackagesPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    PackagesPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    PackagesPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    PackagesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-packages',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/packages/packages.html"*/'<ion-header class="bg-thime">\n    <ion-navbar>\n        <ion-title>{{\'packages\' | translate}}</ion-title>\n    </ion-navbar>\n    <div class="header-text text-white" text-center>\n        <h1 class="text-ellipsis">{{myPlanDetail.leads_remaining_for_today}}</h1>\n        <h2>{{\'leads_left_today\' | translate}}</h2>\n        <p>{{myPlanDetail.remaining_days_count}} {{\'days_left\' | translate}}</p>\n    </div>\n</ion-header>\n\n<ion-content class="bg-light">\n    <!--    <img src="assets/imgs/19.png">-->\n    <ion-list *ngIf="plans" no-lines>\n        <h4 class="text-ellipsis">{{\'purchase_plans\' | translate}}</h4>\n        <ion-item *ngFor="let plan of plans" (click)="planDetail(plan)">\n            <h2 class="text-ellipsis">{{plan.name}}</h2>\n            <p class="text-ellipsis">{{plan.description}}</p>\n            <h3 class="text-ellipsis" item-end>{{plan.priceToShow}}</h3>\n        </ion-item>\n    </ion-list>\n</ion-content>\n<!-- <ion-footer>\n    <div class="fixed-bottom" text-center (click)="conatctus()">\n        <h5>{{\'need_help\' | translate}}<strong class="text-thime">{{\'contact_us\' | translate}}</strong></h5>\n    </div>\n</ion-footer> -->'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/packages/packages.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */]])
    ], PackagesPage);
    return PackagesPage;
}());

//# sourceMappingURL=packages.js.map

/***/ }),

/***/ 255:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PurchaseplanPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_card_info_models__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_config__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_stripe__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_client_service__ = __webpack_require__(16);
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








var PurchaseplanPage = /** @class */ (function () {
    function PurchaseplanPage(config, toastCtrl, translate, navCtrl, navParam, alertCtrl, stripe, loadingCtrl, service) {
        this.config = config;
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.stripe = stripe;
        this.loadingCtrl = loadingCtrl;
        this.service = service;
        this.cardInfo = new __WEBPACK_IMPORTED_MODULE_2__models_card_info_models__["a" /* CardInfo */]();
        this.loadingShown = false;
        this.subscriptions = [];
        this.plan = navParam.get("plan");
        var savedCardInfo = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_CARD_INFO));
        if (savedCardInfo) {
            this.cardInfo.name = savedCardInfo.name;
            this.cardInfo.number = savedCardInfo.number;
            this.cardInfo.expMonth = savedCardInfo.expMonth;
            this.cardInfo.expYear = savedCardInfo.expYear;
        }
        this.purchasePlan(58);
    }
    PurchaseplanPage.prototype.confirm = function () {
        var _this = this;
        if (this.cardInfo.areFieldsFilled()) {
            this.translate.get('verifying_card').subscribe(function (text) {
                _this.presentLoading(text);
            });
            this.stripe.setPublishableKey(this.config.stripeKey);
            this.stripe.createCardToken(this.cardInfo).then(function (token) {
                _this.dismissLoading();
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_CARD_INFO, JSON.stringify(_this.cardInfo));
                _this.purchasePlan(token.id);
            }).catch(function (error) {
                _this.dismissLoading();
                _this.presentErrorAlert(error);
                _this.translate.get('invalid_card').subscribe(function (text) {
                    _this.showToast(text);
                });
                console.error(error);
            });
        }
        else {
            this.translate.get('fill_valid_card').subscribe(function (text) {
                _this.showToast(text);
            });
        }
    };
    PurchaseplanPage.prototype.purchasePlan = function (stripeToken) {
        var _this = this;
        var subscription = this.service.planPurchase(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.plan.id, stripeToken).subscribe(function (res) {
            _this.dismissLoading();
            _this.translate.get('plan_purchased').subscribe(function (text) {
                _this.showToast(text);
            });
            _this.navCtrl.pop();
        }, function (err) {
            console.log('purchase_err', err);
            _this.dismissLoading();
            _this.navCtrl.pop();
        });
        this.subscriptions.push(subscription);
    };
    PurchaseplanPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    PurchaseplanPage.prototype.presentErrorAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: "Error",
            subTitle: msg,
            buttons: ["Dismiss"]
        });
        alert.present();
    };
    PurchaseplanPage.prototype.showToast = function (message) {
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
    PurchaseplanPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    PurchaseplanPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    PurchaseplanPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-purchaseplan',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/purchaseplan/purchaseplan.html"*/'<ion-header class="bg-thime">\n    <ion-navbar>\n        <ion-title>{{\'purchase_plan\' | translate}}</ion-title>\n    </ion-navbar>\n    <ion-list no-lines>\n        <ion-item (click)="purchaseplan()">\n            <h2 class="text-ellipsis">{{plan.name}}</h2>\n            <p class="text-ellipsis">{{plan.description}}</p>\n            <h3 class="text-ellipsis" item-end>{{plan.priceToShow}}</h3>\n        </ion-item>\n    </ion-list>\n</ion-header>\n\n<ion-content class="bg-light">\n\n    <div *ngIf="cardInfo" class="form">\n        <ion-list no-lines>\n            <ion-item>\n                <ion-input type="text" maxlength="16" placeholder="{{\'card_number\' | translate}}"\n                    [(ngModel)]="cardInfo.number"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-input type="text" placeholder="{{\'card_name\' | translate}}" [(ngModel)]="cardInfo.name">\n                </ion-input>\n            </ion-item>\n            <ion-row>\n                <ion-col col-4>\n                    <ion-item>\n                        <ion-input type="text" maxlength="3" placeholder="{{\'card_cvv\' | translate}}"\n                            [(ngModel)]="cardInfo.cvc"></ion-input>\n                    </ion-item>\n                </ion-col>\n                <ion-col col-4 class="">\n                    <div class="d-flex mr-5">\n                        <ion-item>\n                            <ion-input type="text" maxlength="2" placeholder="{{\'card_month\' | translate}}"\n                                [(ngModel)]="cardInfo.expMonth"></ion-input>\n                        </ion-item>\n                    </div>\n                </ion-col>\n                <ion-col col-4>\n                    <ion-item>\n                        <ion-input type="text" maxlength="2" placeholder="{{\'card_year\' | translate}}"\n                            [(ngModel)]="cardInfo.expYear"></ion-input>\n                    </ion-item>\n                </ion-col>\n            </ion-row>\n\n\n            <!-- <ion-item *ngIf="paymentResponse && paymentResponse.length">\n                                <ion-label text-right>{{paymentResponse}}</ion-label>\n                            </ion-item> -->\n        </ion-list>\n    </div>\n    <!-- <ion-list no-lines>\n                <h4 class="text-ellipsis">Purchase Plans{{\'purchase_plans\' | translate}}</h4>\n                <ion-item>\n                    <img src="assets/imgs/card.png" item-start>\n                    <h2 class="text-ellipsis">{{\'credit_card\' | translate}}</h2>\n                </ion-item>\n                <ion-item>\n                    <img src="assets/imgs/card.png" item-start>\n                    <h2 class="text-ellipsis">{{\'debit_card\' | translate}}</h2>\n    \n                </ion-item>\n                <ion-item>\n                    <img src="assets/imgs/pay-pal.png" item-start>\n                    <h2 class="text-ellipsis">{{\'paypal\' | translate}}</h2>\n                </ion-item>\n                <ion-item>\n                    <img src="assets/imgs/google-paly.png" item-start>\n                    <h2 class="text-ellipsis">{{\'googleplay\' | translate}}</h2>\n                </ion-item>\n            </ion-list> -->\n</ion-content>\n<ion-footer>\n    <button class="btn" ion-button round full margin-top margin-bottom\n        (click)="confirm()">{{\'confirm\' | translate}}</button>\n    <!-- <div class="fixed-bottom" text-center (click)="conatctus()">\n            <h5>{{\'need_help\' | translate}}<strong class="text-thime">{{\'contact_us\' | translate}}</strong></h5>\n        </div> -->\n</ion-footer>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/purchaseplan/purchaseplan.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_7__providers_client_service__["a" /* ClientService */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_stripe__["a" /* Stripe */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_7__providers_client_service__["a" /* ClientService */]])
    ], PurchaseplanPage);
    return PurchaseplanPage;
}());

//# sourceMappingURL=purchaseplan.js.map

/***/ }),

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConatctusPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_support_request_models__ = __webpack_require__(382);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_call_number__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_helper_models__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__ = __webpack_require__(17);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ConatctusPage = /** @class */ (function () {
    function ConatctusPage(navCtrl, service, callNumber, loadingCtrl, toastCtrl, translate) {
        this.navCtrl = navCtrl;
        this.service = service;
        this.callNumber = callNumber;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.loadingShown = false;
        this.subscriptions = [];
        this.userMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_USER));
        this.supportRequest = new __WEBPACK_IMPORTED_MODULE_4__models_support_request_models__["a" /* SupportRequest */](this.userMe.name, this.userMe.email, "");
    }
    ConatctusPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    ConatctusPage.prototype.dialSupport = function () {
        var phoneNumber = __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].getSetting("support_phone");
        if (phoneNumber) {
            this.callNumber.callNumber(phoneNumber, true).then(function (res) { return console.log('Launched dialer!', res); }).catch(function (err) { return console.log('Error launching dialer', err); });
        }
    };
    ConatctusPage.prototype.submitSupport = function () {
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
            var subscription = this.service.submitSupport(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].KEY_TOKEN), this.supportRequest).subscribe(function (res) {
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
    ConatctusPage.prototype.showToast = function (message) {
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
    ConatctusPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    ConatctusPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    ConatctusPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-conatctus',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/conatctus/conatctus.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'contact_us\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <!--    <img src="../../assets/imgs/20.png">-->\n    <div class="call-now bg-thime">\n        <h6 text-center class=" text-white">{{\'call_to_speak_with_us\' | translate}}</h6>\n        <button class="btn text-thime" ion-button round full margin-top margin-bottom icon-start (click)="dialSupport()">\n            <ion-icon name="md-call" padding-right></ion-icon><strong>{{\'call_now\' | translate}}</strong>\n        </button>\n    </div>\n    <h5 text-center margin-top margin-bottom padding-bottom class="text-thime">{{\'or_write_us_your_issue\' | translate}}</h5>\n\n    <div class="form">\n        <ion-list no-lines padding-bottom>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-person" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'your_name\' | translate}}</ion-label>\n                <ion-input type="text" [readonly]="true" [(ngModel)]="userMe.name"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-avatar item-start style="margin-bottom: 3px; margin-right: 28px;">\n                    <ion-icon name="md-phone-portrait" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'mobile_number\' | translate}}</ion-label>\n                <ion-input type="text" [readonly]="true" [(ngModel)]="userMe.mobile_number"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-avatar item-start style="margin-bottom: 3px; margin-right: 28px;">\n                    <ion-icon name="md-mail" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey">{{\'your_message\' | translate}}</ion-label>\n                <ion-textarea type="text" class="placeholder-color" [(ngModel)]="supportRequest.message" placeholder="{{\'type_your_message_heare\' | translate}}"></ion-textarea>\n            </ion-item>\n        </ion-list>\n    </div>\n</ion-content>\n<ion-footer>\n    <button class="btn" ion-button round full margin-top (click)="submitSupport()">{{\'submit\' | translate}}</button>\n</ion-footer>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/conatctus/conatctus.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_call_number__["a" /* CallNumber */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */], __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__["c" /* TranslateService */]])
    ], ConatctusPage);
    return ConatctusPage;
}());

//# sourceMappingURL=conatctus.js.map

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutusPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_config__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_helper_models__ = __webpack_require__(29);
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




//import { ListofplumberPage } from '../listofplumber/listofplumber';
var AboutusPage = /** @class */ (function () {
    function AboutusPage(config, navCtrl) {
        this.config = config;
        this.navCtrl = navCtrl;
        this.aboutUs = "";
        this.aboutUs = __WEBPACK_IMPORTED_MODULE_3__models_helper_models__["a" /* Helper */].getSetting("about_us");
    }
    AboutusPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-aboutus',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/aboutus/aboutus.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            {{\'about_us\' | translate}}\n        </ion-title>\n    </ion-navbar>\n    <div class="logo-box bg-thime">\n        <div class="logo">\n            <img src="assets/imgs/logo.png">\n            <h1 class="text-white">{{config.appName}}</h1>\n        </div>\n    </div>\n</ion-header>\n\n<ion-content>\n    <div class="text">\n        <h2 class="text-thime">{{\'about_us\' | translate}}</h2>\n        <p [innerHTML]="aboutUs"></p>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/aboutus/aboutus.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], AboutusPage);
    return AboutusPage;
}());

//# sourceMappingURL=aboutus.js.map

/***/ }),

/***/ 259:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FaqsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//import { ListofplumberPage } from '../listofplumber/listofplumber';
var FaqsPage = /** @class */ (function () {
    function FaqsPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    FaqsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-faqs',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/faqs/faqs.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'faq\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-list no-lines>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">{{\'about_services\' | translate}}</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">{{\'sign_in_sign_up\' | translate}}</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">{{\'payment_policy\' | translate}}</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">{{\'searching_service\' | translate}}</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">{{\'ratings\' | translate}}</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n        <ion-item class="">\n            <h2>\n                <span class="text-ellipsis">{{\'chatting\' | translate}}</span>\n                <ion-icon name="ios-arrow-down-outline"></ion-icon>\n            </h2>\n            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,</p>\n        </ion-item>\n    </ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/faqs/faqs.html"*/
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(41);
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
            selector: 'page-managelanguage',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/managelanguage/managelanguage.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'choose_language\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-list no-lines>\n        <ion-item *ngFor="let language of config.availableLanguages" (click)="onLanguageClick(language)">\n            <h3>{{language.name}}</h3>\n            <ion-icon *ngIf="defaultLanguageCode == language.code" name="md-globe" item-end></ion-icon>\n        </ion-item>\n    </ion-list>\n</ion-content>\n<ion-footer>\n    <ion-item class="add-item" (click)="languageConfirm()">\n        <h2 class="text-thime" text-center>\n            {{\'confirm\' | translate}}\n        </h2>\n    </ion-item>\n</ion-footer>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/managelanguage/managelanguage.html"*/
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatslistPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__chatscreen_chatscreen__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_chat_models__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_sqlite__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ChatslistPage = /** @class */ (function () {
    function ChatslistPage(navCtrl, sqlite) {
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
    ChatslistPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        if (this.db && !this.loadedOnce) {
            this.db.executeSql('SELECT * FROM chat WHERE myId = ? AND isGroup = ? ORDER BY dateTimeStamp DESC', [this.userMe.id, 0]).then(function (res) {
                console.log("chatres", res);
                var chats = new Array();
                for (var i = 0; i < res.rows.length; i++) {
                    var chat = new __WEBPACK_IMPORTED_MODULE_3__models_chat_models__["a" /* Chat */]();
                    chat.fromRow(res.rows.item(i));
                    chats.push(chat);
                }
                _this.chats = chats;
                console.log("refreshedchats");
            }).catch(function (e) { return console.log(e); });
        }
        if (this.loadedOnce)
            this.loadedOnce = false;
    };
    ChatslistPage.prototype.chatscreen = function (chat) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__chatscreen_chatscreen__["a" /* ChatscreenPage */], { chat: chat });
    };
    ChatslistPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-chatslist',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/chatslist/chatslist.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'chat\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div class="empty-view" *ngIf="(!chats || !chats.length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_category.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold;">\n                {{\'no_chats_to_show\' | translate}}\n            </span>\n        </div>\n    </div>\n    <ion-list no-lines>\n        <ion-item *ngFor="let chat of chats" (click)="chatscreen(chat)">\n            <ion-avatar item-start>\n                <img *ngIf="chat.chatImage && chat.chatImage.length" data-src="{{chat.chatImage}}">\n                <img *ngIf="!chat.chatImage || !chat.chatImage.length" src="assets/imgs/empty_dp.png">\n            </ion-avatar>\n            <h2><span class="text-ellipsis">{{chat.chatName}}</span>\n                <span class="ml-auto small">{{chat.timeDiff}}</span>\n            </h2>\n            <p class="text-grey text-ellipsis">{{chat.lastMessage}}</p>\n        </ion-item>\n    </ion-list>\n\n</ion-content>'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/chatslist/chatslist.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_sqlite__["a" /* SQLite */]])
    ], ChatslistPage);
    return ChatslistPage;
}());

//# sourceMappingURL=chatslist.js.map

/***/ }),

/***/ 264:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(265);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(278);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 278:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createTranslateLoader */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(318);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_http_loader__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_aboutus_aboutus__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_account_account__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_allreview_allreview__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_booking_booking__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_chatscreen_chatscreen__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_chatslist_chatslist__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_conatctus_conatctus__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_faqs_faqs__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_forgotpassword_forgotpassword__ = __webpack_require__(387);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_myprofile_myprofile__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_notifications_notifications__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_packages_packages__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_privacy_privacy__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_purchaseplan_purchaseplan__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_requests_requests__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_review_review__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_selectservice_selectservice__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_signin_signin__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_signup_signup__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_tabs_tabs__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ionic_native_status_bar__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ionic_native_splash_screen__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ionic_native_geolocation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__ionic_native_network__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__providers_connectivity_service__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__providers_google_maps__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__app_config__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ionic_native_google_plus__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_otp_otp__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_selectarea_selectarea__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__ionic_native_local_notifications__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__ionic_native_sqlite__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__ionic_native_onesignal__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__ionic_native_call_number__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__ionic_native_globalization__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__node_modules_ngx_translate_core__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__ionic_native_stripe__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__ionic_native_diagnostic__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__ionic_native_location_accuracy__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__pages_managelanguage_managelanguage__ = __webpack_require__(260);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



































//import { HttpClientModule, HttpClient } from '@angular/common/http';












function createTranslateLoader(http) {
    return new __WEBPACK_IMPORTED_MODULE_6__ngx_translate_http_loader__["a" /* TranslateHttpLoader */](http, './assets/i18n/', '.json');
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_aboutus_aboutus__["a" /* AboutusPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_account_account__["a" /* AccountPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_allreview_allreview__["a" /* AllreviewPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_booking_booking__["a" /* BookingPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_chatscreen_chatscreen__["a" /* ChatscreenPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_chatslist_chatslist__["a" /* ChatslistPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_conatctus_conatctus__["a" /* ConatctusPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_faqs_faqs__["a" /* FaqsPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_forgotpassword_forgotpassword__["a" /* ForgotpasswordPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_myprofile_myprofile__["a" /* MyprofilePage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_notifications_notifications__["a" /* NotificationsPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_packages_packages__["a" /* PackagesPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_privacy_privacy__["a" /* PrivacyPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_purchaseplan_purchaseplan__["a" /* PurchaseplanPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_requests_requests__["a" /* RequestsPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_review_review__["a" /* ReviewPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_selectservice_selectservice__["a" /* SelectservicePage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_signin_signin__["a" /* SigninPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_otp_otp__["a" /* OtpPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_selectarea_selectarea__["a" /* SelectareaPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_managelanguage_managelanguage__["a" /* ManagelanguagePage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["b" /* TranslateModule */].forRoot({
                    loader: {
                        provide: __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["a" /* TranslateLoader */],
                        useFactory: createTranslateLoader,
                        deps: [__WEBPACK_IMPORTED_MODULE_4__angular_common_http__["a" /* HttpClient */]]
                    }
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_7__pages_aboutus_aboutus__["a" /* AboutusPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_account_account__["a" /* AccountPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_allreview_allreview__["a" /* AllreviewPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_booking_booking__["a" /* BookingPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_chatscreen_chatscreen__["a" /* ChatscreenPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_chatslist_chatslist__["a" /* ChatslistPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_conatctus_conatctus__["a" /* ConatctusPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_faqs_faqs__["a" /* FaqsPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_forgotpassword_forgotpassword__["a" /* ForgotpasswordPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_myprofile_myprofile__["a" /* MyprofilePage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_notifications_notifications__["a" /* NotificationsPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_packages_packages__["a" /* PackagesPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_privacy_privacy__["a" /* PrivacyPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_purchaseplan_purchaseplan__["a" /* PurchaseplanPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_requests_requests__["a" /* RequestsPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_review_review__["a" /* ReviewPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_selectservice_selectservice__["a" /* SelectservicePage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_signin_signin__["a" /* SigninPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_otp_otp__["a" /* OtpPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_selectarea_selectarea__["a" /* SelectareaPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_managelanguage_managelanguage__["a" /* ManagelanguagePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_27__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_28__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_29__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_30__ionic_native_network__["a" /* Network */],
                __WEBPACK_IMPORTED_MODULE_31__providers_connectivity_service__["a" /* Connectivity */],
                __WEBPACK_IMPORTED_MODULE_32__providers_google_maps__["a" /* GoogleMaps */],
                __WEBPACK_IMPORTED_MODULE_34__ionic_native_google_plus__["a" /* GooglePlus */],
                __WEBPACK_IMPORTED_MODULE_37__ionic_native_local_notifications__["a" /* LocalNotifications */],
                __WEBPACK_IMPORTED_MODULE_38__ionic_native_sqlite__["a" /* SQLite */],
                __WEBPACK_IMPORTED_MODULE_39__ionic_native_onesignal__["a" /* OneSignal */],
                __WEBPACK_IMPORTED_MODULE_40__ionic_native_call_number__["a" /* CallNumber */],
                __WEBPACK_IMPORTED_MODULE_42__node_modules_ngx_translate_core__["c" /* TranslateService */],
                __WEBPACK_IMPORTED_MODULE_41__ionic_native_globalization__["a" /* Globalization */],
                __WEBPACK_IMPORTED_MODULE_43__ionic_native_stripe__["a" /* Stripe */],
                __WEBPACK_IMPORTED_MODULE_44__ionic_native_diagnostic__["a" /* Diagnostic */],
                __WEBPACK_IMPORTED_MODULE_45__ionic_native_location_accuracy__["a" /* LocationAccuracy */],
                { provide: __WEBPACK_IMPORTED_MODULE_33__app_config__["a" /* APP_CONFIG */], useValue: __WEBPACK_IMPORTED_MODULE_33__app_config__["b" /* BaseAppConfig */] },
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
    appName: "Cityzen Provider",
    apiBase: "http://157.230.30.139/public/api/",
    googleApiKey: "AIzaSyDEH-VISwD1jkXSVdmWNB_xAS0CVVMlUe4",
    stripeKey: "",
    oneSignalAppId: "2422a396-85fd-4e7b-868f-df169f7e1c0c",
    oneSignalGPSenderId: "",
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
        databaseURL: "https://cityzen-wellness-app.firebaseio.com",
        projectId: "cityzen-wellness-app",
        storageBucket: "cityzen-wellness-app.appspot.com",
        messagingSenderId: "436254256867"
    },
};
//# sourceMappingURL=app.config.js.map

/***/ }),

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Helper; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_javascript_time_ago__ = __webpack_require__(340);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_javascript_time_ago_locale_en__ = __webpack_require__(349);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_javascript_time_ago_locale_en___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_javascript_time_ago_locale_en__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants_models__ = __webpack_require__(10);



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

/***/ 318:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_signin_signin__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_config__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_firebase__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_sqlite__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_onesignal__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__models_notifications_models__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_globalization__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__node_modules_ngx_translate_core__ = __webpack_require__(17);
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















var MyApp = /** @class */ (function () {
    function MyApp(config, platform, oneSignal, statusBar, splashScreen, clientService, events, sqlite, globalization, translate) {
        var _this = this;
        this.config = config;
        this.platform = platform;
        this.oneSignal = oneSignal;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.sqlite = sqlite;
        this.globalization = globalization;
        this.translate = translate;
        this.rtlSide = "left";
        // window.localStorage.setItem(Constants.KEY_LOCATION, "{\"name\":\"Laxmi Nagar, New Delhi, Delhi, India\",\"lat\":28.636736,\"lng\":77.27480700000001}");
        // window.localStorage.setItem(Constants.KEY_USER, "{\"id\":2,\"name\":\"Test Provider\",\"email\":\"test@pro.com\",\"image_url\":\"https://firebasestorage.googleapis.com/v0/b/handyman-47f5a.appspot.com/o/Sat%20Feb%2009%202019%2016%3A43%3A59%20GMT%2B0530%20(India%20Standard%20Time)?alt=media&token=6dfe1aa6-7e80-4052-9ffa-09ff140196c9\",\"mobile_number\":\"+919999999991\",\"mobile_verified\":0,\"active\":1,\"confirmation_code\":null,\"confirmed\":1,\"fcm_registration_id\":\"660c825e-d5cd-405c-9162-25ad3b808156\",\"created_at\":\"2019-02-09 10:58:48\",\"updated_at\":\"2019-02-09 11:14:02\",\"deleted_at\":null}");
        // window.localStorage.setItem(Constants.KEY_TOKEN, "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQxYThkMWNmYmRjMjhiMTFjY2UwZWIxOTJhOGJlMzUxY2MyY2U2NjE4NzQzZWRlMTA3NjMzZDU4MmFlMDQ3YzhjYjFjNTc3NGQ1NjQ1ZDI0In0.eyJhdWQiOiIxIiwianRpIjoiZDFhOGQxY2ZiZGMyOGIxMWNjZTBlYjE5MmE4YmUzNTFjYzJjZTY2MTg3NDNlZGUxMDc2MzNkNTgyYWUwNDdjOGNiMWM1Nzc0ZDU2NDVkMjQiLCJpYXQiOjE1NDk3MDk5MzYsIm5iZiI6MTU0OTcwOTkzNiwiZXhwIjoxNTgxMjQ1OTM2LCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.uKqQ9-414uKBH9FyV6VCvaCpeEb7u6jdS3Egey-tv8zEa8j_gH0KOpSjY24WuDqTxJFB_5FStywpm2x2XTIisOLv-xvI8o_9B3rbwmOFpDJ56w9dYZPdAXiQd6GithPfW49O0AjrdmnE5SIoFY7r2jkynS38MPoFsAWVvdDwdcQQyy5gTW5gHlNP3EAxePyqiWIip-npakctON8IZZc7eGbmHf7JdCA6blrYZN3va3ezxs79kJ2WkBpkT6xbR2qSfS49G2Ci8ZtMQFPBE9VY9rYcq7ZxIQ8PVvrhGVL-7IEZWH_pYOLZYv51FQGIY-HfyK9r1EG4HPP20t5zoRCafUCdNeMq-F2h3GxyPGVaNBzuDf81Y1sfzYNyuJKkuWVq4Bw4ORCZctCMuqsJcZQZ08LstG4K__38UxYfEEmRDu73f2fMLrd6JEWrbgqkgGyE76UTPDvjDqIRapCcl6SCJULs8n25f180LMvt3kAs67cFi-sJa520CKZ1Ud-HymcAWCZ5hLp0oj7BSYdAiMSCCpxJLzJDd1kDio9EIplETryA9dhJ7trXWYgogBtTAYSMVx4pxVlmQu5jnjiraN764A04Sm6dq311Z6GZayiTYMuIVMUXyjZHX5CJmarc9lLwxPwY5LaZQ-SKXyaErHtOvmSrnL74pdpzBFYOpPV49q0");
        // window.localStorage.setItem(Constants.KEY_PROFILE, "{\"id\":1,\"primary_category_id\":1,\"user_id\":2,\"is_verified\":0,\"document_url\":\"https://firebasestorage.googleapis.com/v0/b/handyman-47f5a.appspot.com/o/Sat%20Feb%2009%202019%2016%3A43%3A19%20GMT%2B0530%20(India%20Standard%20Time)?alt=media&token=27963b27-e5eb-48b9-8c74-28461dad863a\",\"image_url\":null,\"price\":100,\"price_type\":\"hour\",\"address\":\"Shahdara, Delhi, India\",\"longitude\":77.29257710000002,\"latitude\":28.69875679999999,\"about\":\"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\",\"created_at\":\"2019-02-09 10:57:03\",\"updated_at\":\"2019-02-09 11:21:01\",\"ratings\":null,\"primary_category\":{\"id\":1,\"title\":\"Plumber\",\"image_url\":null,\"parent_id\":null,\"created_at\":\"2019-02-09 11:10:34\",\"updated_at\":\"2019-02-09 11:10:34\",\"secondary_image_url\":null},\"subcategories\":[{\"id\":5,\"title\":\"Tap\",\"image_url\":null,\"parent_id\":1,\"created_at\":\"2019-02-09 11:11:30\",\"updated_at\":\"2019-02-09 11:11:30\",\"secondary_image_url\":null,\"pivot\":{\"provider_id\":1,\"category_id\":5}}],\"user\":{\"id\":2,\"name\":\"Test Provider\",\"email\":\"test@pro.com\",\"image_url\":\"https://firebasestorage.googleapis.com/v0/b/handyman-47f5a.appspot.com/o/Sat%20Feb%2009%202019%2016%3A43%3A59%20GMT%2B0530%20(India%20Standard%20Time)?alt=media&token=6dfe1aa6-7e80-4052-9ffa-09ff140196c9\",\"mobile_number\":\"+919999999991\",\"mobile_verified\":0,\"active\":1,\"confirmation_code\":null,\"confirmed\":1,\"fcm_registration_id\":\"660c825e-d5cd-405c-9162-25ad3b808156\",\"created_at\":\"2019-02-09 10:58:48\",\"updated_at\":\"2019-02-09 11:14:02\",\"deleted_at\":null}}");
        this.initializeApp();
        clientService.getSettings().subscribe(function (res) {
            console.log('setting_setup_success');
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_SETTING, JSON.stringify(res));
        }, function (err) {
            console.log('setting_setup_error', err);
        });
        events.subscribe('user:login', function () {
            _this.registerInboxUpdates();
        });
        events.subscribe('language:selection', function (language) {
            _this.globalize(language);
        });
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
            __WEBPACK_IMPORTED_MODULE_8_firebase___default.a.initializeApp({
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
            _this.splashScreen.hide();
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
    MyApp.prototype.getSideOfCurLang = function () {
        this.rtlSide = this.platform.dir() === 'rtl' ? "right" : "left";
        return this.rtlSide;
    };
    MyApp.prototype.getSuitableLanguage = function (language) {
        window.localStorage.setItem("locale", language);
        language = language.substring(0, 2).toLowerCase();
        console.log('check for: ' + language);
        return this.config.availableLanguages.some(function (x) { return x.code == language; }) ? language : 'en';
    };
    MyApp.prototype.markDelivered = function (msg) {
        msg.delivered = true;
        var chatRef = __WEBPACK_IMPORTED_MODULE_8_firebase___default.a.database().ref(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].REF_CHAT).child(msg.chatId);
        chatRef.child(msg.id).child("delivered").set(true);
        if (this.db)
            this.db.executeSql('UPDATE message SET delivered=? WHERE id=?', [1, msg.id]).then(function (res) { return console.log('updateDeliveryC', res); }).catch(function (e) { return console.log(e); });
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
        var inboxRef = __WEBPACK_IMPORTED_MODULE_8_firebase___default.a.database().ref(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].REF_INBOX);
        var newUserMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_USER));
        console.log("newUserMe", newUserMe);
        if (newUserMe && (!this.userMe || (this.userMe && this.userMe.id != newUserMe.id))) {
            console.log("newUserMeAssigned");
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
                    notifications.push(new __WEBPACK_IMPORTED_MODULE_12__models_notifications_models__["a" /* MyNotification */](data.payload.title, data.payload.body, _this.formatDate(new Date())));
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
                        notifications.push(new __WEBPACK_IMPORTED_MODULE_12__models_notifications_models__["a" /* MyNotification */](data.notification.payload.title, data.notification.payload.body, _this.formatDate(new Date())));
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
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/app/app.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_5__providers_client_service__["a" /* ClientService */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_onesignal__["a" /* OneSignal */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_5__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_10__ionic_native_sqlite__["a" /* SQLite */], __WEBPACK_IMPORTED_MODULE_13__ionic_native_globalization__["a" /* Globalization */], __WEBPACK_IMPORTED_MODULE_14__node_modules_ngx_translate_core__["c" /* TranslateService */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 338:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignUpRequest; });
var SignUpRequest = /** @class */ (function () {
    function SignUpRequest(name, email, password, mobile_number) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.mobile_number = mobile_number;
        this.role = "provider";
    }
    return SignUpRequest;
}());

//# sourceMappingURL=signup-request.models.js.map

/***/ }),

/***/ 339:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Message; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_models__ = __webpack_require__(29);

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

/***/ 367:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Rating; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rating_summary_models__ = __webpack_require__(243);

var Rating = /** @class */ (function () {
    function Rating() {
    }
    Rating.getDefault = function () {
        var toReturn = new Rating();
        toReturn.average_rating = "0";
        toReturn.total_completed = 0;
        toReturn.total_ratings = 0;
        toReturn.summary = __WEBPACK_IMPORTED_MODULE_0__rating_summary_models__["a" /* RatingSummary */].defaultArray();
        return toReturn;
    };
    return Rating;
}());

//# sourceMappingURL=rating.models.js.map

/***/ }),

/***/ 368:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FirebaseClient; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_firebase__ = __webpack_require__(70);
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

/***/ 379:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileUpdateRequest; });
var ProfileUpdateRequest = /** @class */ (function () {
    function ProfileUpdateRequest() {
    }
    return ProfileUpdateRequest;
}());

//# sourceMappingURL=profile-update-request.models.js.map

/***/ }),

/***/ 380:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CardInfo; });
var CardInfo = /** @class */ (function () {
    function CardInfo() {
    }
    CardInfo.prototype.areFieldsFilled = function () {
        return ((this.name && this.name.length)
            &&
                (this.number && this.number.length > 10)
            &&
                (this.expMonth && this.expMonth <= 12 && this.expMonth >= 1)
            &&
                (this.expYear && this.expYear <= 99)
            &&
                (this.cvc && this.cvc.length == 3));
    };
    return CardInfo;
}());

//# sourceMappingURL=card-info.models.js.map

/***/ }),

/***/ 381:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PlanDetail; });
var PlanDetail = /** @class */ (function () {
    function PlanDetail() {
    }
    PlanDetail.default = function () {
        var pd = new PlanDetail();
        pd.leads_remaining_for_today = 0;
        pd.remaining_days_count = 0;
        return pd;
    };
    return PlanDetail;
}());

//# sourceMappingURL=plan-detail.models.js.map

/***/ }),

/***/ 382:
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

/***/ 384:
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

//# sourceMappingURL=notifications.models.js.map

/***/ }),

/***/ 387:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ForgotpasswordPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tabs_tabs__ = __webpack_require__(41);
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
            selector: 'page-forgotpassword',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/forgotpassword/forgotpassword.html"*/'<ion-header class="bg-transparent">\n    <ion-navbar>\n        <ion-title>{{\'forgot_password\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="form">\n        <p class="text-grey" text-center>{{\'enter_your_rgisterd_email_address\' | translate}}<br>{{\'well_send_password_reset_info_on_mail\' | translate}}</p>\n        <ion-list no-lines>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-mail" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label class="text-grey" floating>{{\'enter_email_id\' | translate}}</ion-label>\n                <ion-input type="text" value=""></ion-input>\n            </ion-item>\n        </ion-list>\n        <button class="btn" ion-button round full margin-top margin-bottom (click)="tabs()">{{\'submit\' | translate}}</button>\n\n        <div class="fixed-bottom">\n            <p class="text-grey" text-center><small>{{\'by_signing_up\' | translate}}<ins>{{\'terms_condition\' | translate}}</ins></small></p>\n        </div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/forgotpassword/forgotpassword.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], ForgotpasswordPage);
    return ForgotpasswordPage;
}());

//# sourceMappingURL=forgotpassword.js.map

/***/ }),

/***/ 41:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__requests_requests__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__notifications_notifications__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__review_review__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__account_account__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__chatslist_chatslist__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_firebase__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_onesignal__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_client_service__ = __webpack_require__(16);
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
    function TabsPage(oneSignal, navCtrl, service) {
        this.navCtrl = navCtrl;
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_1__requests_requests__["a" /* RequestsPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_2__notifications_notifications__["a" /* NotificationsPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_3__review_review__["a" /* ReviewPage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_4__account_account__["a" /* AccountPage */];
        this.tab5Root = __WEBPACK_IMPORTED_MODULE_5__chatslist_chatslist__["a" /* ChatslistPage */];
        var userMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_USER));
        oneSignal.getIds().then(function (id) {
            if (id && id.userId) {
                __WEBPACK_IMPORTED_MODULE_8_firebase___default.a.database().ref(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].REF_USERS_FCM_IDS).child(userMe.id).set(id.userId);
                service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_TOKEN), { fcm_registration_id: id.userId }).subscribe(function (res) {
                    console.log(res);
                }, function (err) {
                    console.log('update_user', err);
                });
            }
        });
    }
    TabsPage.prototype.ionViewDidEnter = function () {
        this.tabRef.select(2);
        setTimeout(function () {
            var profile = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_PROFILE));
            if (!profile || !profile.primary_category) {
                // this.navCtrl.push(MyprofilePage, { create_edit: true });
            }
        }, 1000);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('myTabs'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["m" /* Tabs */])
    ], TabsPage.prototype, "tabRef", void 0);
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/tabs/tabs.html"*/'<ion-tabs #myTabs>\n    <ion-tab [root]="tab1Root" tabTitle="{{\'requests\' | translate}}" tabIcon="md-calendar" tabsHideOnSubPages="true"></ion-tab>\n    <ion-tab [root]="tab2Root" tabTitle="{{\'notifications\' | translate}}" tabIcon="notifications" tabsHideOnSubPages="true"></ion-tab>\n    <ion-tab [root]="tab3Root" tabTitle="{{\'review\' | translate}}" tabIcon="md-star" tabsHideOnSubPages="true"></ion-tab>\n    <ion-tab [root]="tab4Root" tabTitle="{{\'account\' | translate}}" tabIcon="md-person" tabsHideOnSubPages="true"></ion-tab>\n    <ion-tab [root]="tab5Root" tabTitle="{{\'chat\' | translate}}" tabIcon="md-chatboxes" tabsHideOnSubPages="true"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/tabs/tabs.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_10__providers_client_service__["a" /* ClientService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_9__ionic_native_onesignal__["a" /* OneSignal */], __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_10__providers_client_service__["a" /* ClientService */]])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SigninPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__signup_signup__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_config__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_google_plus__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_firebase__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__otp_otp__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_constants_models__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__tabs_tabs__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ngx_translate_core__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__privacy_privacy__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__models_helper_models__ = __webpack_require__(29);
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
    function SigninPage(config, navCtrl, loadingCtrl, toastCtrl, alertCtrl, service, translate, google, platform, app, events) {
        this.config = config;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.service = service;
        this.translate = translate;
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
        var terms = __WEBPACK_IMPORTED_MODULE_12__models_helper_models__["a" /* Helper */].getSetting("terms");
        if (terms && terms.length) {
            this.translate.get('terms_conditions').subscribe(function (value) {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__privacy_privacy__["a" /* PrivacyPage */], { toShow: terms, heading: value });
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
        this.service.checkUser({ mobile_number: this.phoneNumberFull, role: "provider" }).subscribe(function (res) {
            console.log(res);
            _this.dismissLoading();
            _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_7__otp_otp__["a" /* OtpPage */], { phoneNumberFull: _this.phoneNumberFull });
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
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].KEY_USER, JSON.stringify(res.user));
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].KEY_TOKEN, res.token);
                _this.events.publish('user:login');
                _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_9__tabs_tabs__["a" /* TabsPage */]);
            }
            else {
                _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_7__otp_otp__["a" /* OtpPage */], { phoneNumberFull: res.user.mobile_number });
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
    SigninPage.prototype.googleOnPhone = function () {
        var _this = this;
        this.google.login({
            'webClientId': this.config.firebaseConfig.webApplicationId,
            'offline': false,
            'scopes': 'profile email'
        }).then(function (res) {
            console.log('google_success', res);
            var googleCredential = __WEBPACK_IMPORTED_MODULE_6_firebase___default.a.auth.GoogleAuthProvider.credential(res.idToken);
            __WEBPACK_IMPORTED_MODULE_6_firebase___default.a.auth().signInAndRetrieveDataWithCredential(googleCredential).then(function (response) {
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
            var provider = new __WEBPACK_IMPORTED_MODULE_6_firebase___default.a.auth.GoogleAuthProvider();
            __WEBPACK_IMPORTED_MODULE_6_firebase___default.a.auth().signInWithPopup(provider).then(function (result) {
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
            selector: 'page-signin',template:/*ion-inline-start:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/signin/signin.html"*/'<ion-content>\n    <div class="logo-box bg-thime">\n        <div class="logo">\n            <img src="assets/imgs/cityzen-massage-app.png">\n            <h1 class="text-white">{{config.appName}}</h1>\n        </div>\n    </div>\n\n    <p class="text-grey" text-center>{{\'sign_in_or_sign_up_to_continue\' | translate}}</p>\n\n    <div class="form">\n        <ion-list inset padding-bottom>\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-globe" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label floating>{{\'select_country\' | translate}}</ion-label>\n                <ion-select [(ngModel)]="countryCode" multiple="false" class="text-thime">\n                    <ion-option [value]="country.callingCodes[0]" *ngFor="let country of countries">{{country.name}}</ion-option>\n                </ion-select>\n                <!-- <ion-icon name="ios-arrow-down-outline" item-end class="text-thime"></ion-icon> -->\n            </ion-item>\n\n            <ion-item>\n                <ion-avatar item-start>\n                    <ion-icon name="md-phone-portrait" class="text-thime"></ion-icon>\n                </ion-avatar>\n                <ion-label floating>{{\'enter_phone_number\' | translate}}</ion-label>\n                <ion-input placeholder="" [(ngModel)]="phoneNumber" type="tel"></ion-input>\n            </ion-item>\n        </ion-list>\n        <button class="btn" ion-button round full margin-top margin-bottom (click)="alertPhone()">{{\'continue\' | translate}}</button>\n        <div class="social">\n            <p class="text-light-grey" text-center>{{\'or_continue_with\' | translate}}</p>\n\n            <ion-row>\n                <ion-col>\n                    <button class="btn google" ion-button round full margin-top margin-bottom (click)="signInGoogle()">{{\'google\' | translate}}</button>\n                </ion-col>\n            </ion-row>\n        </div>\n\n    </div>\n    <p class="text-grey" text-center (click)="privacy()">\n        <small>\n            {{\'by_signing_up\' | translate}}\n            <ins>{{\'terms_condition\' | translate}}</ins>\n        </small>\n    </p>\n</ion-content>\n'/*ion-inline-end:"/Users/vitaliy/Downloads/Handyman_AppCode/handyman_provider/src/pages/signin/signin.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_3__providers_client_service__["a" /* ClientService */], __WEBPACK_IMPORTED_MODULE_10__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_google_plus__["a" /* GooglePlus */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */]])
    ], SigninPage);
    return SigninPage;
}());

//# sourceMappingURL=signin.js.map

/***/ })

},[264]);
//# sourceMappingURL=main.js.map