import gsap from 'gsap'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */

const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffff9 }),
)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


gsap.to(mesh.position, { duration: 1, delay: 0, x: 2 })
gsap.to(mesh.position, { duration: 1, delay: 1, x: 0 })

// ANIMATIONS:

const clock = new THREE.Clock()

const animate = () => {

    // const elapsedTime = clock.getElapsedTime()


    // mesh.position.x = Math.sin(elapsedTime)
    // mesh.position.y = Math.cos(elapsedTime)



    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate();