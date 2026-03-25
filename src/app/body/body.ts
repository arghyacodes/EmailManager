import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataService } from '../services/data';

@Component({
  selector: 'app-body',
  imports: [DatePipe],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body implements OnInit {

  @Input() selectedSenderId: number = 0;

  messages: any[] = [];
  messageDetails: any[] = [];
  messageDetail: string = '';

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private dataService: DataService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.dataService.getMessages().subscribe(data => {
      console.log('messages:', data);
      this.messages = data;
      this.cdr.detectChanges();
    });

    this.dataService.getMessageDetails().subscribe(data => {
      console.log('details:', data);
      this.messageDetails = data;
      this.cdr.detectChanges();
    });
  }

  // filter by sender
  get filteredMessages() {
    if (!this.selectedSenderId) {
      return this.messages;
    }
    return this.messages.filter(m => m.senderId === this.selectedSenderId);
  }

  // sort
  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  // sort data
  get sortedMessages() {
    let data = this.filteredMessages;

    if (!this.sortColumn) return data;

    return [...data].sort((a: any, b: any) => {
      let valueA = a[this.sortColumn];
      let valueB = b[this.sortColumn];

      if (this.sortColumn === 'date') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;

      return 0;
    });
  }

  // msg details
  showMessageDetails(messageId: number) {
    this.messageDetail =
      this.messageDetails.find(d => d.messageId === messageId)?.details
      || 'Details not found';
  }

  // arrow
  getArrow(column: string) {
    if (this.sortColumn !== column) return '⬇';
    return this.sortDirection === 'asc' ? '⬆' : '⬇';
  }
}