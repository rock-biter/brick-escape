import '../scss/app.scss';

import { Renderer, Camera, Transform, Box, Program, Mesh } from 'ogl'

if (process.env.NODE_ENV === 'development') {
		require('../index.html');
	}

console.log('hello world');

const r = new Renderer()
const gl = r.gl
document.body.appendChild(gl.canvas)

const cam = new Camera(gl)
cam.position.z = 5

function resize() {
	r.setSize(window.innerWidth,window.innerHeight)
	cam.perspective({
		aspect: gl.canvas.width / gl.canvas.height
	})
}

window.addEventListener('resize',resize,false)
resize()

const s = new Transform()
const geometry = new Box(gl)
const program = new Program(gl,{
	vertex: `
			attribute vec3 position;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			void main() {
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
	`,
	fragment: `
		void main() {
			gl_FragColor = vec4(1.0);
		}
	`
})

const m = new Mesh(gl, {geometry,program})
m.setParent(s)

requestAnimationFrame(update)
function update() {
	requestAnimationFrame(update)

	m.rotation.y -= 0.01
	m.rotation.x += 0.01
	r.render({scene: s,camera: cam})
}

