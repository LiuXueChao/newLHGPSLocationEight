import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LogProvider} from "../../providers/db/logProvider";
import {NativeUtils} from "../../providers/utils/NativeUtils";
import {Lhconfig} from "../../providers/utils/lhconfig";

/**
 * Generated class for the LogshowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logshow',
  templateUrl: 'logshow.html',
})
export class LogshowPage {
 logs=[];
 dialog;
 pageIndex=0;
  constructor(private logprovider:LogProvider,private nativeUtils:NativeUtils,private lhconfig:Lhconfig) {
    var _that=this;
    document.addEventListener('deviceready', function() {
     _that.dialog= _that.nativeUtils.lhDialog("数据查询中,请稍等...");
      _that.request(_that);
    });
  }

  request(_that){
    _that.dialog.present();
    _that.logprovider.queryLog(_that.pageIndex*_that.lhconfig.pageSize,_that.lhconfig.pageSize).then(function (data) {
      console.log("查询到数据了");
      //id integer primary key ,writeTime,type,logContent,mark
      console.log(data.rows.length);
      for (var i=0;i<data.rows.length;i++)
      {
        _that.logs.push(data.rows.item(i));
      }
      _that.dialog.dismiss();
    },function (err) {
      _that.nativeUtils.lhToast("未查询到数据...");
    });
  }

  /**
   * 上拉加载数据
   * @param infiniteScroll
   */
  doInfinite(infiniteScroll)
  {
    this.pageIndex++;
    setTimeout(() => {
      console.log('Async operation has ended');
      this.request(this);
      infiniteScroll.complete();
    }, 2000);

  }
}
