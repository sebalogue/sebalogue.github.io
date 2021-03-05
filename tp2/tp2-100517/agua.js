
function onTextureAguaLoaded() {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, agua.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, agua.texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
};

class Agua {

    constructor(cant_parcelas) {
        this.n = cant_parcelas;
        
        this.texture = null;

        this.parcelas = [];

        this.lado = 50;

        this.refTexture = null;
    };

     initRefTexture(texture_file) {
        
        var ref = gl.createTexture();
        ref.image = new Image();
        this.refTexture = ref;

        this.refTexture.image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, ref);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ref.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.bindTexture(gl.TEXTURE_2D, null);
        };

        this.refTexture.image.src = texture_file;
    };

    initTexture(texture_file) {
        
        this.texture = gl.createTexture();
        this.texture.image = new Image();
        var im = this.texture.image;
        var text = this.texture;

        this.texture.image.onload = function () {   
               onTextureAguaLoaded();
        }
        this.texture.image.src = texture_file;
    };

    initBuffers() {
        var n = this.n;
        var ladoParcela = this.lado / n;

        for (var i = 0; i < n; i += 1) {

            for (var j = 0; j < n; j += 1) {
                
                var parcela = new Parcela(i, j, ladoParcela, this.lado);
                parcela.initBuffers();
                this.parcelas.push(parcela);
            }
        }
        
    };

    draw(mMatrixUniform, nMatrixUniform, posicionHelicoptero) {

        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shaderProgram.samplerUniformAgua, 5);

        gl.activeTexture(gl.TEXTURE6);
        gl.bindTexture(gl.TEXTURE_2D, this.refTexture);
        gl.uniform1i(shaderProgram.samplerUniformRef, 6);
        
        // Para centrar parcelas y calcular dist con helicoptero
        var i = ((posicionHelicoptero[0] + this.lado/2) / this.lado) * this.n;
        var j = ((posicionHelicoptero[2] + this.lado/2) / this.lado) * this.n;
        var posRelativa = vec3.fromValues(-this.lado/2, 0, -this.lado/2);

        var vec2 = glMatrix.vec2;

        var vectorHeli = vec2.fromValues(i, j); 

        for (var k = 0; k < this.parcelas.length; k++) {
            var vectorParcela = vec2.fromValues(this.parcelas[k].i, this.parcelas[k].j);
            if (vec2.distance(vectorHeli, vectorParcela) < 3.5) {
                this.parcelas[k].draw(mMatrixUniform, nMatrixUniform, this.texture, posRelativa);
            }
        }

    };
};