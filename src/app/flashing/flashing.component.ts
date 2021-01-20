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

  flashingModes: String[] = ['single-flashing', 'long-flashing', 'group-flashing', 'composite-group-flashing']
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
      case 'single-flashing':
      case 'long-flashing':
        return false
      case 'group-flashing':
      case 'composite-group-flashing':
        return true
    }
  }

  getModeAbbreviation(color, periodLength) {
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

    switch(this.selectedFlashingMode) {
      case 'single-flashing':
        return `Fl ${getColorCharacter()} ${periodLength}s`
      case 'long-flashing':
        return `L.Fl ${getColorCharacter()} ${periodLength}s`
      case 'group-flashing':
        return `Fl(${this.groupSize}) ${getColorCharacter()} ${periodLength}s`
      case 'composite-group-flashing':
        return `Fl(${this.groupSize}+${this.compositeGroupSize}) ${getColorCharacter()} ${periodLength}s`
    }
  }

  onFlashingModeChange() {
    switch (this.selectedFlashingMode) {
      case 'single-flashing':
        this.periodLengthMin.emit(2)
        break
      case 'long-flashing':
        this.periodLengthMin.emit(5)
    }
    this.settingsChanged.emit()
  }

  onGroupSizeChange(event) {
    this.groupSize = event.detail.value
    // Minimum period length should be group size + 3, to leave at least 3 seconds of darkness before the group starts
    // again. If composite group flashing is selected, additional time should be added
    if(this.selectedFlashingMode == 'group-flashing') {
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
      case 'single-flashing':
        this.singleFlashing()
        break
      case 'long-flashing':
        this.longFlashing()
        break
      case 'group-flashing':
        this.groupFlashing()
        break
      case 'composite-group-flashing':
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
