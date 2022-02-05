import * as THREE from 'three'
import gsap from 'gsap'

const playerWin = new Event('win');

export default class Player {

  isMoving = false
  stop = false
  win = false

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
    // this.resetPosition(cell)

    this.scene.scene.add(this.mesh)

    this.addLight()

    // this.initControls()
    this.startPosition(cell)

  }

  addLight() {
    this.light = new THREE.PointLight( '#dba98c', 0 ,12, 3  )
	// const playerLight = new THREE.PointLight( '#FFDFCD', 4 ,100, 2  )
    this.light.position.set(0,6,0)
    this.light.castShadow = true
    this.light.shadow.radius = 25
    this.light.shadow.bias = 0.001
    this.light.shadow.normalBias = 0.1
    this.light.shadow.mapSize.width = 1024*2; // default
    this.light.shadow.mapSize.height = 1024*2; // default
    // playerLight.shadow.camera.near = 0.5; // default
    this.light.shadow.camera.far = 30; // default
    // playerLight.shadow.camera.fov = 145
    // playerLight.shadow.camera.updateProjectionMatrix()
    // playerLight.power = 20
    this.mesh.add(this.light)
  }

  startPosition(cell) {
    this.resetPosition(cell)

    gsap.to(this.light,{duration: 4, intensity: 25 })
    gsap.to(this.scene.camera.position,{duration: 2, z: cell.j*this.cellSize})
    gsap.to(this.mesh.position,{duration: 2, z: cell.j*this.cellSize, onComplete: () => {
      this.initControls()
    } })
  }

  resetPosition(cell) {
    const x = cell.i*this.cellSize
    const z = cell.j*this.cellSize

    const position = new THREE.Vector3(x,0,z + this.cellSize*1.5)
    this.mesh.position.copy(position)
    this.scene.camera.position.set(x,35,z + this.cellSize*1.5)
    this.scene.camera.rotation.set(-Math.PI/2,0,0)
    // this.scene.controls.target.set(x,0,z)
	  
  }


  moveTo(cell) {

    
    const x = cell.i*this.cellSize
    const z = cell.j*this.cellSize

    this.isMoving = true

    gsap.to(this.scene.camera.position,{duration: 0.5, x: x, z: z, ease: 'linear' })

    gsap.to(this.mesh.position,{duration: 0.5, x: x, z: z, ease: 'linear', onComplete: () => {

      
      if(cell.isExit) {
        window.dispatchEvent(playerWin)

        gsap.to(cell.walls[1].material.color,{duration: 3, r: 0.29, g: 0.78, b: 0.02})
        gsap.to(this.mesh.position,{duration: 3, z: -cell.size*1.5, onComplete: () => {
            this.currentCell = cell
            this.isMoving = false
            this.stop = false            
          } 
        })
      } else if(cell.connections.length == 2 && !this.stop) {
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

    this.initMobileControls()

    window.addEventListener('keyup',(e) => {
      console.log(e)
      const key = e.code

      if(this.win) return

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

  initMobileControls() {
    document.addEventListener('touchstart', this.handleTouchStart, false);        
    document.addEventListener('touchmove', this.handleTouchMove, false);
  }

  getTouches(evt) {
    return evt.touches
  } 

  handleTouchStart = (evt) => {
    const firstTouch = this.getTouches(evt)[0];                                      
    this.xDown = firstTouch.clientX;                                      
    this.yDown = firstTouch.clientY;                                      
  };                                                
                                                                         
  handleTouchMove = (evt) => {
    if ( ! this.xDown || ! this.yDown ) {
        return;
    }

    // if(this.win) return

    if(this.isMoving || this.win) {

      this.xDown = null;
      this.yDown = null; 
      this.stop = true
      return
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = this.xDown - xUp;
    var yDiff = this.yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* right swipe */ 
            this.moveRight()
        } else {
            /* left swipe */
            
            this.moveLeft()
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* down swipe */ 
            this.moveDown()
        } else { 
            /* up swipe */
            this.moveUp()
            
        }                                                                 
    }
    /* reset values */
    this.xDown = null;
    this.yDown = null;                                             
  };

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