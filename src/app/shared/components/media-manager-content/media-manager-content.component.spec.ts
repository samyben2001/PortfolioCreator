import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaManagerContentComponent } from './media-manager-content.component';

describe('MediaManagerContentComponent', () => {
  let component: MediaManagerContentComponent;
  let fixture: ComponentFixture<MediaManagerContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaManagerContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MediaManagerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
