import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapShowPage } from './map-show';

@NgModule({
  declarations: [
    MapShowPage,
  ],
  imports: [
    IonicPageModule.forChild(MapShowPage),
  ],
})
export class MapShowPageModule {}
