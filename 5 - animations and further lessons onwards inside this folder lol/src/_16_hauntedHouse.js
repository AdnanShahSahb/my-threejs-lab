import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from "lil-gui"
import { Sky } from "three/examples/jsm/Addons.js"

const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')
const sizes = {
    height: window.innerHeight,
    width: window.innerWidth,
}
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)


const light = new THREE.AmbientLight('#86cdff', 1)
scene.add(light)
gui.add(light, 'intensity').min(0).max(4).step(0.01).name('amblig')

const dirlight = new THREE.DirectionalLight('#86cdff', 3)
dirlight.position.set(3, 2, -8)
scene.add(dirlight)
gui.add(dirlight, 'intensity').min(0).max(11).step(0.01).name('dirLig')

dirlight.shadow.mapSize.width = 256;
dirlight.shadow.mapSize.height = 256;
dirlight.shadow.camera.top = 8;
dirlight.shadow.camera.right = 12;
dirlight.shadow.camera.left = -12;
dirlight.shadow.camera.bottom = -8;
dirlight.shadow.camera.far = 20;
dirlight.shadow.camera.near = 1;
// const dirLigHelper = new THREE.CameraHelper(dirlight.shadow.camera)
// scene.add(dirLigHelper)



const doorLight = new THREE.PointLight('#ff7d46', 3)
doorLight.position.set(0, 2.2, 2.5)
scene.add(doorLight)
const doorLightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 33, 33), new THREE.MeshStandardMaterial())
doorLightMesh.position.set(0, 2.54, 2.5)
doorLightMesh.rotation.x = -1
scene.add(doorLightMesh)

// TEXTURES
const textureLoader = new THREE.TextureLoader();


// FLOOR
const floorAlphaTexture = textureLoader.load('./optimizedTextures/floor/alpha.webp');
const floorColorTexture = textureLoader.load('./optimizedTextures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
const floorARMTexture = textureLoader.load('./optimizedTextures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./optimizedTextures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('./optimizedTextures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')
floorColorTexture.colorSpace = THREE.SRGBColorSpace
floorColorTexture.repeat.set(8, 8)
floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.repeat.set(8, 8)
floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping


// FLOOR
const wallsColorTexture = textureLoader.load('./optimizedTextures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp')
const wallsARMTexture = textureLoader.load('./optimizedTextures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp')
const wallsNormalTexture = textureLoader.load('./optimizedTextures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp')
wallsColorTexture.colorSpace = THREE.SRGBColorSpace

// ROOF
const roofColorTexture = textureLoader.load('./optimizedTextures/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp')
const roofARMTexture = textureLoader.load('./optimizedTextures/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('./optimizedTextures/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp')
roofColorTexture.colorSpace = THREE.SRGBColorSpace
roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;


// BUSHES
const bushesColorTexture = textureLoader.load('./optimizedTextures/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushesARMTexture = textureLoader.load('./optimizedTextures/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushesNormalTexture = textureLoader.load('./optimizedTextures/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')
bushesColorTexture.colorSpace = THREE.SRGBColorSpace


// GRAVES
const gravesColorTexture = textureLoader.load('./optimizedTextures/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
const gravesARMTexture = textureLoader.load('./optimizedTextures/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')
const gravesNormalTexture = textureLoader.load('./optimizedTextures/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp')
gravesColorTexture.colorSpace = THREE.SRGBColorSpace

// DOOR
const doorColorTexture = textureLoader.load('./optimizedTextures/door/color.webp')
const doorAlphaTexture = textureLoader.load('./optimizedTextures/door/alpha.webp')
const doorHeightexture = textureLoader.load('./optimizedTextures/door/height.webp')
const doorAOTexture = textureLoader.load('./optimizedTextures/door/ambientOcclusion.webp')
const doorNormalTexture = textureLoader.load('./optimizedTextures/door/normal.webp')
const doorMetalicTexture = textureLoader.load('./optimizedTextures/door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('./optimizedTextures/door/roughness.webp')
doorColorTexture.colorSpace = THREE.SRGBColorSpace

// // HORRORFACES
const horrorFace3Texture = textureLoader.load('./textures/horrorfaces/horror3.jpg')
horrorFace3Texture.colorSpace = THREE.SRGBColorSpace
horrorFace3Texture.repeat.set(1, 1)
horrorFace3Texture.wrapS = THREE.RepeatWrapping

const particleTexture = textureLoader.load('./particlesTextures/8.png')


// GEOMS
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 100, 100), new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: floorAlphaTexture,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.8,
    displacementBias: -0.5
}))
floor.rotation.x = - Math.PI / 2;
scene.add(floor)
gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.01).name('floorDisplacementTextureScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.01).name('floorDisplacementTextureBias')


const house = new THREE.Group()
scene.add(house)


const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallsColorTexture,
        aoMap: wallsARMTexture,
        roughnessMap: wallsARMTexture,
        metalnessMap: wallsARMTexture,
        normalMap: wallsNormalTexture,
        side: THREE.DoubleSide
    })
)
walls.position.y = 2.5 / 2;
house.add(walls)

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(4, 2, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture,
    })
)
roof.position.y = 2.5 + (2 / 2);
roof.rotation.y = Math.PI / 2 / 2
house.add(roof)

const door = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2, 100, 100), new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    displacementMap: doorHeightexture,
    aoMap: doorAOTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalicTexture,
    normalMap: doorNormalTexture,

    displacementScale: 0.15,
    displacementBias: -0.04

}))
door.position.z = 2 + 0.01;
door.position.y = 2.5 / 2 / 2
house.add(door)


const bushGeom = new THREE.SphereGeometry(1, 16, 16)
const bushMat = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushesColorTexture,
    metalnessMap: bushesARMTexture,
    roughnessMap: bushesARMTexture,
    aoMap: bushesARMTexture,
    normalMap: bushesNormalTexture
})
const bush1 = new THREE.Mesh(bushGeom, bushMat)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = -1;
const bush2 = new THREE.Mesh(bushGeom, bushMat)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -1;
const bush3 = new THREE.Mesh(bushGeom, bushMat)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -1;
const bush4 = new THREE.Mesh(bushGeom, bushMat)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = -1;
house.add(bush1, bush2, bush3, bush4)


const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
// scene.add(ghost1, ghost2, ghost3)

ghost1.shadow.camera.width = 256;
ghost1.shadow.camera.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.camera.width = 256;
ghost2.shadow.camera.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.camera.width = 256;
ghost3.shadow.camera.height = 256;
ghost3.shadow.camera.far = 10;

// const ghostLigHelper = new THREE.CameraHelper(ghost1.shadow.camera)
// scene.add(ghostLigHelper)
// const ghostLigHelper1 = new THREE.CameraHelper(ghost2.shadow.camera)
// scene.add(ghostLigHelper1)
// const ghostLigHelper2 = new THREE.CameraHelper(ghost3.shadow.camera)
// scene.add(ghostLigHelper2)

const ghost1Mesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 33, 33), new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: horrorFace3Texture
}))
const ghost2Mesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 33, 33), new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: horrorFace3Texture
}))
const ghost3Mesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 33, 33), new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: horrorFace3Texture
}))

const ghost4Mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: horrorFace3Texture,

    emissive: new THREE.Color(0xffffff),
    emissiveMap: horrorFace3Texture,
    emissiveIntensity: 31, // 👈 increase this
}))

ghost1Mesh.position.set(3, 3, -1)
ghost2Mesh.position.set(3, 3, 0)
ghost3Mesh.position.set(3, 3, 1)
ghost4Mesh.position.set(0, 1, 0)
scene.add(ghost3Mesh, ghost4Mesh)
// scene.add(ghost1Mesh, ghost2Mesh, ghost3Mesh, ghost4Mesh)


const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: gravesColorTexture,
    aoMap: gravesARMTexture,
    roughnessMap: gravesARMTexture,
    metalnessMap: gravesARMTexture,
    normalMap: gravesNormalTexture,
})
const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 29; i++) {
    const radius = 4 + Math.random() * 4;
    const angle = Math.random() * Math.PI * 2
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const y = Math.random() / 4;

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x;
    grave.position.z = z;
    grave.position.y = y;

    grave.rotation.x = (Math.random() - 0.5) * 0.5;
    grave.rotation.y = (Math.random() - 0.5) * 0.5;
    grave.rotation.z = (Math.random() - 0.5) * 0.5;
    graves.add(grave)
}



const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)



renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

dirlight.castShadow = true;

ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

graves.children.forEach((d) => {
    d.castShadow = true;
    d.receiveShadow = true;
})



const count = 1100;
const particlesGeom = new THREE.BufferGeometry()
const positions = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
    // const r = 20 + Math.random() * 35; // radius between 5 and 20
    // const theta = Math.random() * Math.PI;  // 0 to π
    // const phi = Math.random() * 2 * Math.PI; // 0 to 2π
    // const x = r * Math.sin(theta) * Math.cos(phi);
    // const y = r * Math.sin(theta) * Math.sin(phi);
    // const z = r * Math.cos(theta);
    const r = 20 + Math.random() * 35; // radius
    const theta = Math.random() * Math.PI / 2;  // 0 to π/2 => only top half
    const phi = Math.random() * 2 * Math.PI;    // 0 to 2π

    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.cos(theta);  // cos(theta) gives positive y in top hemisphere
    const z = r * Math.sin(theta) * Math.sin(phi);

    const i3 = i * 3;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
}
particlesGeom.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)
const particlesMat = new THREE.PointsMaterial({
    size: 4.04,
    sizeAttenuation: false,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    // vertexColors: true
})

const particles = new THREE.Points(particlesGeom, particlesMat)
scene.add(particles)


// const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color:'red' }))
// scene.add(box)

const sky = new Sky()
sky.scale.setScalar(100);
scene.add(sky)


// scene.fog = new THREE.FogExp2('#000000', 0.05)

const controls = new OrbitControls(camera, canvas)

const timer = new Timer()
// controls.autoRotate = true
// controls.autoRotateSpeed = 1.0
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.1;  // radians, look only down to horizon

controls.maxDistance = 9;   // farthest you can zoom
controls.minDistance = 2;   // farthest you can zoom


const anim = () => {
    timer.update()
    const elapsedTime = timer.getElapsed()

    const ghostAngle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghostAngle) * 9
    ghost1.position.z = Math.sin(ghostAngle) * 9
    ghost1.position.y = Math.sin(ghostAngle) * Math.sin(ghostAngle * 2.34) * Math.sin(ghostAngle * 3.45)
    ghost1Mesh.position.set(ghost1.position.x, ghost1.position.y, ghost1.position.z)



    const ghostAngle2 = -elapsedTime * 0.35;
    ghost2.position.x = Math.cos(ghostAngle2) * 6
    ghost2.position.z = Math.sin(ghostAngle2) * 6
    ghost2.position.y = Math.sin(ghostAngle2) * Math.sin(ghostAngle2 * 2.34) * Math.sin(ghostAngle2 * 3.45)
    ghost2Mesh.position.set(ghost2.position.x, ghost2.position.y, ghost2.position.z)



    const ghostAngle3 = elapsedTime * 0.15;
    ghost3.position.x = Math.cos(ghostAngle3) * 6
    ghost3.position.z = Math.sin(ghostAngle3) * 6
    ghost3.position.y = Math.sin(ghostAngle3) * Math.sin(ghostAngle3 * 2.34) * Math.sin(ghostAngle3 * 3.45)
    ghost3Mesh.position.set(ghost3.position.x, ghost3.position.y, ghost3.position.z)

    ghost4Mesh.scale.set(Math.sin(elapsedTime) * 2, Math.sin(elapsedTime) * 2, Math.sin(elapsedTime) * 2)
    ghost4Mesh.position.set(Math.sin(elapsedTime), Math.cos(elapsedTime), Math.sin(elapsedTime))

    // const amplitude = 0.2; // max vertical movement
    // const baseHeight = 0.4;  // base Y position
    // camera.position.y = baseHeight + Math.sin(elapsedTime * 1) * amplitude;

    // camera.position.y = 1 - Math.abs(controls.target.x + Math.sin(elapsedTime) * 0.5);


    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(anim)
}
anim();