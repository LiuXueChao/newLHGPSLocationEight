import {Injectable} from "@angular/core";
import {AlertController, LoadingController} from "ionic-angular";
import {Toast} from "@ionic-native/toast";
import {Network} from "@ionic-native/network";
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {File} from "@ionic-native/file";
import {PhotoViewer} from "@ionic-native/photo-viewer";
@Injectable()
export class NativeUtils {
  isConnection = false;//网络状态，为false无网络，为true连接网络
  uuid: "";

  constructor(public loadingCtrl: LoadingController, private toast: Toast, private network: Network, public uniqueDeviceID: UniqueDeviceID,private  file:File,private photoViewer:PhotoViewer,public alertCtrl: AlertController) {
   this.checkNet();
    //获取uuid
    uniqueDeviceID.get()
      .then((uuid: any) => this.uuid = uuid)
      .catch((error: any) => console.log(error));

  }

  /**
   * 弹出框
   * @param title
   * @param msg
   * @param buttonText
   */
  showAlert(title,msg,buttonText) {
    let alert = this.alertCtrl.create({
      title:title,
      subTitle: msg,
      buttons: [buttonText]
    });
    alert.present();
  }

  /**
   * 加载框
   * @param msg
   * @returns {Loading}
   */
  lhDialog(msg) {
    return this.loadingCtrl.create({
      content: msg,
      dismissOnPageChange: true
    });
  }

  /**
   * 加载框 time 秒后自动关闭
   * @param msg
   * @param time
   * @returns {Loading}
   */
  lhDialogForTime(msg, time) {
    return this.loadingCtrl.create({
      content: msg,
      duration: time,
      dismissOnPageChange: true
    });
  }

  /**
   * tost
   * @param msg
   * @returns {Observable<any>}
   */
  lhToast(msg) {
    return this.toast.show(msg, '3000', 'center');
  }

  /**
   * 监控网络状态
   */
  checkNet() {
    var _that = this;
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      _that.isConnection = false;
    });
//     disconnectSubscription.unsubscribe();
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('we got a wifi connection, woohoo!');
      _that.isConnection = true;
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          _that.isConnection = true;
        }
      }, 3000);
    });
    // connectSubscription.unsubscribe();
  }

  //################################################################文件相关####################
  createDirectory(rootDirEntry) {
    rootDirEntry.getDirectory('NewDirInRoot', {create: true}, function (dirEntry) {
      dirEntry.getDirectory('images', {create: true}, function (subDirEntry) {

        this.createFile(subDirEntry, "fileInNewSubDir.txt", false);

      }, this.onErrorGetDir);
    }, this.onErrorGetDir);
  }

  onErrorGetDir(error) {
    console.log(error);
  }

  //######################################################################展示大图##############################
  /**
   * 展示大图
   * @param path
   */
  photoViewerShow(path){
    this.photoViewer.show(path, '图片附件', {share: false});
  }
}

