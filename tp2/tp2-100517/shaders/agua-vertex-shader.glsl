
// atributos del vertice (cada uno se alimenta de un ARRAY_BUFFER distinto)

attribute vec3 aPosition;   //posicion (x,y,z)
attribute vec3 aNormal;     //vector normal (x,y,z)
attribute vec2 aUv;         //coordenadas de texture (x,y)  x e y (en este caso) van de 0 a 1

// variables Uniform (son globales a todos los vértices y de solo-lectura)

uniform mat4 uMMatrix;     // matriz de modelado
uniform mat4 uVMatrix;     // matriz de vista
uniform mat4 uPMatrix;     // matriz de proyección
uniform mat3 uNMatrix;     // matriz de normales
                
uniform float time;                 // tiempo en segundos

uniform sampler2D uSampler;         // sampler de textura de la tierra

// variables varying (comunican valores entre el vertex-shader y el fragment-shader)
// Es importante remarcar que no hay una relacion 1 a 1 entre un programa de vertices y uno de fragmentos
// ya que por ejemplo 1 triangulo puede generar millones de pixeles (dependiendo de su tamaño en pantalla)
// por cada vertice se genera un valor de salida en cada varying.
// Luego cada programa de fragmentos recibe un valor interpolado de cada varying en funcion de la distancia
// del pixel a cada uno de los 3 vértices. Se realiza un promedio ponderado

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec2 vN;
varying vec2 vUv;


void main(void) {
            
    vec3 position = aPosition;		
    vec3 normal = aNormal;	
    vec2 uv = aUv;

    position.y += 1.5;

    vec4 worldPos = uMMatrix*vec4(position, 1.0);                        

    gl_Position = uPMatrix * uVMatrix * worldPos;

    vWorldPosition=worldPos.xyz;              
    vNormal = normalize(uNMatrix*normal);

    vec4 p = vec4(position, 1.0);

    vec3 e = normalize(vec3(uVMatrix * p));
    vec3 n = normalize(uNMatrix * vNormal);

    vec3 r = reflect(e, n);
    float m = 2.0 * sqrt(
        pow(r.x, 2.0) +
        pow(r.y, 2.0) +
        pow(r.z + 1.0, 2.0)
    );
    vN = r.xy / m + 0.5;

    vUv=uv;
}
