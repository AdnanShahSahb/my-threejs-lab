uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

varying float vElevation;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFreq;
uniform float uSmallWavesSpeed;
uniform float uSmallWavesIteration;

#include "../includes/perlinClassic3D.glsl"


varying vec3 vNormal;
varying vec3 vPosition;

float waveElevation(vec3 position){

    float elevation=
        sin(position.x * uBigWavesFrequency.x+uTime*uBigWavesSpeed) * 
        sin(position.z * uBigWavesFrequency.y+uTime*uBigWavesSpeed)*
        uBigWavesElevation;



    for(float i=1.0;i<=uSmallWavesIteration;i++){
            elevation-=abs(
                perlinClassic3D(
                    vec3(
                        position.xz*uSmallWavesFreq*i
                        ,uTime*uSmallWavesSpeed
                        )
                    )
                        *
                        uSmallWavesElevation/i
                );
    }

    return elevation;
}


void main(){

    float shift=0.01;
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec3 modelPositionA= modelPosition.xyz+vec3(shift,0.0,0.0);
    vec3 modelPositionB= modelPosition.xyz+vec3(0.0,0.0,-shift);


    float elevation=waveElevation(modelPosition.xyz);

    modelPosition.y+=elevation;
    
    modelPositionA.y+=waveElevation(modelPositionA);
    modelPositionB.y+=waveElevation(modelPositionB);
    
    vec3 toA=normalize(modelPositionA-modelPosition.xyz);
    vec3 toB=normalize(modelPositionB-modelPosition.xyz);

    vec3 computeNormal=cross(toA,toB);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vElevation=elevation;
    vNormal=computeNormal;
    vPosition=modelPosition.xyz;
}