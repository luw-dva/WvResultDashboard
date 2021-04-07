import { Component, OnInit } from '@angular/core';
import { ServiceMethod } from './../../service.method';
import { ServiceService } from './../../service.service';
import {Router, ActivatedRoute, Params} from '@angular/router'

@Component({
  selector: 'app-View3WC',
  templateUrl: './View3WC.component.html',
  styleUrls: ['./View3WC.component.css']
})

export class View3WCComponent implements OnInit {
  private sub: any;
  workstationData: any[][] = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
  wynik: any;
  soapOpeartion: string;
  ent_Description_en: string;
  ent_Description_pl: string;
  interval;
  interval2;
  Arr = Array;
  ent_Description_lt;
  ent_ProcessTimeTarget;
  SCORE: number = 0;
  now: string;
  layout: number = 1;
  time = new Date();
  ent_ProcessTimeTargetCurrent;
  wcName: string;
  ScoreCss: string;
  serviceMethod = new ServiceMethod(this.serviceServiceLog);
  public WC_id: string ;
  public WS_id: string ;
  mode: string = 'X';
  numberOfEntities: number = 0;

  fontsizeCSS;
  j: number = 0;

  constructor(private serviceServiceLog: ServiceService, private activatedRoute: ActivatedRoute) {
    setInterval(() => {
      this.now = new Date().toString().split(' ')[4];
    }, 1);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.WC_id = params['Workcenter'];
    });

     this.interval = setInterval(() => {this.checkUpdate();}, 60000);
     this.interval2 = setInterval(() => {this.targetCount(); this.targetCount2}, 5000);

    setTimeout(() => this.serviceMethod.getEntAttr(parseInt(this.WC_id,)), 1000);
    setTimeout(() => this.serviceMethod.getWcResult(this.WC_id), 3000);

    this.sub = this.serviceServiceLog.getResult().subscribe((data) => {
      this.serviceSubcribe(data);
    });
  }

  serviceSubcribe(data: any){
    this.soapOpeartion = this.serviceServiceLog.getSoapOperation();

    if (this.soapOpeartion.substring(0,10) == 'GetEntAttr') {

      let wynikGetEntAttr = data;
      let k = this.soapOpeartion.substr(10,3);

      if(k.length > 0){

      this.soapOpeartion = '';
      if (wynikGetEntAttr != 'false') {
        for (let i = 0; i < wynikGetEntAttr.getElementsByTagName('NewDataSet')[0].childNodes.length; i++) {
            try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_Description_en'){
              this.workstationData[k][1] = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
            };}catch(err){}

            try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_Plant'){
              let nameWS =  wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('ent_name')[0].childNodes[0].nodeValue
              if (nameWS.substr(nameWS.length - 2).substr(0,1) >= 0){
                this.workstationData[k][2] ="|"+ nameWS.substr(nameWS.length - 2) + "|";
              }else{
                this.workstationData[k][2] ="|"+ nameWS.substr(nameWS.length - 1)  + "|";
                }
            };}catch(err){}

            try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_Description_lt'){
              this.workstationData[k][3] = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
            };}catch(err){}

            try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_ProcessTimeTarget'
            ){
              this.workstationData[k][4] = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
              this.targetCount();
            };}catch(err){}
          }
        }
      }else{
        let wynikGetEntAttr = data;
        if (wynikGetEntAttr != 'false') {
          for (let i = 0; i < wynikGetEntAttr.getElementsByTagName('NewDataSet')[0].childNodes.length; i++) {
              try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_Description_en'){
                this.ent_Description_en = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
              };}catch(err){}

              try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_Description_pl'){
                this.ent_Description_pl = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
              };}catch(err){}

              try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_Description_lt'){
                this.ent_Description_lt = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
              };}catch(err){}

              try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_ProcessTimeTarget'){
                this.ent_ProcessTimeTarget = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
                this.targetCount2();
              };}catch(err){}
          }
        }
      }
    }

    if (this.soapOpeartion == 'GetWcResult'){
      this.soapOpeartion = '';
      let wynikGetWcResult = data;
      try {
        if (wynikGetWcResult != 'false') {
          this.j = 0
          this.SCORE = 0
          let numberofEnt =  wynikGetWcResult.getElementsByTagName('NewDataSet')[0].childNodes.length;
          for (let i = 0; i < numberofEnt; i++) {
              let wsScore = parseInt(wynikGetWcResult.getElementsByTagName('directaccess')[i].getElementsByTagName('PT')[0].childNodes[0].nodeValue)
              this.SCORE += wsScore;
              this.workstationData[i][0] = wsScore;
            if(numberofEnt !=  this.numberOfEntities ){
                let entId = wynikGetWcResult.getElementsByTagName('directaccess')[i].getElementsByTagName('ent_id')[0].childNodes[0].nodeValue;
                this.serviceMethod.getEntAttr(entId, this.j);
                this.j++;
            }
          }
            this.numberOfEntities = numberofEnt;
            if (this.numberOfEntities < 3){
              if(this.numberOfEntities == 1){this.layout=1}else{this.layout=2}
              this.fontsizeCSS = 150
            }else{
              this.layout = 3;
              this.fontsizeCSS = 250/Math.floor((this.numberOfEntities+1)/2) + 20
            }
        }
      } catch (error) {}
    }
  }

  targetCount(){
    let time = new Date();
    let xhours = time.getHours();
    for(let i = 0; i < this.numberOfEntities; i++){
      if(xhours >= 6 && xhours < 14){
        this.workstationData[i][5] = Math.floor(parseInt(this.workstationData[i][4])*(((xhours*60 + time.getMinutes()) - 360)/480));
      }

      if(xhours >= 14 && xhours < 22){
        this.workstationData[i][5]  = Math.floor(parseInt(this.workstationData[i][4])*(((xhours*60 + time.getMinutes()) - 840)/480));
        }

      if(xhours >= 22){
        this.workstationData[i][5]  = Math.floor(parseInt(this.workstationData[i][4])*(((xhours*60 + time.getMinutes()) - 1320)/480));
        }

      if(xhours < 6){
        this.workstationData[i][5]  = Math.floor(parseInt(this.workstationData[i][4])*(((xhours*60 + time.getMinutes()) )/480));
        }

      if(this.workstationData[i][0] > this.workstationData[i][5]){
        this.workstationData[i][6]  = "ScorePTok";
      }else{
        this.workstationData[i][6]  ="ScorePTnok";
      }
    }
  }
  targetCount2(){
    let time = new Date();
    let xhours = time.getHours();
    if(xhours >= 6 && xhours < 14){
    this.ent_ProcessTimeTargetCurrent = Math.floor(parseInt(this.ent_ProcessTimeTarget)*(((xhours*60 + time.getMinutes()) - 360)/480));
    }

    if(xhours >= 14 && xhours < 22){
      this.ent_ProcessTimeTargetCurrent = Math.floor(parseInt(this.ent_ProcessTimeTarget)*(((xhours*60 + time.getMinutes()) - 840)/480));
      }

    if(xhours >= 22){
      this.ent_ProcessTimeTargetCurrent = Math.floor(parseInt(this.ent_ProcessTimeTarget)*(((xhours*60 + time.getMinutes()) - 1320)/480));
      }

    if(xhours < 6){
      this.ent_ProcessTimeTargetCurrent = Math.floor(parseInt(this.ent_ProcessTimeTarget)*(((xhours*60 + time.getMinutes()) )/480));
      }

    if(this.SCORE > this.ent_ProcessTimeTargetCurrent){
      this.ScoreCss = "ScorePTok";
    }else{
      this.ScoreCss ="ScorePTnok";
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();

    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.interval2) {
      clearInterval(this.interval2);
    }
  }

  checkUpdate(){
    setTimeout(() => this.serviceMethod.getWcResult(this.WC_id), 3000);
  }
}
