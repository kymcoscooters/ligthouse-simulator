import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lsim-ultra-quick',
  templateUrl: './ultra-quick.component.html',
  styleUrls: ['./ultra-quick.component.scss'],
})
export class UltraQuickComponent implements OnInit {

  @Output() turnOn = new EventEmitter()
  @Output() turnOff = new EventEmitter()
  @Output() intervals = new EventEmitter()
  @Output() periodLengthMin = new EventEmitter()
  @Output() settingsChanged = new EventEmitter()

  @Input() periodLength

  ultraQuickModes: String[] = ['continuous-ultra-quick', 'interrupted-ultra-quick']
  selectedUltraQuickMode: String

  constructor() {
    this.selectedUltraQuickMode = this.ultraQuickModes[0]
  }

  ngOnInit() {}

  isPeriodLengthVisible() {
    switch (this.selectedUltraQuickMode) {
      case 'continuous-ultra-quick':
        return false
      case 'interrupted-ultra-quick':
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

    switch(this.selectedUltraQuickMode) {
      case 'continuous-ultra-quick':
        return `UQ ${getColorCharacter()}`
      case 'interrupted-ultra-quick':
        return `I.UQ ${getColorCharacter()} ${periodLength}s`
    }
  }

  onUltraQuickModeChange() {
    if (this.selectedUltraQuickMode == 'interrupted-ultra-quick') {
      this.periodLengthMin.emit(8)
    }
    this.settingsChanged.emit()
  }

  start() {
    switch (this.selectedUltraQuickMode) {
      case 'continuous-ultra-quick':
        this.continuousUltraQuick()
        break
      case 'interrupted-ultra-quick':
        this.interruptedUltraQuick()
        break
    }
  }

  continuousUltraQuick() {
    const period = 250

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
    }, 100)
  }

  interruptedUltraQuick() {
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

      time += 100

      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 150
    }

    this.intervals.emit(intervals)
  }
}
