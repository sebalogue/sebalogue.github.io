
class TexturaAgua {

	constructor() {
		this.textures = []
		this.scale1 = 1;
		this.low = -0.5;
		this.high = 0.5;
	}

	texturasTerminadas(){
		return totalTexturas <= 0;
	}

	initTextures() {
		this.initTexture("img/tierra.jpg");
		this.initTexture("img/roca.jpg");
		this.initTexture("img/pasto.jpg");
	}

	initTexture(file){

		var texture = gl.createTexture();
		texture.image = new Image();
		
		this.textures.push(texture);

		texture.image.onload = function () {
		
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 					// invierto el ejeY					
			gl.bindTexture(gl.TEXTURE_2D, texture); 						// activo la textura
			
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);	// cargo el bitmap en la GPU
			
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);					// selecciono filtro de magnificacion
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);	// selecciono filtro de minificacion
			
			gl.generateMipmap(gl.TEXTURE_2D);		// genero los mipmaps
			gl.bindTexture(gl.TEXTURE_2D, null);
			
			totalTexturas -= 1;
		}
		texture.image.src = file;
	}

	draw() {
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture
        gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
		gl.uniform1i(shaderProgram.samplerUniform0, 1);
		
        gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
		gl.uniform1i(shaderProgram.samplerUniform1, 2);

		gl.activeTexture(gl.TEXTURE3);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[2]);
		gl.uniform1i(shaderProgram.samplerUniform2, 3);
		
		gl.uniform1f(gl.getUniformLocation(shaderProgram, "scale1"), this.scale1);
		//gl.uniform1f(gl.getUniformLocation(shaderProgram, "low"), this.low);
		//gl.uniform1f(gl.getUniformLocation(shaderProgram, "high"), this.high);

	}

}

