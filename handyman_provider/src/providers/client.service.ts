import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import { Observable } from "rxjs/Observable";
import { APP_CONFIG, AppConfig } from "../app/app.config";
import { Country } from '../models/country.models';
import { Setting } from '../models/setting.models';
import { ResetPasswordResponse } from '../models/reset-password-request.models';
import { AuthResponse } from '../models/auth-response.models';
import { SignUpRequest } from '../models/signup-request.models';
import { BaseListResponse } from '../models/base-list.models';
import { Profile } from '../models/profile.models';
import { ProfileUpdateRequest } from '../models/profile-update-request.models';
import { SupportRequest } from '../models/support-request.models';
import { Appointment } from '../models/appointment.models';
import { User } from '../models/user.models';
import { Rating } from '../models/rating.models';
import { Plan } from '../models/plan.models';
import { PlanDetail } from '../models/plan-detail.models';

@Injectable()
export class ClientService {
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient) {

    }

    public getCountries(): Observable<Array<Country>> {
        return this.http.get<Array<Country>>('./assets/json/countries.json').concatMap((data) => {
            let indiaIndex = -1;
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name == "India") {
                        indiaIndex = i;
                        break;
                    }
                }
            }
            if (indiaIndex != -1) data.unshift(data.splice(indiaIndex, 1)[0]);
            return Observable.of(data);
        });
    }

    public getSettings(): Observable<Array<Setting>> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.get<Array<Setting>>(this.config.apiBase + "settings", { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public forgetPassword(resetRequest: any): Observable<ResetPasswordResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<ResetPasswordResponse>(this.config.apiBase + "forgot-password", JSON.stringify(resetRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public login(loginTokenRequest: any): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + "login", JSON.stringify(loginTokenRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public loginSocial(socialLoginRequest: any): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + "social/login", JSON.stringify(socialLoginRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public signUp(signUpRequest: SignUpRequest): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + "register", JSON.stringify(signUpRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public verifyMobile(verifyRequest: any): Observable<AuthResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<AuthResponse>(this.config.apiBase + "verify-mobile", JSON.stringify(verifyRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public checkUser(checkUserRequest: any): Observable<{}> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.post<{}>(this.config.apiBase + "check-user", JSON.stringify(checkUserRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public updateProfile(token: string, profileRequest: ProfileUpdateRequest): Observable<Profile> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put<Profile>(this.config.apiBase + "provider/profile", JSON.stringify(profileRequest), { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public plans(token: string): Observable<Array<Plan>> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<Array<Plan>>(this.config.apiBase + "provider/plans", { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public planPurchase(adminToken: string, planId: number, token): Observable<{}> {
        const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + adminToken });
        return this.http.post<{}>(this.config.apiBase + 'provider/plans/' + planId + '/payment/stripe', { token: token }, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public planDetails(adminToken: string): Observable<PlanDetail> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken });
        return this.http.get<PlanDetail>(this.config.apiBase + "provider/plan-details", { headers: myHeaders }).concatMap(data => {
            data.remaining_days_count = 0;
            if (data.subscription) {
                let dateStart = new Date(data.subscription.starts_on);
                let dateEnd = new Date(data.subscription.expires_on);
                let dateNow = new Date();
                data.remaining_days_count = dateNow > dateEnd ? 0 : Math.round((dateEnd.getTime() - dateNow.getTime()) / (1000 * 60 * 60 * 24));
                data.starts_at = this.formatDate(dateStart);
                data.ends_at = this.formatDate(dateEnd);
            }
            if (!data.leads_remaining_for_today) data.leads_remaining_for_today = 0;
            return Observable.of(data);
        });
    }

    public categoryParent(token: string): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + "category", { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public categoryChildren(token: string, parentId: number): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + "category?category_id=" + parentId, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public getProfile(token: string): Observable<Profile> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<Profile>(this.config.apiBase + "provider/profile", { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public getRatings(token: string, userId: number): Observable<Rating> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<Rating>(this.config.apiBase + "customer/providers/" + userId + "/rating-summary", { headers: myHeaders }).concatMap(data => {
            data.average_rating = Number(data.average_rating).toFixed(2);
            return Observable.of(data);
        });
    }

    public getMyReviews(token: string, pageNo: number): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + "provider/ratings/?page=" + pageNo, { headers: myHeaders }).concatMap(data => {
            for (let review of data.data) {
                review.created_at = this.formatDate(new Date(review.created_at));
            }
            return Observable.of(data);
        });
    }

    public submitSupport(token: string, supportRequest: SupportRequest): Observable<{}> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<{}>(this.config.apiBase + "support", supportRequest, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public appointments(token: string, pageNo: number): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + "provider/appointment?page=" + pageNo, { headers: myHeaders }).concatMap(data => {
            for (let ap of data.data) {
                ap.created_at = this.formatTime(new Date(ap.created_at));
                ap.updated_at = this.formatTime(new Date(ap.updated_at));
                for (let log of ap.logs) {
                    log.updated_at = this.formatTime(new Date(log.updated_at));
                    log.created_at = this.formatTime(new Date(log.created_at));
                }
                ap.date = this.formatDate(new Date(ap.date));
                ap.time_from = ap.time_from.substr(0, ap.time_from.lastIndexOf(":"));
                ap.time_to = ap.time_to.substr(0, ap.time_to.lastIndexOf(":"));
            }
            return Observable.of(data);
        });
    }

    public appointmentUpdate(token: string, apId: number, status: string): Observable<Appointment> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put<Appointment>(this.config.apiBase + "provider/appointment/" + apId, { status: status }, { headers: myHeaders }).concatMap(data => {
            data.updated_at = this.formatTime(new Date(data.updated_at));
            data.created_at = this.formatTime(new Date(data.created_at));
            for (let log of data.logs) {
                log.updated_at = this.formatTime(new Date(log.updated_at));
                log.created_at = this.formatTime(new Date(log.created_at));
            }
            data.date = this.formatDate(new Date(data.date));
            data.time_from = data.time_from.substr(0, data.time_from.lastIndexOf(":"));
            data.time_to = data.time_to.substr(0, data.time_to.lastIndexOf(":"));
            return Observable.of(data);
        });
    }

    public updateUser(token: string, requestBody: any): Observable<User> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put<User>(this.config.apiBase + "user", requestBody, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    private formatTime(date: Date): string {
        let locale = window.localStorage.getItem("locale");
        if (!locale) locale = "en-US";
        let options = {
            weekday: "short", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        return date.toLocaleTimeString(locale, options);
    }

    private formatDate(date: Date): string {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return date.getDate() + " " + months[date.getMonth()];
    }
}