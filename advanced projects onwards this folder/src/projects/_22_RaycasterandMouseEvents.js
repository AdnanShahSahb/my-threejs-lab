import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

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




/**
 * Objects
 */
const object0 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object0.position.x = - 4
object0.name = 'object0'

const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2
object1.name = 'object1'

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object2.name = 'object2'

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2
object3.name = 'object3'

const object4 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object4.position.x = 4
object4.name = 'object4'

scene.add(object1, object2, object3, object0, object4)


const raycaster = new THREE.Raycaster()

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

const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / sizes.width * 2) - 1;
    const mouseY = -((e.clientY / sizes.height * 2) - 1);
    mouse.x = mouseX
    mouse.y = mouseY
})

window.addEventListener('click', () => {

    if (currInters) {
        [object0, object1, object2, object3, object4].forEach((d) => {
            if (d.name == currInters.object.name) {
                console.info(d.name);
            }
        })
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


let model;
const loader = new GLTFLoader()
loader.load('./models/Duck/glTF-Binary/Duck.glb', (duck) => {
    scene.add(duck.scene)
    // objects.push(duck.scene)
    model = duck.scene;
})

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

let currInters = null;

const objects = [object0, object1, object2, object3, object4]
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


    object0.position.y = Math.sin(elapsedTime * 1 - 1)
    object1.position.y = Math.sin(elapsedTime * 1 + 0)
    object2.position.y = Math.sin(elapsedTime * 1 + 1)
    object3.position.y = Math.sin(elapsedTime * 1 + 2)
    object4.position.y = Math.sin(elapsedTime * 1 + 3)

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(objects)

    objects.forEach((d) => {
        d.material.color.set('#ffffff')
    })
    intersects.forEach((d) => {
        d.object.material.color.set('#ff00f0')
    })

    if (intersects.length) {
        if (currInters == null) {
            console.info('mouseEnter');
        }
        currInters = intersects[0];
    }
    else {

        if (currInters) {
            console.info('mouseLeve');
        }
        currInters = null;
    }


    if (model) {
        const intersectModel = raycaster.intersectObject(model)
        console.info(model);
        if (intersectModel.length > 0) {
            intersectModel[0].object.scale.set(1.25, 1.25, 1.25)
        }
        else {
            console.info(model);
            model.children[0].children[0].scale.set(1, 1, 1)
        }
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()