import { Component, OnInit } from '@angular/core';
import { ServiceMethod } from './../../service.method';
import { ServiceService } from './../../service.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { single } from './chartData';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-FactoryView1WC',
  templateUrl: './FactoryView1WC.component.html',
  styleUrls: ['./FactoryView1WC.component.css']
})
export class FactoryView1WCComponent implements OnInit {

  now: string;
  NgxChartsModule;
  SCORE: number = 0;
  FactoryCurrentTarget: number = 0;
  FactoryTarget: number = 0;
  Arr = Array;

  T5: number = 2;
  T4: number = 146;
  T3: number = 87;
  T2: number = 549;
  T1: number = 551;
  T7: number = 71;

  Results: any[][] = [["T1000010", "DUPA 2001",35, 40],
                      ["T1000020", "DUPA 2002",85, 98],
                      ["T1000030", "DUPA 2003",123, 100],
                      ["T1000040", "DUPA 2004",75, 40],
                      ["T1000050", "DUPA 2005",35, 40],
                      ["T1000060", "DUPA 2006",67, 65],
                      ["T1000070", "DUPA 2007",50, 54],
                      ["T1000080", "DUPA 2008",350, 340],
                      ["T1000090", "DUPA 2009",135, 90],
                      ["T1000100", "DUPA 2010",35, 40],
                      ["T1000110", "DUPA 2011",70, 40],
                      ["T1000120", "DUPA 2012",135, 140],
                      ["T1000130", "DUPA 2013",145, 130],
                      ["T1000140", "DUPA 2014",35, 40],
                      ["T1000150", "DUPA 2015",55, 59],
                      ["T1000160", "DUPA 2016",123, 110]];


  constructor(private serviceServiceLog: ServiceService, private activatedRoute: ActivatedRoute) {
    setInterval(() => {
      this.now = new Date().toString().split(' ')[4];
    }, 1);

    Object.assign(this, { single });
  }


  ngOnInit() {
  }

  //############ CHART #################

  single: any[];
  view: any[] = [300, 100];

  // options
  showXAxis: boolean = true;
  gradient: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28' ]
  };

}
