
var mat4=glMatrix.mat4;
var mat3=glMatrix.mat3;
var vec4=glMatrix.vec4;
var vec3=glMatrix.vec3;

var filas=41;
var columnas=41;

var controlF = [[0,0,0], [-1,1,0], [1,1,0], [0,0,0]];;

var controlR = [[0,0,0], [0,0,1], [0,0,2], [0,0,3]];


var forma = new CurvaBezier(controlF);

var recorrido = new CurvaBezier(controlR);

var ELECCION = 'supbarrido';

var SUPERFICIES = {
    plano: new Plano(3,3),
    esfera: new Esfera(2),
    tubosenoidal: new TuboSenoidal(.3,.25,2,5),
    supbarrido: new SuperficieBarrido(discretizadorDeCurvas(forma, columnas), 
                                      discretizadorDeCurvas(recorrido, filas), 
                                      discretizadorDeRecorrido(recorrido,filas), 
                                      filas, 
                                      columnas),
};

//var superficie3D;
//var mallaDeTriangulos;


function crearGeometria(){

    // el objeto3d tiene la malla
    superficie3D=SUPERFICIES[ELECCION];
    mallaDeTriangulos=generarSuperficie(superficie3D,filas,columnas);
    
}

function dibujarGeometria(){

    // objeto3d.dibujar(malla)
    //      adentro hace rotaciones etc
    //      cambiando los buffers (con las matrices) ??
    dibujarMalla(mallaDeTriangulos);

}

function escalar(v) {
    return [1,1,1];
}


function SuperficieBarrido(forma, matricesModelado, matricesNormales, niveles, vertices, funcEscalar = null, conTapa = false) {

    this.verticePromedio=function(){
        var xMax = 0;
        var xMin = 0;
        var yMax = 0;
        var yMin = 0;
        for (var i = 0; i < forma.length; i++) {
            var vertice_i = forma[i];
            if (vertice_i[0] < xMin) {
                xMin = vertice_i[0];
            }
            if (vertice_i[0] > xMin) {
                xMax = vertice_i[0];
            }
            if (vertice_i[1] < xMin) { 
                yMin = vertice_i[1];
            }
            if (vertice_i[1] > xMin) {
                yMax = vertice_i[1];
            }
        }
        var r = vec3.fromValues((xMin + xMax)/2, -(yMin + yMax)/2,  0);
        return r;
    }

    this.getPosicion=function(u,v){
        var vectorModelado = matricesModelado[Math.round(v*niveles)];
        var matrizNormal = matricesNormales[Math.round(v*niveles)];

        if (!vectorModelado) {
            vectorModelado = matricesModelado[Math.round((v-0.1) * niveles)]
        }

        if (!matrizNormal) {
            matrizNormal = matricesNormales[Math.round((v-0.1) * niveles)]
        }

        if (funcEscalar) {
            mat4.scale(matrizNormal, matrizNormal, funcEscalar(v));
        }

        if (conTapa && (v == 0 || v == 1)) {
            var vPromedio = this.verticePromedio();
            vec3.add(vPromedio, vPromedio, vectorModelado);
            return vPromedio;
        }

        var vertice = forma[Math.round(u*vertices)];
        if (!vertice) {
            vertice = forma[Math.round((u - 0.1)*vertices)];
        }
        var nuevoVertice = vec3.create();
        mat3.multiply(nuevoVertice, matrizNormal, vertice);
        vec3.add(nuevoVertice, nuevoVertice, vectorModelado);

        return nuevoVertice;
    }

    this.productoVectorial = function(a, b) {
        return [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
    }

    this.getNormal = function(u,v) {

        var pos = this.getPosicion(u, v);

        if (conTapa && (v == 0 || v == 1)) {
            var a = this.getPosicion(u, 0);
            var b = this.getPosicion(u, 1);
            if (v == 1) {
                return [a[0] - b[0], a[1] - b[1],  a[2] - b[2]];
            }
            if (v == 0) {
                return [ b[0] - a[0], b[1] - a[1],  b[2] - a[2]];
            }
        }  

        var a = this.getPosicion(u + 0.1, v);
        var b = this.getPosicion(u, v + 0.1);
        var resta_a = [a[0] - pos[0], a[1] - pos[1], a[2] - pos[2]];
        var resta_b = [b[0] - pos[0], b[1] - pos[1], b[2] - pos[2]];
        var result = this.productoVectorial(resta_a, resta_b);
        return result;
    }


    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function Plano(ancho,largo){

    this.getPosicion=function(u,v){

        var x=(u-0.5)*ancho;
        var z=(v-0.5)*largo;
        return [x,0,z];
    }

    this.getNormal=function(u,v){
        return [0,1,0];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}


function Esfera(radio) {

    this.getPosicion=function(u,v) {
        var x = radio*Math.cos(2*Math.PI*u)*Math.sin(Math.PI*v);
        var z = radio*Math.sin(2*Math.PI*u)*Math.sin(Math.PI*v);
        var y = radio*Math.cos(Math.PI*v);
        return [x,y,z];
    }

    this.getNormal=function(u,v) {
        var coords = this.getPosicion(u,v);
        var x = coords[0];
        var y = coords[1];
        var z = coords[2];
        var norma = Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2);
        norma = Math.sqrt(norma);
        return [z/norma, y/norma, x/norma];
    }

    this.getCoordenadasTextura=function(u,v) {
        return [u,v];
    }
}

function TuboSenoidal(amplitud_onda, longitud_onda, radio, altura){

    this.getPosicion=function(u,v){
        var y = (v - 0.5)* altura;
        var x = (radio + amplitud_onda*Math.sin(2*v*Math.PI/longitud_onda))*Math.cos(2*Math.PI*u);
        var z = (radio + amplitud_onda*Math.sin(2*v*Math.PI/longitud_onda))*Math.sin(2*Math.PI*u);;
        return [x,y,z];
    }

    this.productoVectorial = function(a, b) {
        return [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
    }

    this.getNormal=function(u,v){
        var a = this.getPosicion(u + 0.0001, v);
        var b = this.getPosicion(u, v + 0.0001);
        return [Math.sin(2*u*Math.PI), Math.cos(2*u*Math.PI), 0]
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

// para tapas -> hacer otra generarSuperficeTapa(superficie, filas, columnas, formaBarrido)

function generarSuperficie(superficie,filas,columnas){
    
    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {

            var u=j/columnas;
            var v=i/filas;

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs=superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }

    // Buffer de indices de los triángulos

    var filasReales = filas+1;
    var columnasReales = columnas + 1;
    
    indexBuffer=[];
    
    for (var i=0; i < filas; i++) {
        for (var j=0; j < columnas; j++) {
            indexBuffer.push(i*columnasReales + j);
            indexBuffer.push((i+1)*columnasReales + j);
        }
        
        // agrego los ultimos dos vertices de la ultima columna
        indexBuffer.push(i*columnasReales + (columnasReales - 1));
        indexBuffer.push((i+1)*columnasReales + (columnasReales - 1));
        
        // agrego el ultimo vertice y el siguiente para generar el triangulo degenerado
        // solo si no llegue al ultimo quad
        if (i != filas - 1) {
            indexBuffer.push((i+1)*columnasReales + (columnasReales - 1));
            indexBuffer.push((i+1)*columnasReales);
        }
    }

    // Creación e Inicialización de los buffers

    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

function dibujarMalla(mallaDeTriangulos){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
       
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo!="wireframe"){
        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    if (modo!="smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
 
}


