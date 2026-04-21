
// IT IS A VARIABLE - WE WILL HAVE ONLY ONE VARIABLE IN THIS PROJ - WHAT GPUComputationRenderer WILL CALCULATE IS CALLED VARIABLE

#include ../includes/simplexNoise4d.glsl;

uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;



void main(){

    float time=uTime*0.2;

    vec2 uv=gl_FragCoord.xy/resolution.xy;
    vec4 particle=texture(uParticles,uv);
    vec4 base=texture(uBase,uv);

    if(particle.a>=1.0){
        particle.a=mod(particle.a,1.0);
        particle.xyz=base.xyz;
    }
    else{

        float strength=simplexNoise4d(vec4(base.xyz*0.2, time+0.1));
        float influence=(uFlowFieldInfluence-0.5)*(-2.0);
        strength=smoothstep(influence,1.0,strength);

        vec3 flowField=vec3(
            simplexNoise4d(vec4(particle.xyz*uFlowFieldFrequency+0.0,time)),
            simplexNoise4d(vec4(particle.xyz*uFlowFieldFrequency+1.0,time)),
            simplexNoise4d(vec4(particle.xyz*uFlowFieldFrequency+2.0,time))
        );
        flowField=normalize(flowField);
        particle.xyz+=flowField*uDeltaTime*strength*uFlowFieldStrength;
        particle.a+=uDeltaTime*0.3;
    }

    
    gl_FragColor=particle;
}