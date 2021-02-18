
class Objeto3D {
	// atributos privados
	constructor() {
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.mallaDeTriangulos = null;
		this.matrizModelado = mat4.create();
		this.posicion = vec3.create();
		this.rotacion = vec3.create();
		this.escala = vec3.fromValues(1,1,1);
		this.hijos = []; // lista de objetos dependientes
		this.rotateFirst = false;
		this.color = vec3.fromValues(1, 1, 1);
	}

	rotarPrimero() {
		this.rotateFirst = true;
	}

	setColor(r, g, b) {
		vec3.set(this.color, r, g, b);
	}

	// método privado, usa posición, rotación y escala
	actualizarMatrizModelado(){
		this.matrizModelado = mat4.create();

		if (this.rotateFirst) {
			mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[1], [0,1,0]);
			mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[0], [1,0,0]);
			mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[2], [0,0,1]);
			mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);		
		} else {
			mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);

			mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[1], [0,1,0]);
			mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[2], [0,0,1]);
			mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[0], [1,0,0]);
		}

		mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);

	};


	dibujarLaMalla(malla){
	    
	    // Se configuran los buffers que alimentaron el pipeline
	    gl.bindBuffer(gl.ARRAY_BUFFER, malla.webgl_position_buffer);
	    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, malla.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

	    //gl.bindBuffer(gl.ARRAY_BUFFER, malla.webgl_uvs_buffer);
	    //gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, malla.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

	    gl.bindBuffer(gl.ARRAY_BUFFER, malla.webgl_normal_buffer);
	    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, malla.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
	       
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, malla.webgl_index_buffer);


	    /*if (modo!="wireframe"){
	        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));
	        gl.drawElements(gl.TRIANGLE_STRIP, malla.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
	    }
	    
	    if (modo!="smooth") {
	        gl.uniform1i(shaderProgram.useLightingUniform,false);
	        gl.drawElements(gl.LINE_STRIP, malla.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
	    }*/

	    gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));
	    gl.drawElements(gl.TRIANGLE_STRIP, malla.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
	    	 
	};


	// métodos públicos
	dibujar(matriz, mMatrixUniform, nMatrixUniform){ 
		var m = mat4.create();
		this.actualizarMatrizModelado();
		mat4.multiply(m, matriz, this.matrizModelado);

		if (this.vertexBuffer && this.indexBuffer) {
			//// dibujar
			gl.uniformMatrix4fv(mMatrixUniform, false, m);
    
            var normalMatrix = mat3.create();
            mat3.fromMat4(normalMatrix, m); // normalMatrix= (inversa(traspuesta(matrizModelado)));
    
            mat3.invert(normalMatrix, normalMatrix);
            mat3.transpose(normalMatrix, normalMatrix);

            gl.uniformMatrix3fv(nMatrixUniform, false, normalMatrix);

            gl.uniform3fv(shaderProgram.colorRgb, this.color);
            this.dibujarLaMalla(this.mallaDeTriangulos);
		}

		for (var i = 0; i < this.hijos.length; i++) {
			this.hijos[i].dibujar(m, mMatrixUniform, nMatrixUniform);
		}
	};

	setGeometria(mallaDeTriangulos) {
		this.indexBuffer = mallaDeTriangulos.webgl_index_buffer;
		this.vertexBuffer = mallaDeTriangulos.webgl_position_buffer;
		this.mallaDeTriangulos = mallaDeTriangulos;
	};

	agregarHijo(hijo) {
		this.hijos.push(hijo);
	};

	quitarHijo(hijo) {
		const i = this.hijos.indexOf(hijo);
		if (i >= 0) {
		  this.hijos.splice(i, 1);
		}
	};

	setPosicion(x, y, z) {
		this.posicion = vec3.fromValues(x, y, z);
	};

	setRotacion(x, y, z) {
		this.rotacion = vec3.fromValues(x, y, z);
	};

	setEscala(x, y, z) {
		this.escala = vec3.fromValues(x, y, z);
	};
};