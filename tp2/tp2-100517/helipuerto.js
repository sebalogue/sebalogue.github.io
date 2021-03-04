class Helipuerto {

    constructor() {
        this.posicion = [0.11, 0.988, -0.04];
        this.rotacion = [0, 0, Math.PI/2];
        this.objeto3d = new Objeto3D();
    }

    crear(listaObjetos) {
        var filas = 30;
        var columnas = 30;

        var puntosForma = [
            [0, -1.268, 0], 
            [1.36, -1.268, 0], 
            [1.36, 0.058, 0], 
            [1.36, 1.268, 0], 
            [0.034, 1.268, 0], 
            [-1.36, 1.268, 0], 
            [-1.36, 0.12,0],
            [-1.36, -1.268, 0],
            [0, -1.268, 0]
        ];
        var puntosRecorrido = [
            [0, 0, 0],
            [0.2, 0, 0],
            [0.3, 0, 0],
            [2.1, 0, 0]
        ]
        var forma = new CurvaBezier(puntosForma);

        var recorrido = new CurvaBezier(puntosRecorrido);

        var superficie = new SuperficieBarrido(discretizadorDeCurvas(forma, columnas), 
                                      discretizadorDeCurvas(recorrido, filas), 
                                      discretizadorDeRecorrido(recorrido,filas), 
                                      filas, 
                                      columnas,
                                      null,
                                      true);

        var mallaDeTriangulosDelHelicotero = generarSuperficie(superficie, filas,columnas);
        this.objeto3d.setGeometria(mallaDeTriangulosDelHelicotero);

        this.objeto3d.setColor(0.7, 0.7, 0.7);
        this.objeto3d.setPosicion(this.posicion[0], this.posicion[1], this.posicion[2]);
        this.objeto3d.setRotacion(this.rotacion[0], this.rotacion[1], this.rotacion[2]);
        this.objeto3d.setEscala(1, 0.2, 0.2);
        listaObjetos.push(this.objeto3d);
    };

    initTexture(file) {
        this.objeto3d.initTexture(file);
    }
}