import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MorseComponent } from './morse.component';

describe('MorseComponent', () => {
  let component: MorseComponent;
  let fixture: ComponentFixture<MorseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MorseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MorseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
