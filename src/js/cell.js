import * as THREE from 'three'
import Wall from './wall'

export default class Cell {

  walls = [] //top, right, bottom, left
  visited = false

  neighbors = []
  connections = []

  constructor({i,j,index,size,scene, resolution, wallGeometry, wallMaterial }) {
    this.i = i
    this.j = j
    this.index = index
    this.size = size
    this.scene = scene
    this.resolution = resolution

    this.setNeighborIndex()

    for (let i = 0; i < 4; i++) {

      const position = new THREE.Vector3(0,0,0)
      
      const wall = new Wall({ geometry: wallGeometry, material: wallMaterial, position, scene: this.scene })
      this.walls.push(wall)
      
    }

    let x = i*size
    let z = j*size

    this.walls[0].position.set(x,0,z-size/2) //top
    this.walls[1].position.set(x+size/2,0,z) //right
    this.walls[2].position.set(x,0,z+size/2) //bottom
    this.walls[3].position.set(x-size/2,0,z) //left

    // console.log(i,j)

    // this.createWall()

    // for (let i = 0; i < this.walls.length; i++) {
    //   const a = i % 3 - 1
    //   const b = Math.floor(i/3) - 1

    //   if(a === b && a === 0) continue

    //   const position = new THREE.Vector3(this.i*this.size + (a*this.size/2), 0 , this.j*this.size + (b*this.size/2))

    //   const mesh = this.buildWall(position)

    //   this.walls[i] = mesh
      
    // }
  }

  // createWall() {
  //   this.geometry = new THREE.BoxBufferGeometry(this.size/2,this.size*1.5,this.size/2)
  //   this.phongMaterial = new THREE.MeshPhysicalMaterial({
  //     color: new THREE.Color('#6955A3'), 
  //     transparent: true, 
  //     // opacity: 1, 
  //     side: THREE.FrontSide
  //   })
  // }

  buildWalls() {

    // const mesh = new THREE.Mesh(this.geometry, this.phongMaterial)
    // mesh.castShadow = true
    // mesh.receiveShadow = true
    // mesh.position.copy(position)
    // this.scene.scene.add(mesh)

    // return mesh

    for (const wall of this.walls) {
      wall.addMesh()
    }

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
    
    this.connections.push(neighbor)
    neighbor.connections.push(this)

    const diff = this.index - neighbor.index

    switch(diff) {
      case this.resolution:
        this.scene.scene.remove(this.walls[0].active = false)
        this.scene.scene.remove(neighbor.walls[2].active = false)
        break
      case -this.resolution:
        this.scene.scene.remove(this.walls[2].active = false)
        this.scene.scene.remove(neighbor.walls[0].active = false)
        break
      case 1:
        this.scene.scene.remove(this.walls[3].active = false)
        this.scene.scene.remove(neighbor.walls[1].active = false)
        break
      case -1:
        this.scene.scene.remove(this.walls[1].active = false)
        this.scene.scene.remove(neighbor.walls[3].active = false)
        break
    }


  }



}