import * as THREE from 'three'

export default class Wall {

  mesh
  active = true

  constructor({ geometry , material, position, scene }) {
    this.geometry = geometry
    this.material = material
    this.position = position
    this.scene = scene
  }

  addMesh() {
    if(!this.active) return
    this.mesh = new THREE.Mesh(this.geometry,this.material)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.mesh.position.copy(this.position)
    this.scene.scene.add(this.mesh)

  }

  removeMesh() {
    if(!this.active) return
    this.scene.scene.remove(this.mesh)
  }

}