import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {LogProvider} from "../../providers/db/logProvider";
declare var BMap: any;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
declare var BMAP_STATUS_SUCCESS;

/**
 * Generated class for the LhBaiduComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'lhbaidu',
  templateUrl: 'lhbaidu.html'

})
export class LhbaiduComponent implements OnInit {
  @Input() reportData: any;
  @Output() eventEmitter = new EventEmitter<any>();
  public map: any;
  options: any;
  public translateCallback: any;
  text: string = "测试地图";

  constructor(private logprovider:LogProvider) {
    console.log("百度地图22222222");
  }

  ngOnInit() {
    console.log("百度地图1111111111");
    console.log(this.logprovider);
    if (this.logprovider!=null&&this.logprovider!=undefined){
      this.logprovider.insertLogTab(3, " 百度地图初始化");
    }
    this.map = new BMap.Map("baidu-container");          // 创建地图实例
    var point;  // 创建点坐标
    if (this.reportData != undefined && this.reportData != null) {
      point = new BMap.Point(this.reportData.longitude, this.reportData.latitude);  // 创建点坐标
    } else {
      point = new BMap.Point(102.66731763, 25.07291534);  // 创建点坐标
    }
    this.map.centerAndZoom(point, 15);
    // 地图,设置中心点坐标和地图级别
    //添加地图类型控件
    this.map.addControl(new BMap.MapTypeControl({
      mapTypes: [
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]
    }));
    this.map.setCurrentCity("昆明");          // 设置地图显示的城市 此项是必须设置的
    this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    var options = {
      enableHighAccuracy: true,
      maximumAge: 120*1000,
      timeout: 120 * 1000
    };
    var _that=this;
    // navigator.geolocation.watchPosition(function (position) {
    //
    //   if (_that.logprovider!=null&&_that.logprovider!=undefined){
    //     _that.logprovider.insertLogTab(1, "●●H5定位成功，精度:" + position.coords.accuracy + ",纬度:" + position.coords.longitude+",纬度:"+position.coords.latitude+",速度："+position.coords.latitude+"," +
    //       "高度："+position.coords.altitude+"，时间:"+position.timestamp);
    //   }
    // }, this.locError, options);
    if (this.reportData != undefined && this.reportData != null) {
      var mk = new BMap.Marker(point);
      this.map.addOverlay(mk);
    } else {
      this.baiduLoction();
      // this.fzBaiduLocation();
      // setTimeout( this.baiduLoction, 3000);
    }
  }

  public fzBaiduLocation() {
    // 开启SDK辅助定位
    var geolocation = new BMap.Geolocation();
    var _that = this;
    geolocation.enableSDKLocation();
    geolocation.getCurrentPosition(function (r) {
      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        var mk = new BMap.Marker(r.point);
        _that.map.addOverlay(mk);
        _that.map.panTo(r.point);
        alert('百度辅助定位，您的位置：' + r.point.lng + ',' + r.point.lat);
      }
      else {
        alert('failed' + this.getStatus());
      }
    });
  }

  baiduLoction() {
    // 百度地图API功能
    var _that = this;
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
      if (this.getStatus() == 0) {
        var mk = new BMap.Marker(r.point);
        _that.map.addOverlay(mk);
        _that.map.panTo(r.point);
        _that.exportToFather(r.point);
        if (_that.logprovider!=null&&_that.logprovider!=undefined){
          _that.logprovider.insertLogTab(1, "●●百度定位成功，经度:" + r.point.lng + ",纬度:" + r.point.lat);
        }
      // alert('您的位置：'+r.point.lng+','+r.point.lat);
        // _that.ggPoint = new BMap.Point(r.point.lng,r.point.lat);
        // var convertor = new BMap.Convertor();
        // var pointArr = [];
        // pointArr.push( _that.ggPoint);
        // convertor.translate(pointArr, 1, 5, function (data){
        // if(data.status === 0) {
        //   alert('转换完成');
        //   var marker = new BMap.Marker(data.points[0]);
        // var label = new BMap.Label("转换后的百度坐标（正确）",{offset:new BMap.Size(20,-10)});
        // marker.setLabel(label); //添加百度label
        // _that.map.addOverlay(marker);
        // _that.map.panTo(data.points[0]);
        // _that.map.centerAndZoom(data.points[0], 15);
        // }
        // });
      }
      else {
        alert('failed' + this.getStatus());
      }
    }, {enableHighAccuracy: true});
    // setTimeout( this.baiduLoction, 3000);
  }

  exportToFather(point) {
    //反地理编码
    var geoc = new BMap.Geocoder();
    var _that = this;
    geoc.getLocation(point, function (rs) {
      var addComp = rs.addressComponents;
      console.log(addComp);
      var _address = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
      _that.eventEmitter.emit({lat: point.lat, lng: point.lng, address: _address});
    });
  }



  locError(error) {
    console.log(error)
  };
}
