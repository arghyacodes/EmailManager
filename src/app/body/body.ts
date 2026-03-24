import { Component, Input, signal } from '@angular/core';
// import { Senders } from '../senders';
import { Messages } from '../messages';
import { MessageDetails } from '../message-details';
import { DatePipe } from '@angular/common';
// import { Navigation } from '../navigation/navigation';

@Component({
  selector: 'app-body',
  imports: [DatePipe],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {

  @Input() selectedSenderId: number = 0;
  messageDetail: string = '';


  messages: Messages[] = [
    { senderId: 1, date: "2026-03-18T10:30:00", messageId: 1003, message: "package delivered" },
    { senderId: 1, date: "2026-03-18T08:15:00", messageId: 1002, message: "out for delivery" },
    { senderId: 1, date: "2026-03-17T14:20:00", messageId: 1001, message: "package shipped" },
    { senderId: 1, date: "2026-03-16T09:00:00", messageId: 1000, message: "order placed" },
    { senderId: 2, date: "2026-03-22T11:45:00", messageId: 2000, message: "order placed" }
  ];

  get filteredMessages() {
    return this.messages.filter(m => m.senderId === this.selectedSenderId);
  }

  messageDetails: MessageDetails[] = [
    { "messageId": 1001, "details": "Package shipped to your nearest hub. We will let you know once out for delivery" },
    { "messageId": 1000, "details": "Order placed successfully. We will let you know once shipped" },
    { "messageId": 2000, "details": "Order placed successfully. We will let you know once shipped" },
    { "messageId": 1002, "details": "Arriving today : your package is out for delivery will reach you by 11pm" },
    { "messageId": 1003, "details": "Order delivered, you can download invoice from link below." }
  ];
  showMessageDetails(messageId: number) {
    this.messageDetail = this.messageDetails.find(detail => detail.messageId === messageId)?.details || 'Details not found';
  }
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  sortData(column: string) {
    if (this.sortColumn === column) {
      // toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }
  get sortedMessages() {
    let data = this.filteredMessages;

    if (!this.sortColumn) return data;

    return [...data].sort((a: any, b: any) => {
      let valueA = a[this.sortColumn];
      let valueB = b[this.sortColumn];

      // Date handling
      if (this.sortColumn === 'date') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  
  sortDir = signal('⬇');

  toggleBtn(){
    if(this.sortDir()==='⬇'){
      this.sortDir.set('⬆');
    }
    else{
      this.sortDir.set('⬇');
    }
  }
}
