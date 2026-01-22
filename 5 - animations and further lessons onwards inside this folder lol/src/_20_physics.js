import * as THREE from "three"
import CANNON from "cannon"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import GUI from "lil-gui"

const canvas = document.querySelector('canvas.webgl')


const hitSound = new Audio('sounds/hit.mp3')

const playHitSound = (event) => {

    const impactStrength = event.contact.getImpactVelocityAlongNormal();

    if (impactStrength > 1.5) {
        // hitSound.volume=Math.random()
        hitSound.volume = Math.min(Math.max(impactStrength * (0.8 + Math.random() * 0.4), 0), 1);
        hitSound.currentTime = 0;
        hitSound.play()
    }

}


const scene = new THREE.Scene()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/physics/textures/environmentMaps/0/px.png',
    '/physics/textures/environmentMaps/0/nx.png',
    '/physics/textures/environmentMaps/0/py.png',
    '/physics/textures/environmentMaps/0/ny.png',
    '/physics/textures/environmentMaps/0/pz.png',
    '/physics/textures/environmentMaps/0/nz.png'
])


const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true;
world.gravity.set(0, -9.8, 0)

const defaultMaterial = new CANNON.Material('default')
const defaultMaterialContact = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.5
    }
)
world.addContactMaterial(defaultMaterialContact)
world.defaultContactMaterial = defaultMaterialContact;


const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0,
})
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5,
)
floorBody.addShape(floorShape)
world.addBody(floorBody)



const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)


const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)


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



const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



const debugObj = {
    createSphere: () => {
        alert('create a shape shabash')
    }
}
const gui = new GUI()
gui.add(
    {
        createSphere: () => {
            createSphere(Math.random() * (0.7 - 0.3) + 0.3, { x: Math.random() * 1.5, y: 4, z: Math.random() * 1.5 })
        }
    },
    'createSphere'
)

gui.add(
    {
        createBox: () => {
            createBox(Math.random(), 1, Math.random(), { x: 0, y: 5, z: 0 })
        }
    }
    ,
    'createBox'
)

gui.add(
    {
        resetScene: () => {
            for (const o of objsToUpdate) {
                o.body.removeEventListener('collide', playHitSound)
                world.removeBody(o.body)

                scene.remove(o.mesh)
            }

                objsToUpdate.splice(0, objsToUpdate.length)
        }
    },
    'resetScene'
)

const geom = new THREE.SphereGeometry(1, 32, 32);
const mat = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

const objsToUpdate = []
const createSphere = (r, p) => {
    const mesh = new THREE.Mesh(geom, mat)
    mesh.castShadow = true;
    mesh.position.copy(p)
    mesh.scale.set(r, r, r)
    scene.add(mesh);

    const sphere = new CANNON.Sphere(r)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(p),
        shape: sphere,
        material: defaultMaterial
    })
    body.position.copy(p)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)
    objsToUpdate.push({
        mesh,
        body
    })
}


const bgeom = new THREE.BoxGeometry(1, 1, 1);

const createBox = (h, w, d, p) => {
    const mesh = new THREE.Mesh(bgeom, mat)
    mesh.castShadow = true;
    mesh.position.copy(p)
    mesh.scale.set(h, w, d)
    scene.add(mesh);

    const box = new CANNON.Box(new CANNON.Vec3(h / 2, w / 2, d / 2))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(p),
        shape: box,
        material: defaultMaterial
    })
    body.position.copy(p)

    body.addEventListener('collide', playHitSound)

    world.addBody(body)
    objsToUpdate.push({
        mesh,
        body
    })
}


const clock = new THREE.Clock();

let oldElapsedTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const delaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    for (const o of objsToUpdate) {
        o.mesh.position.copy(o.body.position)
        o.mesh.quaternion.copy(o.body.quaternion)
    }

    world.step(1 / 60, delaTime, 3)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()