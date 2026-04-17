import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui';

/**
 * Base
 */
const gui = new GUI();
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/envMaps/forModifiedMat/0/px.jpg',
    '/envMaps/forModifiedMat/0/nx.jpg',
    '/envMaps/forModifiedMat/0/py.jpg',
    '/envMaps/forModifiedMat/0/ny.jpg',
    '/envMaps/forModifiedMat/0/pz.jpg',
    '/envMaps/forModifiedMat/0/nz.jpg'
]);

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Material
 */
const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg');
mapTexture.colorSpace = THREE.SRGBColorSpace;
const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg');

const customUniforms = { uTime: { value: 0 } };

const material = new THREE.MeshStandardMaterial({
    map: mapTexture,
    normalMap: normalTexture
});

const depthMat = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking
});

// Shader modifier function
const modifyShader = (mat) => {
    mat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = customUniforms.uTime;

        shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `
            #include <common>
            uniform float uTime;
            mat2 get2dRotateMatrix(float _angle) {
                return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
            }
            `
        );

        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            float angle = position.y * -0.1 * uTime;
            mat2 rotateMatrix = get2dRotateMatrix(angle);
            transformed.xz = transformed.xz * rotateMatrix;
            `
        );

        shader.vertexShader = shader.vertexShader.replace(
            '#include <beginnormal_vertex>',
            `
            #include <beginnormal_vertex>
            float angle2 = position.y * -0.1 * uTime;
            mat2 rotateMatrix2 = get2dRotateMatrix(angle2);
            objectNormal.xz = objectNormal.xz * rotateMatrix2;
            `
        );
    };
};

modifyShader(material);
modifyShader(depthMat);

/**
 * Models
 */
let meshRef = null;
gltfLoader.load('/models/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
    const mesh = gltf.scene.children[0];
    mesh.rotation.y = Math.PI * 0.5;
    mesh.material = material;
    mesh.customDepthMaterial = depthMat;
    scene.add(mesh);
    meshRef = mesh;
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, -2.25);
scene.add(directionalLight);

/**
 * Sizes & camera
 */
const sizes = { width: window.innerWidth, height: window.innerHeight };
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 1, -4);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Ping-pong twist animation
 */
const clock = new THREE.Clock();
let twistDuration = 2; // seconds
let twistTime = 0;

// Sequence: clockwise, 0, anticlockwise, 0
const twistSequence = [20, 0, -20, 0]; // normalized uTime for rotation direction
let currentTargetIndex = 0;
let currentStart = 0;
let currentEnd = twistSequence[currentTargetIndex];

const tick = () => {
    const deltaTime = clock.getDelta();
    twistTime += deltaTime;

    // Smoothstep interpolation
    const t = Math.min(twistTime / twistDuration, 1);
    customUniforms.uTime.value = THREE.MathUtils.lerp(currentStart, currentEnd, t * t * (3 - 2 * t));

    if (twistTime >= twistDuration) {
        twistTime = 0;
        currentTargetIndex = (currentTargetIndex + 1) % twistSequence.length;
        currentStart = currentEnd;
        currentEnd = twistSequence[currentTargetIndex];
    }

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import GUI from 'lil-gui';

// /**
//  * Base
//  */
// // Debug
// const gui = new GUI();

// // Canvas
// const canvas = document.querySelector('canvas.webgl');

// // Scene
// const scene = new THREE.Scene();

// /**
//  * Loaders
//  */
// const textureLoader = new THREE.TextureLoader();
// const gltfLoader = new GLTFLoader();
// const cubeTextureLoader = new THREE.CubeTextureLoader();

// /**
//  * Update all materials
//  */
// const updateAllMaterials = () => {
//     scene.traverse((child) => {
//         if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
//             child.material.envMapIntensity = 1;
//             child.material.needsUpdate = true;
//             child.castShadow = true;
//             child.receiveShadow = true;
//         }
//     });
// };

// /**
//  * Environment map
//  */
// const environmentMap = cubeTextureLoader.load([
//     '/envMaps/forModifiedMat/0/px.jpg',
//     '/envMaps/forModifiedMat/0/nx.jpg',
//     '/envMaps/forModifiedMat/0/py.jpg',
//     '/envMaps/forModifiedMat/0/ny.jpg',
//     '/envMaps/forModifiedMat/0/pz.jpg',
//     '/envMaps/forModifiedMat/0/nz.jpg'
// ]);

// scene.background = environmentMap;
// scene.environment = environmentMap;

// /**
//  * Material
//  */
// // Textures
// const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg');
// mapTexture.colorSpace = THREE.SRGBColorSpace;
// const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg');

// // Custom uniforms
// const customUniforms = {
//     uTime: { value: 0 }
// };

// // Standard material
// const material = new THREE.MeshStandardMaterial({
//     map: mapTexture,
//     normalMap: normalTexture
// });

// // Depth material
// const depthMat = new THREE.MeshDepthMaterial({
//     depthPacking: THREE.RGBADepthPacking
// });

// // Shader modification for twist effect
// const modifyShader = (mat) => {
//     mat.onBeforeCompile = (shader) => {
//         shader.uniforms.uTime = customUniforms.uTime;

//         shader.vertexShader = shader.vertexShader.replace(
//             '#include <common>',
//             `
//             #include <common>
//             uniform float uTime;
//             mat2 get2dRotateMatrix(float _angle) {
//                 return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
//             }
//         `
//         );

//         shader.vertexShader = shader.vertexShader.replace(
//             '#include <begin_vertex>',
//             `
//             #include <begin_vertex>
//             float angle = position.y * -0.1 * uTime;
//             mat2 rotateMatrix = get2dRotateMatrix(angle);
//             transformed.xz = transformed.xz * rotateMatrix;
//         `
//         );

//         shader.vertexShader = shader.vertexShader.replace(
//             '#include <beginnormal_vertex>',
//             `
//             #include <beginnormal_vertex>
//             float angle2 = position.y * -0.1 * uTime;
//             mat2 rotateMatrix2 = get2dRotateMatrix(angle2);
//             objectNormal.xz = objectNormal.xz * rotateMatrix2;
//         `
//         );
//     };
// };

// // Apply shader modifications
// modifyShader(material);
// modifyShader(depthMat);

// /**
//  * Models
//  */
// gltfLoader.load(
//     '/models/LeePerrySmith/LeePerrySmith.glb',
//     (gltf) => {
//         const mesh = gltf.scene.children[0];
//         mesh.rotation.y = Math.PI * 0.5;
//         mesh.material = material;
//         mesh.customDepthMaterial = depthMat;
//         scene.add(mesh);

//         updateAllMaterials();
//     }
// );

// /**
//  * Lights
//  */
// const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.normalBias = 0.05;
// directionalLight.position.set(0.25, 2, -2.25);
// scene.add(directionalLight);

// /**
//  * Sizes
//  */
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// };

// window.addEventListener('resize', () => {
//     sizes.width = window.innerWidth;
//     sizes.height = window.innerHeight;

//     camera.aspect = sizes.width / sizes.height;
//     camera.updateProjectionMatrix();

//     renderer.setSize(sizes.width, sizes.height);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// /**
//  * Camera
//  */
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
// camera.position.set(4, 1, -4);
// scene.add(camera);

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//     antialias: true
// });
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFShadowMap;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1;
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// /**
//  * Twist animation logic
//  */
// let twistDuration = 13; // seconds
// let untwistSpeedMultiplier = 20; // untwist faster
// let twistPhase = 'twist';
// let twistTime = 0;

// /**
//  * Animate
//  */
// const clock = new THREE.Clock();

// const tick = () => {
//     const deltaTime = clock.getDelta();
//     twistTime += deltaTime;

//     if (twistPhase === 'twist') {
//         const t = Math.min(twistTime / twistDuration, 1);
//         customUniforms.uTime.value = t * t * (3 - 2 * t)*11.4; // smoothstep easing
//         if (twistTime >= twistDuration) {
//             twistPhase = 'untwist';
//             twistTime = 0;
//         }
//     } else if (twistPhase === 'untwist') {
//         const t = Math.min(twistTime / (twistDuration / untwistSpeedMultiplier), 1);
//         customUniforms.uTime.value = 11.4 - t * t * (3 - 2 * t)*11.4; // reverse smoothstep
//         if (customUniforms.uTime.value <= 0) {
//             customUniforms.uTime.value = 0;
//             twistPhase = 'twist';
//             twistTime = 0;
//         }
//     }

//     controls.update();
//     renderer.render(scene, camera);
//     window.requestAnimationFrame(tick);
// };

// // Optional: axes helper for debugging
// // scene.add(new THREE.AxesHelper(5));

// tick();
// // import * as THREE from 'three'
// // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// // import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// // import GUI from 'lil-gui'

// // /**
// //  * Base
// //  */
// // // Debug
// // const gui = new GUI()

// // // Canvas
// // const canvas = document.querySelector('canvas.webgl')

// // // Scene
// // const scene = new THREE.Scene()

// // /**
// //  * Loaders
// //  */
// // const textureLoader = new THREE.TextureLoader()
// // const gltfLoader = new GLTFLoader()
// // const cubeTextureLoader = new THREE.CubeTextureLoader()

// // /**
// //  * Update all materials
// //  */
// // const updateAllMaterials = () => {
// //     scene.traverse((child) => {
// //         if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
// //             child.material.envMapIntensity = 1
// //             child.material.needsUpdate = true
// //             child.castShadow = true
// //             child.receiveShadow = true
// //         }
// //     })
// // }

// // /**
// //  * Environment map
// //  */
// // const environmentMap = cubeTextureLoader.load([
// //     '/envMaps/forModifiedMat/0/px.jpg',
// //     '/envMaps/forModifiedMat/0/nx.jpg',
// //     '/envMaps/forModifiedMat/0/py.jpg',
// //     '/envMaps/forModifiedMat/0/ny.jpg',
// //     '/envMaps/forModifiedMat/0/pz.jpg',
// //     '/envMaps/forModifiedMat/0/nz.jpg'
// // ])

// // scene.background = environmentMap
// // scene.environment = environmentMap

// // /**
// //  * Material
// //  */

// // // Textures
// // const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg')
// // mapTexture.colorSpace = THREE.SRGBColorSpace
// // const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg')

// // // Material
// // const material = new THREE.MeshStandardMaterial({
// //     map: mapTexture,
// //     normalMap: normalTexture
// // });

// // const depthMat = new THREE.MeshDepthMaterial({
// //     depthPacking: THREE.RGBADepthPacking
// // });

// // const customUniforms = {
// //     uTime: { value: 0 }
// // }

// // material.onBeforeCompile = (shader) => {

// //     shader.uniforms.uTime = customUniforms.uTime

// //     shader.vertexShader = shader.vertexShader.replace(
// //         '#include <common>',
// //         `
// //             #include <common>

// //             uniform float uTime;

// //             mat2 get2dRotateMatrix(float _angle)
// //             {
// //                 return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
// //             }
// //         `
// //     );

// //     shader.vertexShader = shader.vertexShader.replace(
// //         '#include <begin_vertex>',
// //         `
// //             #include <begin_vertex>

// //             transformed.xz=transformed.xz*rotateMatrix;
// //         `
// //     );
    
    
// //     shader.vertexShader = shader.vertexShader.replace(
// //         '#include <beginnormal_vertex>',
// //         `
// //             #include <beginnormal_vertex>

// //             // float angle=(position.y+uTime)*-0.1;
// //             float angle=(position.y)*-0.1*uTime;
// //             mat2 rotateMatrix=get2dRotateMatrix(angle);

// //             objectNormal.xz=objectNormal.xz*rotateMatrix;
// //         `
// //     );
    
// // }


// // depthMat.onBeforeCompile = (shader) => {

// //     shader.uniforms.uTime = customUniforms.uTime

// //     shader.vertexShader = shader.vertexShader.replace(
// //         '#include <common>',
// //         `
// //             #include <common>

// //             uniform float uTime;

// //             mat2 get2dRotateMatrix(float _angle)
// //             {
// //                 return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
// //             }
// //         `
// //     );

// //     shader.vertexShader = shader.vertexShader.replace(
// //         '#include <begin_vertex>',
// //         `
// //             #include <begin_vertex>

// //             // float angle=(position.y+uTime)*-0.1;
// //             float angle=(position.y)*-0.1*uTime;
// //             mat2 rotateMatrix=get2dRotateMatrix(angle);

// //             transformed.xz=transformed.xz*rotateMatrix;
// //         `
// //     );
// // }

// // /**
// //  * Models
// //  */
// // gltfLoader.load(
// //     '/models/LeePerrySmith/LeePerrySmith.glb',
// //     (gltf) => {
// //         // Model
// //         const mesh = gltf.scene.children[0]
// //         mesh.rotation.y = Math.PI * 0.5
// //         mesh.material = material;
// //         mesh.customDepthMaterial = depthMat;
// //         scene.add(mesh)

// //         // Update materials
// //         updateAllMaterials()
// //     }
// // )

// // /**
// //  * Lights
// //  */
// // const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
// // directionalLight.castShadow = true
// // directionalLight.shadow.mapSize.set(1024, 1024)
// // directionalLight.shadow.camera.far = 15
// // directionalLight.shadow.normalBias = 0.05
// // directionalLight.position.set(0.25, 2, - 2.25)
// // scene.add(directionalLight)

// // /**
// //  * Sizes
// //  */
// // const sizes = {
// //     width: window.innerWidth,
// //     height: window.innerHeight
// // }

// // window.addEventListener('resize', () => {
// //     // Update sizes
// //     sizes.width = window.innerWidth
// //     sizes.height = window.innerHeight

// //     // Update camera
// //     camera.aspect = sizes.width / sizes.height
// //     camera.updateProjectionMatrix()

// //     // Update renderer
// //     renderer.setSize(sizes.width, sizes.height)
// //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// // })

// // /**
// //  * Camera
// //  */
// // // Base camera
// // const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// // camera.position.set(4, 1, - 4)
// // scene.add(camera)

// // // Controls
// // const controls = new OrbitControls(camera, canvas)
// // controls.enableDamping = true

// // /**
// //  * Renderer
// //  */
// // const renderer = new THREE.WebGLRenderer({
// //     canvas: canvas,
// //     antialias: true
// // })
// // renderer.shadowMap.enabled = true
// // renderer.shadowMap.type = THREE.PCFShadowMap
// // renderer.toneMapping = THREE.ACESFilmicToneMapping
// // renderer.toneMappingExposure = 1
// // renderer.setSize(sizes.width, sizes.height)
// // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// // /**
// //  * Animate
// //  */
// // const clock = new THREE.Clock()

// // const tick = () => {
// //     const elapsedTime = clock.getElapsedTime()
// //     customUniforms.uTime.value = elapsedTime;

// //     // Update controls
// //     controls.update()

// //     // Render
// //     renderer.render(scene, camera)

// //     // Call tick again on the next frame
// //     window.requestAnimationFrame(tick)
// // }

// // tick()