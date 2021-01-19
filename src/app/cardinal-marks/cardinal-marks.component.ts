import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lsim-cardinal-marks',
  templateUrl: './cardinal-marks.component.html',
  styleUrls: ['./cardinal-marks.component.scss'],
})
export class CardinalMarksComponent implements OnInit {

  @Output() turnOn = new EventEmitter()
  @Output() turnOff = new EventEmitter()
  @Output() intervals = new EventEmitter()
  @Output() settingsChanged = new EventEmitter()

  cardinalMarks = ['North', 'East', 'South', 'West']

  selectedCardinalMark: string

  constructor() {
    this.selectedCardinalMark = this.cardinalMarks[0]
  }

  ngOnInit() {}

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

    switch(this.selectedCardinalMark) {
      case 'North':
        return `Q ${getColorCharacter()}`
      case 'East':
        return `Q(3) ${getColorCharacter()} 6s`
      case 'South':
        return `Q(6)+L.Fl ${getColorCharacter()} 12s`
      case 'West':
        return `Q(9) ${getColorCharacter()} 12s`
    }
  }

  onCardinalMarkChange(event) {
    this.selectedCardinalMark = event.detail.value
    this.settingsChanged.emit()
  }

  start() {
    switch(this.selectedCardinalMark) {
      case 'North':
        this.north()
        break
      case 'East':
        this.groupQuick(6, 3)
        break
      case 'South':
        this.south()
        break
      case 'West':
        this.groupQuick(12, 9)
    }
  }

  north() {
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

  south() {
    let intervals = []
    let time = 0
    const period = 12000
    const groupSize = 6

    for (let i = 0; i < groupSize; i++) {
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

    setTimeout(() => {
      this.turnOn.emit()
      intervals.push(setInterval(() => {
        this.turnOn.emit()
      }, period))
    }, time)

    time += 2000

    setTimeout(() => {
      this.turnOff.emit()
      intervals.push(setInterval(() => {
        this.turnOff.emit()
      }, period))
    }, time)

    this.intervals.emit(intervals)
  }

  groupQuick(periodLength, groupSize) {
    let intervals = []
    let time = 0
    const period = periodLength * 1000

    for (let i = 0; i < groupSize; i++) {
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

}
