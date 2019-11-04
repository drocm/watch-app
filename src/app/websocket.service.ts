import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  socket;
  ping:number = 0;
  url: string;

  constructor() { 

    if(window.location.href.includes('localhost')){
      this.url = "http://localhost:5000/";
    } else {
      this.url = "http://ec2-3-95-234-136.compute-1.amazonaws.com:5000/";
    }

    this.socket = io.connect(this.url);

    this.socket.on('probe', (data) => {
      const delay = this.now - data;
      this.ping = (this.ping + delay) / 2;
    });

    setInterval(() => {
      this.probe();
    }, 3000);

  }

  listen(eventName: string){
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any){
    this.socket.emit(eventName, data);
  }

  get now(){
    return Math.floor(new Date().getTime()/1000.0)
  }

  private probe(){
    this.socket.emit('probe', this.now);
  }

}
