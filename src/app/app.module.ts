import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import {WelcomePage} from "../pages/welcome/welcome";
import {ReportDataPage} from "../pages/report-data/report-data";

import {HttpModule, JsonpModule} from "@angular/http";
import {Camera} from "@ionic-native/camera";
import {BackgroundGeolocation} from "@ionic-native/background-geolocation";
import { FileTransfer } from '@ionic-native/file-transfer';
import {File} from "@ionic-native/file";
import {ComponentsModule} from "../components/components.module";
import {MultiPickerModule} from "ion-multi-picker";
import {RegistPage} from "../pages/regist/regist";
import {UserInfoPage} from "../pages/user-info/user-info";
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {Network} from "@ionic-native/network";
import {ReportListPage} from "../pages/report-list/report-list";
import {MapShowPage} from "../pages/map-show/map-show";
import {Toast} from "@ionic-native/toast";
import {ReportContentPage} from "../pages/report-content/report-content";
import {LocStorage} from "../providers/utils/LocStorage";
import {NativeUtils} from "../providers/utils/NativeUtils";
import {CommonUtils} from "../providers/utils/CommonUtils";
import {SQLite} from "@ionic-native/sqlite";
import {Lhconfig} from "../providers/utils/lhconfig";
import {LogProvider} from "../providers/db/logProvider";
import {DataProvider} from "../providers/db/dbData";
import {LogshowPage} from "../pages/logshow/logshow";
import {Geolocation} from "@ionic-native/geolocation";
import {PhotoViewer} from "@ionic-native/photo-viewer";
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WelcomePage,
    ReportDataPage,RegistPage,
    UserInfoPage,ReportListPage,MapShowPage,ReportContentPage
    ,LogshowPage
  ],
  imports: [
    BrowserModule,HttpModule,JsonpModule,ComponentsModule,MultiPickerModule,
    // IonicModule.forRoot(MyApp),
    IonicModule.forRoot(MyApp,{tabsHideOnSubPages:'true',
      backButtonText:"返回"
    })//隐藏二级菜单
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    WelcomePage,
    ReportDataPage,
    RegistPage,
    UserInfoPage,
    ReportListPage
    ,MapShowPage,ReportContentPage
    ,LogshowPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocationTrackerProvider,Camera,BackgroundGeolocation,FileTransfer,Geolocation,
    File,UniqueDeviceID,Network,Toast,LocStorage,NativeUtils,CommonUtils,Lhconfig
    ,SQLite,LogProvider,DataProvider,PhotoViewer
  ]
})
export class AppModule {

}
