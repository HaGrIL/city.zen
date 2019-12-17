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
import { SignInRequest } from '../models/signin-request.models';
import { AuthResponse } from '../models/auth-response.models';
import { SignUpRequest } from '../models/signup-request.models';
import { BaseListResponse } from '../models/base-list.models';
import { Address } from '../models/address.models';
import { AddressCreateRequest } from '../models/address-create-request.models';
import { AppointmentRequest } from '../models/appointment-request.models';
import { SupportRequest } from '../models/support-request.models';
import { User } from '../models/user.models';
import { Appointment } from '../models/appointment.models';
import { RateRequest } from '../models/rate-request.models';
import { Review } from '../models/review.models';

@Injectable()
export class ClientService {
    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient) {

    }

    private sortCountries(allCountries: Country[], sortCountries: String[]) {
        return allCountries.filter((country: Country) => {
            if (sortCountries.indexOf(country.name) > -1) {
                return country
            }
        });
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
            data = this.sortCountries(data, ['Bulgaria', 'Ukraine', 'Hungary']);
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
          console.log(data, 'LOGIN========')
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

    public providers(token: string, catId: string, lat: string, lang: string, pageNo: string): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + "customer/providers?category=" + catId + "&lat=" + lat + "&long=" + lang + "&page=" + pageNo, { headers: myHeaders }).concatMap(data => {
            for (let p of data.data) {
                p.distance = Number(p.distance / 1000).toFixed(2);
                p.ratings = Number(p.ratings).toFixed(2);
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

    public createAppointment(token: string, appointmentRequest: AppointmentRequest): Observable<{}> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<{}>(this.config.apiBase + "customer/appointment", appointmentRequest, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public addresses(token: string): Observable<Array<Address>> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<Array<Address>>(this.config.apiBase + "customer/address", { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public addAddress(token: string, addressRequest: AddressCreateRequest): Observable<Address> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<Address>(this.config.apiBase + "customer/address", addressRequest, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public deleteAddress(token: string, addressId: number): Observable<Address> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.delete<Address>(this.config.apiBase + "customer/address/" + addressId, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public updateAddress(token: string, addressId: number, addressRequest: AddressCreateRequest): Observable<Address> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put<Address>(this.config.apiBase + "customer/address/" + addressId + "/update", addressRequest, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public updateUser(token: string, requestBody: any): Observable<User> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put<User>(this.config.apiBase + "user", requestBody, { headers: myHeaders }).concatMap(data => {
            return Observable.of(data);
        });
    }

    public providerReviews(token: string, profileId: string): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + "customer/providers/" + profileId + "/ratings", { headers: myHeaders }).concatMap(data => {
            for (let review of data.data) {
                review.created_at = this.formatDate(new Date(review.created_at));
            }
            return Observable.of(data);
        });
    }

    public appointments(token: string, pageNo: number): Observable<BaseListResponse> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.get<BaseListResponse>(this.config.apiBase + "customer/appointment?page=" + pageNo, { headers: myHeaders }).concatMap(data => {
            for (let ap of data.data) {
                ap.created_at = this.formatTime(new Date(ap.created_at));
                ap.updated_at = this.formatTime(new Date(ap.updated_at));
                for (let log of ap.logs) {
                    log.updated_at = this.formatTime(new Date(log.updated_at));
                    log.created_at = this.formatTime(new Date(log.created_at));
                }
                ap.date_formatted = this.formatDate(new Date(ap.date));
                ap.time_from_formatted = ap.time_from.substr(0, ap.time_from.lastIndexOf(":"));
                ap.time_to_formatted = ap.time_to.substr(0, ap.time_to.lastIndexOf(":"));
                ap.provider.distance = Number(ap.provider.distance).toFixed(2);
                ap.provider.ratings = Number(ap.provider.ratings).toFixed(2);
            }
            return Observable.of(data);
        });
    }

    public appointmentCancel(token: string, apId: number): Observable<Appointment> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<Appointment>(this.config.apiBase + "customer/appointment/" + apId + '/cancel/', {}, { headers: myHeaders }).concatMap(data => {
            data.updated_at = this.formatTime(new Date(data.updated_at));
            data.created_at = this.formatTime(new Date(data.created_at));
            for (let log of data.logs) {
                log.updated_at = this.formatTime(new Date(log.updated_at));
                log.created_at = this.formatTime(new Date(log.created_at));
            }
            data.provider.distance = Number(data.provider.distance).toFixed(2);
            data.provider.ratings = Number(data.provider.ratings).toFixed(2);
            return Observable.of(data);
        });
    }

    public appointmentUpdate(token: string, apId: number, updateRequest: any): Observable<Appointment> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.put<Appointment>(this.config.apiBase + "provider/appointment/" + apId, JSON.stringify(updateRequest), { headers: myHeaders }).concatMap(data => {
            data.updated_at = this.formatTime(new Date(data.updated_at));
            data.created_at = this.formatTime(new Date(data.created_at));
            for (let log of data.logs) {
                log.updated_at = this.formatTime(new Date(log.updated_at));
                log.created_at = this.formatTime(new Date(log.created_at));
            }
            data.provider.distance = Number(data.provider.distance).toFixed(2);
            data.provider.ratings = Number(data.provider.ratings).toFixed(2);
            return Observable.of(data);
        });
    }

    public rateProvider(token: string, pId: number, rateRequest: RateRequest): Observable<{}> {
        const myHeaders = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        return this.http.post<{}>(this.config.apiBase + "customer/providers/" + pId + "/ratings", JSON.stringify(rateRequest), { headers: myHeaders }).concatMap(data => {
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