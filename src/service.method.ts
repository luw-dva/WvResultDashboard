import { ServiceService } from './service.service';

export class ServiceMethod {
  constructor(private serviceService: ServiceService) { }

  getChildren(entId: string): any {
    const soapOpeartion = `GetChildEntities`;
    const soapParameters = `<entId>` + entId + `</entId>`;
    this.serviceService.soapGsCall(soapOpeartion, soapParameters);
  }

  getUsers(userId: string): any {
    const soapOpeartion = `ValidateUser`;
    const soapParameters = `<userId>` + userId + `</userId>`;
    this.serviceService.soapCall(soapOpeartion, soapParameters);
  }

  getWcResult(entId: string, i?: number): any {
    const soapOpeartion = `GetWcResult`;
    const soapParameters = `<ent_name>` + entId + `</ent_name>`;
    this.serviceService.soapCall(soapOpeartion, soapParameters, i);
  }

  getUserData(entityId:string, userId:string, i?: number): any {
    const soapOpeartion = `GetUserResult`;
    const soapParameters = `<entityId>` + entityId + `</entityId>` +
                         `<worker>` + userId + `</worker>`;
    this.serviceService.soapCall(soapOpeartion, soapParameters, i);
  }

  getEntity(entityId: string): any {
    const soapOpeartion = `GetEntAndParentNameById`;
    const soapParameters = `<entId>` + entityId + `</entId>`;
    this.serviceService.soapCall(soapOpeartion, soapParameters);
  }

  GetActiveLocksByIdOperation(wo: string, entParent: string): any {
    const soapOpeartion = `GetActiveLocksByIdOperation`;
    const soapParameters =
      `<id>` + wo + `</id>` +
      `<operation>` + entParent + `</operation>`;
    this.serviceService.soapQsCall(soapOpeartion, soapParameters);
  }

  confirmBundle(entId: string, bundle: string, entitiesParent: string, userName: string): any {
    const soapOpeartion = `ConfirmBundle`;
    const soapParameters =
      `<entityId>` +  entId +  `</entityId>` +
      `<bundle>` + bundle + `</bundle>` +
      `<operId>` + entitiesParent + `</operId>` +
      `<worker>` + userName + `</worker>`;
    this.serviceService.soapCall( soapOpeartion, soapParameters);
  }

  confirmOperation(entId: string, wo: string, entitiesParent: string, userName: string ): any {
    const soapOpeartion = `ConfirmOperation`;
    const soapParameters =
      `<entityId>` +  entId +  `</entityId>` +
      `<woId>` + wo  + `</woId>` +
      `<operId>` + entitiesParent + `</operId>` +
      `<worker>` + userName + `</worker>`;
    this.serviceService.soapCall(soapOpeartion, soapParameters);
  }

  getEntAttr(entityId:number, i?: number): any {
    const soapOpeartion = `GetEntAttr`;
    const soapParameters = `<entId>` + entityId + `</entId>`+
                      `<attrName></attrName>`;
    this.serviceService.soapGsCall(soapOpeartion, soapParameters, i);
  }

  getLocksSpecialItemsById(wo: string , entId: string): any {
    const soapOpeartion = `GetLocksSpecialItemsById`;
    const soapParameters =
      `<id>` + wo + `</id>` +
      `<entityId>` + entId + `</entityId>`;
    this.serviceService.soapCall(soapOpeartion, soapParameters);
  }

  confirmBackground(wo: string , entId: string, userId: string): any {
    const soapOpeartion = `ConfirmBackground`;

    let woArray: Array<string> = new Array;

    if (wo.search('$')){
      let woTab: Array<string> = wo.split('$')
        woTab.forEach(element => {
          woArray.push(element)
        });
    }else{
      woArray.push(wo)
    }

    const soapParameters =
      `<entityId>` + entId + `</entityId>` +
      `<userId>` + userId + `</userId>` +
      `<keys>[` + woArray + `]</keys>`;
    this.serviceService.soapCall(soapOpeartion, soapParameters);
  }


  getLoginQuality(qualityNumer, qualityPIN): any {
    const soapOpeartion = `Login`;
    const soapParameters = `<userName>` + qualityNumer + `</userName>
                            <password>` + qualityPIN +`</password>`;
    this.serviceService.soapGsCall(soapOpeartion, soapParameters);
  }
}
