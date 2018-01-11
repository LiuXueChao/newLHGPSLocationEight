import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {DataProvider} from "./dbData";
import {CommonUtils} from "../utils/CommonUtils";
import {Injectable} from "@angular/core";
@Injectable()
export class LogProvider {
  database: SQLiteObject;
  constructor(private dataProvider: DataProvider,private commonUtils:CommonUtils) {
    var _that=this;
    document.addEventListener('deviceready', function() {
      _that.database = dataProvider.myAppDatabase;

    });

  }
  /**
   * 插入一条日志
   *
   * @param type//1定位日志●● 2上传下载日志↑↑ ↓↓   3检测系统运行日志★★ 4网络访问异常▶◀ 5热点日志### 6上传定位数据或者定位数据▲▲  7异常数据◎◎ 8系统日志@@
   * @param logmsg
   */
  insertLogTab(type,logmsg)
  {
  this.database.executeSql('INSERT INTO lhlog VALUES (null,?, ?, ?,?);', [this.commonUtils.dateFtt("yyyy-MM-dd hh:mm:ss.S",new Date()),type,logmsg,"预留"]).then(() => console.log('insert into log table successfully')).catch(e => console.log(e));
  }

  queryLogs(){
    console.log("查询数据");
    var _that=this;
    this.database.executeSql('SELECT * FROM lhlog', []).then(data=>console.log(data)).catch(e => function () {
      console.log(e);
      _that.insertLogTab(7,"◎◎查询数据异常");
    });
  }
  queryLog(startIndex,pageSize):Promise<any>{
    console.log(startIndex+","+pageSize);
    return new Promise((resolve,reject)=>{
      var sql='SELECT * FROM lhlog   order by writeTime desc limit '+startIndex+','+pageSize+'';
      console.log(sql);
      this.database.executeSql(sql, []).then(data=>{
        resolve(data);
      }).catch(err=>{
        console.log("select err");
        console.log(err);
        reject(err);
      })
    });
  }
}
