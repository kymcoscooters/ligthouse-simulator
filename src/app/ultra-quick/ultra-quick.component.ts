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

  ultraQuickModes: string[] = ['continuous-ultra-quick', 'interrupted-ultra-quick']
  selectedUltraQuickMode: string

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

  start(sequenceId) {
    switch (this.selectedUltraQuickMode) {
      case 'continuous-ultra-quick':
        this.continuousUltraQuick(sequenceId)
        break
      case 'interrupted-ultra-quick':
        this.interruptedUltraQuick(sequenceId)
        break
    }
  }

  continuousUltraQuick(sequenceId) {
    const period = 250

    this.turnOn.emit(sequenceId)

    this.intervals.emit([
      setInterval(() => {
        this.turnOn.emit(sequenceId)
      }, period),
      sequenceId
    ])

    setTimeout(() => {
      this.turnOff.emit(sequenceId)
      this.intervals.emit([
        setInterval(() => {
          this.turnOff.emit(sequenceId)
        }, period),
        sequenceId
      ])
    }, 100)
  }

  interruptedUltraQuick(sequenceId) {
    let time = 0
    const period = this.periodLength * 1000
    const onPeriod = this.periodLength * (2/3) * 1000

    for (time; time < onPeriod; time) {
      setTimeout(() => {
        this.turnOn.emit(sequenceId)
        this.intervals.emit([
          setInterval(() => {
            this.turnOn.emit(sequenceId)
          }, period),
          sequenceId
        ])
      }, time)

      time += 100

      setTimeout(() => {
        this.turnOff.emit(sequenceId)
        this.intervals.emit([
          setInterval(() => {
            this.turnOff.emit(sequenceId)
          }, period),
          sequenceId
        ])
      }, time)

      time += 150
    }
  }
}
