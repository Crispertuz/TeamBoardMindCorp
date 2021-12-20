import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserStoryComponent } from './list-user-story.component';

describe('ListUserStoryComponent', () => {
  let component: ListUserStoryComponent;
  let fixture: ComponentFixture<ListUserStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUserStoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
