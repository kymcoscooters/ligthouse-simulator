import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lsim-occulting',
  templateUrl: './occulting.component.html',
  styleUrls: ['./occulting.component.scss'],
})
export class OccultingComponent implements OnInit {

  @Output() turnOn = new EventEmitter()
  @Output() turnOff = new EventEmitter()
  @Output() intervals = new EventEmitter()
  @Output() periodLengthMin = new EventEmitter()
  @Output() settingsChanged = new EventEmitter()

  @Input() periodLength

  occultingModes: String[] = ['single-occulting', 'group-occulting', 'composite-group-occulting']
  selectedOccultingMode: String
  groupSize: number
  compositeGroupSize: number

  constructor() {
    this.selectedOccultingMode = this.occultingModes[0]
    this.groupSize = 2
    this.compositeGroupSize = 1
  }

  ngOnInit() {}

  isGroupSizeVisible() {
    switch (this.selectedOccultingMode) {
      case 'single-occulting':
        return false
      case 'group-occulting':
      case 'composite-group-occulting':
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

    switch(this.selectedOccultingMode) {
      case 'single-occulting':
        return `Oc ${getColorCharacter()} ${periodLength}s`
      case 'group-occulting':
        return `Oc(${this.groupSize}) ${getColorCharacter()} ${periodLength}s`
      case 'composite-group-occulting':
        return `Oc(${this.groupSize}+${this.compositeGroupSize}) ${getColorCharacter()} ${periodLength}s`
    }
  }

  onOccultingModeChange() {
    switch (this.selectedOccultingMode) {
      case 'single-occulting':
        this.periodLengthMin.emit(2)
        break
    }
    this.settingsChanged.emit()
  }

  onGroupSizeChange(event) {
    this.groupSize = event.detail.value
    // Minimum period length should be group size + 3, to leave at least 3 seconds of light before the group starts
    // again. If composite group occulting is selected, additional time should be added
    if(this.selectedOccultingMode == 'group-occulting') {
      this.periodLengthMin.emit(this.groupSize + 3)
    } else {
      this.periodLengthMin.emit(this.groupSize + this.compositeGroupSize + 5)
    }
    this.settingsChanged.emit()
  }

  onCompositeGroupSizeChange(event) {
    this.compositeGroupSize = event.detail.value
    // Minimum period length should be group size + composite group size + 5, to leave at least 3 seconds of light
    // before the group starts again, and 2 seconds between the two groups
    this.periodLengthMin.emit(this.groupSize + this.compositeGroupSize + 5)
    this.settingsChanged.emit()
  }

  start() {
    switch (this.selectedOccultingMode) {
      case 'single-occulting':
        this.singleOcculting()
        break
      case 'group-occulting':
        this.groupOcculting()
        break
      case 'composite-group-occulting':
        this.compositeGroupOcculting()
        break
    }
  }

  singleOcculting() {
    const period = this.periodLength * 1000

    this.turnOff.emit()

    const off = setInterval(() => {
      this.turnOff.emit()
    }, period)

    setTimeout(() => {
      this.turnOn.emit()
      const on = setInterval(() => {
        this.turnOn.emit()
      }, period)
      this.intervals.emit([on, off])
    }, 500)
  }

  groupOcculting() {
    let intervals = []
    let time = 0
    const period = this.periodLength * 1000

    for (let i = 0; i < this.groupSize; i++) {
      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 500

      setTimeout(() => {
        this.turnOn.emit()
        intervals.push(setInterval(() => {
          this.turnOn.emit()
        }, period))
      }, time)

      time += 500
    }

    this.intervals.emit(intervals)
  }

  compositeGroupOcculting() {
    let intervals = []
    let time = 0
    const period = this.periodLength * 1000

    for (let i = 0; i < this.groupSize; i++) {
      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 500

      setTimeout(() => {
        this.turnOn.emit()
        intervals.push(setInterval(() => {
          this.turnOn.emit()
        }, period))
      }, time)

      time += 500
    }

    time += 2000

    for (let j = 0; j < this.compositeGroupSize; j++) {
      setTimeout(() => {
        this.turnOff.emit()
        intervals.push(setInterval(() => {
          this.turnOff.emit()
        }, period))
      }, time)

      time += 500

      setTimeout(() => {
        this.turnOn.emit()
        intervals.push(setInterval(() => {
          this.turnOn.emit()
        }, period))
      }, time)

      time += 500
    }

    this.intervals.emit(intervals)
  }

}
