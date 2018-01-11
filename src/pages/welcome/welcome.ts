import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {HomePage} from "../home/home";
import {Http, Jsonp, Headers} from '@angular/http';

//使用rxjs
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {RegistPage} from "../regist/regist";
import {UserInfoPage} from "../user-info/user-info";
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {Network} from "@ionic-native/network";
import {LocStorage} from "../../providers/utils/LocStorage";
import {NativeUtils} from "../../providers/utils/NativeUtils";
import {File} from "@ionic-native/file";
import {Lhconfig} from "../../providers/utils/lhconfig";
import {LogProvider} from "../../providers/db/logProvider";
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  title="定位终端";
  isShow:boolean=true;
  public systems = [];
  public data;
  dialog;
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});

  constructor(public navCtrl: NavController, private http: Http, public lhstorage: LocStorage,private  platFome:Platform,private nativeUtils:NativeUtils,private lhconfig:Lhconfig,private logprovider:LogProvider) {
    var _that=this;
   this.dialog=nativeUtils.lhDialog('数据校验中，请稍等...');
    document.addEventListener('deviceready', function() {
      _that.nativeUtils.checkNet();
      _that.checkPermiss();
    });
 }

  jumpNewPage() {
  if (this.data==null||this.data==undefined)
    {
      alert("请选择一个系统");
      return;
    }
    this.lhstorage.saveItem("lhgpspower", this.data.mycontent);
    this.navCtrl.push(HomePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');

  }

  success = function(data) {
    alert(data);
  }
  checkPermiss() {
    // if (!this.nativeUtils.isConnection)
    // {
    //   this.nativeUtils.showAlert("提示","无网络,请保持网络畅通后重试","确定");
    //   return;
    // }
    this.dialog.present();
    var _that = this;
    this.http.post(this.lhconfig.base_ip+"/LonhwinCenter/servlet/GetLastTerminalPower", "appid="+this.lhconfig.APP_ID+"&imei=863637025263208&modifytm=", {headers: this.headers})
      .map(res => res.json()).subscribe(function (data) {
      _that.dialog.dismiss();
      console.log(data);
      _that.logprovider.insertLogTab(3,"★★用户打开程序,网路状态:"+_that.nativeUtils.isConnection+",uuid:"+_that.nativeUtils.uuid);
      _that.logprovider.insertLogTab(3,"★★获取的授权信息:"+data);

      if (data["lhgpsinfo"] == null) {
        //全新注册
         _that.navCtrl.push(RegistPage);
        return;
      }
        _that.lhstorage.saveItem("lhgpsinfo",data["lhgpsinfo"]);
      if (data["lhgpsinfo"].status!=1){
        //手机未授权
        alert("手机未授权")
        _that.navCtrl.pop();
        return;
      }
      if (data["lhgpspowerList"] == null || data["lhgpspowerList"].length < 1) {
        //手机注册，未分配系统
         _that.navCtrl.push(RegistPage,JSON.stringify(data["lhgpsinfo"]));
         return;
      }

      if (data["lhgpspowerList"].length == 1) {
        _that.lhstorage.saveItem("lhgpspower", data["lhgpspowerList"][0]);
        if (data["lhgpspowerList"][0].lhpower == null) {
          //授权异常，提示重新授权
          alert("授权异常请重新授权");
          _that.platFome.exitApp();
          return;
        }
        if (data["lhgpspowerList"][0].powerStatus!=1)
        {
          //未授权
          _that.navCtrl.push(UserInfoPage,true);
          return;
        }
        //直接进去
        _that.navCtrl.push(HomePage);
        return;
      }
        //多系统，选系统
         let temlhgpspower=_that.lhstorage.getItem("lhgpspower");
         if (temlhgpspower!=null)
         {
           //之前已经有数据了，不用再选择系统，比较授权状态就可以了
            for (var m=0;m<data["lhgpspowerList"].length; m++)
            {

              if (data["lhgpspowerList"][m].id.projectId==temlhgpspower.lhproject.projectId)
              {
                _that.lhstorage.saveItem("lhgpspower", data["lhgpspowerList"][m]);
                if(data["lhgpspowerList"][m].powerStatus==1)
                {
                  //可以进去
                  _that.navCtrl.push(HomePage);
                  this.navCtrl.pop();
                  return;
                }
                //未授权跳转到用户信息界面
                _that.navCtrl.push(UserInfoPage,true);
                this.navCtrl.pop();

                break;
              }
            }
           return;
         }

            _that.isShow=false;
            _that.title="选择系统";
            _that.data=data["lhgpspowerList"][0];

        for (var i = 0; i < data["lhgpspowerList"].length; i++) {
          if (i == 0) {
            _that.systems.push({"chek": true, mycontent: data["lhgpspowerList"][i]})
            this.me = data["lhgpspowerList"][i];
          } else {
            _that.systems.push({"chek": false, mycontent: data["lhgpspowerList"][i]})
          }
        }

    }, function (err) {
      console.log(err);
      _that.dialog.dismiss();
    });
  }

  public chekFun(i) {
    let _that = this;
    this.systems.forEach(function (data, inde, array) {
      if (i == inde) {
        data.chek = true;
        _that.data = data;
      } else {
        data.chek = false
      }
      console.log(_that.data);
    });
  }
  ionViewDidLeav(){
    console.log("离开welcome页面");
  }
}
