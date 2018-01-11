import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare var BMap: any;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
declare var BMAP_STATUS_SUCCESS;
/**
 * Generated class for the MapShowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-show',
  templateUrl: 'map-show.html',
})
export class MapShowPage {
    reportData;
  public map:any;
  options:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.reportData=navParams.data;
    this.initMap();
  }

  ionViewDidLoad() {

  }

  initMap(){
    this.map = new BMap.Map("baidu-container");          // 创建地图实例
    var point;  // 创建点坐标
    // point = new BMap.Point(this.reportData.longitude, this.reportData.latitude);  // 创建点坐标
    point = new BMap.Point(102.66731763, 25.07291534);  // 创建点坐标
    this.map.centerAndZoom(point, 15);
    // 地图,设置中心点坐标和地图级别
    //添加地图类型控件
    this.map.addControl(new BMap.MapTypeControl({
      mapTypes:[
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]}));
    this.map.setCurrentCity("昆明");          // 设置地图显示的城市 此项是必须设置的
    this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    var mk = new BMap.Marker(point);
    this.map.addOverlay(mk);
    this.map.panTo(point);
  }

  waringType(type) {
    if (type == 10) {
      return "火点"
    }
    else if (type == 20) {
      return "偷砍盗伐";
    } else if (type == 30) {
      return "偷猎";
    } else if (type == 40) {
      return "病虫害";
    } else if (type == 50) {
      return "野外用火";
    } else if (type == 60) {
      return "日报";
    } else if (type == 90) {
      return "位置上报";
    } else {
      return "其他";
    }
  }
}
