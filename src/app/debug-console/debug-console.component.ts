import { Component, AfterViewInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'debug-console',
  templateUrl: './debug-console.component.html',
  styleUrls: ['./debug-console.component.scss']
})

export class DebugConsoleComponent implements AfterViewInit {

  console;
  src;
  init;
  sent;
  received;

  count = 0;

  constructor(
    private wss: WebsocketService
  ) { }

  ngAfterViewInit() {

    this.console = document.getElementById('console');
    this.src = document.getElementById('src');
    this.init = document.getElementById('init');
    this.sent = document.getElementById('sent');
    this.received = document.getElementById('received');

    this.wss.listen('PlayerInit').subscribe((data: any) => {
      this.listened('Init', this.init);
      console.log('PlayerInit', data);
    });

    this.wss.listen('ChangeSource').subscribe((data: any) => {
      this.listened('Src: ' + data.src, this.src);
      console.log('ChangeSource', data);
    });

    this.wss.listen('PlayerAction').subscribe((data: any) => {
      this.listened('Action: ' + data.action, this.received);
      console.log('PlayerAction', data);
    });

  }

  private listened(msg: string, ele: any){

    this.count++;

    if(this.count > 5){
      this.console.removeChild(this.console.childNodes[0]);
    }

    const clone = ele.cloneNode(true);

    clone.lastChild.innerHTML = msg;

    this.console.appendChild(clone);

  }

}
