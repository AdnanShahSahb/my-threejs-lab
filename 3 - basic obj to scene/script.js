import * as THREE from "three"


const canvas = document.getElementById('canvas')

const scene = new THREE.Scene()

const geo = new THREE.BoxGeometry(1, 1, 1)
const mat = new THREE.MeshBasicMaterial({ color: 'red' })
const mesh = new THREE.Mesh(geo, mat)

scene.add(mesh)

const size = {
    height: 600,
    width: 800
}
const camera = new THREE.PerspectiveCamera(75, size.width / size.height,)
camera.position.z=4
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas })

renderer.setSize(size.width, size.height)
renderer.render(scene, camera)