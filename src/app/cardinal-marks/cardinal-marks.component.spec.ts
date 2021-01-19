import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardinalMarksComponent } from './cardinal-marks.component';

describe('CardinalMarksComponent', () => {
  let component: CardinalMarksComponent;
  let fixture: ComponentFixture<CardinalMarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardinalMarksComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardinalMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
