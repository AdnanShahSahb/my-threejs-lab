import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { EXRLoader, GLTFLoader, GroundedSkybox, RGBELoader } from 'three/examples/jsm/Addons.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

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


const textureLoader = new THREE.TextureLoader()
const envMap = textureLoader.load('envMaps/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
envMap.mapping = THREE.EquirectangularReflectionMapping;
envMap.colorSpace = THREE.SRGBColorSpace;
scene.background = envMap;
// scene.environment = envMap;


// const textureLoader = new THREE.TextureLoader()
// const envMap = textureLoader.load('/envMaps/anime_art_style_japan_streets_with_cherry_blossom_.jpg')
// envMap.colorSpace = THREE.SRGBColorSpace;
// envMap.mapping = THREE.EquirectangularReflectionMapping;
// scene.background = envMap;
// scene.environment = envMap;
// const groundedSkybox = new GroundedSkybox(envMap, 15, 70)
// groundedSkybox.position.y=15;
// scene.add(groundedSkybox)


// const exrLoader = new EXRLoader()
// exrLoader.load('/envMaps/nvidiaCanvas-4k.exr', (env) => {
//     env.mapping = THREE.EquirectangularReflectionMapping;
//     scene.background = env;
//     scene.environment = env;
// })

// const rgbeLoader = new RGBELoader()

// rgbeLoader.load('/envMaps/custom%20made/Untitled_1.hdr', (env) => {
//     env.mapping = THREE.EquirectangularReflectionMapping
//     // scene.background = env;
//     scene.environment = env;
// })

// const cubeTextureLoader = new THREE.CubeTextureLoader()

// const envMap = cubeTextureLoader.load([

//     // '/envMaps/0/px.png',
//     // '/envMaps/0/nx.png',
//     // '/envMaps/0/py.png',
//     // '/envMaps/0/ny.png',
//     // '/envMaps/0/pz.png',
//     // '/envMaps/0/nz.png',

//     '/envMaps/Standard-Cube-Map (5)/px.png',
//     '/envMaps/Standard-Cube-Map (5)/nx.png',
//     '/envMaps/Standard-Cube-Map (5)/py.png',
//     '/envMaps/Standard-Cube-Map (5)/ny.png',
//     '/envMaps/Standard-Cube-Map (5)/pz.png',
//     '/envMaps/Standard-Cube-Map (5)/nz.png',
// ])
// scene.background = envMap;
// scene.environment = envMap;



gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.01)
gui.add(scene, 'backgroundBlurriness').min(0).max(0.5).step(0.01)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.01)
gui.add(scene.backgroundRotation, 'y').min(0).max(10).step(0.01).name('Yaxisbg')
gui.add(scene.environmentRotation, 'y').min(0).max(10).step(0.01).name('Yaxisenv')

/**
 * Objects
 */


const donut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),

    new THREE.MeshBasicMaterial({
        color: 'white',
    })

)
scene.add(donut);
donut.position.y = 3.5;
donut.layers.enable(1);


const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
    256,
    {
        type: THREE.HalfFloatType
    }
)
scene.environment = cubeRenderTarget.texture;

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1);



const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0,
        metalness: 1,
        color: '0xaaaaaa'
    })
)
// torusKnot.material.envMap = envMap;
torusKnot.position.y = 4;
torusKnot.position.x = -4;
scene.add(torusKnot)

const gltfLoader = new GLTFLoader()
gltfLoader.load('./models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    scene.add(gltf.scene)
    gltf.scene.scale.set(10, 10, 10)
})


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
})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.y = 3.5;



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
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


    donut.rotation.x = Math.sin(elapsedTime);

    cubeCamera.update(renderer, scene)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
