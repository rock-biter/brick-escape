import '../scss/app.scss';
import * as THREE from 'three'

import Maze from './maze';
import BasicScene from './scene'

if (process.env.NODE_ENV === 'development') {
		require('../index.html');
	}

// console.log('hello world');



window.addEventListener('DOMContentLoaded', () => {

	const resolution = 10
	const cellSize = 4


	const scene = new BasicScene({
    camera: { type: 'perspective'}, 
    enableShadow: true,
  });

	const maze = new Maze({resolution, cellSize, scene })

	const startCell = maze.cells[ Math.floor( Math.random() * resolution**2 ) ]
	const startPosition = {
		x: startCell.i*cellSize,
		z: startCell.j*cellSize
	}

	console.log(startPosition)

	scene.camera.position.set(startPosition.x,20,startPosition.z)
	

	const playerLight = new THREE.PointLight( '#FFDFCD', 4 ,16, 2  )
	playerLight.position.set(startPosition.x,cellSize+1,startPosition.z)
	playerLight.castShadow = true
	// playerLight.power = 20
	scene.scene.add(playerLight)

	const player = new THREE.BoxBufferGeometry(cellSize/4, cellSize/4,cellSize/4)
	const playerPhongMaterial = new THREE.MeshPhysicalMaterial({
		color: new THREE.Color('#FFDFCD'), 
		transparent: true, 
		// opacity: 1, 
		side: THREE.FrontSide
	})

	const pMesh = new THREE.Mesh(player,playerPhongMaterial)
	pMesh.position.set(startPosition.x,0,startPosition.z)


	scene.scene.add(pMesh)

	scene.controls.target = pMesh.position


})