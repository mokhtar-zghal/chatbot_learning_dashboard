import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {concatMap, map, Observable} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('apikey:gonGjOBnw_kd-DCPmduSpvPCzCInN-SM3W_u4H4lJTgn')
  })
};
@Injectable({
  providedIn: 'root',
})
export class IntentService {
  constructor(private _http: HttpClient) {}

  getIntentList(): Observable<any> {
    return this._http.get('https://api.au-syd.assistant.watson.cloud.ibm.com/instances/' +
      '18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/intents?version=2023-02-01',httpOptions);
  }
  getDialogNodesList(): Observable<any> {
    return this._http.get('https://api.au-syd.assistant.watson.cloud.ibm.com/instances/' +
      '18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/dialog_nodes?version=2023-02-01',httpOptions);
  }
  deleteIntent(intent: any): Observable<any> {
    return this._http.delete(`https://api.au-syd.assistant.watson.cloud.ibm.com/instances/18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/intents/${intent}?version=2023-02-01`, httpOptions)
      .pipe(
        concatMap(() =>
          this._http.delete(`https://api.au-syd.assistant.watson.cloud.ibm.com/instances/18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/dialog_nodes/${intent}?version=2023-02-01`, httpOptions)
        ),
        map(() => intent)
      );
  }

  getQuestionsList(intentName:string): Observable<any> {
    return this._http.get('https://api.au-syd.assistant.watson.cloud.ibm.com/instances/' +
      '18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/intents/'+intentName+'/examples?version=2023-02-01',httpOptions);
  }

}
