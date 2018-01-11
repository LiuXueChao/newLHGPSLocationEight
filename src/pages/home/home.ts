import {Component, OnInit} from '@angular/core';
import {
  IonicPage, NavController, NavParams, MenuController, App, ModalController,
  ToastController, Platform, IonicApp, LoadingController
} from 'ionic-angular';
import {ReportDataPage} from "../report-data/report-data";
import {LocationTrackerProvider} from "../../providers/location-tracker/location-tracker";
import {Http} from "@angular/http";
//使用rxjs
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {Network} from "@ionic-native/network";
import {ReportListPage} from "../report-list/report-list";
import {UserInfoPage} from "../user-info/user-info";
import {Toast} from "@ionic-native/toast";
import {LocStorage} from "../../providers/utils/LocStorage";
import {NativeUtils} from "../../providers/utils/NativeUtils";
import {LogshowPage} from "../logshow/logshow";
import {LogProvider} from "../../providers/db/logProvider";
import {Lhconfig} from "../../providers/utils/lhconfig";
declare var cordova:any;
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mtoast;
   beginDate=0;          // 两次点击退出按钮开始时间
   isToast = false;    // 是否弹出弹框
  params: Object;
  backButtonPressed: boolean = false;  //用于判断返回键是否触发
  pushPage: any;
  isExpand: boolean = false;
   mPoint;
  childrens = [];
  lhgpspower;
  imgs=[["assets/img/home_yjsb_dzwbh.png","assets/img/home_yjsb_gylgl.png","assets/img/home_yjsb_lqgl.png","assets/img/home_yjsb_lyflfgxc.png"],
    ["assets/img/home_yjsb_qt.png","assets/img/home_yjsb_slbch.png","assets/img/home_yjsb_slfh.png","assets/img/home_yjsb_xzgl.png"]];
  constructor(public ionicApp: IonicApp, public platform: Platform, public navCtrl: NavController, public http: Http, public locationTracker: LocationTrackerProvider,private loadingCtrl:LoadingController,private menu: MenuController,private  lhstorage: LocStorage,private nativeUtils:NativeUtils,private logProvider:LogProvider,private lhcongif:Lhconfig) {
    this.pushPage = ReportDataPage;
    this.params = {reportCode: '10', reportName: '偷砍盗伐'};
    this.lhgpspower = lhstorage.getItem("lhgpspower");
    if (this.lhgpspower != null && this.lhgpspower.moduleTree.children.length > 0) {
      // moduleName
      for (var i = 0; i < this.lhgpspower.moduleTree.children.length; i++) {
        if (this.lhgpspower.moduleTree.children[i].moduleName == "一键上报") {
          var index = 0;
          var rowDatas = [];
          for (var j = 0; j < this.lhgpspower.moduleTree.children[i].children.length; j++) {
            index++;
            rowDatas.push(this.lhgpspower.moduleTree.children[i].children[j]);
            if (index == 4 || j == this.lhgpspower.moduleTree.children[i].children.length - 1) {
              let tem = [];
              tem = rowDatas;
              this.childrens.push(tem)
              rowDatas = [];
              index = 0;
            }
          }
          break;
        }
      }
    }
    this.locationTracker.startTracking();
    this.logProvider.insertLogTab(3,"★★上传报警地址:"+this.lhgpspower.lhproject.serverForGpsupload);
    this.logProvider.insertLogTab(3,"★★业务地址:"+this.lhgpspower.lhproject.serverForBusiness);
  // String account,String token,String appkey,String madcd,String madcdName,String mProjectId,String mpowerServer,String appId
    cordova.exec(this.success, this.err, "LHnimPlugin", "init", [this.lhgpspower.msgAccid,this.lhgpspower.msgToken,this.lhgpspower.lhproject.msgKey,this.lhgpspower.adcd,this.lhgpspower.adcdName,this.lhgpspower.id.projectId,this.lhcongif.base_ip,this.lhcongif.APP_ID]);
    cordova.exec(this.success, this.err, "LHnimPlugin", "login", [this.lhgpspower.msgAccid,this.lhgpspower.msgToken,this.lhgpspower.lhproject.msgKey,this.lhgpspower.adcd,this.lhgpspower.adcdName,this.lhgpspower.id.projectId,this.lhcongif.base_ip,this.lhcongif.APP_ID]);
    this.logProvider.insertLogTab(3,"★★网易云初始化和登陆:"+this.lhgpspower.msgAccid+":"+this.lhgpspower.msgToken+":"+this.lhgpspower.lhproject.msgKey+":"+this.lhgpspower.adcd+":"+this.lhgpspower.adcdName+":"+this.lhgpspower.id.projectId+":"+this.lhcongif.base_ip+":"+this.lhcongif.APP_ID);
  }


  ionViewDidLoad() {
    this.isExpand = true;
    this.controlShow();

  }
  err=function (err) {
    alert(err);
  }
   success = function(data) {
    alert(data);
  }

  openPage(page){
    this.menu.close();
    if (page==1)
    {
      this.navCtrl.push(UserInfoPage);
    }else if (page==2){
      this.navCtrl.push(UserInfoPage);
    }else  if (page==3){
      this.navCtrl.push(LogshowPage);
    }else {
      this.navCtrl.push(UserInfoPage);
    }

  }
  gotoYX(){
    cordova.exec(this.success, this.err, "LHnimPlugin", "goto", [this.lhgpspower.msgAccid,this.lhgpspower.msgToken,this.lhgpspower.lhproject.msgKey,this.lhgpspower.adcd,this.lhgpspower.adcdName,this.lhgpspower.id.projectId,this.lhcongif.base_ip,this.lhcongif.APP_ID]);
    // cordova.exec(this.success,  this.err, "HelloPlugin", "hello", ["hello", "world", "!!!"]);
  }
refersh(){

    var _that=this;
   var dialog=this.nativeUtils.lhDialogForTime("数据刷新中请稍等...",3000);
  dialog.present();
  dialog.onDidDismiss(() => {
   this.nativeUtils.lhToast('刷新成功');
  });
}
  // registerBackButtonAction() {
  //   this.platform.registerBackButtonAction(() => {
  //     console.log('返回按钮回掉');
  //     //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
  //     // this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
  //     let activePortal = this.ionicApp._modalPortal.getActive();
  //     if (activePortal) {
  //       activePortal.dismiss().catch(() => {
  //       });
  //       activePortal.onDidDismiss(() => {
  //       });
  //       return;
  //     }
  //     let activeVC = this.navCtrl.getActive();
  //     let tabs = activeVC.instance.tabs;
  //     let activeNav = tabs.getSelected();
  //     return activeNav.canGoBack() ? activeNav.pop() : this.showExit()
  //   }, 1);
  // }
  //
  // //双击退出提示框
  // showExit() {
  //   console.log('点击返回按钮');
  //   if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
  //     this.platform.exitApp();
  //   } else {
  //     this.toastCtrl.create({
  //       message: '再按一次退出应用',
  //       duration: 2000,
  //       position: 'top'
  //     }).present();
  //     this.backButtonPressed = true;
  //     setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
  //   }
  // }

  controlShow() {
    if (this.isExpand) {
      document.getElementById("expand").style.display = "inline";
      document.getElementById("flod").style.display = "none";
      this.isExpand = false;
      document.getElementById("home_bottom_inside").style.display = "none";
      document.getElementById("home_bottom_outside").style.cssText = "    width: 100%;\n" +
        "    height: 40px;\n" +
        "    top: 90%;\n" +
        "    float: left;\n" +
        "    position:absolute;\n" +
        "    border:1px solid #DCDCDC;\n"
    } else {
      this.isExpand = true;
      document.getElementById("expand").style.display = "none";
      document.getElementById("flod").style.display = "inline";
      document.getElementById("home_bottom_inside").style.display = "inline";
      document.getElementById("home_bottom_outside").style.cssText = "width: 100%;height: 245px;top: 60%;float: left;position:absolute;border:1px solid #DCDCDC;"
    }
  }

  getLatLont(point) {
    this.mPoint = point;
    this.isExpand=false;
    this.controlShow();
  }

  gotoReport(mchildren) {
    if (this.mPoint == null || this.mPoint == undefined) {
      alert("未定位，请重试");
      return;
    }
    var mReportInfo = {
      children: mchildren,
      point: this.mPoint
    };
    this.navCtrl.push(ReportDataPage, mReportInfo);
  }
  gotoReportList(){
    this.navCtrl.push(ReportListPage);
  }
  gotoUserInfo(){
    this.navCtrl.push(UserInfoPage,true);
  }
  requestImg(event) {
    // console.log("#######################");
    // console.log(event);
    //
    // this.http.get("http://112.124.119.114:8739/LonhwinCenter/servlet/GetSourceByID?sourceid=" + sourceid + "&softid=" + this.lhgpspower.lhproject.projectId)
    //   .map(res => res.json()).subscribe(
    //   function (data) {
    //     var img=document.getElementById(event);
    //     console.log(img);
    //     img.setAttribute("src",'data:image/jpeg;base64,'+data[0]["content"]);
    //     // img.src= 'data:image/jpeg;base64,'+data[0]["content"];
    //
    //   }, function (err) {
    //
    //   }
    // );
  }
}

