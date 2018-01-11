import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
//使用rxjs
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {Http} from "@angular/http";
import {MapShowPage} from "../map-show/map-show";
import {ReportDataPage} from "../report-data/report-data";
import {ReportContentPage} from "../report-content/report-content";
import {LocStorage} from "../../providers/utils/LocStorage";
import {NativeUtils} from "../../providers/utils/NativeUtils";
/**
 * Generated class for the ReportListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-list',
  templateUrl: 'report-list.html',
})
export class ReportListPage {
   lhgpspower;
  lhgpsinfo;
  mtype=-1;
  mtime=0;
  reportDatas=[];
  reportData=null;
  dialog;
  constructor(private  lhstorage: LocStorage,public navCtrl: NavController, public navParams: NavParams,public http:Http, private nativeUtils:NativeUtils) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportListPage');
    this.lhgpspower=this.lhstorage.getItem("lhgpspower");
    this.lhgpsinfo=this.lhstorage.getItem("lhgpsinfo");
    this.dialog =this.nativeUtils.lhDialog( '正在同步数据，请稍等...');

    this.requestData(this.mtype,this.mtime);
  }
  gotoMap(e)
  {
    console.log(e);
    this.navCtrl.push(ReportContentPage,e);
  }
  after()
  {
    this.mtime++;
    this.requestData(this.mtype,this.mtime);
  }
  now(){
    this.mtime=0;
    this.requestData(this.mtype,this.mtime);
  }
  next(){
    this.mtime--;
    this.requestData(this.mtype,this.mtime);
  }

  requestData(type,time)
  {
    this.dialog.present();
    // String sysid,@Query("2") String adcd, @Query("3") String gpsid, @Query("4") String zt, @Query("5") String bs);
    var _that=this;
    let url="http://"+this.lhgpspower.lhproject.serverForBusiness+"/webmvc/all/RangerManager/RangerMarnagerMobileSS/reportTodayMobile?1="
      +this.lhgpspower.id.projectId+"&2="+this.lhgpspower.adcd+"&3="+this.lhgpsinfo.gpsId+"&4="+type+"&5="+time;
    console.log(url);
   this.http.get(url).map(res=>res.json()).subscribe(
     function (data) {
       _that.reportData=data;
       _that.reportDatas=data.rdlist;
       _that.dialog.dismiss();
      console.log(data);
     },function (err) {
       console.log(err);
       _that.dialog.dismiss();
     }
   );
  }

  waringType(type)
  {
    if (type==10)
    {
      return "火点"
    }
    else if (type==20)
    {
      return "偷砍盗伐";
    } else if (type==30)
    {
      return "偷猎";
    } else if (type==40)
    {
      return "病虫害";
    } else if (type==50)
    {
      return "野外用火";
    } else if (type==60)
    {
      return "日报";
    } else if (type==90)
    {
      return "位置上报";
    } else
    {
      return "其他";
    }
  }

  splitStr(old)
  {
    return old.split("@@@");
  }
}
