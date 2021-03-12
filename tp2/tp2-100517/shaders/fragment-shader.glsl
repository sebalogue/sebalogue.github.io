        precision mediump float;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        uniform vec3 RGB;
        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;	    // color de luz direccional
        uniform vec3 uLightPosition;        // posición de la luz
        
        uniform bool uUseLighting;          // usar iluminacion si/no

        uniform sampler2D uSampler;

        // Lighting

        varying highp vec3 vLighting;

        // texturas
        uniform bool useTexture;
        uniform sampler2D uSamplerH;
        uniform bool cabina;

        void main(void) {

            vec2 uv_ = vUv;
            if (cabina) {
                float factor = 0.64;
                float offset = 0.75;
                uv_.x = vWorldPosition.x*-factor - 0.6;
                uv_.y = vWorldPosition.y*factor + offset;
            }

            //------------
            vec3 N = normalize(-vNormal);
            vec3 L = normalize(uLightPosition - vWorldPosition);

            // Lambert
            float lambertian = max(dot(N, L), 0.0);

            float specular = 0.0;
            float shininessVal = 1.0;

            if(lambertian > 0.0) {
                vec3 R = reflect(-L, N);     
                vec3 V = normalize(vWorldPosition);

                // especular
                float specAngle = max(dot(R, V), 0.0);
                specular = pow(specAngle, shininessVal);
            }

            float Ka = 1.0;   // Ambiente
            float Kd = 0.1;  // Difusion
            float Ks = 1.0;   // Especular

            vec3 diffuseColor = vec3(0.3, 0.3, 0.3);
            vec3 specularColor = vec3(1.0, 1.0, 1.0);

            vec3 color = Ka * uAmbientColor + Kd * lambertian* diffuseColor + Ks * specular * specularColor;

            

            if (useTexture) {
                vec3 textureH = texture2D(uSamplerH, uv_).xyz;
                //color = textureH;
                color.x *= textureH.x;
                color.y *= textureH.y;
                color.z *= textureH.z;
            } else {
                color.x *= RGB.x;
                color.y *= RGB.y;
                color.z *= RGB.z;
            }

            gl_FragColor = vec4(color, 1.0);
            
        }