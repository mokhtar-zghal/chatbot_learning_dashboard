import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constant } from '../constant';
import { CoreService } from '../core/core.service';
import { IntentService } from '../services/intent.service';
import {HttpClient  } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa('apikey:gonGjOBnw_kd-DCPmduSpvPCzCInN-SM3W_u4H4lJTgn')
  })
};
const postIntentUrl='https://api.au-syd.assistant.watson.cloud.ibm.com/instances/18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/' +
  'workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/intents?version=2023-02-01';
const dialog_nodeUrl='https://api.au-syd.assistant.watson.cloud.ibm.com/instances/18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/' +
  'workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/dialog_nodes?version=2023-02-01';
const x='{"intent":"'
@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './intent-add-edit.component.html',
  styleUrls: ['./intent-add-edit.component.scss'],
})
export class IntentAddEditComponent implements OnInit {

  questions: string[] = [];
  responses: string[] = [];

  onQuestionsChanged(newItems: string[]) {
    this.questions = newItems;
    this.intentForm.get('questions')?.setValue(newItems);

  }
  onResponsesChanged(newItems: string[]) {
    this.responses = newItems;
    this.intentForm.get('responses')?.setValue(newItems);

  }

  question = Constant.question;
  reponse = Constant.reponse;
  items : any[] = [];
  selectedItem: any='';
  selectItem(item: any) {
    this.selectedItem = item;
  }
  updateItem() {
    const index = this.items.length;
    if(this.selectedItem!=null && this.selectedItem!=''){
      this.items[index] = this.selectedItem;
      this.selectedItem = null;
    }

  }
  deleteItem(item: string) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

   intentForm: FormGroup;



  constructor(
    private http:HttpClient,
private _fb: FormBuilder,
    private _empService: IntentService,
    private _dialogRef: MatDialogRef<IntentAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.intentForm = this._fb.group({
      intent:'',
      questions:[],
      responses:[[]], // Initialize with empty array

    });
  }

  ngOnInit(): void {
    if(this.data!==null){
      this.intentForm.get('intent')?.disable();//? to safely access the intentForm FormGroup and the intent form control.
      // This operator checks if the object is null or undefined before accessing its properties or methods
    }
    this.intentForm.patchValue(this.data);

  }


  onFormSubmit() {
    if (this.intentForm.valid) {
      if (this.data) {
        this.http.post(`https://api.au-syd.assistant.watson.cloud.ibm.com/instances/18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/`+
    `workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/intents/`+this.intentForm.get('intent')?.value+`?version=2023-02-01`
          ,this.jsonIntents(this.intentForm.get('intent')?.value, this.intentForm.get('questions')?.value), httpOptions).subscribe((result: any) => {
          console.log(result);
        }, () => console.log('erreur'));

        this.http.post(`https://api.au-syd.assistant.watson.cloud.ibm.com/instances/18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/dialog_nodes/`+this.intentForm.get('intent')?.value+`?version=2023-02-01`
          ,this.jsonDialogNode(this.intentForm.get('intent')?.value,this.intentForm.get('responses')?.value), httpOptions).subscribe({
          next: () => {
            this._coreService.openSnackBar('updated');
            this._dialogRef.close( {
              intent: this.intentForm.get('intent')?.value,
              responses: this.intentForm.get('responses')?.value,
              questions: this.intentForm.get('questions')?.value}
            );
          },
          error: (err: any) => {
            console.error(err);
          },
        });

      }
      else {
        console.log("create")
        console.log(this.intentForm.value);
        if(this.intentForm.get('intent')?.value!=""&&this.intentForm.get('questions')?.value.length!=0&&this.intentForm.get('responses')?.value.length!=0){
          this.http.post(postIntentUrl
            ,this.jsonIntent(this.intentForm.get('intent')?.value, this.intentForm.get('questions')?.value), httpOptions).subscribe((result: any) => {
            console.log(result);
          }, () => console.log('dictionary already exists... use the update option in the main page'));

          this.http.post(dialog_nodeUrl
            ,this.jsonDialogNode(this.intentForm.get('intent')?.value,this.intentForm.get('responses')?.value), httpOptions).subscribe({
            next: () => {
              this._coreService.openSnackBar('created');
              this._dialogRef.close( {
                intent: this.intentForm.get('intent')?.value,
                responses: this.intentForm.get('responses')?.value,
                questions: this.intentForm.get('questions')?.value}
              );
            },
            error: (err: any) => {
              console.error(err);
            },
          });


        }
      }
    }

    }
    jsonDialogNode(dict:string,responses:string[]){

      return{
        dialog_node: dict,
          conditions: `#${dict}`,
        output: {
        generic: [
          {
            response_type: "text",
            values: responses.map(value => ({ text: value }))
          }
        ]
      },
        title: dict
      }

    }

  jsonIntents(dict:string,responses:string[]) {

    return {
      intent: dict,
      examples: responses.map(value => ({text: value})),


    }
  }


    jsonIntent(dict:string,userInput:string[]):string {

    let examples="";
    for(const element of userInput) {
      examples += '{"text":"' + element+'"},';
    }
      examples=examples.slice(0, -1)
      return '{"intent":"'+dict+'","examples":['+examples+']}'

    }


}
