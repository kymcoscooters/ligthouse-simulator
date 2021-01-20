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

  cardinalMarks = ['north', 'east', 'south', 'west']

  selectedCardinalMark: string

  constructor() {
    this.selectedCardinalMark = this.cardinalMarks[0]
  }

  ngOnInit() {}

  getModeAbbreviation(color) {
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

    switch(this.selectedCardinalMark) {
      case 'north':
        return `Q ${getColorCharacter()}`
      case 'east':
        return `Q(3) ${getColorCharacter()} 6s`
      case 'south':
        return `Q(6)+L.Fl ${getColorCharacter()} 12s`
      case 'west':
        return `Q(9) ${getColorCharacter()} 12s`
    }
  }

  onCardinalMarkChange() {
    this.settingsChanged.emit()
  }

  start() {
    switch(this.selectedCardinalMark) {
      case 'north':
        this.north()
        break
      case 'east':
        this.groupQuick(6, 3)
        break
      case 'south':
        this.south()
        break
      case 'west':
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
