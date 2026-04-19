uniform vec2 uResolution;
uniform float uSize;

attribute vec3 positionTarget;

uniform float uProgress;

#include ../includes/noise.glsl;

varying vec3 vColor;

void main()
{

    float noiseOrig=simplexNoise3d(position*0.1);
    float noiseTarget=simplexNoise3d(positionTarget*0.1);
    float noise=mix(noiseOrig,noiseTarget,uProgress);
    noise=smoothstep(-1.0,1.0,noise);

    float duration=0.4;
    float delay=(1.0-duration)*noise;
    float end=delay+duration;
    float progress=smoothstep(delay,end,uProgress);

    // float progress=uProgress;
    vec3 mixedPos=mix(position,positionTarget,progress);

    // Final position
    vec4 modelPosition = modelMatrix * vec4(mixedPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor=vec3(noise);
}