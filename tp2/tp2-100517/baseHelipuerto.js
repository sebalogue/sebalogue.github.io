class BaseHelipuerto {

    constructor() {
        this.posicion = [-0.01, 2.915, 0];
        this.rotacion = [0, Math.PI/2, 0];
        this.objeto3d = new Objeto3D();
    }

    crear(listaObjetos) {
        var filas = 30;
        var columnas = 30;

        var superficie = new Plano(0.28, 0.28);

        var mallaDeTriangulosDelHelicotero = generarSuperficie(superficie, filas,columnas);
        this.objeto3d.setGeometria(mallaDeTriangulosDelHelicotero);

        this.objeto3d.setColor(0.7, 0.7, 0.7);
        this.objeto3d.setPosicion(this.posicion[0], this.posicion[1], this.posicion[2]);
        this.objeto3d.setRotacion(this.rotacion[0], this.rotacion[1], this.rotacion[2]);
        this.objeto3d.setEscala(1, 1, 1);
        listaObjetos.push(this.objeto3d);
    };

    initTexture(file) {
        this.objeto3d.initTexture(file);
    }
}