precision mediump float;
varying highp vec2 vUv;


varying vec3 vNormal;
varying vec2 vN;
varying vec3 vWorldPosition;

uniform sampler2D uSamplerAgua;
uniform sampler2D samplerRef;




// ***************************************************************************



void main(void) {

  // sampleo el pasto a diferentes escalas

  vec3 texturaAgua = texture2D(uSamplerAgua, vUv * 0.7).xyz;
  vec3 texturaRef = texture2D(samplerRef, vN).xyz;

  gl_FragColor = vec4(texturaAgua * texturaRef ,1.0);

}