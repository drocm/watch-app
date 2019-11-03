import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerControlsService {

  localActions: BehaviorSubject<PlayerActions> = new BehaviorSubject<PlayerActions>(null);
  player: BehaviorSubject<HTMLVideoElement> = new BehaviorSubject<HTMLVideoElement>(null);
  livePlayer: HTMLVideoElement;

  constructor(
    private wss: WebsocketService
  ) {}

  updatePlayer(player: HTMLVideoElement){
    this.livePlayer = <HTMLVideoElement>document.getElementById('player');
    this.player.next(player);
  }

  play(){
    this.emitPlayerAction(PlayerActions.Play, this.livePlayer.currentTime);
  }

  pause(){
    this.emitPlayerAction(PlayerActions.Pause, this.livePlayer.currentTime);
  }

  seek(value){
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

  source(url: string){
    this.wss.emit('ChangeSource', url);
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