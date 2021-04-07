import { DataService } from './data.service';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ServiceService {
  constructor(private dataService: DataService) {}

  private WSDL =
    'http://dkvdc-wmes0001/MESServices/MESConfirmOperation.asmx?WSDL';
  private WSDLgs =
    'http://dkvdc-wmes0001/MESServices/GeneralServices.asmx?WSDL';
  private WSDLus =
    'http://dkvdc-wmes0001/MESServices/UserServices.asmx?WSDL';
  private WSDLqs =
    'http://dkvdc-wmes0001/MESServices/QualityLockServices.asmx?WSDL';

  private responseSOAP: any;
  private result = new Subject<string>();

  operation: string;

  soapCall(operation: string, parameters: string, i?: number): void {
    this.soapStructure(operation, parameters, this.WSDL, i);
  }

  soapGsCall(operation: string, parameters: string, i?: number): void {
    this.soapStructure(operation, parameters, this.WSDLgs, i);
  }

  soapUsCall(operation: string, parameters: string, i?: number): void {
    this.soapStructure(operation, parameters, this.WSDLus, i);
  }

  soapQsCall(operation: string, parameters: string, i?: number): void {
    this.soapStructure(operation, parameters, this.WSDLqs, i);
  }

  soapStructure(operation: string, parameters: string, WSDL: string, i?: number){
    this.responseSOAP = '';
    const xmlhttp = new XMLHttpRequest();
    const sr =
      `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Body>
      <` + operation + ` xmlns="http://tempuri.org/">` +
      parameters +
      `</` + operation + `>
      </soap12:Body>
      </soap12:Envelope>`;


      xmlhttp.onreadystatechange = () => {

        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
            const xml = xmlhttp.responseXML;

            this.dataService.setXml(xml);

            this.responseSOAP = this.responseSOAP = xml.getElementsByTagName(operation + 'Result')[0];
          } else {
            this.responseSOAP = 'false';
          }

          if (i != undefined){this.operation = operation + i;}else{this.operation = operation }
          console.log(this.responseSOAP);
          this.result.next(this.responseSOAP);
          this.responseSOAP = '';
        }
      };

    // Send the POST request.
    xmlhttp.open('POST', WSDL, true);
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
    }

  getResult(): Observable<string> {
    return this.result.asObservable();
  }

  getSoapOperation(){
    return this.operation;
  }

}
