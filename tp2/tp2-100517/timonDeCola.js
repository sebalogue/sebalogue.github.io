class TimonDeCola {

    constructor(helicoptero, posicion, rotacion) {
        this.posicion = posicion;
        this.rotacion = rotacion;
        this.objeto = new Objeto3D();
        var filas = 30;
        var columnas = 30;

        var superficie = new TuboSenoidal(0, 1, 0.02, 0.3); // amplitud_onda, longitud_onda, radio, altura

        var mallaDeTriangulosDelHelicotero = generarSuperficie(superficie, filas,columnas);
        this.objeto.setGeometria(mallaDeTriangulosDelHelicotero);

        this.objeto.setRotacion(this.rotacion[0], this.rotacion[1], this.rotacion[2]);
        this.objeto.setPosicion(this.posicion[0], this.posicion[1] , this.posicion[2]);

        this.objeto.setColor(0.5, 0.3, 0.2);

        var posTimon = [0.0, 0.15, -0.05]
        this.timonIzq = new Objeto3D();
        this.timonIzq.setColor(0.1, 0.4, 0.1);
        this.agregarTimon(this.timonIzq, posTimon);

        posTimon = [0.0, -0.12, -0.05]
        this.timonDer = new Objeto3D();
        this.timonDer.setColor(0.1, 0.4, 0.1);
        this.agregarTimon(this.timonDer, posTimon);

        helicoptero.agregarHijo(this.objeto);
    };

    agregarTimon(timon, pos) {
        var filas = 30;
        var columnas = 30;

        //var puntosForma = [[1.3,0.6, 0], [0,0.39, 0], [0,0,0], [1.3, 0, 0], [2.7, 0, 0], [2.5, 0.9, 0], [1.3,0.6,0]];
        var puntosRecorrido = [[0,0,0], [0,0,0.1], [0, 0, 0.2], [0,0,0.3]];

        var puntosForma = [
                               [-0.15, -0.045, 0],
                                [-0.184, 0.0396, 0],
                                [0.063, 0.07137, 0],
                                [0.1, 0.045, 0],

                                [0.1, 0.045, 0],
                                [0.192, -0.06705, 0],
                                [-0.121, -0.12267, 0],
                                [-0.15, -0.045, 0]
                             ];

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

        var mallaDeTriangulos = generarSuperficie(superficie, filas,columnas);
        timon.setGeometria(mallaDeTriangulos);
        timon.setPosicion(pos[0], pos[1], pos[2]);
        timon.setRotacion(0.0, Math.PI/4, 0.0);
        timon.setEscala(1.7, 1.0, 0.1);

        this.objeto.agregarHijo(timon);
    }

    rotarTimones(rot) {
        if (Math.abs(rot) < Math.PI) {
            this.timonDer.setRotacion(this.rotacion[0] - rot, Math.PI/2, 0);
            this.timonIzq.setRotacion(this.rotacion[0] - rot , Math.PI/2, 0);
        }
    }
}