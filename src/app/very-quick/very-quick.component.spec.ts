import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VeryQuickComponent } from './very-quick.component';

describe('VeryQuickComponent', () => {
  let component: VeryQuickComponent;
  let fixture: ComponentFixture<VeryQuickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VeryQuickComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VeryQuickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
