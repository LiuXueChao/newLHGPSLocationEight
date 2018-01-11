import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogshowPage } from './logshow';

@NgModule({
  declarations: [
    LogshowPage,
  ],
  imports: [
    IonicPageModule.forChild(LogshowPage),
  ],
})
export class LogshowPageModule {}
