import {Injectable} from "@angular/core";
import {File} from "@ionic-native/file";

@Injectable()
export class Lhconfig {
  base_ip="http://112.124.119.114:8738";
  APP_ID="dwzddevelop";
  logFileDir;
  dbFileDir;
  pageSize=50;
  browser={versions:function()
    {var a=navigator.userAgent,b=navigator.appVersion;
      return{trident:a.indexOf("Trident")>-1,presto:a.indexOf("Presto")>-1,
        webKit:a.indexOf("AppleWebKit")>-1,gecko:a.indexOf("Gecko")>-1&&a.indexOf("KHTML")==-1,
        mobile:!!a.match(/AppleWebKit.*Mobile.*/),ios:!!a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android:a.indexOf("Android")>-1||a.indexOf("Linux")>-1,iPhone:a.indexOf("iPhone")>-1,
        iPad:a.indexOf("iPad")>-1,webApp:a.indexOf("Safari")==-1}}()};
  constructor(private navfile:File) {
    this.logFileDir=navfile.externalRootDirectory+"lonhwin/"+this.APP_ID+"/logs";
    this.dbFileDir=navfile.externalRootDirectory+"lonhwin/"+this.APP_ID+"/db";

  // console.log("*************************1");
  //   this.navfile.createDir(navfile.externalRootDirectory, "lonhwin1",false);
  //   console.log("*************************2");
  //   this.navfile.createDir(navfile.externalRootDirectory+"/lonhwin1", this.APP_ID,false);
  //   console.log("*************************3");
  //   this.navfile.createDir(navfile.externalRootDirectory+"/lonhwin1/"+this.APP_ID, "logs",false);


  }


}
