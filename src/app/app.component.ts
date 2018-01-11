import {Component, ViewChild} from '@angular/core';
import {IonicApp, Keyboard, Nav, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {WelcomePage} from "../pages/welcome/welcome";
import {MapShowPage} from "../pages/map-show/map-show";
import {ReportContentPage} from "../pages/report-content/report-content";
import {HomePage} from "../pages/home/home";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: Nav;//根应用程序组件无法注入NavController， 通过@ViewChild引用变量myNav来获取Nav组件的实例，该实例是导航控制器（它扩展NavController）

  private rootPage:any  =WelcomePage;
  private backButtonPressed: boolean = false;  //用于判断返回键是否触发

  constructor(
    private  platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private ionicApp:IonicApp,
    private toastCtrl:ToastController,
    private keyboard:Keyboard
    // private nativeService:NativeService,
    // private broadcaster:Broadcaster
  ){
    platform.ready().then(() => {
      this.registerBackButtonAction();
      statusBar.styleDefault();
      splashScreen.hide();
    });

  }
  //注册安卓物理返回键
  private registerBackButtonAction() {
    var _that=this;
    this.platform.registerBackButtonAction(() => {
      //如果有弹窗或loading，返回键什么也不做
      console.log(_that);
      console.log(_that.ionicApp);
      let activeLoading = _that.ionicApp._loadingPortal.getActive();
      let activeOverlay = _that.ionicApp._overlayPortal.getActive();
      console.log("@@@@@@@@@@@@@@@")
      console.log(activeLoading);
      console.log(activeOverlay);
      if (activeLoading) {
        activeLoading.dismiss().catch(()=>{
        });
        return;
      }
      if(activeOverlay){
        activeOverlay.dismiss().catch(()=>{
        });
        return ;
      }
      //处理modal
      let activeModal = _that.ionicApp._modalPortal.getActive();
      if (activeModal) {
        activeModal.dismiss().catch(() => {
        });
        activeModal.onDidDismiss(() => {
        });
        return;
      }
      // this.nativeService.hideLoading();
      if(_that.keyboard.isOpen()){
        _that.keyboard.close();
      }
      if(_that.nav.canGoBack()){
        return _that.nav.pop();
      }
      // 返回当前活动页面的视图控制器
      let activeVC = this.nav.getActive();
      let page = activeVC.instance;

      if (page instanceof WelcomePage || page instanceof HomePage || !_that.nav.canGoBack()) {
        return _that.showExit();
      }
      return _that.nav.pop();
    }, 1);
  }

  /**
   *
   * **/双击退出App提示框
  private showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'top'
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }

  /**
   * todo 语音监听android 音视频通话结果
   * @requires liveAudioVedio
   * **/
  // private liveAudioVedioBroadcast():void{
  //   this.broadcaster.addEventListener('liveAudioVedio').subscribe((event) =>{
  //     console.log("liveAudioVedioBroadcast:",'color:blue',event);
  //   });
  // }
}

