import { NavController, Platform, MenuController, ToastController, NavParams, AlertController } from 'ionic-angular';
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as firebase from 'firebase';
import { MyLocation } from '../../models/my-location.models';
import { GoogleMaps } from '../../providers/google-maps';
import { Appointment } from '../../models/appointment.models';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { TranslateService } from '@ngx-translate/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'page-track',
  templateUrl: 'track.html'
})
export class TrackPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  private initialized: boolean;
  private appointment: Appointment;
  private markerMe: any;
  private markerProvider: any;
  private posMe: any;
  private refLocation: firebase.database.Reference;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private alertCtrl: AlertController,
    navParam: NavParams, private translate: TranslateService, public maps: GoogleMaps,
    private platform: Platform, private diagnostic: Diagnostic, private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation, private toastCtrl: ToastController) {
    this.menuCtrl.enable(false, 'myMenu');
    this.appointment = navParam.get("appointment");
  }

  ionViewDidEnter() {
    const component = this;
    this.refLocation = firebase.database().ref().child("handyman_provider").child(String(this.appointment.provider.user_id));
    this.refLocation.on('value', function (snapshot) {
      var providerLocation = snapshot.val() as MyLocation;
      component.checkAndSetLocation(providerLocation);
    });
  }

  ionViewWillLeave() {
    if (this.refLocation) {
      this.refLocation.off();
    }
  }

  checkAndSetLocation(location: MyLocation) {
    console.log('inlocation', location);
    if (this.maps.map) {
      let center = new google.maps.LatLng(Number(location.lat), Number(location.lng));
      let posBonds = new google.maps.LatLngBounds();
      if (this.posMe)
        posBonds.extend(this.posMe);
      posBonds.extend(center);
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

      setTimeout(() => {
        this.maps.map.panTo(posBonds.getCenter());
      }, 200);
    }
  }

  ionViewDidLoad(): void {
    if (!this.initialized) {
      let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
        this.initialized = true;
        this.plotMarkers();
      }).catch(err => {
        console.log(err);
        this.navCtrl.pop();
      });
      mapLoaded.catch(err => {
        console.log(err);
        this.navCtrl.pop();
      });
    }
  }

  plotMarkers() {
    let posBonds = new google.maps.LatLngBounds();
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

    setTimeout(() => {
      this.maps.map.panTo(posBonds.getCenter());
    }, 200);
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.maps.map, marker);
    });

  }

}
