import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PlayerControlsService, PlayerActions, PlayerState } from '../player-controls.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YoutubePlayerComponent implements OnInit {

  player: any;
  body: HTMLBodyElement;
  playOnReadyTime: number = -1;
  isPlaying: boolean = false;

  videoOptions = {
    height: '100%',
    width: '100%',
    videoId: 'Xjs6fnpPWy4',
    startSeconds: 0,
    playerVars: {
      autoPlay: 0,
      modestbranding: 1,
      controls: 0,
      disablekb: 1,
      rel: 0,
      fs: 0,
      plausinline: 1
    },
    events: {
      'onStateChange': this.playerChange.bind(this),
      'onError': this.playerError.bind(this),
      'onReady': this.playerReady.bind(this)
    }
  };

  constructor(
    public service: PlayerControlsService,
    private wss: WebsocketService
  ) {}

  ngOnInit() {

    this.body = <HTMLBodyElement>document.getElementsByTagName('body')[0];

    this.wss.listen('PlayerInit').subscribe((data: any) => {

      if(data.player === 'youtube'){

        this.videoOptions.videoId = this.getFromLink(data.src);

      }

      if(this.videoOptions.videoId !== null){

        this.initVideo();

      }

      if(data.action){

        if (data.action === PlayerActions.Play) {

          this.playOnReadyTime = this.adjustTimestamp(data.timestamp);

        }

      }

    });

    this.wss.listen('PlayerAction').subscribe((data: any) => {
      if(data.player === 'youtube'){
        this.applyAction(data.action, data.timestamp);
      }
    });

    this.wss.listen('ChangeSource').subscribe((data: any) => {
      if(data.player === 'youtube'){
        const videoId = this.getFromLink(data.src);
        this.videoOptions.videoId = videoId;
        if(!this.player){
          this.initVideo(videoId);
        } else {
          this.player.loadVideoById(videoId);
          this.player.pauseVideo();
          this.player.seekTo(10, true);
        }
      }
    });

    this.service.localActions.subscribe((action: PlayerActions) => {
      this.applyAction(action);
    });

  }

  private getFromLink(url: string): string{

    const videoId: string = url ? url.split('?v=')[1] : null;

    return videoId;

  }

  initVideo(videoID: string = null){

    this.player = new window['YT'].Player('player', this.videoOptions);

  }

  playerChange(event){
    console.log('playerChange', event);

    const status = event.data
    if(status == -1){ this.isPlaying = false; } //unstarted
    if(status === 0){ this.isPlaying = false; } //ended
    if(status === 1){ this.isPlaying = true; }  //playing
    if(status === 2){ this.isPlaying = false; } //paused
    if(status === 3){ this.isPlaying = false; } //buffering
    if(status === 4){ this.isPlaying = false; } //...
    if(status === 5){ this.isPlaying = false; } //video cued

  }

  playerError(event){
    //console.log('playerError', event);
  }

  playerReady(event){

    //console.log('ONREADY', Object.assign({}, this.player));
    this.service.updatePlayer(this.player);

    if (this.playOnReadyTime >= 0) {

      this.applyAction(PlayerActions.Seek, this.playOnReadyTime);

    }

    this.player.loadVideoById(this.videoOptions.videoId);
    this.player.pauseVideo();
    this.player.seekTo(10, true);

  }

  playPause(){

    if(this.player){

      let state = this.player.getPlayerState();

      if(state === PlayerState.Paused){
        this.isPlaying = true;
        this.service.play();
      } else {
        this.isPlaying = false;
        this.service.pause();
      }

    }
  }

  private applyAction(action: PlayerActions, timestamp: number = null){

    if(action === PlayerActions.Play){
      this.player.playVideo();
      this.isPlaying = true;
    }

    if(action === PlayerActions.Pause){
      this.player.pauseVideo();
      this.isPlaying = false;
    }

    if(action === PlayerActions.Seek){
      this.player.seekTo(timestamp, true);
      if(this.isPlaying){ 
        this.service.play(timestamp);
      } else {
        this.service.pause(timestamp);
      }
    }

    if(action === PlayerActions.Fullscreen){
      this.body.requestFullscreen();
    }

    if(action === PlayerActions.Shrink){
      document.exitFullscreen();
    }

  }

  private adjustTimestamp(timestamp): number{

    const now = Date.now();

    const diff = (now - timestamp + this.wss.ping) / 1000;

    return timestamp + diff;
  }

}