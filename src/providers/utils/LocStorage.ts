import {Injectable} from "@angular/core";
import {Lhconfig} from "./lhconfig";
import {CommonUtils} from "./CommonUtils";
@Injectable()
 export class LocStorage{

   constructor(private lhconfig:Lhconfig,private commonUtils:CommonUtils) {

   }




   /**
    * 保存临时数据
    * @param key
    * @param vue
    */
   saveItem(key,value){
     localStorage.setItem(key, JSON.stringify(value));
   }

   /**
    * 获取数据
    * @param key
    */
   getItem(key){
     let value: string = localStorage.getItem(key);
     if (value != "undefined" && value != "null"&&value!="") {
       return JSON.parse(value);
     }
     return null;
     // return JSON.parse(localStorage.getItem(key));
   }
  /**
   * 根据类名和key读取一个实例
   * @param {string} key
   * @returns {T}
   */
  read<T>(key: string): T {
    let value: string = localStorage.getItem(key);
    if (value && value != "undefined" && value != "null"&&value!="") {
      return <T>JSON.parse(value);
    }
    return null;
  }
   /**
    * 清除所有数据
    */
   clearData(){
     localStorage.clear();
   }

   /**
    * 移除指定key
    * @param key
    */
   removeItem(key){
     localStorage.removeItem(key);
   }

 }
