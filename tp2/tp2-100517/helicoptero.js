class Helicoptero {
	// atributos privados
	constructor(controlHelicoptero) {
		this.control = controlHelicoptero;
		this.objeto3d = new Objeto3D();
		this.hijos = [];
		this.helices = [];
		this.timon = null;
	}

	generarCabina(listaObjetos) {
		var filas = 30;
		var columnas = 30;

		var puntosForma = [[1.3,0.6, 0], [0,0.39, 0], [0,0,0], [1.3, 0, 0], [2.7, 0, 0], [2.5, 0.9, 0], [1.3,0.6,0]];
        var puntosRecorrido = [[0,0,0], [0,0,0.1], [0, 0, 0.2], [0,0,0.3]];


		var forma = new CurvaBezier(puntosForma);

		var recorrido = new CurvaBezier(puntosRecorrido);

		var superficie = new SuperficieBarrido(discretizadorDeCurvas(forma, columnas), 
                                      discretizadorDeCurvas(recorrido, filas), 
                                      discretizadorDeRecorrido(recorrido,filas), 
                                      filas, 
                                      columnas,
                                      null,
                                      true,
                                      false);

		var mallaDeTriangulosDelHelicotero = generarSuperficie(superficie, filas,columnas);
        this.objeto3d.setGeometria(mallaDeTriangulosDelHelicotero);

        this.objeto3d.setColor(0.5, 0.6, 0.2);
        this.objeto3d.initTexture("img/cabina.png");
        this.objeto3d.setCabina();
        listaObjetos.push(this.objeto3d);

	}

	crearObjetos(listaObjetos) {
        this.generarCabina(listaObjetos);

        //brazos helices:
        var rot = [Math.PI/2, 0, 0];
        var pos = [1.6, -0.2, 0.45];
        var posHelices =  [0, 0.3, 0];
        var brazoHeliceIzq = new BrazoHelice(this.objeto3d, pos, rot, posHelices);
        //this.hijos.push(brazoHeliceIzq);
        this.helices.push(brazoHeliceIzq);

        pos = [1.6, -0.2, -0.15];
        posHelices =  [0, -0.3, 0];
        var rotCirculo = [0, 0, Math.PI];
        var brazoHeliceDer = new BrazoHelice(this.objeto3d, pos, rot, posHelices, rotCirculo);
        //this.hijos.push(brazoHeliceDer);
        this.helices.push(brazoHeliceDer);

        pos = [1.0, -0.16, 0.45];
        var posHelices =  [0, 0.3, 0];
        var brazoHeliceIzqTrasero = new BrazoHelice(this.objeto3d, pos, rot, posHelices);
        //this.hijos.push(brazoHeliceIzqTrasero);
        this.helices.push(brazoHeliceIzqTrasero);

        pos = [1.0, -0.16, -0.15];
        posHelices =  [0, -0.3, 0];
        var rotCirculo = [0, 0, Math.PI];
        var brazoHeliceDerTrasero = new BrazoHelice(this.objeto3d, pos, rot, posHelices, rotCirculo);
        this.hijos.push(brazoHeliceDerTrasero);
        this.helices.push(brazoHeliceDerTrasero);

        // cola:
		rot = [0, 0, Math.PI*0.45];
        pos = [0.2, -0.2, 0.1];
        var colaIzq = new ColaHelicoptero(this.objeto3d, pos, rot);
        this.hijos.push(colaIzq);

        //rot = [0, 0, Math.PI*0.45];
        pos = [0.2, -0.2, 0.2];
        var colaDer = new ColaHelicoptero(this.objeto3d, pos, rot);
        this.hijos.push(colaDer);

        var rot = [Math.PI/2, 0, 0];
        var pos = [-0.18, -0.15, 0.15];
        this.timon = new TimonDeCola(this.objeto3d, pos, rot);
        this.hijos.push(this.timon);

        //patas
        var rot = [Math.PI/7, 0, 0];
        var pos = [1.5, -0.75, -0.055];
        var pataDerecha = new PatasHelicoptero(this.objeto3d, pos, rot);
        this.hijos.push(pataDerecha);

        var rot = [-Math.PI/7, 0, 0];
        var pos = [1.5, -0.75, 0.35];
        var pataIzquierda = new PatasHelicoptero(this.objeto3d, pos, rot);
        this.hijos.push(pataIzquierda);

	}

	actualizar(tiempo){ 
        for (var i = 0; i < this.helices.length; i++) {
        	this.helices[i].girar(tiempo);
        	this.helices[i].orientar(this.control.getPitch(), this.control.getSpeed());
        }
        this.timon.rotarTimones(this.control.getRoll());

		this.control.update();
        var pos = this.control.getPosition();
        this.objeto3d.setPosicion(pos.x, pos.y, pos.z);
        this.objeto3d.setEscala(0.1, 0.1, 0.1);

        var rotZ = this.control.getPitch();
        var rotX = this.control.getRoll();
        var rotY = this.control.getYaw();
        this.objeto3d.setRotacion(rotX, rotY, rotZ);
	}

	actualizarCamara(matrizVista) {
		var pos = this.control.getPosition();
		var vectorCentro = vec3.fromValues(pos.x, pos.y, pos.z);
		var vectorOjo = vec3.fromValues(-1, 3, 0);
		vec3.add(vectorOjo, vectorCentro, vectorOjo);

		vec3.rotateY(vectorOjo, vectorOjo, vectorCentro, this.control.getYaw());

		
		mat4.lookAt(matrizVista,
	            vectorOjo,
	            vectorCentro,
	            vec3.fromValues(0, 1, 0)
	        );
	}

	obtenerPos() {
		var pos = this.control.getPosition();
		return vec3.fromValues(pos.x, pos.y, pos.z);
	}
}