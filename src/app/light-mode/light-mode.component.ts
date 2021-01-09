import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FlashingComponent } from '../flashing/flashing.component';

@Component({
  selector: 'lsim-light-mode',
  templateUrl: './light-mode.component.html',
  styleUrls: ['./light-mode.component.scss'],
})
export class LightModeComponent implements OnInit {
  lightModes: String[]
  selectedLightMode: String
  periodLength: number

  @ViewChild('periodLengthContainer') periodLengthContainer
  @ViewChild('periodLengthSlider') periodLengthSlider
  @ViewChild(FlashingComponent) flashingComponent

  @Output() lightModeChange = new EventEmitter<String>()
  @Output() periodLengthChange = new EventEmitter<String>()
  @Output() turnOn = new EventEmitter()
  @Output() turnOff = new EventEmitter()
  @Output() intervals = new EventEmitter()


  constructor() {
    this.lightModes = ['Fixed', 'Flashing', 'Isophase']
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
}
