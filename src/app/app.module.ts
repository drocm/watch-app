import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { PlayerControlsComponent } from './player-controls/player-controls.component';
import { VideoScrubberComponent } from './video-scrubber/video-scrubber.component';
import { TestViewComponent } from './test-view/test-view.component';
import { MainComponent } from './main/main.component';
import { VideoVolumeComponent } from './video-volume/video-volume.component';
import { SourceSelectComponent } from './source-select/source-select.component';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';
import { DebugConsoleComponent } from './debug-console/debug-console.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoPlayerComponent,
    PlayerControlsComponent,
    VideoScrubberComponent,
    TestViewComponent,
    MainComponent,
    VideoVolumeComponent,
    SourceSelectComponent,
    YoutubePlayerComponent,
    DebugConsoleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
