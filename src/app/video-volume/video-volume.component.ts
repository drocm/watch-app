import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'video-volume',
  templateUrl: './video-volume.component.html',
  styleUrls: ['./video-volume.component.scss']
})
export class VideoVolumeComponent implements OnInit {

  @Output() volumeChange = new EventEmitter();

  volume:number = 50;
  private preMuteVolume: number;

  constructor() { }

  ngOnInit() {
    this.volumeChange.emit(this.volume);
  }

  update(value){
    this.volume = value;
    this.volumeChange.emit(this.volume);
  }

  mute(){
    this.preMuteVolume = this.volume;
    this.volume = 0;
    this.volumeChange.emit(0);
  }

  unmute(){
    this.volume = this.preMuteVolume;
    this.volumeChange.emit(this.preMuteVolume);
  }

}
