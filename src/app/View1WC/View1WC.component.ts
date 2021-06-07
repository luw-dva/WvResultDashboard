import { dict } from './../../dictionary';
import { Component, OnInit } from '@angular/core';
import { ServiceMethod } from './../../service.method';
import { ServiceService } from './../../service.service';
import {Router, ActivatedRoute, Params} from '@angular/router'

@Component({
  selector: 'app-View1WC',
  templateUrl: './View1WC.component.html',
  styleUrls: ['./View1WC.component.css']
})

export class View1WCComponent implements OnInit {
  private sub: any;
  wynik: any;
  soapOpeartion: string;
  ent_Description_en: string;
  ent_Description_pl: string;
  interval;
  interval2;
  ent_Description_lt: string;
  ent_ProcessQtyTarget: string = '0';
  ent_ProcessTimeTarget: string  = '0';
  now: string;
  time = new Date();
  ent_ProcessTimeTargetCurrent: number  = 0;
  ent_ProcessQtyTargetCurrent: number  = 0;
  wcName: string;
  SCORE: number = 0;
  ScoreCss: string;
  serviceMethod = new ServiceMethod(this.serviceServiceLog);
  public WC_id: string ;
  public WS_id: string ;
  Langu: string = 'PL';
  mode: string = 'X';
  dataType: string = 'PT'
  lang = 0;
  dict_result: string ;
  dict_current_target: string ;
  dict_shift_target: string ;


  dictionaryChangeLanguage() {
    this.dict_result = dict.get('Wynik')[this.lang];
    this.dict_current_target = dict.get('Cel_biezacy')[this.lang];
    this.dict_shift_target = dict.get('Cel_zmianowy')[this.lang];
  }


  constructor(private serviceServiceLog: ServiceService, private activatedRoute: ActivatedRoute) {
    setInterval(() => {
      this.now = new Date().toString().split(' ')[4];
    }, 1);
  }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.WC_id = params['Workcenter'];
      this.WS_id = params['Workstation'];
      this.Langu = params['Language'];
      if (this.Langu == 'EN') this.lang = 1;
      if ( params['DataType'] == "Qty"){this.dataType = "QTY"}
      if (this.WS_id != undefined){
        this.mode = 'WS'
      }else{
        this.mode = 'WC'
      }


    });


    this.interval = setInterval(() => {this.checkUpdate();}, 60000);
    this.interval2 = setInterval(() => {this.targetCount();}, 30000);

    // setTimeout(() => this.serviceMethod.getUserData(this.WC_id, '0'), 1000);
    setTimeout(() =>  this.serviceMethod.getWcResult(this.WC_id), 3000);

    setTimeout(() => {
      this.dictionaryChangeLanguage();
    if(this.mode == 'WC'){
      this.serviceMethod.getEntAttr(parseInt(this.WC_id,));
    }
    if(this.mode == 'WS'){
      this.serviceMethod.getEntAttr(parseInt(this.WS_id,));
    }
  }
    , 1000)
    this.sub = this.serviceServiceLog.getResult().subscribe((data) => {
      this.serviceSubcribe(data);
    });
  }

  serviceSubcribe(data: any){
    this.soapOpeartion = this.serviceServiceLog.getSoapOperation();

    if (this.soapOpeartion == 'GetUserResult') {
      this.soapOpeartion = '';
      let wynikGetUserResult = data;
      if (wynikGetUserResult != 'false') {
        this.SCORE = parseInt(
        wynikGetUserResult.getElementsByTagName('Workcenter_process')[0].childNodes[0].nodeValue);
      }
    }

    if (this.soapOpeartion == 'GetEntAttr') {
      this.soapOpeartion = '';
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
              this.targetCount();
            };}catch(err){}

            try { if (wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_desc')[0].childNodes[0].nodeValue == 'ent_PiecesTarget'){
              this.ent_ProcessQtyTarget = wynikGetEntAttr.getElementsByTagName('ent_attr')[i].getElementsByTagName('attr_value')[0].childNodes[0].nodeValue
            };}catch(err){}
        }
      }
    }

    if (this.soapOpeartion == 'GetWcResult'){
      this.soapOpeartion = '';
      let wynikGetWcResult = data;

        if (wynikGetWcResult != 'false') {
          if (this.mode == 'WS'){
            try{ for (let i = 0; i < wynikGetWcResult.getElementsByTagName('NewDataSet')[0].childNodes.length; i++) {
              if(wynikGetWcResult.getElementsByTagName('directaccess')[i].getElementsByTagName('ent_id')[0].childNodes[0].nodeValue == this.WS_id){
                this.SCORE = parseInt(wynikGetWcResult.getElementsByTagName('directaccess')[i].getElementsByTagName(this.dataType)[0].childNodes[0].nodeValue)}
            }
          }catch(err){}
        }
        if (this.mode == 'WC'){
          this.SCORE = 0;
          try{ for (let i = 0; i < wynikGetWcResult.getElementsByTagName('NewDataSet')[0].childNodes.length; i++) {
            this.SCORE += parseInt(wynikGetWcResult.getElementsByTagName('directaccess')[i].getElementsByTagName(this.dataType)[0].childNodes[0].nodeValue)}
        }catch(err){}
        }
      }
    }
  }

  targetCount(){
    let time = new Date();
    let xhours = time.getHours();
    if (this.dataType == 'PT'){
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
        this.ent_ProcessTimeTargetCurrent = Math.floor(parseInt(this.ent_ProcessTimeTarget)*(((xhours*60 + time.getMinutes() + 120) )/480));
        }

        if(this.SCORE > this.ent_ProcessTimeTargetCurrent){
          this.ScoreCss = "ScorePTok";
        }else{
          this.ScoreCss ="ScorePTnok";
        }
    }

    if (this.dataType == 'QTY'){
      if(xhours >= 6 && xhours < 14){
      this.ent_ProcessQtyTargetCurrent = Math.floor(parseInt(this.ent_ProcessQtyTarget)*(((xhours*60 + time.getMinutes()) - 360)/480));
      }

      if(xhours >= 14 && xhours < 22){
        this.ent_ProcessQtyTargetCurrent = Math.floor(parseInt(this.ent_ProcessQtyTarget)*(((xhours*60 + time.getMinutes()) - 840)/480));
        }

      if(xhours >= 22){
        this.ent_ProcessQtyTargetCurrent = Math.floor(parseInt(this.ent_ProcessQtyTarget)*(((xhours*60 + time.getMinutes()) - 1320)/480));
        }

      if(xhours < 6){
        this.ent_ProcessQtyTargetCurrent = Math.floor(parseInt(this.ent_ProcessQtyTarget)*(((xhours*60 + time.getMinutes() + 120) )/480));
        }

      if(this.SCORE > this.ent_ProcessQtyTargetCurrent){
          this.ScoreCss = "ScorePTok";
        }else{
          this.ScoreCss ="ScorePTnok";
        }
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
