import { Component, ElementRef, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Flashlight } from '@ionic-native/flashlight/ngx'
import { ColorModeComponent } from '../color-mode/color-mode.component';

@Component({
  selector: 'lsim-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  flashlight = new Flashlight();

  // colorModes: String[]
  selectedColorMode: String

  lightModes: String[] = ['Fixed', 'Flashing', 'Isophase']
  selectedLightMode: String

  flashingModes: String[] = ['Single-flashing', 'Long-flashing', 'Group-flashing', 'Composite group-flashing']
  selectedFlashingMode: String

  periodLength
  flashProm
  intervals
  cancel
  running
  modeAbbreviation

  @ViewChild('content') content: ElementRef
  @ViewChild('range') range
  @ViewChild('periodLengthContainer') periodLengthContainer
  @ViewChild('flashingModeContainer') flashingModeContainer
  @ViewChild('footerBar') footerBar
  @ViewChild(ColorModeComponent) colorMode

  constructor(
    private platform: Platform
  ) {
    /* if (this.platform.is('capacitor')) {
      this.colorModes = ['LED', 'White', 'Green', 'Red']
    } else {
      this.colorModes = ['White', 'Green', 'Red']
    }

    this.selectedColorMode = this.colorModes[0] */
    this.selectedLightMode = this.lightModes[0]
    // this.modeAbbreviation = this.setModeAbbreviation()
  }

  start() {
    this.cancel = this.startFlashing().cancel
    console.log(this.colorMode.selectedColorMode)
  }

  testing(event) {
    console.log(event)
  }

  startFlashing() {
    let finished = false
    let cancel = () => {
      finished = true
      console.log('canceling')
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
      

      switch (this.selectedLightMode) {
        case 'Fixed':
          this.turnOn()
          break
        case 'Flashing':
          this.flashing()
          break
        case 'Isophase':
          this.isophase()
          break
      }
      

      cancel = () => {
        if (finished) {
          return
        }

        console.log('stopping')
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
      console.log('rejectedd')
      finished = true
      return err
    })

    return { promise, cancel }
  }

  cancelFlash() {
    this.flashProm.cancel()
    this.flashProm = undefined
  }

/*   onColorModeChange(event) {
    console.log(this.flashProm?.st)
    this.selectedColorMode = event.detail.value
    this.modeAbbreviation = this.setModeAbbreviation()
  } */

  onLightModeChange(event) {
    this.selectedLightMode = event.detail.value

    switch (this.selectedLightMode) {
      case 'Fixed':
        this.periodLengthContainer.nativeElement.classList.add('hidden')
        break
      case 'Flashing':
        this.periodLengthContainer.nativeElement.classList.remove('hidden')
        this.periodLength = this.range.min
        this.flashingModeContainer.nativeElement.classList.remove('hidden')
        break
      case 'Isophase':
        this.periodLengthContainer.nativeElement.classList.remove('hidden')
        this.periodLength = this.range.min
        break
    }

    this.setModeAbbreviation()
  }

  onFlashingModeChange(event) {
    this.selectedFlashingMode = event.detail.value
    this.setModeAbbreviation()
  }

  onPeriodLengthChange(event) {
    this.periodLength = event.detail.value
    this.setModeAbbreviation()
  }

  turnOn() {
    console.log('turning on')
    if (this.selectedColorMode != 'LED') {
      this.content.nativeElement.classList.add(this.selectedColorMode)
      this.content.nativeElement.classList.remove('black')
    } else {
      this.flashlight.switchOn()
    }
  }

  turnOff() {
    console.log('turning off')
    if (this.selectedColorMode != 'LED') {
      this.content.nativeElement.classList.remove(this.selectedColorMode)
      this.content.nativeElement.classList.add('black')
    } else {
      this.flashlight.switchOff()
    }
  }

  flashing() {
    const period = this.periodLength * 1000
    this.turnOn()
    const on = setInterval(() => {
      this.turnOn()
    }, period)
    setTimeout(() => {
      this.turnOff()
      const off = setInterval(() => {
        this.turnOff()
      }, period)
      this.intervals = [on, off]
    }, 500)
  }

  isophase() {
    const period = this.periodLength * 1000
    this.turnOn()
    const on = setInterval(() => {
      this.turnOn()
    }, period)
    setTimeout(() => {
      this.turnOff()
      const off = setInterval(() => {
        this.turnOff()
      }, period)
      this.intervals = [on, off]
    }, period/2)
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
    const getColorCharacter = () => {
      switch (this.colorMode.selectedColorMode) {
        case 'LED':
        case 'White':
          return 'W'
        case 'Red':
          return 'R'
        case 'Green':
          return 'G'
      }
    }

    console.log('heeere')
    switch (this.selectedLightMode) {
      case 'Fixed':
        this.modeAbbreviation = `F ${getColorCharacter()}`
        break;
      case 'Flashing':
        this.modeAbbreviation = `Fl ${getColorCharacter()} ${this.periodLength}s`
        break;
      case 'Isophase':
        this.modeAbbreviation = `Iso ${getColorCharacter()} ${this.periodLength}s`
        break;
    }
  }
}
