import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlashingComponent } from './flashing.component';

describe('FlashingComponent', () => {
  let component: FlashingComponent;
  let fixture: ComponentFixture<FlashingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FlashingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
