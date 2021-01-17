import { Component, ElementRef, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Flashlight } from '@ionic-native/flashlight/ngx'
import { ColorModeComponent } from '../color-mode/color-mode.component';
import { LightModeComponent } from '../light-mode/light-mode.component';

@Component({
  selector: 'lsim-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  flashlight = new Flashlight();

  flashProm
  intervals
  cancel
  running
  modeAbbreviation = 'F W'

  @ViewChild('content') content: ElementRef
  @ViewChild('footerBar') footerBar
  @ViewChild(ColorModeComponent) colorMode
  @ViewChild(LightModeComponent) lightMode

  constructor() {}

  start() {
    this.cancel = this.startFlashing().cancel
  }

  startFlashing() {
    let finished = false
    let cancel = () => {
      finished = true
    }

    const promise = new Promise<void>((resolve, reject) => {
      this.running = true
      this.content.nativeElement.classList.add('black')
      const children = this.content.nativeElement.children
      for (let child of children) {
        if (child.id != 'cancel') {
          child.classList.add('hidden')
        }
      }
      
      this.lightMode.start()

      cancel = () => {
        if (finished) {
          return
        }
        this.clearIntervals()
        this.turnOff()
        this.content.nativeElement.classList.remove('black')
        this.showHiddenItems()
        resolve()
      }

      if (finished) {
        cancel()
      }
    })
    .then(() => {
      finished = true
      this.running = false
      return
    })
    .catch((err) => {
      finished = true
      return err
    })

    return { promise, cancel }
  }

  cancelFlash() {
    this.flashProm.cancel()
    this.flashProm = undefined
  }

  turnOn() {
    console.log('turning on')
    if (this.colorMode.selectedColorMode != 'LED') {
      this.content.nativeElement.classList.add(this.colorMode.selectedColorMode)
      this.content.nativeElement.classList.remove('black')
    } else {
      this.flashlight.switchOn()
    }
  }

  turnOff() {
    console.log('turning off')
    if (this.colorMode.selectedColorMode != 'LED') {
      this.content.nativeElement.classList.remove(this.colorMode.selectedColorMode)
      this.content.nativeElement.classList.add('black')
    } else {
      this.flashlight.switchOff()
    }
  }

  setIntervals(event) {
    this.intervals = event
  }

  clearIntervals() {
    this.intervals?.forEach((id) => {
      clearInterval(id)
    })
  }

  showHiddenItems() {
    const children = this.content.nativeElement.children
    for (let child of children) {
      child.classList.remove('hidden')
    }
  }

  setModeAbbreviation() {
    this.modeAbbreviation = this.lightMode.getModeAbbreviation(this.colorMode.selectedColorMode)
  }
}
