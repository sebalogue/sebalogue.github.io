class Camara {

    constructor() {
        this.radio = 5;
        this.rotY = 0;
        this.rotX = Math.PI/2;
        this.xAnterior = 0;
        this.yAnterior = 0;
        this.factorVelocidad = 0.01
        this.modoCamara = "orbital";
    }

    modoOrbital() {
        this.modoCamara = "orbital";
    }

    modoLateral() {
        this.modoCamara = "lateral";
    }

    modoTrasera() {
        this.modoCamara = "trasera";
    }

    modoSuperior() {
        this.modoCamara = "superior";
    }

    actualizar(matrizVista, mouse, isMouseDown, control) {
        if (this.modoCamara == "trasera") {
            var vectorOjo = vec3.fromValues(-0.2, 0, 0);
            this.actualizarCamaraCon(matrizVista, control, vectorOjo);
        }
        if (this.modoCamara == "lateral") {
            var vectorOjo = vec3.fromValues(0, 0, -0.2);
            this.actualizarCamaraCon(matrizVista, control, vectorOjo);
        }
        if (this.modoCamara == "superior") {
            var vectorOjo = vec3.fromValues(-0.1, 0.2, 0);
            this.actualizarCamaraCon(matrizVista, control, vectorOjo);
        }
        if (this.modoCamara == "orbital") {
            this.actualizarConMouse(matrizVista, mouse, isMouseDown, control)
        }
    }

    actualizarCamara(matrizVista, control) {
        var pos = control.getPosition();
        var vectorCentro = vec3.fromValues(pos.x, pos.y, pos.z);
        var vectorOjo = vec3.fromValues(-1, 3, 0);
        vec3.add(vectorOjo, vectorCentro, vectorOjo);

        vec3.rotateY(vectorOjo, vectorOjo, vectorCentro, control.getYaw());

        mat4.lookAt(matrizVista,
                vectorOjo,
                vectorCentro,
                vec3.fromValues(0, 1, 0)
            );
    }

    actualizarCamaraCon(matrizVista, control, vectorOjo) {
        var pos = control.getPosition();
        var vectorCentro = vec3.fromValues(pos.x, pos.y, pos.z);
        vec3.add(vectorOjo, vectorCentro, vectorOjo);

        vec3.rotateY(vectorOjo, vectorOjo, vectorCentro, control.getYaw());

        mat4.lookAt(matrizVista,
                vectorOjo,
                vectorCentro,
                vec3.fromValues(0, 1, 0)
            );
    }

    actualizarConMouse(matrizVista, mouse, isMouseDown, control) {
        var pos = control.getPosition();
        var vectorCentro = vec3.fromValues(pos.x, pos.y, pos.z);

        var vectorOjo = vec3.fromValues(-0.1, 0.1, 0.1);
        vec3.add(vectorOjo, vectorCentro, vectorOjo);

        //vec3.rotateY(vectorOjo, vectorOjo, vectorCentro, control.getYaw());

        vec3.rotateX(vectorOjo, vectorOjo, vectorCentro, -this.rotX * (Math.PI/180));
        vec3.rotateY(vectorOjo, vectorOjo, vectorCentro, this.rotY * (Math.PI/180));

        mat4.lookAt(matrizVista,
                vectorOjo,
                vectorCentro,
                vec3.fromValues(0, 1, 0)
            );

        this.rotar(mouse, isMouseDown);
    }

    rotar(mouse, mouseDown) {
        if(mouseDown){
            this.rotY = this.rotY + (mouse.x - this.xAnterior) / 10;
            this.rotX = this.rotX - (this.yAnterior - mouse.y) / 10;  
        }

        if (this.rotX > 90) {
            this.rotX = 90;
        }
        if (this.rotX < -90) {
            this.rotX = -90;
        }

        this.xAnterior = mouse.x;
        this.yAnterior = mouse.y;

    }
}