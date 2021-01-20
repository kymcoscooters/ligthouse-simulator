import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lsim-quick',
  templateUrl: './quick.component.html',
  styleUrls: ['./quick.component.scss'],
})
export class QuickComponent implements OnInit {

  @Output() turnOn = new EventEmitter()
  @Output() turnOff = new EventEmitter()
  @Output() intervals = new EventEmitter()
  @Output() periodLengthMin = new EventEmitter()
  @Output() settingsChanged = new EventEmitter()

  @Input() periodLength

  quickModes: String[] = ['continuous-quick', 'group-quick', 'interrupted-quick']
  selectedQuickMode: String
  groupSize: number

  constructor() {
    this.selectedQuickMode = this.quickModes[0]
    this.groupSize = 2
  }

  ngOnInit() {}

  isGroupSizeVisible() {
    switch (this.selectedQuickMode) {
      case 'continuous-quick':
      case 'interrupted-quick':
        return false
      case 'group-quick':
        return true
    }
  }

  isPeriodLengthVisible() {
    switch (this.selectedQuickMode) {
      case 'continuous-quick':
        return false
      case 'group-quick':
      case 'interrupted-quick':
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

    switch(this.selectedQuickMode) {
      case 'continuous-quick':
        return `Q ${getColorCharacter()}`
      case 'group-quick':
        return `Q(${this.groupSize}) ${getColorCharacter()} ${periodLength}s`
      case 'interrupted-quick':
        return `I.Q ${getColorCharacter()} ${periodLength}s`
    }
  }

  onQuickModeChange() {
    if (this.selectedQuickMode == 'interrupted-quick') {
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
    switch (this.selectedQuickMode) {
      case 'continuous-quick':
        this.continuousQuick()
        break
      case 'group-quick':
        this.groupQuick()
        break
      case 'interrupted-quick':
        this.interruptedQuick()
        break
    }
  }

  continuousQuick() {
    const period = 1050

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
    }, 450)
  }

  groupQuick() {
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

      time += 450

      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 450
    }

    this.intervals.emit(intervals)
  }

  interruptedQuick() {
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

      time += 450

      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 600
    }

    this.intervals.emit(intervals)
  }
}
