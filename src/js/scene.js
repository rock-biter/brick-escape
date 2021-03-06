import * as THREE from 'three'
// import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

// import * as SOUNDS from './audio'

const event = new Event('gameover');

export default class BasicScene {

    isStarted = false

    score
    bestScore

    scene
    world

    // wind = new CANNON.Vec3(0,0,-0.0002)

    camera
    controls
    renderer

    offset = 0

    jump = false

    lights = []
    meshes = []
    bodies = []

    clock
    fr = 1/60

    constructor({ camera = {}, enableShadow = false, world = { forces: []}}) {

        this.clock = new THREE.Clock()

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color('#000000')
        // this.scene.add(new THREE.AxesHelper(5))
        this.score = document.getElementById('score')
        

        this.initRenderer(enableShadow)
        this.initDefaultLight()
        this.initCamera(camera)
        // this.initWorld(world.forces)
        this.animate()
        // this.initControls() 

    }

    initRenderer(enableShadow) {
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.shadowMap.enabled = enableShadow
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.renderer.toneMapping = THREE.ReinhardToneMapping
        this.renderer.toneMappingExposure = 2

        window.addEventListener('resize', () => {
            this.onWindowResize()
        })
    }

    initControls() {

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableRotate = false
        this.controls.enableZoom = false
        this.controls.enablePan = true
        this.controls.enableDamping = true
        this.controls.target = new THREE.Vector3(0,0,0)
    }

    initCamera({type = 'perspective', near = 0, far = 2000, fov = 45}={}) {

        if(type === 'orto') {

            this.camera = new THREE.OrthographicCamera( 
                window.innerWidth / - 48, 
                window.innerWidth / 48, 
                window.innerHeight / 48, 
                window.innerHeight / - 48, 
                near, 
                far );

        } else {

            this.camera = new THREE.PerspectiveCamera(
                40, window.innerWidth / window.innerHeight, 1, 1000
              )

        }

        this.scene.add(this.camera);
        
        this.camera.position.set(50, 50, 50)

        if(window.innerWidth < 890) {
            this.camera.zoom = 0.70
            this.camera.updateProjectionMatrix()
            this.offset = 7
        }

    }

    addObject({mesh,body}) {
        this.addBody(body)
        this.addMesh(mesh)
    }

    addMesh(mesh) {
        this.meshes.push(mesh)
        this.scene.add(mesh)
    }

    addBody(body) {
        this.bodies.push(body)
        this.world.addBody(body)
    }

    initDefaultLight() {
        const ambientLight = new THREE.AmbientLight('#ffffff',0.0)
        // const dirLight = new THREE.DirectionalLight('#ffffff',0.8)
        // dirLight.position.copy(new THREE.Vector3(10,15,0))
        // dirLight.target = new THREE.Vector3(0,0,0)

        this.lights.push(ambientLight)
        // this.lights.push(dirLight)

        this.scene.add(ambientLight)
        // this.scene.add(dirLight)
    }

    initWorld(forces) {

        let force = new CANNON.Vec3();
        for(let f of forces) {
            force = force.vadd(f);
        }

        console.log(force);
        // todo: sum all the forces and apply to world
        this.world = new CANNON.World({
            gravity: force,
            allowSleep: true
        })

        
    }

    onWindowResize() {
        console.log('resize')
        if(this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = window.innerWidth / window.innerHeight
        } else if(this.camera instanceof THREE.OrthographicCamera) {

            this.camera.left = window.innerWidth / - 48;
            this.camera.right = window.innerWidth / 48;
            this.camera.top = window.innerHeight / 48;
            this.camera.bottom = window.innerHeight / - 48;

        }
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.render()
    }

    reset() {

        // SOUNDS._GAME_OVER.play()

        // let player = this.bodies[0]
        // player.position.copy( new CANNON.Vec3(0,10,0))
        // player.velocity = new CANNON.Vec3(0,0,0)

        // this.world.gravity = new CANNON.Vec3(0,-100,0)
        // this.isStarted = false
        // this.jump = false

        window.dispatchEvent(event);
    }

    animate() {

        requestAnimationFrame(() => {
            this.animate()
        })
      
        this.controls && this.controls.update()
        // let body = this.bodies[0]

        // if(body) {

        //     if(this.isStarted)
        //         body.applyImpulse(this.wind);

        //     if(body.position.y < -20)
        //         this.reset()
            
        // }

        
      
        // this.world.gravity.vadd(this.wind)
      
        // let delta = Math.min(this.clock.getDelta(), 0.1)
      
        // this.world.step(delta)


        // for(let i =0; i < this.bodies.length; i++) {

        //     // console.log(this.meshes[i]);

        //     this.meshes[i].position.copy(
        //         this.bodies[i].position
        //     )
          
        //     this.meshes[i].quaternion.copy(
        //         this.bodies[i].quaternion
        //     )

        // }

        // if(this.meshes.length) {
        //     this.camera.position.z = THREE.MathUtils.lerp(this.meshes[0].position.z + this.camera.position.y - this.offset, this.camera.position.z, 0.9);  
        //     this.controls.target.z = this.camera.position.z - this.camera.position.y
        //     this.score.innerHTML = parseInt(-this.meshes[0].position.z)
        // }
      
        // console.log(bullets)
        
        
        this.render()
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }
}