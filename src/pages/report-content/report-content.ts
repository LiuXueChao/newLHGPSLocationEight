import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LocStorage} from "../../providers/utils/LocStorage";
import {CommonUtils} from "../../providers/utils/CommonUtils";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {NativeUtils} from "../../providers/utils/NativeUtils";

/**
 * Generated class for the ReportContentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-content',
  templateUrl: 'report-content.html',
})
export class ReportContentPage {
  reportDta;
  lhgpspower;
  paths;
  mcommonUtils;
  constructor(public nativeUtils: NativeUtils, public navParams: NavParams,private  lhstorage: LocStorage,private commonUtils:CommonUtils) {
    this.reportDta=navParams.data;
    console.log(this.reportDta);
    this.lhgpspower=lhstorage.getItem("lhgpspower");
    this.paths=JSON.parse(this.reportDta.filePath)
    this.mcommonUtils=commonUtils;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportContentPage');
  }

  getPath(imgId)
  {
    console.log(imgId);
    return "http://" + this.lhgpspower.lhproject.serverForSearch + "/lhcenter/api/v1/oss/thumb/"+imgId;
  }
  splitStr(old)
  {
    return old.split("@@@");
  }
  showImage(id)
  {
    console.log("showImage调用");
    this.nativeUtils.photoViewerShow("http://" + this.lhgpspower.lhproject.serverForSearch + "/lhcenter/api/v1/oss"+id);
 }


}
