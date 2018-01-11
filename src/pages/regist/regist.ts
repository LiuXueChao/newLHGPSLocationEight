import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, Platform} from 'ionic-angular';
import {Http} from "@angular/http";

//使用rxjs
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {WelcomePage} from "../welcome/welcome";
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {NativeUtils} from "../../providers/utils/NativeUtils";
import {CommonUtils} from "../../providers/utils/CommonUtils";
import {Lhconfig} from "../../providers/utils/lhconfig";

/**
 * Generated class for the RegistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-regist',
  templateUrl: 'regist.html',
})
export class RegistPage {
  dialog;
  provice;//省
  provices = [];
  city;//市
  citys = [];
  county;//县
  countys = [];
  township;//乡
  townships = [];
  selectAdcd;//用户最终选择的行政区划
  userName = "";
  phoneNumbe = ""
  position = "";
  departmentd;//单位
  departments = [];
  systemAndRoles = [];
  selectSystem;//默认选择一个系统
  role: any;//默认选择一个角色
  roles = [];
  sex = [{"chek": true, value: "男"}, {"chek": false, value: "女"}];
  index = 0;

  constructor(public navCtrl: NavController, public platform: Platform, public http: Http,private nativeUtils:NativeUtils,private comonUtils:CommonUtils,private lhconfig:Lhconfig) {
  }

  ionViewDidLoad() {

    this.getAdcd("", 1);

  }

  /**
   * j检测性别改变的时候
   * @param i
   */
  chekFun(i) {
    let _that = this;
    this.sex.forEach(function (data, inde, array) {
      if (i == inde) {
        data.chek = true;
        _that.index = inde;
      } else {
        data.chek = false
      }

    });
  }

  /**
   * 用户选了省
   * @param e
   */
  proviceChange(e) {
    if (e.adcd.length < 2) {
      return;
    }
    if (this.selectSystem != null && this.selectSystem != undefined) {
      this.getDepartment(this.selectSystem.lhproject.projectId, this.comonUtils.get15Adcd(e.adcd), this.comonUtils.getLevelByAdcd(e.adcd));//获取部门
    }
    switch (this.comonUtils.getLevelByAdcd(e.adcd)) {
      case 1:
        this.selectAdcd = e;
        this.provice = e;
        this.getAdcd(e.adcd, 2)
        break;

      case 2:
        this.selectAdcd = e;
        this.city = e;
        this.getAdcd(e.adcd, 3)

        break;
      case 3:
        this.selectAdcd = e;
        this.county = e;
        this.getAdcd(e.adcd, 4)

        break;
      case 4:
        this.selectAdcd = e;
        this.township = e;
        break;
    }

  }

  /**
   * 用户选择了部门
   * @param e
   */
  departmentdChange(e) {
    this.departmentd = e;
  }

  /**
   * 检测选择的角色改变的时候
   * @param e
   */
  roleChange(e) {
    this.role = e;
  }

  /**
   * 检测选择的系统改变的时候
   * @param e
   */
  sysChange(e) {
    if (this.selectAdcd == null || this.selectAdcd == undefined) {
      return;
    }
    this.selectSystem = e;
    this.roles = e.roleList;
    this.role = e.roleList[0];
    console.log("!!!!!!!!!!!!!!!");
    console.log(this.selectAdcd);
    console.log(this.selectSystem);
    if (this.selectAdcd != null && this.selectAdcd != undefined) {
      this.getDepartment(this.selectSystem.lhproject.projectId, this.comonUtils.get15Adcd(this.selectAdcd.adcd), this.comonUtils.getLevelByAdcd(this.selectAdcd.adcd));//获取部门
    }
  }

  /**
   * 获取所属角色和系统
   */
  systemAndRole() {
    var _that = this;
    this.http.get(this.lhconfig.base_ip+"/LonhwinCenter/servlet/GetAppPowerList?appid=dwzddevelop").map(res => res.json()).subscribe(
      function (data) {

        if (data == null || data.length < 1) {
          _that.nativeUtils.lhToast("未获取到所属系统");
          return;
        }
        _that.selectSystem = data[0];
        _that.systemAndRoles = data;

        _that.getDepartment(_that.selectSystem.lhproject.projectId, _that.comonUtils.get15Adcd(_that.selectAdcd.adcd), _that.comonUtils.getLevelByAdcd(_that.selectAdcd.adcd));//获取部门
      }, function (err) {
        _that.nativeUtils.lhToast("获取所述系统异常");
      }
    );
  }


  /**
   * 获取行政区划
   * @param adcd
   * @param type
   */
  getAdcd(adcd, type) {
    var _that = this;
    this.http.get("http://112.124.119.114:8741/data/DataSSServlet/findSubAdcd?adcd=" + adcd).map(res => res.json()).subscribe(
      function (data) {

        switch (type) {
          case 1:
            _that.provice = data[23];
            _that.provices = data;
            _that.selectAdcd = data[23];
            _that.getAdcd(_that.provice.adcd, 2);
            _that.systemAndRole();
            break;
          case 2:
            data.push({
              autoID: "1",
              adcd: "0",
              name: "-选择州/市-"
            });

            _that.city = data[data.length - 1];
            _that.citys = data;

            break;
          case 3:
            data.push({
              autoID: "1",
              adcd: "0",
              name: "--选择县/区-"
            });
            _that.county = data[data.length - 1];
            _that.countys = data;
            break;
          case 4:
            data.push({
              autoID: "1",
              adcd: "0",
              name: "-选择乡/镇-"
            });
            _that.township = data[data.length - 1]
            _that.townships = data;

            break;
        }

      }, function (err) {
        _that.nativeUtils.lhToast("获取行政区划异常");
      }
    );
  }

  /**
   * 获取部门
   * @param projectId
   * @param adcd
   * @param minlevel
   */
  getDepartment(projectId, adcd, minlevel) {
    console.log("*************88");
    console.log(projectId + adcd + minlevel);
    var _that = this;
    this.http.get(this.lhconfig.base_ip+"/LonhwinCenter/servlet/GetAdcdTreeSub?projectid=" + projectId + "&id=" + adcd + "&gpstype=-1&minlevel=" + minlevel).map(res => res.json()).subscribe(
      function (data) {

        _that.departments = data;
        if (data == null || data.length < 1) {
          _that.departmentd = null;
          return;
        }
        _that.departmentd = data[0];
      }, function (err) {

      }
    );
  }

  submitData() {
    console.log("&&&&&&&&&&&&&&&&&&&");
    console.log(this.selectSystem );
    if (this.selectSystem == undefined || this.selectSystem == null) {
      this.nativeUtils.lhToast("请选择所属系统");
      return;
    }
    if (this.role == undefined || this.role == null) {
      this.nativeUtils.lhToast("请选择角色");
      return;
    }
    if (this.userName.length < 1) {
      this.nativeUtils.lhToast("请输入用户名");
      return;
    }
    if (this.userName.length < 1) {
      this.nativeUtils.lhToast("请输入用户名");
      return;
    }
    if (this.phoneNumbe.length < 1) {
      this.nativeUtils.lhToast("请输入联系方式");
      return;
    }
    let gpsInfo = {
      imei: "863637025263208",
      mac: "",
      gpsType: 0,
      name: "测试三星", //设备名称
      owner: this.userName, //设备持有者/管理者
      ownerPhone: this.phoneNumbe, //持有者/管理者手机
      headPic: "",  //持有者头像
      position: this.position, //持有者职务
      adcd: this.selectAdcd.adcd,//所属行政区划编码
      adcdName:this.selectAdcd.name,
      unit: this.departmentd.name, //所属单位
      lat: 0,  //纬度
      lon: 0,  //经度
      height: 0, //高度
      tag: "",  //附加信息（Json字串：键值对）
      status: 0, //状态： -1已删除0禁用1启用
      remark: "", //备注
      gpsphon: "",//设备号码
      alongBss: "林业", //所属行业
      regtm: "", //注册时间
      sex: this.sex[this.index].value, //性别： -1无0男1女
      idnumber: "",//身份证号/编号
      birthday: "",//生日
      modifytm: "", //修改时间
      modifyUserId: "", //修改人ID
      modifyUserName: "" //修改人名称
    };
    let lhgpspowerId = {
      gpsId: "",
      projectId:this.lhconfig.APP_ID
    };
    console.log(lhgpspowerId)
    let lhgpspower = {
      id: lhgpspowerId, //复合主键
      gpsType: 0, //设备类型：0手机1电脑2网络帐号3视频监控4监测站5对讲机6座机7视频会议终端
      adcd: this.selectAdcd.adcd,//所属行政区划编码
      roleList: "|" + this.role.roleId + "|",//角色列表：角色ID两边加竖线分割，比如单角色：|12|，12是角色ID，双角色|12||13|
      groupList: "|" + this.departmentd.id + "|", //单位部门分组列表：单位、部门、分组ID两边加竖线分割
      appList: "|"+this.lhconfig.APP_ID+"|", //手机APP列表：appID两边加竖线分割
      powerStatus: 0,//授权状态：-1已删除;0未授权:1启用9禁用
      modifytm: "", //修改时间
      modifyUserId: "", //修改人ID
      modifyUserName: "",//修改人名称
      msgToken: "",
      msgAccid: "",
      msgName: ""
    };
    console.log(gpsInfo);
    console.log(lhgpspower);
    let _that = this;
     this.dialog = this.nativeUtils.lhDialog('数据提交中请稍等...');
     this.dialog.present();
     let url=this.lhconfig.base_ip+"/LonhwinCenter/servlet/RegistGPS?lhgpsinfo=" + JSON.stringify(gpsInfo) + "&lhgpspower=" + JSON.stringify(lhgpspower);
     console.log(url);
    this.http.get(url).map(res => res.json()).subscribe(
      function (data) {
        _that.dialog.dismiss();
        _that.nativeUtils.lhToast("注册成功");
        _that.navCtrl.pop()

      }, function (err) {
        console.log(err);
        _that.dialog.dismiss();
        _that.nativeUtils.lhToast("注册失败");
      }
    );
  }

  close() {
    this.platform.exitApp();
  }


}
