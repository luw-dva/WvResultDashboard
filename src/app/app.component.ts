import { Component } from '@angular/core';
import { ServiceMethod } from './../service.method';
import { ServiceService } from './../service.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  constructor(private activatedRoute: ActivatedRoute) { }

  WC_id;
  WC_id2;
  mode;
  factory;
  isWC3: boolean  = false;
  isWC2: boolean  = false;
  isWC1: boolean  = false;
  isFactoryView1: boolean = false;

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.WC_id = params['Workcenter'];
      this.WC_id2 = params['Workcenter2'];
      this.mode = params['Mode'];
      this.factory = params['Factory'];

      if (this.WC_id2 != undefined && this.WC_id != undefined && this.mode == undefined  ){
        this.isWC2 = true;
      }else if (this.WC_id != undefined && this.mode == undefined){
        this.isWC1 = true;
      }else if (this.WC_id != undefined && this.mode != undefined){
        this.isWC3 = true;
      }else if(this.factory != undefined){
        this.isFactoryView1 = true;
      }
    });
  }
}
