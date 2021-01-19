import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CardinalMarksComponent } from '../cardinal-marks/cardinal-marks.component';
import { CartaMarinaComponent } from '../carta-marina/carta-marina.component';
import { FlashingComponent } from '../flashing/flashing.component';
import { MorseComponent } from '../morse/morse.component';
import { OccultingComponent } from '../occulting/occulting.component';
import { QuickComponent } from '../quick/quick.component';
import { UltraQuickComponent } from '../ultra-quick/ultra-quick.component';
import { VeryQuickComponent } from '../very-quick/very-quick.component';

@Component({
  selector: 'lsim-light-mode',
  templateUrl: './light-mode.component.html',
  styleUrls: ['./light-mode.component.scss'],
})
export class LightModeComponent implements OnInit {
  lightModes: String[]
  selectedLightMode: String
  periodLength: number
  periodLengthVisible: boolean

  @ViewChild('periodLengthSlider') periodLengthSlider
  @ViewChild(FlashingComponent) flashingComponent
  @ViewChild(OccultingComponent) occultingComponent
  @ViewChild(QuickComponent) quickComponent
  @ViewChild(VeryQuickComponent) veryQuickComponent
  @ViewChild(UltraQuickComponent) ultraQuickcomponent
  @ViewChild(MorseComponent) morseComponent
  @ViewChild(CartaMarinaComponent) cartaMarinaComponent
  @ViewChild(CardinalMarksComponent) cardinalMarksComponent

  @Output() turnOn = new EventEmitter()
  @Output() turnOff = new EventEmitter()
  @Output() intervals = new EventEmitter()
  @Output() settingsChanged = new EventEmitter()

  constructor() {
    this.lightModes = [
      'Fixed',
      'Flashing',
      'Isophase',
      'Occulting',
      'Quick',
      'Very quick',
      'Ultra quick',
      'Morse',
      'Carta Marina',
      'Cardinal Marks'
    ]
    this.selectedLightMode = this.lightModes[0]
    this.periodLength = 2
    this.periodLengthVisible = false
  }

  ngOnInit() {}

  onLightModeChange(event) {
    this.selectedLightMode = event.detail.value
    if (this.selectedLightMode == 'Morse') {
      this.setPeriodLengthMin(6)
    }
    this.onSettingsChanged()
  }

  onPeriodLengthChange(event) {
    this.periodLength = event.detail.value
    this.onSettingsChanged()
  }

  emitTurnOn() {
    this.turnOn.emit()
  }

  emitTurnOff() {
    this.turnOff.emit()
  }

  setIntervals(intervals) {
    this.intervals.emit(intervals)
  }

  onSettingsChanged() {
    this.settingsChanged.emit()
    this.periodLengthVisible = this.isPeriodLengthVisible()
  }

  start() {
    switch (this.selectedLightMode) {
      case 'Fixed':
        this.emitTurnOn()
        break
      case 'Flashing':
        this.flashingComponent.start()
        break
      case 'Isophase':
        this.isophase()
        break
      case 'Occulting':
        this.occultingComponent.start()
        break
      case 'Quick':
        this.quickComponent.start()
        break
      case 'Very quick':
        this.veryQuickComponent.start()
        break
      case 'Ultra quick':
        this.ultraQuickcomponent.start()
        break
      case 'Morse':
        this.morseComponent.start()
        break
      case 'Carta Marina':
        this.cartaMarinaComponent.start()
      case 'Cardinal Marks':
        this.cardinalMarksComponent.start()
    }
  }

  isophase() {
    const period = this.periodLength * 1000

    this.emitTurnOn()

    const on = setInterval(() => {
      this.emitTurnOn()
    }, period)

    setTimeout(() => {
      this.emitTurnOff()
      const off = setInterval(() => {
        this.emitTurnOff()
      }, period)
      this.setIntervals([on, off])
    }, period/2)
  }

  isPeriodLengthVisible() {
    switch (this.selectedLightMode) {
      case 'Fixed':
      case 'Carta Marina':
      case 'Cardinal Marks':
        return false
      case 'Flashing':
      case 'Isophase':
      case 'Occulting':
      case 'Morse':
        return true
      case 'Quick':
        return this.quickComponent?.isPeriodLengthVisible()
      case 'Very quick':
        return this.veryQuickComponent.isPeriodLengthVisible()
      case 'Ultra quick':
        return this.ultraQuickcomponent.isPeriodLengthVisible()
    }
  }

  setPeriodLengthMin(min) {
    if (this.periodLength < min) {
      this.periodLengthSlider.value = min
      this.periodLength = min
    }
    this.periodLengthSlider.min = min
  }

  getModeAbbreviation(color) {
    const getColorCharacter = () => {
      switch (color) {
        case 'LED':
        case 'White':
          return 'W'
        case 'Red':
          return 'R'
        case 'Green':
          return 'G'
      }
    }

    switch (this.selectedLightMode) {
      case 'Fixed':
        return `F ${getColorCharacter()}`
      case 'Flashing':
        return this.flashingComponent?.getModeAbbreviation(color, this.periodLength)
      case 'Isophase':
        return `Iso ${getColorCharacter()} ${this.periodLength}s`
      case 'Occulting':
        return this.occultingComponent?.getModeAbbreviation(color, this.periodLength)
      case 'Quick':
        return this.quickComponent?.getModeAbbreviation(color, this.periodLength)
      case 'Very quick':
        return this.veryQuickComponent.getModeAbbreviation(color, this.periodLength)
      case 'Ultra quick':
        return this.ultraQuickcomponent.getModeAbbreviation(color, this.periodLength)
      case 'Morse':
        return this.morseComponent.getModeAbbreviation(color, this.periodLength)
      case 'Carta Marina':
        return this.cartaMarinaComponent.getModeAbbreviation(color)
      case 'Cardinal Marks':
        return this.cardinalMarksComponent.getModeAbbreviation(color)
    }
  }
}
