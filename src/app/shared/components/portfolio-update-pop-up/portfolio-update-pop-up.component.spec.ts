import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePopUpComponent } from './portfolio-update-pop-up.component';

describe('UpdatePopUpComponent', () => {
  let component: UpdatePopUpComponent;
  let fixture: ComponentFixture<UpdatePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
