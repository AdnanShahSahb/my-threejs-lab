

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import testVertexShader from "./water/vertex.glsl"
import testFragmentShader from "./water/fragment.glsl"
import { GUI } from "lil-gui"

/**
 * Base
 */
// Debug
const gui = new GUI()
const debugObj = {};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)


const ah=new THREE.AxesHelper()
ah.position.y+=0.25;
// scene.add(ah)

/**
 * Objects
 */

debugObj.depthColor = '#186691'
debugObj.surfaceColor = '#9bd8ff'

const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 2, 512, 512),

    new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        uniforms: {
            uTime: { value: 0 },

            uBigWavesElevation: { value: 0.2 },
            uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
            uBigWavesSpeed: { value: 0.75 },

            uDepthColor: { value: new THREE.Color(debugObj.depthColor) },
            uSurfaceColor: { value: new THREE.Color(debugObj.surfaceColor) },
            uColorOffset:{value:0.25},
            uColorMultiplier:{value:3},

            uSmallWavesElevation:{value:0.15},
            uSmallWavesFreq:{value:3},
            uSmallWavesSpeed:{value:0.2},
            uSmallWavesIteration:{value:4.0}
        }
    })

)
mesh.rotation.x = -Math.PI * 0.5;
scene.add(mesh);
mesh.geometry.deleteAttribute('uv')
mesh.geometry.deleteAttribute('normal')

gui.add(mesh.material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001)
gui.add(mesh.material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.01).name('uBigWavesFrequencyX')
gui.add(mesh.material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.01).name('uBigWavesFrequencyY')
gui.add(mesh.material.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')

gui.addColor(debugObj, 'depthColor')
    .name('uDepthColor')
    .onChange(()=>{
        mesh.material.uniforms.uDepthColor.value.set(debugObj.depthColor)
    })
gui.addColor(debugObj, 'surfaceColor')
    .name('usurfaceColor')
    .onChange(()=>{
        mesh.material.uniforms.uSurfaceColor.value.set(debugObj.surfaceColor)
    })

gui.add(mesh.material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001)
gui.add(mesh.material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001)


gui.add(mesh.material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(mesh.material.uniforms.uSmallWavesFreq, 'value').min(0).max(30).step(0.001).name('uSmallWavesFreq')
gui.add(mesh.material.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(mesh.material.uniforms.uSmallWavesIteration, 'value').min(0).max(5).step(1).name('uSmallWavesIteration')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping=THREE.ACESFilmicToneMapping
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 1, 1.3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0


const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


    mesh.material.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
