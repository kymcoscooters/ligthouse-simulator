import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ColorModeComponent } from '../color-mode/color-mode.component';
import { LightModeComponent } from '../light-mode/light-mode.component';
import { FlashingComponent } from '../flashing/flashing.component';
import { OccultingComponent } from '../occulting/occulting.component';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    ColorModeComponent,
    LightModeComponent,
    FlashingComponent,
    OccultingComponent
  ]
})
export class HomePageModule {}
