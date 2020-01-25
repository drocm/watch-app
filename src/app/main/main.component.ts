import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  watch: boolean = false;
  bgLoaded: boolean = false;
  imageSrc: string = '/assets/main-bg.jpg';
  overlayTimer = null;
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  player: string = "youtube"; 

  constructor() {
    this.body.addEventListener('mousemove', () => {

      if(this.overlayTimer){ clearTimeout(this.overlayTimer); }

      this.overlayTimer = setTimeout(() => {
        this.body.classList.remove('show-controls');
      }, 2500);

      this.body.classList.add('show-controls');

    });

    this.body.addEventListener('mouseleave', () => {

      this.body.classList.remove('show-controls');

    });
  }

  watchNow(){
    this.watch = true;
  }

  bgOnLoad(){
    setTimeout(() => {
      this.bgLoaded = true;
    }, 100);
  }

}
