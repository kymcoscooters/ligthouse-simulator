import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UltraQuickComponent } from './ultra-quick.component';

describe('UltraQuickComponent', () => {
  let component: UltraQuickComponent;
  let fixture: ComponentFixture<UltraQuickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UltraQuickComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UltraQuickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
