import {Injectable} from "@angular/core";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

@Injectable()
export class DataProvider{
  myAppDatabase: SQLiteObject;
  constructor(private sqlite: SQLite) {
    this.initDatabase()
  }
  /**
   * 初始化数据库
   */
  initDatabase() {
    var _that=this;
    this.sqlite.create({
      name: 'lhdata.db',
      location:"default"
    }).then((database: SQLiteObject) => {
      _that.myAppDatabase = database;//AUTOINCREMENT
      database.executeSql('CREATE TABLE IF NOT EXISTS lhlog(id integer primary key ,writeTime,type,logContent,mark)', {}).then(() => console.log('init database successfully')).catch(e => console.log(e));
    })
  }
}
