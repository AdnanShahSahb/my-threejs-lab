// import gsap from 'gsap'
import { GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js'
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

const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
})


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1*aspectRatio, 1*aspectRatio, 1, -1, 0.1, 100)
camera.position.z = 3
scene.add(camera)





const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

const loader = new GLTFLoader();

loader.load('./aircraft.glb', (gltf) => {
    const model = gltf.scene;
    console.info(model);
    scene.add(model);

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    console.log('Model size:', size);
    const maxAxis = Math.max(size.x, size.y, size.z);
    gltf.scene.scale.multiplyScalar(1 / maxAxis);
    const center = box.getCenter(new THREE.Vector3());
    gltf.scene.position.sub(center);

});


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


// gsap.to(mesh.position, { duration: 1, delay: 0, x: 2 })
// gsap.to(mesh.position, { duration: 1, delay: 1, x: 0 })

// ANIMATIONS:

const clock = new THREE.Clock()

const animate = () => {

    // const elapsedTime = clock.getElapsedTime()


    // mesh.position.x = Math.sin(elapsedTime)
    // mesh.position.y = Math.cos(elapsedTime)

    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 5
    // camera.lookAt(mesh.position)
    controls.update()


    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate();