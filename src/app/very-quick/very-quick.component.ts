import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lsim-very-quick',
  templateUrl: './very-quick.component.html',
  styleUrls: ['./very-quick.component.scss'],
})
export class VeryQuickComponent implements OnInit {

  @Output() turnOn = new EventEmitter()
  @Output() turnOff = new EventEmitter()
  @Output() intervals = new EventEmitter()
  @Output() periodLengthMin = new EventEmitter()
  @Output() settingsChanged = new EventEmitter()

  @Input() periodLength

  veryQuickModes: String[] = ['Continuous very quick', 'Group very quick', 'Interrupted very quick']
  selectedVeryQuickMode: String
  groupSize: number

  constructor() {
    this.selectedVeryQuickMode = this.veryQuickModes[0]
    this.groupSize = 2
  }

  ngOnInit() {}

  isGroupSizeVisible() {
    switch (this.selectedVeryQuickMode) {
      case 'Continuous very quick':
      case 'Interrupted very quick':
        return false
      case 'Group very quick':
        return true
    }
  }

  isPeriodLengthVisible() {
    switch (this.selectedVeryQuickMode) {
      case 'Continuous very quick':
        return false
      case 'Group very quick':
      case 'Interrupted very quick':
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

    switch(this.selectedVeryQuickMode) {
      case 'Continuous very quick':
        return `VQ ${getColorCharacter()}`
      case 'Group very quick':
        return `VQ(${this.groupSize}) ${getColorCharacter()} ${periodLength}s`
      case 'Interrupted very quick':
        return `I.VQ ${getColorCharacter()} ${periodLength}s`
    }
  }

  onVeryQuickModeChange(event) {
    this.selectedVeryQuickMode = event.detail.value
    if (this.selectedVeryQuickMode == 'Interrupted very quick') {
      this.periodLengthMin.emit(8)
    }
    this.settingsChanged.emit()
  }

  onGroupSizeChange(event) {
    this.groupSize = event.detail.value
    // Minimum period length should be group size + 3, to leave at least 3 seconds of darkness before the group starts
    // again
    this.periodLengthMin.emit(this.groupSize + 3)

    this.settingsChanged.emit()
  }

  start() {
    switch (this.selectedVeryQuickMode) {
      case 'Continuous very quick':
        this.continuousVeryQuick()
        break
      case 'Group very quick':
        this.groupVeryQuick()
        break
      case 'Interrupted very quick':
        this.interruptedVeryQuick()
        break
    }
  }

  continuousVeryQuick() {
    const period = 500

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
    }, 200)
  }

  groupVeryQuick() {
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

      time += 250

      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 250
    }

    this.intervals.emit(intervals)
  }

  interruptedVeryQuick() {
    let intervals = []
    let time = 0
    const period = this.periodLength * 1000
    const onPeriod = this.periodLength * (2/3) * 1000

    for (time; time < onPeriod; time) {
      setTimeout(() => {
        this.turnOn.emit()
        intervals.push(setInterval(() => {
          this.turnOn.emit()
        }, period))
      }, time)

      time += 200

      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 300
    }

    this.intervals.emit(intervals)
  }

}
