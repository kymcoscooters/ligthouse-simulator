import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FlashingComponent } from '../flashing/flashing.component';
import { OccultingComponent } from '../occulting/occulting.component';

@Component({
  selector: 'lsim-light-mode',
  templateUrl: './light-mode.component.html',
  styleUrls: ['./light-mode.component.scss'],
})
export class LightModeComponent implements OnInit {
  lightModes: String[]
  selectedLightMode: String
  periodLength: number

  @ViewChild('periodLengthSlider') periodLengthSlider
  @ViewChild(FlashingComponent) flashingComponent
  @ViewChild(OccultingComponent) occultingComponent

  @Output() lightModeChange = new EventEmitter<String>()
  @Output() periodLengthChange = new EventEmitter<String>()
  @Output() turnOn = new EventEmitter()
  @Output() turnOff = new EventEmitter()
  @Output() intervals = new EventEmitter()
  @Output() settingsChanged = new EventEmitter()

  constructor() {
    this.lightModes = ['Fixed', 'Flashing', 'Isophase', 'Occulting']
    this.selectedLightMode = this.lightModes[0]
    this.periodLength = 2
  }

  ngOnInit() {}

  onLightModeChange(event) {
    this.selectedLightMode = event.detail.value
    this.lightModeChange.emit(event.detail.value)
  }

  onPeriodLengthChange(event) {
    this.periodLength = event.detail.value
    this.periodLengthChange.emit(event.detail.value)
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
        return false
      case 'Flashing':
      case 'Isophase':
      case 'Occulting':
        return true
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
    }
  }
}
