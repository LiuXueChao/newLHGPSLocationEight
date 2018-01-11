import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {LocStorage} from "../../providers/utils/LocStorage";

/**
 * Generated class for the UserInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
})
export class UserInfoPage {
  lhgpspower;
  lhgpsinfo;
  isShow:false;
  constructor(private  lhstorage: LocStorage,public navCtrl: NavController, public navParams: NavParams,public platform:Platform) {
    this.isShow=navParams.data;
    console.log("***********");
    this.lhgpspower=lhstorage.getItem("lhgpspower");
    this.lhgpsinfo=lhstorage.getItem("lhgpsinfo");
  }

  ionViewDidLoad() {

  }
  exit(){
   this.platform.exitApp();
  }
  back(){
    this.navCtrl.pop();
  }
}
