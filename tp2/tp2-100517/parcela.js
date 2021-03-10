
class Parcela {

    constructor(i, j, lado, largoTotal, shader = null) {
        this.i = i;
        this.j = j;
        this.lado = lado;
        this.largoTotal = largoTotal;

        this.latitudeBands = 40;
        this.longitudeBands = 40;
        
        this.position_buffer = null;
        this.normal_buffer = null;
        this.texture_coord_buffer = null;
        this.index_buffer = null;

        this.webgl_position_buffer = null;
        this.webgl_normal_buffer = null;
        this.webgl_texture_coord_buffer = null;
        this.webgl_index_buffer = null;
        this.shaderProgram = shaderProgramTerreno;
        if (shader) {
            this.shaderProgram = shader;
        }
    };

    initBuffers() {

        this.position_buffer = [];
        this.normal_buffer = [];
        this.texture_coord_buffer = [];

        var latNumber = 0;
        var longNumber = 0;

        this.latitudeBands = 50;
        this.longitudeBands = 50;

        for (latNumber = 0; latNumber <= this.latitudeBands; latNumber++) {
            for (longNumber = 0; longNumber <= this.longitudeBands; longNumber++) {
                var x = (this.i + (latNumber/this.latitudeBands))*this.lado;
                var z = (this.j + (longNumber/this.longitudeBands))*this.lado;
                var y = 0;


                var u =  (x / this.largoTotal);
                var v = 1-(z / this.largoTotal);

                this.normal_buffer.push(0);
                this.normal_buffer.push(1);
                this.normal_buffer.push(0);

                this.texture_coord_buffer.push(u);
                this.texture_coord_buffer.push(v);
                
                this.position_buffer.push(x);
                this.position_buffer.push(y);
                this.position_buffer.push(z);
            }
        }
        // Buffer de indices de los triangulos
        this.index_buffer = [];
      
        for (latNumber = 0; latNumber < this.latitudeBands; latNumber++) {
            for (longNumber = 0; longNumber < this.longitudeBands; longNumber++) {

                var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
                var second = first + this.longitudeBands + 1;

                this.index_buffer.push(first);
                this.index_buffer.push(second);
                this.index_buffer.push(first + 1);

                this.index_buffer.push(second);
                this.index_buffer.push(second + 1);
                this.index_buffer.push(first + 1);
                
            }
        }

        // Creación e Inicialización de los buffers a nivel de OpenGL
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = this.position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;
    };

    draw(mMatrixUniform, nMatrixUniform, texture, pos) {
        var m = mat4.create();

        mat4.translate(m, m, pos);

        gl.uniformMatrix4fv(mMatrixUniform, false, m);

        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, m); // normalMatrix= (inversa(traspuesta(matrizModelado)));

        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);

        gl.uniformMatrix3fv(nMatrixUniform, false, normalMatrix);

        // Se configuran los buffers que alimentaron el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        var su = (this.shaderProgram).samplerUniform;
        gl.uniform1i(su, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

        if (modo!="wireframe"){
            gl.uniform1i(this.shaderProgram.useLightingUniform,(lighting=="true"));                    
            gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        if (modo!="smooth") {
            gl.uniform1i(this.shaderProgram.useLightingUniform,false);
            gl.drawElements(gl.LINE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

    };
};