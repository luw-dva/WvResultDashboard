import { dict } from './../../dictionary';
import { Component, OnInit } from '@angular/core';
import { ServiceMethod } from './../../service.method';
import { ServiceService } from './../../service.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { single } from './chartData';

@Component({
  selector: 'app-FactoryView1WC',
  templateUrl: './FactoryView1WC.component.html',
  styleUrls: ['./FactoryView1WC.component.css']
})

export class FactoryView1WCComponent implements OnInit {

  now: string;
  SCORE: number = 0;
  FactoryCurrentTarget: number = 0;
  FactoryTarget: number = 0;
  interval;
  sub;
  interval2;
  initial = 0
  ent_ProcessTimeTargetCurrent;
  ent_ProcessTimeTarget;
  soapOpeartion;
  serviceMethod = new ServiceMethod(this.serviceServiceLog);
  Arr = Array;
  numberOfEntities;
  Factory: string;
  Factory_number: number;
  Results: any[][] = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

  constructor(private serviceServiceLog: ServiceService, private activatedRoute: ActivatedRoute) {
    setInterval(() => {
      this.now = new Date().toString().split(' ')[4];
    }, 1);
    Object.assign(this, { single });
  }

    Langu: string = 'PL';
  lang = 0;
  dict_result: string ;
  dict_current_target: string ;
  dict_shift_target: string ;
  dict_wc: string ;
  dict_chart: string;


  dictionaryChangeLanguage() {
    this.dict_result = dict.get('Wynik')[this.lang];
    this.dict_current_target = dict.get('Cel_biezacy')[this.lang];
    this.dict_shift_target = dict.get('Cel_zmianowy')[this.lang];
    this.dict_wc = dict.get('WC')[this.lang];
    this.dict_wc = dict.get('Wykres')[this.lang];
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.Factory = params['Factory'];
      this.Langu = params['Language'];
      if (this.Langu == 'EN') this.lang = 1;
    });

    this.setFactoryNumber();

    this.serviceMethod.getEntAttr(this.Factory_number);

    setTimeout(() => {this.serviceMethod.getFactoryResult(this.Factory_number);
      this.dictionaryChangeLanguage();}, 3000);

     this.interval = setInterval(() => {this.checkUpdate();}, 60000);
     this.interval2 = setInterval(() => {this.CurrentTarget();}, 5000);

     this.sub = this.serviceServiceLog.getResult().subscribe((data) => {
      this.serviceSubcribe(data);
    });

  }

  serviceSubcribe(data: any){
    this.soapOpeartion = this.serviceServiceLog.getSoapOperation();
    if (this.soapOpeartion == 'GetFactoryResult') {
      this.soapOpeartion = '';
      let wynikFactroyResult = data;
        try {
          if (wynikFactroyResult != 'false') {

            this.SCORE = 0
            let numberofEnt =  wynikFactroyResult.getElementsByTagName('NewDataSet')[0].childNodes.length;
            this.numberOfEntities = numberofEnt;
            for (let i = 0; i < numberofEnt; i++) {
                let wsScore = parseInt(wynikFactroyResult.getElementsByTagName('directaccess')[i].getElementsByTagName('PT')[0].childNodes[0].nodeValue)
                this.SCORE += wsScore;
                //ent name
                this.Results[i][2] = wynikFactroyResult.getElementsByTagName('directaccess')[i].getElementsByTagName('ent_name')[0].childNodes[0].nodeValue;
                //result
                this.Results[i][0] = wsScore;
                //qty
                this.Results[i][1] = parseInt(wynikFactroyResult.getElementsByTagName('directaccess')[i].getElementsByTagName('QTY')[0].childNodes[0].nodeValue);

                // za pierwszym razem pobierz ent_attr
                if (this.initial == 0) {
                  this.serviceMethod.getEntAttr( wynikFactroyResult.getElementsByTagName('directaccess')[i].getElementsByTagName('ent_id')[0].childNodes[0].nodeValue, i);
                 }
                 if(this.Results[i][2] == 'T5000091'){
                   i--;
                   numberofEnt--;
                   this.numberOfEntities--;
                 }
               }
              this.targetCountWC();
              this.initial = 1;


          }
        } catch (error) {console.log(error);}
      }

      if (this.soapOpeartion.substring(0,10) == 'GetEntAttr') {

        let wynikGetEntAttr = data;
        let k = this.soapOpeartion.substr(10,3);
        if(k.length > 0){

          this.soapOpeartion = '';
          if (wynikGetEntAttr != 'false') {
            for (let i = 0; i < wynikGetEntAttr.getElementsByTagName('NewDataSet')[0].childNodes.length; i++) {


                try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_Description_en'){
                  this.Results[k][3] = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
                };}catch(err){}

                try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_Plant'){
                  this.Results[k][4] =  wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('ent_name')[0].childNodes[0].nodeValue
                };}catch(err){}

                try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_Description_lt'){
                  this.Results[k][5] = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
                };}catch(err){}

                try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_ProcessTimeTarget'
                ){
                  this.Results[k][6] = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
             //     this.targetCount();
                };}catch(err){}
              }
            }
      }else{
        for (let i = 0; i < wynikGetEntAttr.getElementsByTagName('NewDataSet')[0].childNodes.length; i++) {

        try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_ProcessTimeTarget'){
          this.ent_ProcessTimeTarget = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
          this.targetCount();
        };}catch(err){}
      }
    }
    }
  }

  setFactoryNumber(){
    if (this.Factory == 'T7') this.Factory_number = 71;
    if (this.Factory == 'T5') this.Factory_number = 2;
    if (this.Factory == 'T4') this.Factory_number = 146;
    if (this.Factory == 'T3') this.Factory_number = 87;
    if (this.Factory == 'T2') this.Factory_number = 549;
    if (this.Factory == 'T1') this.Factory_number = 551;
    if (this.Factory == 'VS') this.Factory_number = 249;
  }

  targetCountWC(){

    let time = new Date();
    let xhours = time.getHours();

    for (let i=0; i < this.numberOfEntities; i++){
    if(xhours >= 6 && xhours < 14){
      this.Results[i][7] = Math.floor(parseInt(this.Results[i][6])*(((xhours*60 + time.getMinutes() + time.getSeconds()/60) - 360 )/480));
    }

    if(xhours >= 14 && xhours < 22){
      this.Results[i][7] = Math.floor(parseInt(this.Results[i][6])*(((xhours*60 + time.getMinutes() + time.getSeconds()/60) - 840)/480));
      }

    if(xhours >= 22){
      this.Results[i][7] = Math.floor(parseInt(this.Results[i][6])*(((xhours*60 + time.getMinutes() + time.getSeconds()/60) - 1320)/480));
      }

    if(xhours < 6){
      this.Results[i][7] = Math.floor(parseInt(this.Results[i][6])*(((xhours*60 + time.getMinutes() + 120 + time.getSeconds()/60) )/480));
      }

    if(this.Results[i][0] > this.Results[i][7]){
      this.Results[i][8] = "ScorePTok";
    }else{
      this.Results[i][8] ="ScorePTnok";
    }
    }

  }

  targetCount(){
    let time = new Date();
    let xhours = time.getHours();
   // console.log("Factory target: " + this.ent_ProcessTimeTargetCurrent);
    if(xhours >= 6 && xhours < 14){
    this.ent_ProcessTimeTargetCurrent = Math.floor(parseInt(this.ent_ProcessTimeTarget)*(((xhours*60 + time.getMinutes() + time.getSeconds()/60) - 360)/480));
    }

    if(xhours >= 14 && xhours < 22){
      this.ent_ProcessTimeTargetCurrent = Math.floor(parseInt(this.ent_ProcessTimeTarget)*(((xhours*60 + time.getMinutes()) - 840)/480));
      }

    if(xhours >= 22){
      this.ent_ProcessTimeTargetCurrent = Math.floor(parseInt(this.ent_ProcessTimeTarget)*(((xhours*60 + time.getMinutes()) - 1320)/480));
      }

    if(xhours < 6){
      this.ent_ProcessTimeTargetCurrent = Math.floor(parseInt(this.ent_ProcessTimeTarget)*(((xhours*60 + time.getMinutes() + 120) )/480));
      }
    }

  CurrentTarget(){
    this.targetCountWC();
    this.targetCount();
  }

  ngOnDestroy() {
   // this.sub.unsubscribe();

    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.interval2) {
      clearInterval(this.interval2);
    }
  }

  checkUpdate(){
    setTimeout(() => this.serviceMethod.getFactoryResult(this.Factory_number), 3000);
  }

  //############ CHART #################

  single: any[];
  view: any[] = [300, 75];

  // options
  showXAxis: boolean = true;
  gradient: boolean = false;
  color1: string = '#8ac926'
  color2: string = '#a9d6e5'
  color3: string = '#1a759f'

  colorScheme = {
    domain: [this.color1, this.color2, this.color3]
  };
}

