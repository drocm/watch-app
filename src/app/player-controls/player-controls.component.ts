import { Component, AfterViewInit } from '@angular/core';
import { PlayerControlsService, PlayerActions } from '../player-controls.service';
import { WebsocketService } from '../websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss']
})
export class PlayerControlsComponent implements AfterViewInit {

  showSubtitles: boolean = false;
  isFullscreen: boolean = false;
  isPlaying: boolean = false;
  videoLength: VideoLength = VideoLength.Short;
  currentVideoTime: Date;
  videoDuration: Date;
  videoTitle: string;

  private player: HTMLVideoElement;
  private playerSub: Subscription;
  private videoInterval: any;

  constructor(
    public service: PlayerControlsService,
    private wss: WebsocketService
  ) {

    this.wss.listen('PlayerInit').subscribe((data: any) => {
      if (data.action && data.action.playerAction === PlayerActions.Play) {
        this.isPlaying = true;
      }
    });

    this.wss.listen('ChangeSource').subscribe((url: string) => {
      this.init();
      this.service.updatePlayer;
    });

  }

  ngAfterViewInit() {

    this.init();

  }

  init(){

    this.playerSub = this.service.player.subscribe((player) => {
      if(player) {
        this.player = player;
        this.currentVideoTime = this.service.toDateTime(player.currentTime);
        this.videoDuration = this.service.toDateTime(player.duration);
        this.setVideoLength(player.duration);
        player.onplay = () => { this.isPlaying = true; }
        player.onpause = () => { this.isPlaying = false; }
        this.videoTitle = player.currentSrc.split('/').pop();
      }
    });

    this.videoInterval = setInterval(() => {
      this.currentVideoTime = this.service.toDateTime(this.player ? this.player.currentTime : 0);
    }, 100);

  }

  destroy(){

    this.playerSub.unsubscribe();
    clearInterval(this.videoInterval);

  }

  togglePlay(status: string){
    if(status === 'on'){
      this.isPlaying = true;
      this.service.play();
    } else {
      this.isPlaying = false;
      this.service.pause();
    }
  }

  toggleFullscreen(status: string){
    if(status === 'on'){
      this.isFullscreen = true;
      this.service.fullscreen();
    } else {
      this.isFullscreen = false;
      this.service.shrink();
    }
  }

  toggleSubtitles(status: string){
    if(status === 'on'){
      this.showSubtitles = true;
      this.service.showSubtitles();
    } else {
      this.showSubtitles = false;
      this.service.hideSubtitles();
    }
  }

  setVolume(value){
    if(this.player){
      this.player.volume = (value/100);
    }
  }

  changeSource(value){
    this.service.source(value);
  }

  private setVideoLength(duration: number){

    if (duration >= 3600) { 
      
      this.videoLength = VideoLength.Long;
    
    } else if (duration >= 600) {

      this.videoLength = VideoLength.Medium;

    } else {

      this.videoLength = VideoLength.Short;

    }

  }

}

export enum VideoLength{
  Long = 'long',
  Medium = 'medium',
  Short = 'short'
}