import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */

// const posArr = new Float32Array([
//     0, 0, 0,
//     0, 1, 0,
//     1, 0, 0
// ])
// const posAttr = new THREE.BufferAttribute(posArr, 3)
// const geom = new THREE.BufferGeometry()
// geom.setAttribute('position', posAttr)

const geom = new THREE.BufferGeometry()
const count = 8
const posArr = new Float32Array(count * 3 * 3) // triangle * each vertices * xyz means 3 vals => count*3*3

for (let i = 0; i < count * 3 * 3; i++) {
    posArr[i] = Math.random()-0.5
}

const posAttr = new THREE.BufferAttribute(posArr, 3)
geom.setAttribute('position', posAttr)

const mat = new THREE.MeshBasicMaterial({ color: 0xffff9, wireframe: true })

const mesh = new THREE.Mesh(geom, mat)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {

    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    }
    else {
        document.exitFullscreen()
    }

})


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
// controls.enabled = false;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)



const animate = () => {


    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate();