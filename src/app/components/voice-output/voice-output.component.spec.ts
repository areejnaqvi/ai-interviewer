import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceOutputComponent } from './voice-output.component';

describe('VoiceOutputComponent', () => {
  let component: VoiceOutputComponent;
  let fixture: ComponentFixture<VoiceOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceOutputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
