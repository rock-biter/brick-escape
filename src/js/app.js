import '../scss/app.scss';
import * as THREE from 'three'

import Maze from './maze';
import BasicScene from './scene'
import Player from './player';

if (process.env.NODE_ENV === 'development') {
		require('../index.html');
	}

// console.log('hello world');



window.addEventListener('DOMContentLoaded', () => {

	const resolution = 50
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

	scene.camera.position.set(startPosition.x,30,startPosition.z)
	

	// const playerLight = new THREE.PointLight( '#dba98c', 25 ,12, 3  )
	// // const playerLight = new THREE.PointLight( '#FFDFCD', 4 ,100, 2  )
	// playerLight.position.set(startPosition.x,cellSize+1,startPosition.z)
	// playerLight.castShadow = true
	// playerLight.shadow.radius = 50
	// playerLight.shadow.bias = 0.0001
	// playerLight.shadow.normalBias = 0.1
	// playerLight.shadow.mapSize.width = 1024*4; // default
	// playerLight.shadow.mapSize.height = 1024*4; // default
	// // playerLight.shadow.camera.near = 0.5; // default
	// // playerLight.shadow.camera.far = 500; // default
	// // playerLight.shadow.camera.fov = 145
	// // playerLight.shadow.camera.updateProjectionMatrix()
	// // playerLight.power = 20
	// scene.scene.add(playerLight)



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


})