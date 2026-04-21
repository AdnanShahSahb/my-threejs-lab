const params = new URLSearchParams(window.location.search);
const proj = params.get("proj");

const controls = document.getElementById('controls')
const intro = document.getElementById('intro')

const scripts = {
    shadows: () => import('./projects/_15_shadows.js'),
    hauntedHouse: () => import('./projects/_16_hauntedHouse.js'),
    particles: () => import('./projects/_17_particles.js'),
    galaxyGenerator: () => import('./projects/_18_galaxyGenerator.js'),
    scrollbasedProj: () => {
        import('./projects/_19_scrollbasedProj.js');

        document.getElementsByClassName('sec')[0].style.display = 'flex'
        document.getElementsByClassName('sec')[1].style.display = 'flex'
        document.getElementsByClassName('sec')[2].style.display = 'flex'

        controls.style.display = 'none'
        intro.style.display = 'none'
    },
    physics: () => import('./projects/_20_physics.js'),
    RaycasterandMouseEvents: () => import('./projects/_22_RaycasterandMouseEvents.js'),
    envMap: () => import('./projects/_24_envMap.js'),
    realistic_render: () => import('./projects/_25_realistic_render.js'),

    shaders_flag: () => import('./shaders lessons/_27_shaders_flag/scene.js'),
    shaders_modifiedMaterials: () => import('./shaders lessons/_31_shaders_modifiedMaterials/script.js'),
    shaders_ragingSea: () => import('./shaders lessons/_29_shaders_ragingSea/scene.js'),
    shaders_ragingSea_adv: () => import('./shaders lessons/_36_shaders_ragingSea_adv/scene.js'),
    particles_cursor_animation: () => import('./shaders lessons/_39_particles_cursor_animation/src/script.js'),
    particles_morphing: () => import('./shaders lessons/_40_particles_morphing/script.js'),
    gpgpu_flowfieldparticles_shaders: () => import('./shaders lessons/_41_gpgpu_flowfieldparticles_shaders/script.js'),
};



if (proj && scripts[proj]) {
    // hide panel when a project is loaded
    controls.classList.remove('visible')
    intro.classList.remove('visible')

    scripts[proj]()



} else {
    // show panel when no project
    controls.classList.add('visible')
    intro.classList.add('visible')


    document.getElementsByClassName('sec')[0].style.display = 'none'
    document.getElementsByClassName('sec')[1].style.display = 'none'
    document.getElementsByClassName('sec')[2].style.display = 'none'

    document.getElementById('otherProjBtn').style.display = 'none'

}