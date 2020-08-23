import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoVolumeComponent } from './video-volume.component';

describe('VideoVolumeComponent', () => {
  let component: VideoVolumeComponent;
  let fixture: ComponentFixture<VideoVolumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoVolumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
