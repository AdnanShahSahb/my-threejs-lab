uniform vec2 uResolution;
uniform float uSize;

attribute vec3 aPositionTarget;
attribute float aSize;

uniform float uProgress;

uniform vec3 uColorA;
uniform vec3 uColorB;

#include ../includes/noise.glsl;

varying vec3 vColor;

void main()
{

    float noiseOrig=simplexNoise3d(position*0.1);
    float noiseTarget=simplexNoise3d(aPositionTarget*0.1);
    float noise=mix(noiseOrig,noiseTarget,uProgress);
    noise=smoothstep(-1.0,1.0,noise);

    float duration=0.4;
    float delay=(1.0-duration)*noise;
    float end=delay+duration;
    float progress=smoothstep(delay,end,uProgress);

    // float progress=uProgress;
    vec3 mixedPos=mix(position,aPositionTarget,progress);

    // Final position
    vec4 modelPosition = modelMatrix * vec4(mixedPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize =aSize* uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor=mix(uColorA,uColorB,noise);
}