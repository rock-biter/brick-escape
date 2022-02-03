import * as THREE from 'three'

export default class Cell {

  walls = [true,true,true,true,true,true,true,true,true]
  visited = false

  neighbors = []

  constructor({i,j,index,size,scene, resolution}) {
    this.i = i
    this.j = j
    this.index = index
    this.size = size
    this.scene = scene
    this.resolution = resolution

    this.setNeighborIndex()

    // console.log(i,j)

    this.createWall()

    for (let i = 0; i < this.walls.length; i++) {
      const a = i % 3 - 1
      const b = Math.floor(i/3) - 1

      if(a === b && a === 0) continue

      const position = new THREE.Vector3(this.i*this.size + (a*this.size/2), 0 , this.j*this.size + (b*this.size/2))

      const mesh = this.buildWall(position)

      this.walls[i] = mesh
      
    }
  }

  createWall() {
    this.geometry = new THREE.BoxBufferGeometry(this.size/2,this.size*1.5,this.size/2)
    this.phongMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#6955A3'), 
      transparent: true, 
      // opacity: 1, 
      side: THREE.FrontSide
    })
  }

  buildWall(position) {

    const mesh = new THREE.Mesh(this.geometry, this.phongMaterial)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.copy(position)
    this.scene.scene.add(mesh)

    return mesh

  }

  setNeighborIndex() {

    const top = this.index - this.resolution
    const bottom = this.index + this.resolution
    const left = this.index - 1
    const right = this.index + 1

    if(top >= 0) {
      this.neighbors.push(top)
    }

    if(right % this.resolution !== 0) {
      this.neighbors.push(right)
    } 

    if(bottom < this.resolution**2) {
      this.neighbors.push(bottom)
    }

    if(this.index % this.resolution !== 0) {
      this.neighbors.push(left)
    }

  }

  connectTo(neighbor) {

    const diff = this.index - neighbor.index

    switch(diff) {
      case this.resolution:
        this.scene.scene.remove(this.walls[1])
        this.scene.scene.remove(neighbor.walls[7])
        break
      case -this.resolution:
        this.scene.scene.remove(this.walls[7])
        this.scene.scene.remove(neighbor.walls[1])
        break
      case 1:
        this.scene.scene.remove(this.walls[3])
        this.scene.scene.remove(neighbor.walls[5])
        break
      case -1:
        this.scene.scene.remove(this.walls[5])
        this.scene.scene.remove(neighbor.walls[3])
        break
    }


  }



}