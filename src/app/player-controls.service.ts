import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerControlsService {

  localActions: BehaviorSubject<PlayerActions> = new BehaviorSubject<PlayerActions>(null);
  player: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  livePlayer: any;
  playerType: PlayerTypes = PlayerTypes.Youtube;

  constructor(
    private wss: WebsocketService
  ) {}

  updatePlayer(player: any){
    if(this.playerType === PlayerTypes.Youtube){
      this.livePlayer = player;
      this.player.next(player);
    } else {
      this.livePlayer = <HTMLVideoElement>document.getElementById('player');
      this.player.next(player);
    }
  }

  play(value = null){
    const timestamp:number = value || this.livePlayer.currentTime || this.livePlayer.getCurrentTime() || 0;
    this.emitPlayerAction(PlayerActions.Play, timestamp);
  }

  pause(value = null){
    const timestamp:number = value || this.livePlayer.currentTime || this.livePlayer.getCurrentTime() || 0;
    this.emitPlayerAction(PlayerActions.Pause, timestamp);
  }

  seek(value = null){
    this.emitPlayerAction(PlayerActions.Seek, value);
  }

  fullscreen(){
    this.localActions.next(PlayerActions.Fullscreen);
  }

  shrink(){
    this.localActions.next(PlayerActions.Shrink);
  }

  ended(){
    this.emitPlayerAction(PlayerActions.Pause, 0);
  }

  source(src: string, player: PlayerTypes = PlayerTypes.Youtube){
    const data = {
      player: player,
      src: src
    };
    this.wss.emit('ChangeSource', data);
  }

  toDateTime(secs): Date {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t;
  }

  private emitPlayerAction(action: PlayerActions, timestamp: number){

    const data = {
      playerAction: action,
      timestamp: timestamp
    };

    this.wss.emit('PlayerAction', data);

  }


}

export enum PlayerActions{
  Play = "play",
  Pause = "pause",
  Seek = "seek",
  Fullscreen = "fullscreen",
  Shrink = "shrink",
  Volume = "volume"
}

export enum PlayerTypes{
  Youtube = "youtube",
  Video = "video"
}

export enum PlayerState {
  Unstarted = -1,
  Ended = 0,
  Playing = 1,
  Paused = 2,
  Buffering = 3,
  Cued = 5,
}