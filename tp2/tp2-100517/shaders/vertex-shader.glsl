
        // atributos del vertice (cada uno se alimenta de un ARRAY_BUFFER distinto)

        attribute vec3 aNormal;     //vector normal (x,y,z)
        attribute vec2 aUv;         //coordenadas de texture (x,y)  x e y (en este caso) van de 0 a 1
        attribute vec3 aPosition;   //posicion (x,y,z)

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
        varying vec2 vUv;

        uniform bool cabina;

        // lighting

        varying highp vec3 vLighting;                       
        
        // constantes
        
        const float PI=3.141592653;

        void main(void) {
                    
            vec3 position = aPosition;		
            vec3 normal = aNormal;	
            vec2 uv = aUv;
                                   	
           vec4 textureColor = texture2D(uSampler, vec2(uv.s, uv.t));         
            
            // **************** EDITAR A PARTIR DE AQUI *******************************
            
            //position+=normal*(1.0+sin(uv.x*18.0*PI+time*20.0))*0.03; 

            // ************************************************************************

            vec4 worldPos = uMMatrix*vec4(position, 1.0);                        

            gl_Position = uPMatrix * uVMatrix * worldPos;

            if (cabina) {
                vWorldPosition = aPosition;
            } else {
                vWorldPosition=worldPos.xyz;              
            }
            
            vNormal = normalize(uNMatrix*normal);
            vUv=uv;

            // Apply lighting effect
            
            //highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
            //highp vec3 directionalLightColor = vec3(1, 1, 1);
            //highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

            //highp vec4 transformedNormal = uNMatrix * vec4(aNormal, 1.0);

            //highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            //vLighting = ambientLight + (directionalLightColor * directional);

        }
