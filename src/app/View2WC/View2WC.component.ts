import { dict } from './../../dictionary';
import { Component, OnInit } from '@angular/core';
import { ServiceMethod } from './../../service.method';
import { ServiceService } from './../../service.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-View2WC',
  templateUrl: './View2WC.component.html',
  styleUrls: ['./View2WC.component.css'],
})
export class View2WCComponent implements OnInit {
  private sub: any;
  wynik: any;
  soapOpeartion: string;
  ent_Description_en: string;
  ent_Description_pl: string;
  ent_Description_lt: string;
  ent_ProcessTimeTarget: string = '0';
  ent_ProcessTimeTargetCurrent: number = 0;
  WC_id: string;
  WS_id: string;
  now: string;
  interval;
  interval2;
  xyz: number = 0;
  wcName: string;
  SCORE: number = 0;
  ScoreCss: string;
  serviceMethod = new ServiceMethod(this.serviceServiceLog);
  WC_id2: string;
  WS_id2: string;
  SCORE2: number = 0;
  ScoreCss2: string;
  mode: string;
  ent_Description_en2: string;
  ent_Description_pl2: string;
  ent_Description_lt2: string;
  ent_ProcessTimeTarget2: string = '0';
  ent_ProcessTimeTargetCurrent2: number = 0;

  constructor(
    private serviceServiceLog: ServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    setInterval(() => {
      this.now = new Date().toString().split(' ')[4];
    }, 1);
  }

  Langu: string = 'PL';
  lang = 0;
  dict_result: string ;
  dict_current_target: string ;
  dict_shift_target: string ;


  dictionaryChangeLanguage() {
    this.dict_result = dict.get('Wynik')[this.lang];
    this.dict_current_target = dict.get('Cel_biezacy')[this.lang];
    this.dict_shift_target = dict.get('Cel_zmianowy')[this.lang];
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.WC_id = params['Workcenter'];
      this.WC_id2 = params['Workcenter2'];
      this.WS_id = params['Workstation'];
      this.WS_id2 = params['Workstation2'];
      this.Langu = params['Language'];
      if (this.Langu == 'EN') this.lang = 1;
      if (this.WS_id != undefined){
        this.mode = 'WS'
      }else{
        this.mode = 'WC'
      }
    });

    this.interval = setInterval(() => {
      this.checkUpdate();
    }, 60000);

    this.interval2 = setInterval(() => {
      this.targetCount();
    }, 30000);

    setTimeout(() => {
      this.dictionaryChangeLanguage();
    if(this.mode == 'WC'){
      this.serviceMethod.getEntAttr(parseInt(this.WC_id), 1)
      this.serviceMethod.getEntAttr(parseInt(this.WC_id2), 2)
    }
    if(this.mode == 'WS'){
      this.serviceMethod.getEntAttr(parseInt(this.WS_id), 1)
      this.serviceMethod.getEntAttr(parseInt(this.WS_id2), 2)
    }
  }
    , 1000)

    setTimeout(() => this.serviceMethod.getWcResult(this.WC_id, 1), 2000);
    setTimeout(() => this.serviceMethod.getWcResult(this.WC_id2, 2), 4000);

    this.sub = this.serviceServiceLog.getResult().subscribe((data) => {
      this.serviceSubscribe(data);
    });
  }

  serviceSubscribe(data:any ){
      this.soapOpeartion = this.serviceServiceLog.getSoapOperation();

      if (this.soapOpeartion == 'GetUserResult1') {
        let dataGetUserResult = data;
        this.soapOpeartion = '';
        if (dataGetUserResult != 'false') {
          this.SCORE = parseInt(
            dataGetUserResult.getElementsByTagName('Workcenter_process')[0]
              .childNodes[0].nodeValue
          );
        }
      }

      if (this.soapOpeartion == 'GetUserResult2') {
        let dataGetUserResult = data;
        this.soapOpeartion = '';
        if (this.wynik != 'false') {
          dataGetUserResult = parseInt(
            dataGetUserResult.getElementsByTagName('Workcenter_process')[0]
              .childNodes[0].nodeValue
          );
        }
      }

       if (this.soapOpeartion == 'GetEntAttr1') {
        let dataGetEntAttr = data;
        this.soapOpeartion = '';
        if (dataGetEntAttr != 'false') {
          for (
            let i = 0;
            i <
            dataGetEntAttr.getElementsByTagName('NewDataSet')[0].childNodes.length;
            i++
          ) {
            try {
              if (
                dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName('attr_desc')[0].childNodes[0]
                  .nodeValue == 'ent_Description_en'
              ) {
                this.ent_Description_en = dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName(
                    'attr_value'
                  )[0].childNodes[0].nodeValue;
              }
            } catch (err) {}

            try {
              if (
                dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName('attr_desc')[0].childNodes[0]
                  .nodeValue == 'ent_Description_pl'
              ) {
                this.ent_Description_pl = dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName(
                    'attr_value'
                  )[0].childNodes[0].nodeValue;
              }
            } catch (err) {}

            try {
              if (
                dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName('attr_desc')[0].childNodes[0]
                  .nodeValue == 'ent_Description_lt'
              ) {
                this.ent_Description_lt = dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName(
                    'attr_value'
                  )[0].childNodes[0].nodeValue;
              }
            } catch (err) {}

            try {
              if (
                dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName('attr_desc')[0].childNodes[0]
                  .nodeValue == 'ent_ProcessTimeTarget'
              ) {
                this.ent_ProcessTimeTarget = dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName(
                    'attr_value'
                  )[0].childNodes[0].nodeValue;
              }
            } catch (err) {}
          }
        }
      }

      if (this.soapOpeartion == 'GetEntAttr2') {
        let dataGetEntAttr = data;
        this.soapOpeartion = '';
        if (dataGetEntAttr != 'false') {
          for (
            let i = 0;
            i <
            dataGetEntAttr.getElementsByTagName('NewDataSet')[0].childNodes.length;
            i++
          ) {
            try {
              if (
                dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName('attr_desc')[0].childNodes[0]
                  .nodeValue == 'ent_Description_en'
              ) {
                this.ent_Description_en2 = dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName(
                    'attr_value'
                  )[0].childNodes[0].nodeValue;
              }
            } catch (err) {}

            try {
              if (
                dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName('attr_desc')[0].childNodes[0]
                  .nodeValue == 'ent_Description_pl'
              ) {
                this.ent_Description_pl2 = dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName(
                    'attr_value'
                  )[0].childNodes[0].nodeValue;
              }
            } catch (err) {}

            try {
              if (
                dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName('attr_desc')[0].childNodes[0]
                  .nodeValue == 'ent_Description_lt'
              ) {
                this.ent_Description_lt2 = dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName(
                    'attr_value'
                  )[0].childNodes[0].nodeValue;
              }
            } catch (err) {}

            try {
              if (
                dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName('attr_desc')[0].childNodes[0]
                  .nodeValue == 'ent_ProcessTimeTarget'
              ) {
                this.ent_ProcessTimeTarget2 = dataGetEntAttr
                  .getElementsByTagName('ent_attr')
                  [i].getElementsByTagName(
                    'attr_value'
                  )[0].childNodes[0].nodeValue;
                this.targetCount();
              }
            } catch (err) {}
          }
          this.wynik = '';
        }
      }

      if (this.soapOpeartion == 'GetWcResult1'){
        this.soapOpeartion = '';
        let wynikGetWcResult = data;

          if (wynikGetWcResult != 'false') {
            if (this.mode == 'WS'){
              try{ for (let i = 0; i < wynikGetWcResult.getElementsByTagName('NewDataSet')[0].childNodes.length; i++) {
                if(wynikGetWcResult.getElementsByTagName('directaccess')[i].getElementsByTagName('ent_id')[0].childNodes[0].nodeValue == this.WS_id){
                 this.SCORE = parseInt(wynikGetWcResult.getElementsByTagName('directaccess')[i].getElementsByTagName('PT')[0].childNodes[0].nodeValue)}
              }
            }catch(err){}
          }
          if (this.mode == 'WC'){
            this.SCORE = 0;
            try{for (let i = 0; i < wynikGetWcResult.getElementsByTagName('NewDataSet')[0].childNodes.length; i++) {
                  this.SCORE += parseInt(wynikGetWcResult.getElementsByTagName('directaccess')[i].getElementsByTagName('PT')[0].childNodes[0].nodeValue)
          }
          }catch(err){}
        }
      }}

      if (this.soapOpeartion == 'GetWcResult2'){

        this.soapOpeartion = '';
        let wynikGetWcResult = data;

          if (wynikGetWcResult != 'false') {
            if (this.mode == 'WS'){
              try{ for (let i = 0; i < wynikGetWcResult.getElementsByTagName('NewDataSet')[0].childNodes.length; i++) {
                if(wynikGetWcResult.getElementsByTagName('directaccess')[i].getElementsByTagName('ent_id')[0].childNodes[0].nodeValue == this.WS_id2){
                  this.SCORE2 = parseInt(wynikGetWcResult.getElementsByTagName('directaccess')[i].getElementsByTagName('PT')[0].childNodes[0].nodeValue)}
              }
            }catch(err){}
          }
          if (this.mode == 'WC'){
            try{ this.SCORE2 = 0;
            for (let i = 0; i < wynikGetWcResult.getElementsByTagName('NewDataSet')[0].childNodes.length; i++) {
                  this.SCORE2 += parseInt(wynikGetWcResult.getElementsByTagName('directaccess')[i].getElementsByTagName('PT')[0].childNodes[0].nodeValue)
          }

          }catch(err){}
        }
      }
    }
  }

  targetCount() {
    let time = new Date();
    let xhours = time.getHours();
    if (xhours >= 6 && xhours < 14) {
      this.ent_ProcessTimeTargetCurrent = Math.floor(
        parseInt(this.ent_ProcessTimeTarget) *
          ((xhours * 60 + time.getMinutes() - 360) / 480)
      );
      this.ent_ProcessTimeTargetCurrent2 = Math.floor(
        parseInt(this.ent_ProcessTimeTarget2) *
          ((xhours * 60 + time.getMinutes() - 360) / 480)
      );
    }

    if (xhours >= 14 && xhours < 22) {
      this.ent_ProcessTimeTargetCurrent = Math.floor(
        parseInt(this.ent_ProcessTimeTarget) *
          ((xhours * 60 + time.getMinutes() - 840) / 480)
      );
      this.ent_ProcessTimeTargetCurrent2 = Math.floor(
        parseInt(this.ent_ProcessTimeTarget2) *
          ((xhours * 60 + time.getMinutes() - 840) / 480)
      );
    }

    if (xhours >= 22) {
      this.ent_ProcessTimeTargetCurrent = Math.floor(
        parseInt(this.ent_ProcessTimeTarget) *
          ((xhours * 60 + time.getMinutes() - 1320) / 480)
      );
      this.ent_ProcessTimeTargetCurrent2 = Math.floor(
        parseInt(this.ent_ProcessTimeTarget2) *
          ((xhours * 60 + time.getMinutes() - 1320) / 480)
      );
    }

    if (xhours < 6) {
      this.ent_ProcessTimeTargetCurrent = Math.floor(
        parseInt(this.ent_ProcessTimeTarget) *
          ((xhours * 60 + 120 + time.getMinutes()) / 480)
      );
      this.ent_ProcessTimeTargetCurrent2 = Math.floor(
        parseInt(this.ent_ProcessTimeTarget2) *
          ((xhours * 60 + 120 + time.getMinutes()) / 480)
      );
    }

    if (this.SCORE >= this.ent_ProcessTimeTargetCurrent) {
      this.ScoreCss = 'ScorePTok';
    } else {
      this.ScoreCss = 'ScorePTnok';
    }

    if (this.SCORE2 >= this.ent_ProcessTimeTargetCurrent2) {
      this.ScoreCss2 = 'ScorePTok';
    } else {
      this.ScoreCss2 = 'ScorePTnok';
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

  checkUpdate() {
    setTimeout(() => this.serviceMethod.getWcResult(this.WC_id, 1), 2000);
    setTimeout(() => this.serviceMethod.getWcResult(this.WC_id2, 2), 3000);
  }
}
