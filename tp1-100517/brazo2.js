class BrazoHelice2 {

    constructor(helicoptero, posicion, rotacion, posicionHelices) {
        this.posicion = posicion;
        this.rotacion = rotacion;
        this.circuloHelices = null;
        this.objeto = new Objeto3D();
        this.esfera = new Objeto3D();

        

        var filas = 30;
        var columnas = 30;
        //var superficie = new TuboSenoidal(0, 1, 0.04, 0.3); // amplitud_onda, longitud_onda, radio, altura

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
            [0.1, 0,0], 
            [0.2, 0,0], 
            [0.3, 0,0], 
            [0.4, 0,0]
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

        this.objeto.setRotacion(this.rotacion[0], this.rotacion[1], this.rotacion[2]);
        this.objeto.setPosicion(this.posicion[0] - 1.603, this.posicion[1] + 0.25, this.posicion[2] - 0.15);

        this.objeto.setColor(0.5, 0.3, 0.2);
        this.objeto.setEscala(0.3, 0.06, 0.06);

        posicionHelices = [this.posicion[0] - 2.2, this.posicion[1] - 0.07, this.posicion[2] - 0.2]
        this.agregarCirculoHelices(posicionHelices);
        
        this.agregarEsfera(posicion);
        helicoptero.agregarHijo(this.esfera);
    };

    agregarCirculoHelices(pos) {
        var rot = [this.rotacion[0] , this.rotacion[1], this.rotacion[2]];
        this.circuloHelices = new CirculoHelices2(this.objeto, pos, rot);
    }

    agregarEsfera(pos) {
        var filas = 30;
        var columnas = 30;
        var superficie = new Esfera(0.06);

        var mallaDeTriangulos = generarSuperficie(superficie, filas,columnas);
        this.esfera.setGeometria(mallaDeTriangulos);

        this.esfera.setPosicion(pos[0], pos[1], pos[2]);
        this.esfera.setColor(0.1, 0.4, 0.1);
        this.esfera.setEscala(1, 1, 1);
        this.esfera.agregarHijo(this.objeto);

    }

    orientar(rot, vel) {
        if (Math.abs(vel * Math.PI) < Math.PI / 4) {
            this.objeto.setRotacion(this.rotacion[0], this.rotacion[1], this.rotacion[2] -vel * Math.PI);
        }
    }

    girar(tiempo) {
        this.circuloHelices.girar(tiempo);
    }
}