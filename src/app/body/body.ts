import { Component, Input } from '@angular/core';
// import { Senders } from '../senders';
import { Messages } from '../messages';
import { MessageDetails } from '../message-details';
// import { Navigation } from '../navigation/navigation';

@Component({
  selector: 'app-body',
  // imports: [Navigation],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {

  @Input() selectedSenderId: number=0;
  messageDetail: string = '';


  messages: Messages[] = [
    { "senderId": 1, "date": "2026-03-18", "messageId": 1003, "message": "package delivered" },
    { "senderId": 1, "date": "2026-03-18", "messageId": 1002, "message": "package out for delivery" },
    { "senderId": 1, "date": "2026-03-17", "messageId": 1001, "message": "package shipped" },
    { "senderId": 1, "date": "2026-03-16", "messageId": 1000, "message": "order placed" },
    { "senderId": 2, "date": "2026-03-22", "messageId": 2000, "message": "order placed" }
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
}
