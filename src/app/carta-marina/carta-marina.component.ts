import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lsim-carta-marina',
  templateUrl: './carta-marina.component.html',
  styleUrls: ['./carta-marina.component.scss'],
})
export class CartaMarinaComponent implements OnInit {

  @Output() turnOn = new EventEmitter()
  @Output() turnOff = new EventEmitter()
  @Output() intervals = new EventEmitter()
  @Output() settingsChanged = new EventEmitter()

  cartaMarinaLights = [
    'Byö',
    'Hyljekrunni',
    'Kalla',
    'Karhi',
    'Laitakari',
    'Möyly',
    'Norra Finnbanken',
    'Norrudd',
    'Puukari',
    'Viira',
    'Ättys'
  ]

  selectedCartaMarinaLight: string

  constructor() {
    this.selectedCartaMarinaLight = this.cartaMarinaLights[0]
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

    switch(this.selectedCartaMarinaLight) {
      case 'Byö':
        return `L.Fl ${getColorCharacter()} 6s`
      case 'Hyljekrunni':
        return `Q(3) ${getColorCharacter()} 20s`
      case 'Kalla':
        return `Fl ${getColorCharacter()} 3s`
      case 'Karhi':
      case 'Puukari':
        return `F ${getColorCharacter()}`
      case 'Laitakari':
        return `Q(2) ${getColorCharacter()} 4s`
      case 'Möyly':
        return `Fl(3) ${getColorCharacter()} 10s`
      case 'Norra Finnbanken':
        return `Fl(2) ${getColorCharacter()} 20s`
      case 'Norrudd':
        return `Fl(4) ${getColorCharacter()} 45s`
      case 'Viira':
        return `Fl(2) ${getColorCharacter()} 10s`
      case 'Ättys':
        return `Q(2) ${getColorCharacter()} 3s`
    }
  }

  onCartaMarinaLightChange(event) {
    this.selectedCartaMarinaLight = event.detail.value
    this.settingsChanged.emit()
  }

  start() {
    switch(this.selectedCartaMarinaLight) {
      case 'Byö':
        this.byö()
        break
      case 'Hyljekrunni':
        this.groupQuick(20, 3)
        break
      case 'Kalla':
        this.kalla()
        break
      case 'Karhi':
      case 'Puukari':
        this.turnOn.emit()
        break
      case 'Laitakari':
        this.groupQuick(4, 2)
        break
      case 'Möyly':
        this.groupFlashing(10, 3)
        break
      case 'Norra Finnbanken':
        this.groupFlashing(20, 2)
        break
      case 'Norrudd':
        this.groupFlashing(45, 4)
        break
      case 'Viira':
        this.groupFlashing(10, 2)
        break
      case 'Ättys':
        this.groupQuick(3, 2)
    }
  }

  byö() {
    const period = 6000

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

  kalla() {
    const period = 3000

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

  groupFlashing(periodLength, groupSize) {
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
