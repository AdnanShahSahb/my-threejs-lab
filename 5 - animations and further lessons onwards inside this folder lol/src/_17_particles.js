import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"


const canvas = document.querySelector('canvas.webgl')
const sizes = {
    height: window.innerHeight,
    width: window.innerWidth,
}
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 1;
scene.add(camera)

const ambLight = new THREE.AmbientLight()
scene.add(ambLight)

const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('./particlesTextures/2.png')


const count = 5000;
const particlesGeom = new THREE.BufferGeometry()
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}
particlesGeom.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

particlesGeom.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

const particlesMat = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    vertexColors: true
})

const particles = new THREE.Points(particlesGeom, particlesMat)
scene.add(particles)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

const controls = new OrbitControls(camera, canvas)

const clock = new THREE.Clock()

const anim = () => {
    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < count * 3; i++) {
        const i3 = i * 3;

        const x = particlesGeom.attributes.position.array[i3]
        const z = particlesGeom.attributes.position.array[i3 + 2]
        particlesGeom.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x + z)
    }

    particlesGeom.attributes.position.needsUpdate = true;


    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(anim)
}
anim();



