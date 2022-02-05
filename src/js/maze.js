import * as THREE from 'three'

import Cell from "./cell"
import Wall from "./wall"

export default class Maze {

  cells = []
  walls = []
  pillars = []
  startCell
  exitCell

  stack = []
  currentCell = null

  broadphase

  wallGeometry
  wallMaterial

  constructor({ resolution, cellSize, scene }) {
    this.cellSize = cellSize
    this.resolution = resolution
    this.scene = scene

    this.initWallData()

    for (let k = 0; k < this.resolution**2; k++) {
      const i = k % this.resolution
      const j = Math.floor(k / this.resolution)

      const cell = new Cell({i,j,index: k,size: cellSize, scene, resolution, wallGeometry: this.wallGeometry, wallMaterial: this.wallMaterial})
      this.cells.push(cell)
      
    }

    // create angular cell pillars - always present
    for (let k = 0; k < (this.resolution+1)**2; k++) {
      const i = k % (this.resolution+1)
      const j = Math.floor(k / (this.resolution+1))

      const position = new THREE.Vector3( i*this.cellSize - this.cellSize/2, 0, j*this.cellSize - this.cellSize/2 )

      const wall = new Wall({ geometry: this.wallGeometry, material: this.wallMaterial, position, scene: this.scene })
      wall.addMesh()
      this.pillars.push(wall)
      
    }

    this.generate()

    for (const cell of this.cells) {
      cell.buildWalls()
    }
  }

  initWallData() {
    this.wallGeometry = new THREE.BoxBufferGeometry(this.cellSize/2,this.cellSize*1.5,this.cellSize/2)
    this.wallMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#c050f4'), 
      // transparent: true, 
      // opacity: 1, 
      // side: THREE.FrontSide
    })
  }

  generate() {
    // set current cell ramdomly
    this.currentCell = this.cells[ Math.floor(  -this.resolution / 2 + this.resolution**2 / 2 ) ] 
    // mark cell as visited
    this.currentCell.visited = true
    // push cell into stack
    this.stack.push(this.currentCell)
    // while stack is not empty
    while(this.stack.length) {

      // pop cell from stack
      this.currentCell = this.stack.pop()
      // get unvisited neighbors from cell
      const unvisitedNeighborsIndex = this.checkNeighbors(this.currentCell.neighbors)
      const l = unvisitedNeighborsIndex.length

      //if cell has only one unvisited neightbor
      if(l > 1) {
        // push cell to stack
        this.stack.push(this.currentCell)
      }

      // if cell has unvisited neightbors
      if(l) {
        
        //choose one neightbor
        let i = Math.floor( Math.random() * l)
        let neighborsIndex = unvisitedNeighborsIndex[i]
        let nextCell = this.cells[neighborsIndex]

        // remove wall from cells
        this.currentCell.connectTo(nextCell)

        nextCell.visited = true
        this.stack.push(nextCell)

      }

    }

    this.createEntrance()
    this.createExit()



    // this.checkPoints = []

    // for (const cell of this.cells) {
      
    //   this.visitCell(cell)

    // }
    // genera il labirinto
  }

  // "recursive backtracker" algorithm
  visitCell(cell) {
    // console.log(cell.index)
    cell.visited = true
    const unvisitedNeighborsIndex = this.checkNeighbors(cell.neighbors)
    // console.log(unvisitedNeighborsIndex)

    const l = unvisitedNeighborsIndex.length
    
    if(l > 1) {
      this.checkPoints.push(cell)
    }

    if(l > 0 ) {
      let i = Math.floor( Math.random() * l)
      let neighborsIndex = unvisitedNeighborsIndex[i]
      let nextCell = this.cells[neighborsIndex]

      // remove wall between cell and nextCell
      cell.connectTo(nextCell)

      this.visitCell(nextCell)
    } else {

      if(this.checkPoints.length) 
        this.visitCell(this.checkPoints.pop())
    }

  }

  checkNeighbors(neighbors) {
    // console.log(neighbors)
    return neighbors.filter(item => {
     return this.cells[item].visited === false 
    });

  }

  addLoop() {
    //aggiungere connessioni tra celle per creare dei loop nel labirinto
    
  }

  solver() {
    // 
  }

  createEntrance() {

    const coords = {
      i: Math.floor( this.resolution / 2),
      j: this.resolution - 1
    }

    const cell = this.cells.find(cell => cell.i === coords.i && cell.j === coords.j)

    console.log('start at',cell)

    cell.removeWall(2)
    cell.isStart = true
    this.startCell = cell


  }

  createExit() {

    const coords = {
      i: Math.floor( this.resolution / 2),
      j: 0
    }

    const cell = this.cells.find(cell => cell.i === coords.i && cell.j === coords.j)

    console.log('start at',cell)

    cell.removeWall(0)
    cell.isExit = true
    this.exitCell = cell

  }

  

}