import { Component, OnInit } from '@angular/core';
import { PlayerControlsService, PlayerActions } from '../player-controls.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  player: HTMLVideoElement;
  body: HTMLBodyElement;
  src: string;

  constructor(
    public service: PlayerControlsService,
    private wss: WebsocketService
  ) { }

  ngOnInit() {

    this.player = <HTMLVideoElement>document.getElementById('player');
    this.body = <HTMLBodyElement>document.getElementsByTagName('body')[0];

    this.wss.listen('PlayerInit').subscribe((data: any) => {
      this.src = data.src;
      this.player.load();
      if(data.action){
        if (data.action.playerAction === PlayerActions.Play) {
          data.action.timestamp = this.adjustTimestamp(data.timestamp, data.action.timestamp);
        }
        this.applyAction(data.action.playerAction, data.action.timestamp);
      }
    });

    this.wss.listen('PlayerAction').subscribe((data: any) => {
      this.applyAction(data.playerAction, data.timestamp);
    });

    this.wss.listen('ChangeSource').subscribe((url: string) => {
      this.src = url;
      this.player.load();
    });

    this.service.localActions.subscribe((action: PlayerActions) => {
      this.applyAction(action);
    });

    this.player.oncanplay = () => {
      this.service.updatePlayer(this.player);
    };

    this.player.onended = () => {
      this.service.ended();
    };

  }

  playPause(){
    if(this.player.paused){
      this.service.play();
    } else {
      this.service.pause();
    }
  }

  private applyAction(action: PlayerActions, timestamp: number = null){

    if(action === PlayerActions.Play){
      this.setVideoTime(timestamp);
      this.player.play();
    }

    if(action === PlayerActions.Pause){
      this.player.pause();
      this.setVideoTime(timestamp);
    }

    if(action === PlayerActions.Seek){
      this.setVideoTime(timestamp);
    }

    if(action === PlayerActions.Fullscreen){
      this.body.requestFullscreen();
    }

    if(action === PlayerActions.Shrink){
      document.exitFullscreen();
    }

  }

  private setVideoTime(timestamp: number){
    this.player.currentTime = timestamp;
  }

  private adjustTimestamp(timestamp, actionTimestamp: number): number{

    const now = Date.now();

    const diff = (now - timestamp + this.wss.ping) / 1000;

    return actionTimestamp + diff;
  }

}
