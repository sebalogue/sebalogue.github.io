class ColaHelicoptero {

    constructor(helicoptero, posicion, rotacion) {
        this.posicion = posicion;
        this.rotacion = rotacion;
        this.objeto = new Objeto3D();
        var filas = 30;
        var columnas = 30;

        var puntosForma = [[0,1, 0], [0,1.6, 0], [1,1.6,0], [1, 1, 0], [1, 0.3, 0], [0, 0.3, 0]];
        var puntosRecorrido = [[0,0.48,0], [0,3.2,3.2], [0, 0, 0.48], [0,2.56,8.0]];

        var forma = new CurvaBezier(puntosForma);

        var recorrido = new CurvaBezier(puntosRecorrido);

        var superficie = new SuperficieBarrido(discretizadorDeCurvas(forma, columnas), 
                                      discretizadorDeCurvas(recorrido, filas), 
                                      discretizadorDeRecorrido(recorrido,filas), 
                                      filas, 
                                      columnas);

        var mallaDeTriangulos = generarSuperficie(superficie, filas,columnas);
        this.objeto.setGeometria(mallaDeTriangulos);

        this.objeto.setColor(0.3, 0.4, 0.2);
        this.objeto.setEscala(0.03, 0.03, 0.09);
        this.objeto.setRotacion(this.rotacion[0], this.rotacion[1], this.rotacion[2]);
        this.objeto.setPosicion(this.posicion[0], this.posicion[1] , this.posicion[2]);

        helicoptero.agregarHijo(this.objeto);
    };
}