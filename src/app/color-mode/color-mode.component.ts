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

  @Output() colorChange = new EventEmitter();

  constructor(
    private platform: Platform
  ) {
    if (this.platform.is('capacitor')) {
      this.colorModes = ['led', 'white', 'green', 'red']
    } else {
      this.colorModes = ['white', 'green', 'red']
    }

    this.selectedColorMode = this.colorModes[0]
  }

  ngOnInit() {}

  onColorModeChange() {
    this.colorChange.emit()
  }
}
