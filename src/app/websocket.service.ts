import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  socket;
  ping:number = 0;

  constructor() { 
    this.socket = io.connect(environment.ws_url);

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
