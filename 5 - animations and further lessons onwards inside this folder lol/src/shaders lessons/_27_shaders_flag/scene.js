import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import testVertexShader from "./test/vertex.glsl"
import testFragmentShader from "./test/fragment.glsl"

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
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

/**
 * Objects
 */
const textureLoader = new THREE.TextureLoader()
const flag = textureLoader.load('./textures/pakistan/Flag_of_Pakistan.jpg')

const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4, 32, 32),
    new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        uniforms: {
            uFreq: { value: new THREE.Vector2(3, 2) },
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('orange') },
            uTexture: { value: flag }
        }
    })
)
mesh.scale.y = 2 / 3
scene.add(mesh)

/**
 * Urdu text overlay — words drop in one by one from below
 */
const words = ['پاک', 'سر', 'زمین', 'شاد', 'باد']


const overlay = document.createElement('div')
overlay.style.cssText = `
    position: fixed;
    bottom: 5px;
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    padding-right: 5px;
    align-items: center;
    gap: 8px;
    pointer-events: none;
    z-index: 10;
    font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
`;

document.body.appendChild(overlay)

// Load Urdu font from Google Fonts
const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@700&display=swap'
document.head.appendChild(fontLink)

// Emoji — fixed, always visible
const salute = document.createElement('div')
salute.textContent = ''
salute.style.cssText = `
    font-size: 48px;
    margin-bottom: 4px;
    line-height: 1;
`
overlay.appendChild(salute)

// // Animate each word dropping in from below
// words.forEach((word, i) => {
//     const el = document.createElement('div')
//     el.textContent = word
//     el.style.cssText = `
//           font-size: 42px;
//         font-weight: 700;
//         color: white;
//         text-shadow: 0 2px 12px rgba(0,0,0,0.7);
//         opacity: 0;
//         transform: translateX(40px);
//         transition: opacity 0.6s ease, transform 0.6s ease;
//   `
//     overlay.appendChild(el)

//     setTimeout(() => {
//         el.style.opacity = '1'
//         el.style.transform = 'translateX(0)'
//     }, 400 + i * 500)
// })

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

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 4)
scene.add(camera)

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

    mesh.material.uniforms.uTime.value = elapsedTime

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import GUI from 'lil-gui'
// import testVertexShader from "./test/vertex.glsl"
// import testFragmentShader from "./test/fragment.glsl"

// /**
//  * Base
//  */
// // Debug
// // const gui = new GUI()

// // Canvas
// const canvas = document.querySelector('canvas.webgl')

// // Scene
// const scene = new THREE.Scene()

// /**
//  * Lights
//  */
// const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(5, 5, 5)
// scene.add(directionalLight)



// /**
//  * Objects
//  */


// const textureLoader = new THREE.TextureLoader()
// const flag = textureLoader.load('./textures/pakistan/Flag_of_Pakistan.jpg')


// const mesh = new THREE.Mesh(
//     new THREE.PlaneGeometry(4, 4, 32, 32),

//     new THREE.ShaderMaterial({
//         vertexShader: testVertexShader,
//         fragmentShader: testFragmentShader,
//         uniforms: {
//             uFreq: { value: new THREE.Vector2(3, 2) },
//             uTime: { value: 0 },
//             uColor: { value: new THREE.Color('orange') },
//             uTexture: { value: flag }
//         }
//     })
//     // new THREE.MeshBasicMaterial({
//     //     color: 'white',
//     // })

// )
// mesh.scale.y = 2 / 3;
// scene.add(mesh);

// // gui.add(mesh.material.uniforms.uFreq.value, 'x').min(0).max(20).step(0.01)
// // gui.add(mesh.material.uniforms.uFreq.value, 'y').min(0).max(20).step(0.01)


// /**
//  * Sizes
//  */
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// window.addEventListener('resize', () => {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })



// /**
//  * Camera
//  */
// // Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.set(0, 0, 4)
// scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true



// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//     antialias: true
// })
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// /**
//  * Animate
//  */
// const clock = new THREE.Clock()
// let previousTime = 0


// const tick = () => {
//     const elapsedTime = clock.getElapsedTime()
//     const deltaTime = elapsedTime - previousTime
//     previousTime = elapsedTime

//     mesh.material.uniforms.uTime.value = elapsedTime;

//     // Update controls
//     controls.update()

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()
