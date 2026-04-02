import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTopics() {
    return this.http.get<string[]>(`${this.baseUrl}/topics`);
  }

  getMessages(topic: string) {
    return this.http.get<any[]>(`${this.baseUrl}/messages/${topic}`);
  }

  getMessageDetails(topic: string, id: string) {
    return this.http.get<any>(`${this.baseUrl}/message/${topic}/${id}`);
  }

  getAllMessages() {
  return this.http.get<any[]>(`${this.baseUrl}/messages`);
}
}