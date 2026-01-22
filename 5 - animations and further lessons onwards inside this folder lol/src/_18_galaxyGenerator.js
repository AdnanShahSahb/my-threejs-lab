import GUI from "lil-gui"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

const canvas = document.querySelector('canvas.webgl')

const size = {
    height: window.innerHeight,
    width: window.innerWidth,
}



const scene = new THREE.Scene()


const gui = new GUI()

const parameters = {
    count: 10000,
    size: 0.01,
    radius: 2,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
}


let geometry = null;
let material = null;
let particles = null;
const generateGalaxy = () => {

    if (particles !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(particles)
    }

    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        const randomnessX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomnessY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomnessZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomnessX
        positions[i3 + 1] = 0 + randomnessY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomnessZ

        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius/parameters.radius)

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )


    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )



    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })
    particles = new THREE.Points(geometry, material)
    scene.add(particles)

}
generateGalaxy();


gui.add(parameters, 'count').min(300).max(5000).step(1).onChange(generateGalaxy);
gui.add(parameters, 'size').min(0.01).max(0.1).step(0.01).onChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.5).max(5).step(0.01).onChange(generateGalaxy);
gui.add(parameters, 'branches').min(3).max(33).step(1).onChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onChange(generateGalaxy);



const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
camera.position.z = 6;
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(size.width, size.height)

const controls = new OrbitControls(camera, canvas)
const animate = () => {


    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()