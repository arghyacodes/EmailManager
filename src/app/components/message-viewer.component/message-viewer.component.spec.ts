import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageViewerComponent } from './message-viewer.component';

describe('MessageViewerComponent', () => {
  let component: MessageViewerComponent;
  let fixture: ComponentFixture<MessageViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageViewerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
