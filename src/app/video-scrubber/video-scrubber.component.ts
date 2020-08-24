import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PlayerControlsService } from '../player-controls.service';
import { WebsocketService } from '../websocket.service';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'video-scrubber',
  templateUrl: './video-scrubber.component.html',
  styleUrls: ['./video-scrubber.component.scss']
})
export class VideoScrubberComponent implements OnInit {

  player: HTMLVideoElement;
  preview: HTMLVideoElement;
  input: HTMLInputElement;
  currentVideoTime: number;
  showPreview: boolean = false;
  previewXPosition: number = 5;

  private scrubberStyles: HTMLStyleElement;
  private scrubberBGTimer = null;

  private previewDebouncer: BehaviorSubject<any> = new BehaviorSubject(null);

  @Output() seek = new EventEmitter();

  constructor(
    public service: PlayerControlsService,
    private wss: WebsocketService
  ) { }

  ngOnInit() {

    this.preview = <HTMLVideoElement>document.getElementById('scrubberPreview');
    this.scrubberStyles = <HTMLStyleElement>document.getElementById('scrubber');
    this.input = <HTMLInputElement>document.getElementById('video-scrubber');

    this.service.player.subscribe((player) => {
      this.player = player ? player : null;
      if (this.player) {
        this.initPreview();
      }
    });

    setInterval(() => {
      this.currentVideoTime = this.player ? this.player.currentTime : 0;
    }, 100);

    setInterval(() => {
      if(this.player){
        this.setScrubberBG();
      }
    }, 150);

    this.previewDebouncer.pipe(debounceTime(16)).subscribe((event) => {
      if (!event) { return }
      this.preview.currentTime = this.calcSliderPos(event);
      let mouseXOffset: number = ((event.offsetX / (<HTMLInputElement>event.target).clientWidth) * 100);
      this.previewXPosition = this.limitPreviewXPosition(mouseXOffset);
    });

  }

  seeked(value: number){
    this.showPreview = false;
    this.seek.emit(this.preview.currentTime);
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

  setPreview(event) {
    this.previewDebouncer.next(event);
    this.showPreview = false;
  }

  clearPreview() {
    this.showPreview = false;
  }

  private initPreview() {
    this.preview.src = this.player.currentSrc;
    this.preview.load();
    this.previewXPosition = 0;
    this.preview.onseeked = () => {
      this.showPreview = true;
    };
  }

  private limitPreviewXPosition(position: number): number {
    if (position < 5) {
      return 5;
    } else if (position > 95) {
      return 95;
    } else {
      return position;
    }
  }

  private calcSliderPos(event): number {
    const pos: number = (event.offsetX / event.target.clientWidth) * parseFloat(event.target.getAttribute('max'));
    return pos;
  }

}
