import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lsim-flashing',
  templateUrl: './flashing.component.html',
  styleUrls: ['./flashing.component.scss'],
})
export class FlashingComponent implements OnInit {

  @Output() turnOn = new EventEmitter()
  @Output() turnOff = new EventEmitter()
  @Output() intervals = new EventEmitter()
  @Output() periodLengthMin = new EventEmitter()

  @Input() periodLength

  flashingModes: String[] = ['Single-flashing', 'Long-flashing', 'Group-flashing', 'Composite group-flashing']
  selectedFlashingMode: String

  constructor() {
    this.selectedFlashingMode = this.flashingModes[0]
  }

  ngOnInit() {}

  singleFlashing() {
    const period = this.periodLength * 1000
    this.turnOn.emit()
    const on = setInterval(() => {
      this.turnOn.emit()
    }, period)
    setTimeout(() => {
      this.turnOff.emit()
      const off = setInterval(() => {
        this.turnOff.emit()
      }, period)
      this.intervals.emit([on, off])
    }, 500)
  }

  longFlashing() {
    const period = this.periodLength * 1000
    this.turnOn.emit()
    const on = setInterval(() => {
      this.turnOn.emit()
    }, period)
    setTimeout(() => {
      this.turnOff.emit()
      const off = setInterval(() => {
        this.turnOff.emit()
      }, period)
      this.intervals.emit([on, off])
    }, 2000)
  }

  onFlashingModeChange(event) {
    this.selectedFlashingMode = event.detail.value
    switch (this.selectedFlashingMode) {
      case 'Single-flashing':
        this.periodLengthMin.emit(2)
        break
      case 'Long-flashing':
        this.periodLengthMin.emit(5)
    }
  }

  start() {
    switch (this.selectedFlashingMode) {
      case 'Single-flashing':
        this.singleFlashing()
        break
      case 'Long-flashing':
        this.longFlashing()
        break
    }
  }

}
