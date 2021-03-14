
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
        varying vec2 vUv;

        varying float altura;                         
        
        // constantes
        
        const float PI=3.141592653;
        const float epsilon=1.0/1024.0;

        const float amplitud=4.0;


        // controla la cantidad de muestras que se promedian

        const int samplingRange=4; // 0 = 1 muestra,  1 = 9 muestras, 2= 25 muestras, 3 = 49 muestras
        const float textureSize = 1024.0;

        float multisample(sampler2D texture,vec2 coord){

            float sum=0.0;
            float totalWeight;
            float pixelDistance=(1.0/textureSize);

            for (int i=-samplingRange;i<=samplingRange;i++){
                for (int j=-samplingRange;j<=samplingRange;j++){

                    float weight=1.0/(1.0+sqrt(pow(float(j),2.0)+pow(float(i),2.0)));
                    totalWeight+=weight;

                    vec2 uv=coord+vec2(float(i),float(j))*pixelDistance*2.0;
                    sum+=weight*texture2D(texture, vec2(uv.s, uv.t)).x;
                }
            }

            return sum/totalWeight;
        }

        void main(void) {
                    
            vec3 position = aPosition;                  
            vec2 uv = aUv;

            float epsilon=1.0/textureSize;
            
            float center = multisample(uSampler, vec2(uv.s, uv.t));

            float centerMasX = multisample(uSampler, vec2(uv.s+epsilon, uv.t));  
            float centerMasZ = multisample(uSampler, vec2(uv.s, uv.t+epsilon));  

            // elevamos la coordenada Y
            position.y+=center*amplitud;

            altura = position.y;

            vec4 worldPos = uMMatrix*vec4(position, 1.0);                        
            gl_Position = uPMatrix*uVMatrix*worldPos;

            vWorldPosition=worldPos.xyz;        

            // diferencias de elevación entre 2 puntos proximos
            
            float deltaElevationX=(centerMasX-center)*amplitud;
            float deltaElevationZ=(centerMasZ-center)*amplitud;


            // angulo del vector tangente en el plano XY, ZY respectivamente            
            float angEnX=atan(deltaElevationX,epsilon);
            float angEnZ=atan(deltaElevationZ,epsilon);

            // vectores tangentes
            vec3 tangenteX=vec3(cos(angEnX),sin(angEnX),0.0);
            vec3 tangenteZ=vec3(0.0,sin(angEnZ),cos(angEnZ));

            // vector normal
            vNormal=cross(tangenteZ,tangenteX);
            vUv=uv; 
        }
