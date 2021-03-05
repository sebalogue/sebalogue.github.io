precision mediump float;
varying highp vec2 vUv;


varying vec3 vNormal;
varying vec2 vN;
varying vec3 vWorldPosition;

uniform sampler2D uSamplerAgua;
uniform sampler2D samplerRef;

uniform vec3 lightVec;




// ***************************************************************************



void main(void) {

  vec3 texturaAgua = texture2D(uSamplerAgua, vUv * 0.7).xyz;
  vec3 texturaRef = texture2D(samplerRef, vN).xyz;

  float factorDifuso = max(0.4, dot(vNormal, lightVec) * 1.1);
 
  gl_FragColor = vec4(texturaAgua * texturaRef ,1.0);

}