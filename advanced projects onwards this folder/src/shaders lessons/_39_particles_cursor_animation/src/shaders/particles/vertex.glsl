uniform vec2 uResolution;
uniform sampler2D uPicTexture;
uniform sampler2D uDisplacementTexture;

varying vec3 vColor;

attribute float aIntensity;
attribute float aAngle;

void main()
{
    vec3 newPosition=position;
    float displacementIntensity=texture(uDisplacementTexture,uv).r;
    displacementIntensity=smoothstep(0.1,0.3,displacementIntensity);


    vec3 displacement=vec3(
        sin(aAngle)*0.2,
        cos(aAngle)*0.2,
        1.0
    );
    displacement=normalize(displacement);
    displacement*=displacementIntensity;
    displacement*=3.0;
    displacement*=aIntensity;

    newPosition+=displacement;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float picIntensity=texture(uPicTexture,uv).r;
    // float picIntensity=texture(uDisplacementTexture,uv).r;


    // Point size
    gl_PointSize = 0.1* picIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor=vec3(pow(picIntensity,2.0));
}