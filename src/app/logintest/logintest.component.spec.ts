import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogintestComponent } from './logintest.component';

describe('LogintestComponent', () => {
  let component: LogintestComponent;
  let fixture: ComponentFixture<LogintestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogintestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogintestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
