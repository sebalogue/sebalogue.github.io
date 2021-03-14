precision mediump float;
varying highp vec2 vUv;

uniform float scale1;
float low;
float high;

varying float altura;                         

varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform vec3 uAmbientColor;         // color de luz ambiente
uniform vec3 uDirectionalColor;     // color de luz direccional
uniform vec3 uLightPosition;        // posición de la luz

uniform bool uUseLighting;          // usar iluminacion si/no

uniform sampler2D uSampler0;
uniform sampler2D uSampler1;
uniform sampler2D uSampler2;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float cnoise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}
// ***************************************************************************



void main(void) {

    // uSampler0: tierra
    // uSampler1: roca
    // uSampler2: pasto

    if (altura <= 1.6) {
      low = 0.9;
      high = 0.3;;
    } else if (altura >= 2.5) {
      low = -0.9;
      high = 0.01;
    } else {
      low = -0.01;
      high = 0.9;
    }

   //vec4 textureColor = texture2D(uSampler2,vUv*3.0);
   //vec4 textureColor = texture2D(uSampler2,vUv*3.0);
   
   // sampleo el pasto a diferentes escalas

   vec3 pasto1=texture2D(uSampler2,vUv*4.0*scale1).xyz;
   vec3 pasto2=texture2D(uSampler2,vUv*3.77*scale1).xyz;
   vec3 pasto3=texture2D(uSampler2,vUv*2.11*scale1).xyz;
   
   // sampleo la tierra a diferentes escalas

   vec3 tierra1=texture2D(uSampler0,vUv*4.0*scale1).xyz;
   vec3 tierra2=texture2D(uSampler0,vUv*2.77*scale1).xyz;
   
   // sampleo la roca
   vec3 roca=texture2D(uSampler1,vUv*2.77*scale1).xyz;
   
   // combino los 3 sampleos del pasto con la funcion de mezcla
   vec3 color1=mix(mix(pasto1,pasto2,0.5),pasto3,0.3);
   
   // genero una mascara 1 a partir de ruido perlin
   float noise1=cnoise(vUv.xyx*8.23*scale1+23.11);
   float noise2=cnoise(vUv.xyx*11.77*scale1+9.45);
   float noise3=cnoise(vUv.xyx*14.8*scale1+21.2);
   
   float mask1=mix(mix(noise1,noise2,0.5),noise3,0.3);      
   mask1=smoothstep(-0.1,0.2,mask1);
   
   // combino tierra y roca usando la mascara 1
   vec3 color2=mix(mix(tierra1,tierra2,0.5),roca,mask1);
   
   // genero la mascara 2 a partir del ruido perlin
   float noise4=cnoise(vUv.xyx*8.23*scale1);
   float noise5=cnoise(vUv.xyx*11.77*scale1);
   float noise6=cnoise(vUv.xyx*14.8*scale1);
   
   float mask2=mix(mix(noise4,noise5,0.5),noise6,0.3);             
   mask2=smoothstep(low,high,mask2);
   
   // combino color1 (tierra y rocas) con color2 a partir de la mascara2
   vec3 color=mix(color1,color2,mask2);

   
  //--------

  vec3 spec = vec3(0.0);

  // normalize
  vec3 n = normalize(-vNormal);
  vec3 e = normalize(vec3(vWorldPosition));

  float intensity = max(dot(n, uLightPosition), 0.0);
  vec3 specularColor = vec3(1.0, 1.0, 1.0);
  vec3 diffuseColor = vec3(0.3, 0.3, 0.3);
  vec3 ambientColor = vec3(0.4, 0.4, 0.4);
  float shininess = 1.0;

  // if the vertex is lit compute the specular color
  if (intensity > 0.0) {
      // compute the half vector
      vec3 h = normalize(uLightPosition + e);  
      // compute the specular term into spec
      float intSpec = max(dot(h,n), 0.0);
      spec = specularColor * pow(intSpec, shininess);
  }
  vec3 colorlight = max(intensity *  diffuseColor + spec, ambientColor);

  color.x *= colorlight.x;
  color.y *= colorlight.y;
  color.z *= colorlight.z;

  gl_FragColor = vec4(color, 1.0);
}