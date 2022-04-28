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
  lightModes: string[]
  selectedLightMode: string
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
    this.lightModes = [
      'fixed',
      'flashing',
      'isophase',
      'occulting',
      'quick',
      'very-quick',
      'ultra-quick',
      'morse',
      'carta-marina',
      'cardinal-marks'
    ]
    this.selectedLightMode = this.lightModes[0]
    this.periodLength = 2
    this.periodLengthVisible = false
  }

  ngOnInit() {}

  onLightModeChange(event) {
    this.selectedLightMode = event.detail.value
    if (this.selectedLightMode == 'morse') {
      this.setPeriodLengthMin(6)
    }
    this.onSettingsChanged()
  }

  onPeriodLengthChange(event) {
    this.periodLength = event.detail.value
    this.onSettingsChanged()
  }

  emitTurnOn(sequenceId) {
    this.turnOn.emit(sequenceId)
  }

  emitTurnOff(sequenceId) {
    this.turnOff.emit(sequenceId)
  }

  setIntervals(intervals) {
    this.intervals.emit(intervals)
  }

  onSettingsChanged() {
    this.settingsChanged.emit()
    this.periodLengthVisible = this.isPeriodLengthVisible()
  }

  start(sequenceId) {
    switch (this.selectedLightMode) {
      case 'fixed':
        this.emitTurnOn(sequenceId)
        break
      case 'flashing':
        this.flashingComponent.start(sequenceId)
        break
      case 'isophase':
        this.isophase(sequenceId)
        break
      case 'occulting':
        this.occultingComponent.start(sequenceId)
        break
      case 'quick':
        this.quickComponent.start(sequenceId)
        break
      case 'very-quick':
        this.veryQuickComponent.start(sequenceId)
        break
      case 'ultra-quick':
        this.ultraQuickcomponent.start(sequenceId)
        break
      case 'morse':
        this.morseComponent.start(sequenceId)
        break
      case 'carta-marina':
        this.cartaMarinaComponent.start(sequenceId)
        break
      case 'cardinal-marks':
        this.cardinalMarksComponent.start(sequenceId)
        break
    }
  }

  isophase(sequenceId) {
    const period = this.periodLength * 1000

    this.emitTurnOn(sequenceId)

    this.setIntervals([
      setInterval(() => {
        this.emitTurnOn(sequenceId)
      }, period),
      sequenceId
    ])

    setTimeout(() => {
      this.emitTurnOff(sequenceId)
      this.setIntervals([
        setInterval(() => {
          this.emitTurnOff(sequenceId)
        }, period),
        sequenceId
      ])
    }, period/2)
  }

  isPeriodLengthVisible() {
    switch (this.selectedLightMode) {
      case 'fixed':
      case 'carta-marina':
      case 'cardinal-marks':
        return false
      case 'flashing':
      case 'isophase':
      case 'occulting':
      case 'morse':
        return true
      case 'quick':
        return this.quickComponent?.isPeriodLengthVisible()
      case 'very-quick':
        return this.veryQuickComponent.isPeriodLengthVisible()
      case 'ultra-quick':
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
        case 'led':
        case 'white':
          return 'W'
        case 'red':
          return 'R'
        case 'green':
          return 'G'
      }
    }

    switch (this.selectedLightMode) {
      case 'fixed':
        return `F ${getColorCharacter()}`
      case 'flashing':
        return this.flashingComponent?.getModeAbbreviation(color, this.periodLength)
      case 'isophase':
        return `Iso ${getColorCharacter()} ${this.periodLength}s`
      case 'occulting':
        return this.occultingComponent?.getModeAbbreviation(color, this.periodLength)
      case 'quick':
        return this.quickComponent?.getModeAbbreviation(color, this.periodLength)
      case 'very-quick':
        return this.veryQuickComponent.getModeAbbreviation(color, this.periodLength)
      case 'ultra-quick':
        return this.ultraQuickcomponent.getModeAbbreviation(color, this.periodLength)
      case 'morse':
        return this.morseComponent.getModeAbbreviation(color, this.periodLength)
      case 'carta-marina':
        return this.cartaMarinaComponent.getModeAbbreviation(color)
      case 'cardinal-marks':
        return this.cardinalMarksComponent.getModeAbbreviation(color)
    }
  }
}
