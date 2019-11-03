import { TestBed } from '@angular/core/testing';

import { PlayerControlsService } from './player-controls.service';

describe('PlayerControlsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerControlsService = TestBed.get(PlayerControlsService);
    expect(service).toBeTruthy();
  });
});
