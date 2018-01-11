import { NgModule } from '@angular/core';
import { LhbaiduComponent } from './lhbaidu/lhbaidu';
import { BrowserModule } from '@angular/platform-browser';
import {LogProvider} from "../providers/db/logProvider";
@NgModule({
	declarations: [LhbaiduComponent],
	imports: [BrowserModule],/** 解决在组件模块引用angular**/
	exports: [LhbaiduComponent]
})
export class ComponentsModule {}
