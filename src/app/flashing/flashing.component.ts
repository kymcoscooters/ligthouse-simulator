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
  @Output() settingsChanged = new EventEmitter()

  @Input() periodLength

  flashingModes: String[] = ['Single-flashing', 'Long-flashing', 'Group-flashing', 'Composite group-flashing']
  selectedFlashingMode: String
  groupSize: number
  compositeGroupSize: number

  constructor() {
    this.selectedFlashingMode = this.flashingModes[0]
    this.groupSize = 2
    this.compositeGroupSize = 1
  }

  ngOnInit() {}

  isGroupSizeVisible() {
    switch (this.selectedFlashingMode) {
      case 'Single-flashing':
      case 'Long-flashing':
        return false
      case 'Group-flashing':
      case 'Composite group-flashing':
        return true
    }
  }

  getModeAbbreviation(color, periodLength) {
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

    switch(this.selectedFlashingMode) {
      case 'Single-flashing':
        return `Fl ${getColorCharacter()} ${periodLength}s`
      case 'Long-flashing':
        return `L.Fl ${getColorCharacter()} ${periodLength}s`
      case 'Group-flashing':
        return `Fl(${this.groupSize}) ${getColorCharacter()} ${periodLength}s`
      case 'Composite group-flashing':
        return `Fl(${this.groupSize}+${this.compositeGroupSize}) ${getColorCharacter()} ${periodLength}s`
    }
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
    this.settingsChanged.emit()
  }

  onGroupSizeChange(event) {
    this.groupSize = event.detail.value
    // Minimum period length should be group size + 3, to leave at least 3 seconds of darkness before the group starts
    // again. If composite group flashing is selected, additional time should be added
    if(this.selectedFlashingMode == 'Group-flashing') {
      this.periodLengthMin.emit(this.groupSize + 3)
    } else {
      this.periodLengthMin.emit(this.groupSize + this.compositeGroupSize + 5)
    }
    this.settingsChanged.emit()
  }

  onCompositeGroupSizeChange(event) {
    this.compositeGroupSize = event.detail.value
    // Minimum period length should be group size + composite group size + 5, to leave at least 3 seconds of darkness
    // before the group starts again, and 2 seconds between the two groups
    this.periodLengthMin.emit(this.groupSize + this.compositeGroupSize + 5)
    this.settingsChanged.emit()
  }

  start() {
    switch (this.selectedFlashingMode) {
      case 'Single-flashing':
        this.singleFlashing()
        break
      case 'Long-flashing':
        this.longFlashing()
        break
      case 'Group-flashing':
        this.groupFlashing()
        break
      case 'Composite group-flashing':
        this.compositeGroupFlashing()
        break
    }
  }

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

  groupFlashing() {
    let intervals = []
    let time = 0
    const period = this.periodLength * 1000

    for (let i = 0; i < this.groupSize; i++) {
      setTimeout(() => {
        this.turnOn.emit()
        intervals.push(setInterval(() => {
          this.turnOn.emit()
        }, period))
      }, time)

      time += 500

      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 500
    }

    this.intervals.emit(intervals)
  }

  compositeGroupFlashing() {
    let intervals = []
    let time = 0
    const period = this.periodLength * 1000

    for (let i = 0; i < this.groupSize; i++) {
      setTimeout(() => {
        this.turnOn.emit()
        intervals.push(setInterval(() => {
          this.turnOn.emit()
        }, period))
      }, time)

      time += 500

      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 500
    }

    time += 2000

    for (let j = 0; j < this.compositeGroupSize; j++) {
      setTimeout(() => {
        this.turnOn.emit()
        intervals.push(setInterval(() => {
          this.turnOn.emit()
        }, period))
      }, time)

      time += 500

      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 500
    }

    this.intervals.emit(intervals)
  }
}
