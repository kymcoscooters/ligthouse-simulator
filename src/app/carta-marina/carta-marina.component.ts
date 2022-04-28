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

  cartaMarinaLights: string[] = [
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
        case 'led':
        case 'white':
          return 'W'
        case 'red':
          return 'R'
        case 'green':
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

  start(sequenceId) {
    switch(this.selectedCartaMarinaLight) {
      case 'Byö':
        this.byö(sequenceId)
        break
      case 'Hyljekrunni':
        this.groupQuick(20, 3, sequenceId)
        break
      case 'Kalla':
        this.kalla(sequenceId)
        break
      case 'Karhi':
      case 'Puukari':
        this.turnOn.emit(sequenceId)
        break
      case 'Laitakari':
        this.groupQuick(4, 2, sequenceId)
        break
      case 'Möyly':
        this.groupFlashing(10, 3, sequenceId)
        break
      case 'Norra Finnbanken':
        this.groupFlashing(20, 2, sequenceId)
        break
      case 'Norrudd':
        this.groupFlashing(45, 4, sequenceId)
        break
      case 'Viira':
        this.groupFlashing(10, 2, sequenceId)
        break
      case 'Ättys':
        this.groupQuick(3, 2, sequenceId)
    }
  }

  byö(sequenceId) {
    const period = 6000

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
    }, 2000)
  }

  kalla(sequenceId) {
    const period = 3000

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
    }, 500)
  }

  groupFlashing(periodLength, groupSize, sequenceId) {
    let time = 0
    const period = periodLength * 1000

    for (let i = 0; i < groupSize; i++) {
      setTimeout(() => {
        this.turnOn.emit(sequenceId)
        this.intervals.emit([
          setInterval(() => {
            this.turnOn.emit(sequenceId)
          }, period),
          sequenceId
        ])
      }, time)

      time += 500

      setTimeout(() => {
        this.turnOff.emit(sequenceId)
        this.intervals.emit([
          setInterval(() => {
            this.turnOff.emit(sequenceId)
          }, period),
          sequenceId
        ])
      }, time)

      time += 500
    }
  }

  groupQuick(periodLength, groupSize, sequenceId) {
    let time = 0
    const period = periodLength * 1000

    for (let i = 0; i < groupSize; i++) {
      setTimeout(() => {
        this.turnOn.emit(sequenceId)
        this.intervals.emit([
          setInterval(() => {
            this.turnOn.emit(sequenceId)
          }, period),
          sequenceId
        ])
      }, time)

      time += 450

      setTimeout(() => {
        this.turnOff.emit(sequenceId)
        this.intervals.emit([
          setInterval(() => {
            this.turnOff.emit(sequenceId)
          }, period),
          sequenceId
        ])
      }, time)

      time += 450
    }
  }

}
