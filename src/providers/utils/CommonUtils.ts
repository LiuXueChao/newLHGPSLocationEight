import {Injectable} from "@angular/core";

@Injectable()
export class CommonUtils {
  constructor() {
  }
  /**************************************时间格式化处理************************************/
  dateFtt(fmt, date) { //author: meizz
    var o = {
      "M+": date.getMonth() + 1,                 //月份
      "d+": date.getDate(),                    //日
      "h+": date.getHours(),                   //小时
      "m+": date.getMinutes(),                 //分
      "s+": date.getSeconds(),                 //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  /**
   * 根据类型编码返回类型
   * @param type
   * @returns {string}
   */
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


  /**
   * 得到15位adcd
   * @param adcd
   * @returns {any}
   */
  get15Adcd(adcd) {
    if (adcd == null || adcd.length < 1 || adcd.length == 15) {
      return adcd;
    }
    let tem = "";
    for (var i = 0; i < (15 - adcd.length); i++) {
      tem += "0";
    }

    return adcd + tem;
  }

  /**
   * 根据Adcd获取级别,15位的行政区划
   */
  getLevelByAdcd(madcd) {
    if (madcd == null || madcd == "") {
      return 1;
    }
    let adcd = this.get15Adcd(madcd);
    if (adcd.substring(2, 5) == "000") {
      return 1;//省
    }
    if (adcd.substring(4, 7) == "000") {
      return 2;//市
    }
    if (adcd.substring(6, 9) == "000") {
      return 3;//县
    }
    if (adcd.substring(9, 12) == "000") {
      return 4;//乡镇
    }
    if (adcd.substring(12, 15) == "000") {
      return 5;//行政村
    }
    return 5;
  }
}
