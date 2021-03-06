import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})

export class DataService {

  constructor() {
  }

  private lang = new Subject<number>();
  private language:number = 0;
  private userName:string;
  private userPcs:string;
  private lockWoData:any;
  private WO: string;
  private xml;
  private blockJust2Check: boolean = false;
  private userProcess:string;
  private entName:string;
  private blocks: Array<{ item: string; message: string; pos: string; qConfirm: string }>;
  private entId:string;
  private entParentName: string;
  private Can_confirm_single_orders:string;
  private Ask_for_steps:string;
  private Store_products_attr:string;
  private Can_type_location:string;
  private Allow_static_location: string;

  setLanguage(num:number){
        this.language = num;
        this.lang.next(num);
  }

  getLanguage(): Observable<number> {
    return this.lang.asObservable();
  }

  setXml(num){
    this.xml = num;
}

getXml() {
return this.xml;
}

  setBlocks(block: Array<{ item: string; message: string; pos: string; qConfirm: string}>){
    this.blocks = block;
}

  getBlocks(): Array<{ item: string; message: string; pos: string, qConfirm: string}> {
      return this.blocks;
  }

  getLanguageFirstTime(): number {
    return this.language;
  }

  setEntName(name:string){
    this.entName = name;
  }

  getEntName(){
    return this.entName;
  }

  setWo(name:string){
    this.WO = name;
  }

  getWo(){
    return this.WO;
  }

  setBlockJust2Check(name:boolean){
    this.blockJust2Check = name;
  }

  getBlockJust2Check(){
    return this.blockJust2Check;
  }

  setLockWoData(name:any){
    this.lockWoData = name;
  }

  getLockWoData(){
    return this.lockWoData;
  }

  setUserPcs(name:string){
    this.userPcs = name;
  }

  getUserPcs(){
    return this.userPcs;
  }

  setUserProcess(name:string){
    this.userProcess = name;
  }

  getUserProcess(){
    return this.userProcess;
  }

  setEntId(name:string){
    this.entId = name;
  }

  getEntId(): string{
    return this.entId;
  }

  setEntParentName(name:string){
    this.entParentName = name;
  }

  getEntParentName(){
    return this.entParentName;
  }

  setAskForSteps(name:string){
    this.Ask_for_steps = name;
  }

  getAskForSteps(){
    return this.Ask_for_steps;
  }

  setCanConfirmSingleOrders(name:string){
    this.Can_confirm_single_orders = name;
  }

  getCanConfirmSingleOrders(){
    return this.Can_confirm_single_orders;
  }

  setStoreProductsAttr(name:string){
    this.Store_products_attr = name;
  }

  getStoreProductsAttr(){
    return this.Store_products_attr;
  }

  setCanTypeLocation(name:string){
    this.Can_type_location = name;
  }

  getCanTypeLocation(){
    return this.Can_type_location;
  }

  setAllowStaticLocation(name:string){
    this.Allow_static_location = name;
  }

  getAllowStaticLocation(){
    return this.Allow_static_location;
  }

  setUserName(name:string){
    this.userName = name;
  }

  getUserName(){
    return this.userName;
  }
}
