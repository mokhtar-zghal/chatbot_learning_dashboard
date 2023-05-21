import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { Constant } from '../constant';



@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent {
  type: string = '';
  @Input()
  title: string = '';
  @Input()
  data: any;
  label: string = '';
  items: string[] = [];

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER] as const;

  @Output()
  itemsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  ngOnInit() {

    this.label = this.title == 'Question' ? 'Enter questions*' : 'Enter responses*';
    this.title == 'Question' ? this.items.push(...this.data.questions) : this.items.push(...this.data.responses);
    this.itemsChanged.emit(this.items);

  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add question/response to the array named items
    if (value) {
      this.items.push(value);
      this.itemsChanged.emit(this.items);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(qu: string): void {
    const index = this.items.indexOf(qu);

    if (index >= 0) {
      this.items.splice(index, 1);
      this.itemsChanged.emit(this.items);
    }
  }

  edit(item: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove question/response if it no longer has a name
    if (!value) {
      this.remove(item);
      return;
    }

    // Edit existing question/response
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this.items[index] = value;
      this.itemsChanged.emit(this.items);
    }
  }
}
