import { Component, OnInit } from '@angular/core';
import { Body } from "./body/body";
import { Navigation } from './navigation/navigation';



@Component({
  selector: 'app-root',
  imports: [Navigation, Body],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App {
  selectedSenderId: number = 0;

  onSenderChange(senderId: number) {
    this.selectedSenderId = senderId;
  }
}
