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

  veryQuickModes: string[] = ['continuous-very-quick', 'group-very-quick', 'interrupted-very-quick']
  selectedVeryQuickMode: string
  groupSize: number

  constructor() {
    this.selectedVeryQuickMode = this.veryQuickModes[0]
    this.groupSize = 2
  }

  ngOnInit() {}

  isGroupSizeVisible() {
    switch (this.selectedVeryQuickMode) {
      case 'continuous-very-quick':
      case 'interrupted-very-quick':
        return false
      case 'group-very-quick':
        return true
    }
  }

  isPeriodLengthVisible() {
    switch (this.selectedVeryQuickMode) {
      case 'continuous-very-quick':
        return false
      case 'group-very-quick':
      case 'interrupted-very-quick':
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

    switch(this.selectedVeryQuickMode) {
      case 'continuous-very-quick':
        return `VQ ${getColorCharacter()}`
      case 'group-very-quick':
        return `VQ(${this.groupSize}) ${getColorCharacter()} ${periodLength}s`
      case 'interrupted-very-quick':
        return `I.VQ ${getColorCharacter()} ${periodLength}s`
    }
  }

  onVeryQuickModeChange() {
    if (this.selectedVeryQuickMode == 'interrupted-very-quick') {
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

  start(sequenceId) {
    switch (this.selectedVeryQuickMode) {
      case 'continuous-very-quick':
        this.continuousVeryQuick(sequenceId)
        break
      case 'group-very-quick':
        this.groupVeryQuick(sequenceId)
        break
      case 'interrupted-very-quick':
        this.interruptedVeryQuick(sequenceId)
        break
    }
  }

  continuousVeryQuick(sequenceId) {
    const period = 500

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
    }, 200)
  }

  groupVeryQuick(sequenceId) {
    let time = 0
    const period = this.periodLength * 1000

    for (let i = 0; i < this.groupSize; i++) {
      setTimeout(() => {
        this.turnOn.emit(sequenceId)
        this.intervals.emit([
          setInterval(() => {
            this.turnOn.emit(sequenceId)
          }, period),
          sequenceId
        ])
      }, time)

      time += 250

      setTimeout(() => {
        this.turnOff.emit(sequenceId)
        this.intervals.emit([
          setInterval(() => {
            this.turnOff.emit(sequenceId)
          }, period),
          sequenceId
        ])
      }, time)

      time += 250
    }
  }

  interruptedVeryQuick(sequenceId) {
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

      time += 200

      setTimeout(() => {
        this.turnOff.emit(sequenceId)
        this.intervals.emit([
          setInterval(() => {
            this.turnOff.emit(sequenceId)
          }, period),
          sequenceId
        ])
      }, time)

      time += 300
    }
  }

}
