import '../scss/app.scss';
import * as THREE from 'three'
import gsap from 'gsap'

import Maze from './maze';
import BasicScene from './scene'
import Player from './player';

if (process.env.NODE_ENV === 'development') {
		require('../index.html');
	}

// console.log('hello world');

const appH = () => {
	const doc = document.documentElement
	doc.style.setProperty('--app-height',`${window.innerHeight}px`)
}


window.addEventListener('DOMContentLoaded', () => {



	const resolution = 20
	const cellSize = 4


	const scene = new BasicScene({
    camera: { type: 'perspective'}, 
    enableShadow: true,
  });

	const maze = new Maze({resolution, cellSize, scene })

	// const startCell = maze.cells[ Math.floor( Math.random() * resolution**2 ) ]
	const startCell = maze.startCell
	const startPosition = {
		x: startCell.i*cellSize,
		z: startCell.j*cellSize
	}

	console.log(startPosition)

	const cameraH = window.innerWidth < 780 ? 20 : 30
	scene.camera.position.set(startPosition.x,cameraH,startPosition.z)

	const player = new Player({ scene, cell: startCell })
	// player.init(startCell)

	// const helper = new THREE.CameraHelper( playerLight.shadow.camera );
	// scene.scene.add( helper );

	// const player = new THREE.BoxBufferGeometry(cellSize/4, cellSize/4,cellSize/4)
	// const playerPhongMaterial = new THREE.MeshPhysicalMaterial({
	// 	color: new THREE.Color('#ffffff'), 
	// 	transparent: true, 
	// 	opacity: 1, 
	// 	side: THREE.FrontSide
	// })

	

	// const pMesh = new THREE.Mesh(player,playerPhongMaterial)
	// // pMesh.castShadow = true
	// pMesh.position.set(startPosition.x,0,startPosition.z)


	// scene.scene.add(pMesh)

	// scene.controls.target = new THREE.Vector3(startPosition.x,0,startPosition.z)


appH()

})

window.addEventListener('win',() => {
	console.log('win event')
	const winMessage = document.getElementById('win')

	gsap.fromTo(winMessage,{y: 100, autoAlpha: 0},{duration: 3, y: 0, autoAlpha: 1 })
})