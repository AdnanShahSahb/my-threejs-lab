
uniform vec2 uFreq;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

float elevation=sin(modelPosition.x*uFreq.x-uTime)*0.25;
elevation+=sin(modelPosition.y*uFreq.y-uTime)*0.25;
    modelPosition.z+=elevation;

    // modelPosition.z+=sin(modelPosition.x*uFreq.x-uTime)*0.25;
    // modelPosition.z+=sin(modelPosition.y*uFreq.y-uTime)*0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    vUv=uv;
    vElevation=elevation;
}