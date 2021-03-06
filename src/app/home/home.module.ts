import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ColorModeComponent } from '../color-mode/color-mode.component';
import { LightModeComponent } from '../light-mode/light-mode.component';
import { FlashingComponent } from '../flashing/flashing.component';
import { OccultingComponent } from '../occulting/occulting.component';
import { QuickComponent } from '../quick/quick.component';
import { VeryQuickComponent } from '../very-quick/very-quick.component';
import { UltraQuickComponent } from '../ultra-quick/ultra-quick.component';
import { MorseComponent } from '../morse/morse.component';
import { CartaMarinaComponent } from '../carta-marina/carta-marina.component';
import { CardinalMarksComponent } from '../cardinal-marks/cardinal-marks.component';

import { HomePageRoutingModule } from './home-routing.module';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [
    HomePage,
    ColorModeComponent,
    LightModeComponent,
    FlashingComponent,
    OccultingComponent,
    QuickComponent,
    VeryQuickComponent,
    UltraQuickComponent,
    MorseComponent,
    CartaMarinaComponent,
    CardinalMarksComponent
  ]
})
export class HomePageModule {}
