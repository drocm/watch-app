import { Component, OnInit } from '@angular/core';
import { PlayerControlsService } from '../player-controls.service';
import { HttpClient } from '@angular/common/http';

class subtitlePart {
  start: string;
  end: string;
  line1: string;
  line2: string;
}

@Component({
  selector: 'subtitle-view',
  templateUrl: './subtitle-view.component.html',
  styleUrls: ['./subtitle-view.component.scss']
})
export class SubtitleViewComponent implements OnInit {

  show: boolean = true;
  userShow: boolean = false;
  hasSubs: boolean = false;
  subtitles: subtitlePart[] = [];
  currentSub: subtitlePart = {
    start: null,
    end: null,
    line1: null,
    line2: null
  }

  private proxyUrl = "https://cors-anywhere.herokuapp.com/";
  private url: string = "http://drodario.us/watch/subs.srt";
  private clearTimer = null;

  constructor(
    private playerControlsService: PlayerControlsService,
    private http: HttpClient
  ) { }

  ngOnInit() {

    this.playerControlsService.showSubs.subscribe((state) => {
      this.userShow = state;
    });

    let rawSubs: string[] = [];

    try {


      this.http.get(this.proxyUrl + this.url, {responseType: 'text'}).subscribe((response) => {

        if (response) {
          rawSubs = response.toString().split("\n");
          this.init(rawSubs);
        }

      })


    } catch (e) {

      console.warn('404: SUBTITLES NOT FOUND FOR THIS MOVIE!');
    
    }

  }

  init(rawSubs: string[]) {

    this.hasSubs = true;

    this.buildSubtitles(rawSubs);

    this.startSubtitleInterval();

  }

  buildSubtitles(rawSubs: string[]) {

    rawSubs.forEach((line, i) => {

      if (line.includes('-->')) {

        const start: string[] = line.split(',')[0].trim().split(':');
        const end: string[] = line.split(',')[1].split('-->')[1].trim().split(':');

        const startInSec: string = ((parseInt(start[0]) * 3600) + (parseInt(start[1]) * 60) + (parseInt(start[2]) * 1)).toString();
        const endInSec: string = ((parseInt(end[0]) * 3600) + (parseInt(end[1]) * 60) + (parseInt(end[2]) * 1)).toString();

        this.subtitles.push({
          start: startInSec,
          end: endInSec,
          line1: rawSubs[i+1],
          line2: (rawSubs[i+2].length > 0) ? rawSubs[i+2] : null
        });

      }

    });

  }

  private startSubtitleInterval() {

    window.setInterval(() => { this.updateSubtitles(); }, 1000);

  }

  private updateSubtitles() {

    const currentTime = this.playerControlsService.getCurrentTime().toString().split('.')[0];

    const start = this.subtitles.find((sub) => sub.start === currentTime);

    if (start) { 

      if (this.clearTimer !== null) { clearTimeout(this.clearTimer); }

      this.currentSub = start;

      let duration: number = (parseInt(start.end) - parseInt(start.start)) * 1000;

      this.clearTimer = setTimeout((e) => {
        this.show = false;
      }, duration);

      this.show = true;

    }

  }


}
