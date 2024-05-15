import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PausedTasksComponent } from './paused-tasks.component';

describe('PausedTasksComponent', () => {
  let component: PausedTasksComponent;
  let fixture: ComponentFixture<PausedTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PausedTasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PausedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
