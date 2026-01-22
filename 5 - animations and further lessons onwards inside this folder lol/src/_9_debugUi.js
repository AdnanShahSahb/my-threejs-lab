import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

import GUI from "lil-gui"

import { gsap } from 'gsap/gsap-core'


const gui = new GUI({
    width:300,
    title:'debuging by adnan'
})

gui.hide()
const globalParams = {

}

window.addEventListener('keydown',(e)=>{
    if(e.key=='h')
        gui.show(gui._hidden)
})

const folder1=gui.addFolder('Folder 1')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */

globalParams.color = '#8585ff'

const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: globalParams.color }),
)
scene.add(mesh)


folder1.add(mesh.position, 'y')
    .min(-2)
    .max(2)
    .step(0.00000001)
    .name('elevationYouKnow')


const obj = {
    anyVar: 5
}

folder1.add(obj, 'anyVar')
    .min(0)
    .max(10)
    .step(1)

folder1.add(mesh, 'visible')

folder1.add(mesh.material, 'wireframe')

folder1
    .addColor(globalParams, 'color')
    .onChange(() => {
        mesh.material.color.set(globalParams.color)
    })


globalParams.spin = () => {
    console.info(1);
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2, duration: 5 })
}
folder1.add(globalParams, 'spin')

globalParams.subdivision = 2
folder1
    .add(globalParams, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(1, 1, 1, globalParams.subdivision, globalParams.subdivision, globalParams.subdivision)
    })

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