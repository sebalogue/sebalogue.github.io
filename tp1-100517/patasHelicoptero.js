class PatasHelicoptero {

    constructor(helicoptero, posicion, rotacion) {
        this.posicion = posicion;
        this.rotacion = rotacion;
        this.objeto = new Objeto3D();
        var filas = 30;
        var columnas = 30;

        var puntosForma = [
            [-0.53, 0.81, 0], 
            [0, 0.99, 0], 
            [0.96, 0.87,0], 
            [1, 0, 0], 
            [1, -0.7, 0], 
            [0, -0.8, 0],
            [-0.8, -0.9, 0],
            [-1.4, 0.4, 0],
            [-0.53, 0.81, 0]
        ];

        var puntosRecorrido = [
            [-5, 2, 0], 
            [-2.5, -2.4,0], 
            [4.2, -2.4,0], 
            [5, 2,0]
        ];


        var forma = new CurvaBezier(puntosForma);

        var recorrido = new CurvaBezier(puntosRecorrido);

        var superficie = new SuperficieBarrido(discretizadorDeCurvas(forma, columnas), 
                                      discretizadorDeCurvas(recorrido, filas), 
                                      discretizadorDeRecorrido(recorrido,filas), 
                                      filas, 
                                      columnas,
                                      null,
                                      true);

        var mallaDeTriangulos = generarSuperficie(superficie, filas,columnas);
        this.objeto.setGeometria(mallaDeTriangulos);

        this.objeto.setColor(0, 0, 0);
        this.objeto.setEscala(0.1, 0.04, 0.04);
        this.objeto.setRotacion(this.rotacion[0], this.rotacion[1], this.rotacion[2]);
        this.objeto.setPosicion(this.posicion[0], this.posicion[1] , this.posicion[2]);

        var posTuboDelantero = [2, -4, 0]
        this.tuboDelantero = new Objeto3D();
        this.tuboDelantero.setColor(0, 0, 0);
        this.agregarTubo(this.tuboDelantero, posTuboDelantero);

        var posTuboTrasero= [-1.7, -3.5, 0]
        this.tuboTrasero = new Objeto3D();
        this.tuboTrasero.setColor(0, 0, 0);
        this.agregarTubo(this.tuboTrasero, posTuboTrasero);

        helicoptero.agregarHijo(this.objeto);
    };

    agregarTubo(tubo, pos) {
        var filas = 30;
        var columnas = 30;

        var puntosForma = [
            [-0.53, 0.81, 0], 
            [0, 0.99, 0], 
            [0.96, 0.87,0], 
            [1, 0, 0], 
            [1, -0.7, 0], 
            [0, -0.8, 0],
            [-0.8, -0.9, 0],
            [-1.4, 0.4, 0],
            [-0.53, 0.81, 0]
        ];

        var puntosRecorrido = [
            [0, 0,1], 
            [0, 0,2], 
            [0, 0,3], 
            [0, 0,4]
        ];

        var forma = new CurvaBezier(puntosForma);

        var recorrido = new CurvaBezier(puntosRecorrido);

        var superficie = new SuperficieBarrido(discretizadorDeCurvas(forma, columnas), 
                                      discretizadorDeCurvas(recorrido, filas), 
                                      discretizadorDeRecorrido(recorrido,filas), 
                                      filas, 
                                      columnas,
                                      null,
                                      true);

        var mallaDeTriangulos = generarSuperficie(superficie, filas,columnas);
        tubo.setGeometria(mallaDeTriangulos);
        tubo.setPosicion(pos[0], pos[1], pos[2]);
        tubo.setRotacion(-Math.PI/2, 0, 0);
        tubo.setEscala(0.5, 0.5, 2);

        this.objeto.agregarHijo(tubo);
    }
}