import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface FirebaseConfig {
	apiKey: string,
	authDomain: string,
	databaseURL: string,
	projectId: string,
	storageBucket: string,
	messagingSenderId: string,
	webApplicationId: string
}

export interface AppConfig {
	appName: string;
	apiBase: string;
	googleApiKey: string;
	oneSignalAppId: string;
	oneSignalGPSenderId: string;
	availableLanguages: Array<any>;
	firebaseConfig: FirebaseConfig;
	paymentUrl: string;
}


export const BaseAppConfig: AppConfig = {
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