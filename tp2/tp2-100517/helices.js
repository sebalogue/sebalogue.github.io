class Helices {

    constructor(helicoptero, posicion, rotacion) {
        this.helices = [];
        this.posicion = posicion;
        this.rotacion = rotacion;

        for (var i = 0; i < 4; i++) {

            var objeto = new Objeto3D();
            var filas = 30;
            var columnas = 30;
            var superficie = new Plano(0.15, 0.07);

            var mallaDeTriangulos = generarSuperficie(superficie, filas,columnas);
            objeto.setGeometria(mallaDeTriangulos);

            helicoptero.agregarHijo(objeto);
            this.helices.push(objeto);
        }
    };

    acomodar() {
    }

    girar(tiempo) {
        for (var i = 0; i < this.helices.length; i++) {
            this.helices[i].setRotacion(this.rotacion[0], this.rotacion[1] + tiempo * 20 * (Math.PI/4) + i * Math.PI/4, this.rotacion[2]);
            this.helices[i].setPosicion(this.posicion[0], this.posicion[1], this.posicion[2]);
        }
    }
}