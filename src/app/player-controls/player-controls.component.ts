import { Component, AfterViewInit } from '@angular/core';
import { PlayerControlsService, PlayerActions, PlayerTypes } from '../player-controls.service';
import { WebsocketService } from '../websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss']
})
export class PlayerControlsComponent implements AfterViewInit {

  isFullscreen: boolean = false;
  isPlaying: boolean = false;
  videoLength: VideoLength = VideoLength.Short;
  currentVideoTime: Date;
  videoDuration: Date;
  videoTitle: string;
  hasYTAuthor: boolean = false;
  hidden: boolean = true;

  private player: any;
  private playerSub: Subscription;
  private videoInterval: any;
  private playerType: PlayerTypes = PlayerTypes.Youtube;

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
    });

    this.wss.listen('PlayerAction').subscribe((data: any) => {

      if(data.action === PlayerActions.Play){ this.isPlaying = true; }
      if(data.action === PlayerActions.Pause){ this.isPlaying = false; }

    });

  }

  ngAfterViewInit() {

    this.init();

  }

  init(){

    if(this.videoInterval){ clearInterval(this.videoInterval); }

    this.playerSub = this.service.player.subscribe((player) => {

        if(player && this.playerType === PlayerTypes.Youtube){

          const debug = Object.assign({}, player);

          //console.log('playerXX', debug);
          //console.log('player.l.videoData.titleXX', player.getVideoData());
         // console.log('player.l.videoData.titleXX yo yo', player.l.videoData.title);

          this.player = player;


          const YTPlayerPoller = setInterval(() => {


            if(this.player.getVideoData().title !== ""){

              clearInterval(YTPlayerPoller);

              this.currentVideoTime = this.service.toDateTime(player.getCurrentTime() || 0);
              this.videoDuration = this.service.toDateTime(player.getDuration());
              this.setVideoLength(player.getDuration());
              this.videoTitle = player.getVideoData().title;
              this.hasYTAuthor = player.getVideoData().author !== "";              
              this.hidden = false;

              this.videoInterval = setInterval(() => {
                this.currentVideoTime = this.service.toDateTime(player ? player.getCurrentTime() : 0);
              }, 100);

            }




          }, 250);


        }

        if(player && this.playerType === PlayerTypes.Video){

          this.player = player;
          this.currentVideoTime = this.service.toDateTime(player.currentTime);
          this.videoDuration = this.service.toDateTime(player.duration);
          this.setVideoLength(player.duration);
          this.videoTitle = player.currentSrc.split('/').pop();
          this.hidden = false;

          this.videoInterval = setInterval(() => {
            this.currentVideoTime = this.service.toDateTime(this.player ? this.player.getCurrentTime() : 0);
          }, 100);

        }

    });


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

  setVolume(value){
    if (this.player && this.playerType === PlayerTypes.Video) { this.player.volume = (value/100); }
    if (this.player && this.playerType === PlayerTypes.Youtube) { this.player.setVolume(value); }
  }

  changeSource(value){
    this.service.source(value);
    this.hidden = false;
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