import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IntentAddEditComponent } from './emp-add-edit/intent-add-edit.component';
import { IntentService } from './services/intent.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import {HttpClient} from "@angular/common/http";


interface DialogNodeTransformed {
  intent: string;
  responses: { text: string }[];
  questions: { text: string }[];
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'intent',
    'questions',
    'responses',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  cc: DialogNodeTransformed[] = [];

  constructor(
    private _http: HttpClient,
    private _dialog: MatDialog,
    private _intentService: IntentService,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {

    this.cc=[];
    this.getDictionaryList();
    /*setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.cc);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.cc.length);
    }, 1500);*/
  }
  reload():void{
    console.log(this.cc.length);
    this.dataSource = new MatTableDataSource(this.cc);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  }

  openAddEditIntentForm() {

    const dialogRef = this._dialog.open(IntentAddEditComponent, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        let data={
          intent: val.intent,
          responses: val.responses.map((value:string) => ({ text: value })),
          questions: val.questions.map((value:string) => ({ text: value }))
        };
        console.log(data);
        this.cc.push(data);
        this.dataSource = new MatTableDataSource(this.cc);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  openEditForm(data: any) {
    data={
      intent: data.intent,
      questions: data.questions.map((q: {text: string}) => q.text),
      responses: data.responses.map((r: {text: string}) => r.text)
    }
    const dialogRef = this._dialog.open(IntentAddEditComponent, {
      width: '50%',data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        let data={
          intent: val.intent,
          responses: val.responses.map((value:string) => ({ text: value })),
          questions: val.questions.map((value:string) => ({ text: value }))
        };
        console.log(data);
        this.cc = this.cc.filter((item) => item.intent !== val.intent);
        this.cc.push(data);
        this.dataSource = new MatTableDataSource(this.cc);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
    });
  }
  getDictionaryList() {

    interface DialogNode {
      type: string;
      title: string;
      output: {
        generic: {
          values: { text: string }[];
          response_type: string;
        }[];
      };
      conditions?: string; // add the `?` to make the property optional
      dialog_node: string;
      previous_sibling: string;
    }




    type DialogNodes = {
      dialog_nodes: DialogNode[];
      pagination: {
        refresh_url: string;
      };
    };
    type QuestionList = {
      examples: { text: string }[];
      pagination: { refresh_url: string };
    };



    this._intentService.getDialogNodesList().subscribe((data: DialogNodes) => {
      data.dialog_nodes.map((node) => {
        this._intentService.getQuestionsList(node.title).subscribe((questions: QuestionList) => {
          const transformedNode: DialogNodeTransformed = {
            intent: node.title,
            responses: node.output.generic[0].values,
            questions: questions.examples.map((example) => {
              return { text: example.text };
            })
          };
          this.cc.push(transformedNode);
          this.dataSource = new MatTableDataSource(this.cc);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        })
      });

    });

      }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteIntent(intent: any) {
    console.log(intent);
    this._intentService.deleteIntent(intent).subscribe({
      next: () => {

        this.cc = this.cc.filter((item) => item.intent !== intent);
        console.log(this.cc.length);
        this.dataSource = new MatTableDataSource(this.cc);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this._coreService.openSnackBar('Intent deleted!', 'done');
      },
      error: console.log,
    });
  }




}
