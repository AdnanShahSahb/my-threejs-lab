import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

import img from "../static/door.jpg"

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
    console.info('start');
}
loadingManager.onLoad = () => {
    console.info('loaded');
}
loadingManager.onProgress = () => {
    console.info('loading');
}
loadingManager.onError = () => {
    console.info('error');
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const texture = textureLoader.load('/checkerboard-1024x1024.png')

// texture.repeat.x = 2
// texture.repeat.y = 3
// texture.wrapS = THREE.MirroredRepeatWrapping
// texture.wrapT = THREE.MirroredRepeatWrapping

// texture.offset.x=0.5
// texture.offset.y=0.5

// texture.rotation=1*Math.PI/4

// texture.center.x=0.5
// texture.center.y=0.5

texture.minFilter = THREE.NearestFilter


const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    // new THREE.SphereGeometry(1, 31, 31),
    new THREE.MeshBasicMaterial({ map: texture }),
)
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
        // canvas.requestFullscreen()
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