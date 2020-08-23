import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoScrubberComponent } from './video-scrubber.component';

describe('VideoScrubberComponent', () => {
  let component: VideoScrubberComponent;
  let fixture: ComponentFixture<VideoScrubberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoScrubberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoScrubberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
