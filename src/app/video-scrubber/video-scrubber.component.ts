import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PlayerControlsService } from '../player-controls.service';

@Component({
  selector: 'video-scrubber',
  templateUrl: './video-scrubber.component.html',
  styleUrls: ['./video-scrubber.component.scss']
})
export class VideoScrubberComponent implements OnInit {

  player: HTMLVideoElement;
  input: HTMLInputElement;
  currentVideoTime: number;

  private scrubberStyles: HTMLStyleElement;
  private scrubberBGTimer = null;

  @Output() seek = new EventEmitter();

  constructor(
    public service: PlayerControlsService
  ) { }

  ngOnInit() {

    this.scrubberStyles = <HTMLStyleElement>document.getElementById('scrubber');
    this.input = <HTMLInputElement>document.getElementById('video-scrubber');

    this.service.player.subscribe((player) => {
      this.player = player ? player : null;
    });

    setInterval(() => {
      this.currentVideoTime = this.player ? this.player.currentTime : 0;
    }, 100);

    setInterval(() => {
      if(this.player){
        this.setScrubberBG();
      }
    }, 150);

  }

  seeked(value: number){
    this.seek.emit(value);
  }

  setScrubberBG(){

    const value: number = parseFloat(this.input.value);
    const percentage: number = (value/this.player.duration) * 100;
    this.scrubberStyles.innerHTML = `
    
      input#video-scrubber[type=range]::-webkit-slider-runnable-track{
        background: -moz-linear-gradient(left,  rgba(221,44,0,1) 0%, rgba(221,44,0,1) ${percentage}%, rgba(221,44,0,0) ${percentage}%, rgba(221,44,0,0) 100%);
        background: -webkit-linear-gradient(left,  rgba(221,44,0,1) 0%,rgba(221,44,0,1) ${percentage}%,rgba(221,44,0,0) ${percentage}%,rgba(221,44,0,0) 100%);
        background: linear-gradient(to right,  rgba(221,44,0,1) 0%,rgba(221,44,0,1) ${percentage}%,rgba(221,44,0,0) ${percentage}%,rgba(221,44,0,0) 100%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#DD2C00', endColorstr='#DD2C00',GradientType=1 );
      }

    `;

  }


}
