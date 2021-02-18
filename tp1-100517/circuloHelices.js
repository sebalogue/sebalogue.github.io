class CirculoHelices {

    constructor(helicoptero, posicion, rotacion) {
        this.posicion = posicion;
        this.rotacion = rotacion;
        this.objeto = new Objeto3D();
        this.tubo = new Objeto3D();
        var filas = 30;
        var columnas = 30;

        var superficie = new TuboSenoidal(0, 1, 0.15, 0.1); // amplitud_onda, longitud_onda, radio, altura

        var mallaDeTriangulosDelHelicotero = generarSuperficie(superficie, filas,columnas);
        this.objeto.setGeometria(mallaDeTriangulosDelHelicotero);

        this.objeto.setRotacion(this.rotacion[0], this.rotacion[1], this.rotacion[2]);
        this.objeto.setPosicion(this.posicion[0], this.posicion[1] , this.posicion[2]);
        this.objeto.setColor(0.1, 0.4, 0.1);
        this.agregarTubo();

        helicoptero.agregarHijo(this.objeto);
    };

    agregarTubo() {
        var filas = 30;
        var columnas = 30;

        var superficie = new TuboSenoidal(0, 1, 0.01, 0.1); // amplitud_onda, longitud_onda, radio, altura

        var mallaDeTriangulosDelHelicotero = generarSuperficie(superficie, filas,columnas);
        this.tubo.setGeometria(mallaDeTriangulosDelHelicotero);
        this.tubo.setColor(0.8, 0.2, 0.1);
        this.agregarHelices();

        this.objeto.agregarHijo(this.tubo);
    }

    agregarHelices() {
        for (var i = 0; i < 10; i++) {

            var helice = new Objeto3D();
            var filas = 30;
            var columnas = 30;
            var superficie = new Plano(0.13, 0.07);

            var mallaDeTriangulos = generarSuperficie(superficie, filas,columnas);
            helice.setGeometria(mallaDeTriangulos);

            helice.setRotacion(Math.PI/5 , this.rotacion[1] + i * Math.PI/5, 0);
            helice.setPosicion(0.08 , 0 , 0);
            helice.rotarPrimero();
            helice.setColor(0, 0, 0.1);

            this.tubo.agregarHijo(helice);
        }
    }
    girar(tiempo) {
        this.tubo.setRotacion(0, tiempo * 10 * (Math.PI/4), 0);
    }
}