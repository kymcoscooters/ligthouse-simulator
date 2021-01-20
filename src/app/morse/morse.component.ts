import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lsim-morse',
  templateUrl: './morse.component.html',
  styleUrls: ['./morse.component.scss'],
})
export class MorseComponent implements OnInit {

  @Output() turnOn = new EventEmitter()
  @Output() turnOff = new EventEmitter()
  @Output() intervals = new EventEmitter()
  @Output() periodLengthMin = new EventEmitter()
  @Output() settingsChanged = new EventEmitter()

  @Input() periodLength

  objectKeys = Object.keys

  morseLetters = {
    A: '01',
    B: '1000',
    C: '1010',
    D: '100',
    E: '0',
    F: '0010',
    G: '110',
    H: '0000',
    I: '00',
    J: '0111',
    K: '101',
    L: '0100',
    M: '11',
    N: '10',
    O: '111',
    P: '0110',
    Q: '1101',
    R: '010',
    S: '000',
    T: '1',
    U: '001',
    V: '0001',
    W: '011',
    X: '1001',
    Y: '1011',
    Z: '1100'
  }

  selectedMorseLetter

  constructor() {
    this.selectedMorseLetter = Object.keys(this.morseLetters)[0]
  }

  ngOnInit() {}

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

    return `Mo(${this.selectedMorseLetter}) ${getColorCharacter()} ${periodLength}s`
  }

  onMorseLetterChange(event) {
    this.selectedMorseLetter = event.detail.value
    this.periodLengthMin.emit(6)
    this.settingsChanged.emit()
  }

  start() {
    this.morse()
  }

  morse() {
    let intervals = []
    let time = 0
    const period = this.periodLength * 1000
    const letter = this.morseLetters[this.selectedMorseLetter]

    for (let i = 0; i < letter.length; i++) {
      setTimeout(() => {
        this.turnOn.emit()
        intervals.push(setInterval(() => {
          this.turnOn.emit()
        }, period))
      }, time)

      if (letter[i] == '0') {
        time += 200
      } else {
        time += 600
      }

      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 200
    }

    this.intervals.emit(intervals)
  }
}
