import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {Http, Headers} from "@angular/http";
import {convertEnumToColumn} from 'ion-multi-picker';
//使用rxjs
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {Toast} from "@ionic-native/toast";
import {LocStorage} from "../../providers/utils/LocStorage";
import {NativeUtils} from "../../providers/utils/NativeUtils";
import {CommonUtils} from "../../providers/utils/CommonUtils";
import {LogProvider} from "../../providers/db/logProvider";


/**
 * Generated class for the ReportDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

enum CommonLanguage {
  选择常用语, 巡护正常, 未发现火点, 一切正常, 出现异常情况, 出现火点, 其他情况
}

@IonicPage()
@Component({
  selector: 'page-report-data',
  templateUrl: 'report-data.html',
})

export class ReportDataPage {
  dialog;
  mydescript;
  adcdNmae: string = "";
  CommonLanguages: any[];
  language: CommonLanguage;
  CommonLanguage;
  descript: string = "";
  selectDescript = [];
  options: CameraOptions = {
    quality: 10,	//图像的保存质量，范围0-100，100是最大值，最高的分辨率，没有任何压缩损失（请注意有关该相机的分辨率信息不可用。）
    destinationType: this.camera.DestinationType.FILE_URI,//选择返回值的格式
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.ALLMEDIA,
    saveToPhotoAlbum: true,                       //保存本地
    cameraDirection: this.camera.Direction.BACK   //后置摄像头

  }
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
  public uploadIndex = 0;
  public mutiType = 0;
  public lhgpspower;

  public paths = [{
    defaultPath: "assets/img/default_camear.png",
    camearPath: "0",
    isUpload: false
  }, {
    defaultPath: "assets/img/default_camear.png",
    camearPath: "1",
    isUpload: false
  }, {
    defaultPath: "assets/img/default_camear.png",
    camearPath: "2",
    isUpload: false
  }, {
    defaultPath: "assets/img/default_camear.png",
    camearPath: "3",
    isUpload: false
  }];
  public reportInfo;
  public pathId = [];
  public descriptDatas = [];

  constructor(public navCtr: NavController, public navParams: NavParams, private camera: Camera, private transfer: FileTransfer, private file: File, private http: Http, private  lhstorage: LocStorage, private nativeUtils: NativeUtils, private commonUtils: CommonUtils,private logprovider:LogProvider) {
    this.reportInfo = navParams.data;
    this.lhgpspower = lhstorage.getItem("lhgpspower");
    this.language = CommonLanguage.选择常用语;
    this.CommonLanguage = CommonLanguage;
    this.CommonLanguages = convertEnumToColumn(this.CommonLanguage);
    this.adcdNmae = this.lhgpspower.adcdName;
    // target  正常#一切正常*巡护正常 @@@ 异常# 发生野外用火*发生荒火*发生林火 @@@
    var perent = this.reportInfo.children.target.split("@@@");
    console.log(perent);
    for (var i = 0; i < perent.length - 1; i++) {
      if (perent[i].length > 5) {
        var tem = perent[i].split("#")[1].split("*");
        for (var j = 0; j < tem.length; j++) {
          this.selectDescript.push(tem[j]);
        }
      }
    }
    this.mydescript = this.selectDescript[0];

  }

  ionViewDidLoad() {
    this.dialog = this.nativeUtils.lhDialog('数据提交中请稍等...');

  }

  reportData() {
    var _that = this;
    this.dialog.present();
    if (this.uploadIndex > 3) {
      //附件上传完了，上传数据，
      var lhgpsinfo = this.lhstorage.getItem("lhgpsinfo");
      if (this.lhgpspower == null) {
        alert("授权为空！");
        this.dialog.dismiss();
        return;
      }


      var uploadData = {
        gpsID: this.lhgpspower.id.gpsId,
        sysID: this.lhgpspower.id.projectId,
        gpsType: '0',
        adcd: this.lhgpspower.adcd,
        tm: this.commonUtils.dateFtt("yyyy-MM-dd hh:mm:ss.S", new Date()),
        latitude: this.reportInfo.point.lat,
        longitude: this.reportInfo.point.lng,
        status: this.reportInfo.children.className,
        multiType: this.mutiType,
        multiPath: "",
        multiTitle: "正常",
        multiRemark: this.descript + this.language + "@@@" + this.reportInfo.point.address + "@@@" + this.lhgpspower.adcdName,
        writetm: "",
        outBorderFlg: 9,
        locationStatus: 2,
        usesatellite: 15,
        snr: 25,
        acc: 50,
        workFor: "工作内容未知",
        remark: this.descript + " @@@" + this.reportInfo.point.address + "@@@" + this.lhgpspower.adcdName,
        roleID: this.lhgpspower.lhpower.roleId,
        battery: "30",
        netState: "1",
        phoneState: "1",
        filePath: JSON.stringify(this.pathId),
        ver: "1.0.1",
        owner: lhgpsinfo.owner,
        ownerPhone: lhgpsinfo.ownerPhone,
        pmid: "",
        pmName: "",
      };
      var content = document.getElementById("content");
      this.logprovider.insertLogTab(6,"▲▲上传文本内容:"+JSON.stringify(uploadData));
      this.logprovider.insertLogTab(3,"★★上传文本内容地址:"+"http://" + this.lhgpspower.lhproject.serverForGpsupload + "/api/v1/data/");
      this.http.post("http://" + this.lhgpspower.lhproject.serverForGpsupload + "/api/v1/data/" + this.lhgpspower.lhpower.projectId, "data=" + "[" + JSON.stringify(uploadData) + "]", {headers: this.headers})
        .map(res => res.json()).subscribe(function (data) {
        console.log(data);
        _that.dialog.dismiss();
        _that.nativeUtils.lhToast(`上报成功`);
        _that.navCtr.pop();
      }, function (err) {
        console.log(err);
        _that.dialog.dismiss();
        _that.nativeUtils.lhToast(`上报失败`);
      });

      return;
    }
    console.log(this.paths);
    this.uploadFile(this.paths[this.uploadIndex])
  }


  cameraPicture(event, index) {
    if(this.paths[index].camearPath.length>5)
    {
      console.log("展示大图的路径："+this.paths[index].camearPath);
      this.nativeUtils.photoViewerShow(this.paths[index].camearPath);
      return;
    }
    var _this = this;
    this.camera.getPicture(this.options).then((imageData) => {
      console.log(imageData);
      event.srcElement.src = imageData;
      _this.paths[index].camearPath = imageData;
      console.log(_this.paths);
    }, (err) => {
      // Handle error
    });
  }


  //使用FileTransfer插件，上传文件
  uploadFile(obj) {

    console.log("上传的路径:" + obj.camearPath);
    if (obj.camearPath.length < 5) {
      this.uploadIndex++;
      this.reportData();
      return;
    }
    this.mutiType = 2;
    if (obj.camearPath.indexOf("png") > 0 || obj.camearPath.indexOf("jpg") || obj.camearPath.indexOf("jpeg")) {
      this.mutiType = 1;
    }
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: obj.camearPath.substr(obj.camearPath.lastIndexOf("/"), obj.camearPath.length)
    }
    var _that = this;//"http://srv.lonhcloud.com/lhcenter/api/v1/oss"
    fileTransfer.upload(obj.camearPath, encodeURI("http://" + this.lhgpspower.lhproject.serverForSearch + "/lhcenter/api/v1/oss"), options)
      .then((data) => {
        if (data['responseCode'] == 200) {
          //上传成功
          var fileId={id: data['response'], type: _that.mutiType};
          _that.logprovider.insertLogTab(6,"▲▲上传附件成功:"+fileId);
          _that.pathId.push(fileId);
          _that.uploadIndex++;
        }
        // success
        console.log(data);
        //继续上次
        _that.reportData();
      }, (err) => {
        // error
        console.log(err);
        _that.logprovider.insertLogTab(6,"▲▲上传附件失败:"+err);
        alert(err);
        _that.dialog.dismiss();
      });
  }

  descriptChange(e) {
    //选择的描述信息改变
    if (this.descript.indexOf(",")) {
      let tem = this.descript.substring(this.descript.indexOf(",") + 1, this.descript.length);
      console.log(tem);
      this.descript = e + "," + tem;
    } else {
      this.descript = e + ",";
    }
  }

}
