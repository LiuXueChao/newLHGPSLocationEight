import { Injectable,NgZone } from '@angular/core';
import 'rxjs/add/operator/map';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import 'rxjs/add/operator/filter';
import {Geolocation, Geoposition} from "@ionic-native/geolocation";
import {LogProvider} from "../db/logProvider";
declare var BMap: any;
@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;

  constructor(public zone: NgZone,public backgroundGeolocation:BackgroundGeolocation,public geolocation:Geolocation,public logProvider:LogProvider) {

  }
  startTracking() {
    this.logProvider.insertLogTab(3,"★★开始后台定位:");
    let config = {
      desiredAccuracy: 1,
      stationaryRadius: 200,
      distanceFilter: 10,
      debug: true,
      interval: 5000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {
      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
      console.log(location.coords);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.logProvider.insertLogTab(3, "●●运行在后台情况下定位成功，精度:" + location.coords.accuracy + ",纬度:" + location.coords.longitude+",纬度:"+location.coords.latitude+",速度："+location.coords.latitude+"," +
          "高度："+location.coords.altitude+"，时间:"+location.timestamp);
        this.lat = location.latitude;
        this.lng = location.longitude;
      });
    }, (err) => {
      console.log(err);
    });
    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();
    // Foreground Tracking
    let options = {
      frequency: 10000,
      enableHighAccuracy: true,
      interval: 5000 //定位间隔
    };
    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      console.log(position.coords);
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.logProvider.insertLogTab(3, "●●运行在前台情况下定位成功，精度:" + position.coords.accuracy + ",纬度:" + position.coords.longitude+",纬度:"+position.coords.latitude+",速度："+position.coords.latitude+"," +
          "高度："+position.coords.altitude+"，时间:"+position.timestamp);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

    });

  }

  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();

  }
}
