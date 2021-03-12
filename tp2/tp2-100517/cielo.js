class Cielo {

    constructor() {
        this.posicion = [0.11, 0.988, -0.04];
        this.rotacion = [0, Math.PI/2, Math.PI];
        this.objeto3d = new Objeto3D();
    }

    crear(listaObjetos) {
        var filas = 30;
        var columnas = 30;
        var superficie = new Esfera(50.05);

        var mallaDeTriangulos = generarSuperficie(superficie, filas,columnas);
        this.objeto3d.setGeometria(mallaDeTriangulos);
        this.objeto3d.setColor(0.7, 0.7, 0.7);

        this.objeto3d.setPosicion(0, -10, 0);
        this.objeto3d.setRotacion(this.rotacion[0], this.rotacion[1], this.rotacion[2]);

        this.objeto3d.setEscala(1,1,1);
        listaObjetos.push(this.objeto3d);
    };

    initTexture(file) {
        this.objeto3d.initTexture(file);
    }
}