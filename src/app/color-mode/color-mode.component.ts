import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'lsim-color-mode',
  templateUrl: './color-mode.component.html',
  styleUrls: ['./color-mode.component.scss'],
})
export class ColorModeComponent implements OnInit {
  colorModes: String[]
  selectedColorMode: String
  @Output() colorChange = new EventEmitter<String>();


  constructor(
    private platform: Platform
  ) {
    if (this.platform.is('capacitor')) {
      this.colorModes = ['LED', 'White', 'Green', 'Red']
    } else {
      this.colorModes = ['White', 'Green', 'Red']
    }

    this.selectedColorMode = this.colorModes[0]
  }

  ngOnInit() {}

  onColorModeChange(event) {
    this.selectedColorMode = event.detail.value
    this.colorChange.emit(event.detail.value)
    //this.modeAbbreviation = this.setModeAbbreviation()
  }

}
