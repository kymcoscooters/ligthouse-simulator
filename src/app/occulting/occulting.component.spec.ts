import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OccultingComponent } from './occulting.component';

describe('OccultingComponent', () => {
  let component: OccultingComponent;
  let fixture: ComponentFixture<OccultingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccultingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OccultingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
