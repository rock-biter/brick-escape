import Cell from "./cell"

export default class Maze {

  cells = []

  broadphase

  constructor({ resolution, cellSize, scene }) {
    this.cellSize = cellSize
    this.resolution = resolution
    this.scene = scene

    for (let k = 0; k < this.resolution**2; k++) {
      const i = k % this.resolution
      const j = Math.floor(k / this.resolution)

      const cell = new Cell({i,j,index: k,size: cellSize, scene, resolution})
      this.cells.push(cell)
      
    }

    this.generate()
  }

  generate() {

    this.checkPoints = []

    for (const cell of this.cells) {
      
      this.visitCell(cell)

    }
    // genera il labirinto
  }

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

  

}