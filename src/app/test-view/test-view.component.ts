import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'test-view',
  templateUrl: './test-view.component.html',
  styleUrls: ['./test-view.component.scss']
})
export class TestViewComponent implements OnInit {

  frame1: HTMLIFrameElement;
  frame2: HTMLIFrameElement;

  src: string;

  constructor() { 

      if(window.location.href.includes('localhost')){
        this.src = "http://localhost:4200/";
      } else {
        this.src = "http://ec2-3-95-234-136.compute-1.amazonaws.com/";
      }

  }

  ngOnInit() {

    this.frame1 = <HTMLIFrameElement>document.getElementById('frame1');
    this.frame2 = <HTMLIFrameElement>document.getElementById('frame2');

  }

  reloadFrame(id){

    let frame;

    if(id === "frame1"){ frame = this.frame1; }
    if(id === "frame2"){ frame = this.frame2; }

    const src = frame.src;

    frame.src = '';

    setTimeout(function(){
      frame.src = src;
    }, 500);
  }

}
