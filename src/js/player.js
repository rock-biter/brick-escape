import * as THREE from 'three'
import gsap from 'gsap'

export default class Player {

  isMoving = false
  stop = false

  constructor({ scene, cell }) {
    this.scene = scene
    this.cellSize = cell.size

    console.log(cell)
    this.currentCell = cell

    this.init(cell)
  }


  init(cell) {

    const player = new THREE.BoxBufferGeometry(this.cellSize/4, this.cellSize/4,this.cellSize/4)
    const playerPhongMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'), 
      transparent: true, 
      opacity: 1, 
      side: THREE.FrontSide
    })

    this.mesh = new THREE.Mesh(player,playerPhongMaterial)
    // pMesh.castShadow = true
    this.resetPosition(cell)

    this.scene.scene.add(this.mesh)

    

    this.addLight()

    this.initControls()

  }

  addLight() {
    this.playerLight = new THREE.PointLight( '#dba98c', 25 ,12, 3  )
	// const playerLight = new THREE.PointLight( '#FFDFCD', 4 ,100, 2  )
    this.playerLight.position.set(0,6,0)
    this.playerLight.castShadow = true
    this.playerLight.shadow.radius = 25
    this.playerLight.shadow.bias = 0.001
    this.playerLight.shadow.normalBias = 0.1
    this.playerLight.shadow.mapSize.width = 1024*2; // default
    this.playerLight.shadow.mapSize.height = 1024*2; // default
    // playerLight.shadow.camera.near = 0.5; // default
    // playerLight.shadow.camera.far = 500; // default
    // playerLight.shadow.camera.fov = 145
    // playerLight.shadow.camera.updateProjectionMatrix()
    // playerLight.power = 20
    this.mesh.add(this.playerLight)
  }

  resetPosition(cell) {
    const x = cell.i*this.cellSize
    const z = cell.j*this.cellSize

    const position = new THREE.Vector3(x,0,z)
    this.mesh.position.copy(position)
    this.scene.camera.position.set(x,25,z)
    this.scene.camera.rotation.set(-Math.PI/2,0,0)
    // this.scene.controls.target.set(x,0,z)
  }


  moveTo(cell) {
    const x = cell.i*this.cellSize
    const z = cell.j*this.cellSize

    this.isMoving = true

    gsap.to(this.scene.camera.position,{duration: 1, x: x, z: z, ease: 'linear' })

    gsap.to(this.mesh.position,{duration: 1, x: x, z: z, ease: 'linear', onComplete: () => {
      

      if(cell.connections.length == 2 && !this.stop) {
        const nextCell = cell.connections.find(el => el.index !== this.currentCell.index)

        this.currentCell = cell
        this.moveTo(nextCell)
      } else {
        this.currentCell = cell
        this.isMoving = false
        this.stop = false
      }

    } })
    // gsap.to(this.mesh.position,{duration: 1, x: x, y: y, z: z, ease: 'linear' })


  }

  initControls() {

    window.addEventListener('keyup',(e) => {
      console.log(e)
      const key = e.code

      if(this.isMoving) {
        this.stop = true
        return
      }
      
      switch(key) {
        case 'ArrowUp':
          this.moveUp()
          break;
        case 'ArrowDown':
          this.moveDown()
          break;
        case 'ArrowRight':
          this.moveRight()
          break;
        case 'ArrowLeft':
          this.moveLeft()
          break;
      }

    })

  }

  moveUp() {

    const neighborIndex = this.currentCell.index - this.currentCell.resolution
    const n = this.currentCell.connections.find(el => el.index == neighborIndex)
    console.log(neighborIndex, this.currentCell.index, n)

    if(n) {
      this.moveTo(n)
    } else {
      console.log('connection up not found')
    }

  }

  moveDown() {

    const neighborIndex = this.currentCell.index + this.currentCell.resolution
    const n = this.currentCell.connections.find(el => el.index == neighborIndex)

    if(n) {
      this.moveTo(n)
    } else {
      console.log('connection down not found')
    }

  }

  moveLeft() {

    const neighborIndex = this.currentCell.index - 1
    const n = this.currentCell.connections.find(el => el.index == neighborIndex)

    if(n) {
      this.moveTo(n)
    } else {
      console.log('connection down not found')
    }

  }

  moveRight() {

    const neighborIndex = this.currentCell.index + 1
    const n = this.currentCell.connections.find(el => el.index == neighborIndex)

    if(n) {
      this.moveTo(n)
    } else {
      console.log('connection down not found')
    }

  }
  

}