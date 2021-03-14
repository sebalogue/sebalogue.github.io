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
                float factor = 0.77;
                uv_.x = vWorldPosition.x*-factor + 0.5;
                uv_.y = vWorldPosition.y*factor - 0.55;
            }

            //_------------
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
            vec3 color = max(intensity *  diffuseColor + spec, ambientColor);

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