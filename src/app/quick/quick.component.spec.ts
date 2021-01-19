import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuickComponent } from './quick.component';

describe('QuickComponent', () => {
  let component: QuickComponent;
  let fixture: ComponentFixture<QuickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QuickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
