import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LightModeComponent } from './light-mode.component';

describe('LightModeComponent', () => {
  let component: LightModeComponent;
  let fixture: ComponentFixture<LightModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightModeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LightModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
