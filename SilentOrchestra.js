import { createBottom } from "./TUGAS/TUGAS/Bottom.js";
import { createMiddle } from "./TUGAS/TUGAS/Middle.js";
import { createTop } from "./TUGAS/TUGAS/Top.js";
import { createAccessory } from "./TUGAS/TUGAS/Accessory.js";
import { createLitVertices } from "./TUGAS/TUGAS/PartGeometry.js";

class OrchestraPart {
    POSITION_MATRIX = LIBS.get_I4();
    MOVE_MATRIX = LIBS.get_I4();
    MODEL_MATRIX = LIBS.get_I4();
    childs = [];

    constructor(GL, SHADER_PROGRAM, position, color, Mmatrix, mesh) {
        this.GL = GL;
        this.SHADER_PROGRAM = SHADER_PROGRAM;
        this._position = position;
        this._color = color;
        this._MMatrix = Mmatrix;
        this.mesh = mesh;
    }

    setup() {
        const GL = this.GL;
        const data = createLitVertices(this.mesh);
        const light = [-0.45, 0.72, -0.85];
        const len = Math.hypot(...light);

        for (let v = 0; v < data.length; v += 9) {
            const d = Math.abs(data[v + 6] * light[0] + data[v + 7] * light[1] + data[v + 8] * light[2]) / len;
            const k = 0.4 + 0.6 * d;
            for (let c = 0; c < 3; c++) data[v + 3 + c] = Math.min(1, data[v + 3 + c] * k);
        }

        this.vb = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vb);
        GL.bufferData(GL.ARRAY_BUFFER, data, GL.STATIC_DRAW);
        this.fb = GL.createBuffer();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.fb);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.faces), GL.STATIC_DRAW);
        this.count = this.mesh.faces.length;
        this.childs.forEach(child => child.setup());
    }

    render(PARENT_MATRIX) {
        const GL = this.GL;
        this.MODEL_MATRIX = LIBS.multiply(
            LIBS.multiply(this.MOVE_MATRIX, this.POSITION_MATRIX),
            PARENT_MATRIX
        );
        GL.useProgram(this.SHADER_PROGRAM);
        GL.uniformMatrix4fv(this._MMatrix, false, this.MODEL_MATRIX);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vb);
        GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false, 36, 0);
        GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false, 36, 12);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.fb);
        GL.drawElements(GL.TRIANGLES, this.count, GL.UNSIGNED_SHORT, 0);
        this.childs.forEach(child => child.render(this.MODEL_MATRIX));
    }
}

export class SilentOrchestra extends OrchestraPart {
    animationStart = null;
    scaleDuration = 1000;
    rotateDuration = 1000;
    moveDuration = 1000;
    accessoryOrbitDuration = 3000;

    constructor(GL, SHADER_PROGRAM, _position, _color, _Mmatrix) {
        super(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, createMiddle());

        this.top = new OrchestraPart(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, createTop());
        this.accessory = new OrchestraPart(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, createAccessory());
        this.bottom = new OrchestraPart(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, createBottom());
        LIBS.rotateY(this.top.POSITION_MATRIX, Math.PI);
        this.top.childs = [this.accessory];
        this.childs = [this.top, this.bottom];
    }

    animate(time) {
        if (this.animationStart === null) this.animationStart = time;
        const elapsed = time - this.animationStart;
        const scaleUpEnd = this.scaleDuration;
        const scaleBackEnd = scaleUpEnd + this.scaleDuration;
        const rotateEnd = scaleBackEnd + this.rotateDuration;
        const moveEnd = rotateEnd + this.moveDuration;

        LIBS.set_I4(this.top.MOVE_MATRIX);
        LIBS.set_I4(this.MOVE_MATRIX);
        LIBS.set_I4(this.accessory.MOVE_MATRIX);
        const orbitProgress = (elapsed % this.accessoryOrbitDuration) / this.accessoryOrbitDuration;
        LIBS.rotateY(this.accessory.MOVE_MATRIX, orbitProgress * Math.PI * 2);

        if (elapsed < scaleUpEnd) {
            const progress = elapsed / this.scaleDuration;
            LIBS.scaleY(this.top.MOVE_MATRIX, 1 + 0.5 * progress);
        } else if (elapsed < scaleBackEnd) {
            const progress = (elapsed - scaleUpEnd) / this.scaleDuration;
            LIBS.scaleY(this.top.MOVE_MATRIX, 1.5 - 0.5 * progress);
        } else if (elapsed < rotateEnd) {
            const progress = (elapsed - scaleBackEnd) / this.rotateDuration;
            LIBS.rotateY(this.top.MOVE_MATRIX, (Math.PI / 2) * progress);
        } else if (elapsed < moveEnd) {
            LIBS.rotateY(this.top.MOVE_MATRIX, Math.PI / 2);
            LIBS.translateZ(this.MOVE_MATRIX, -2 * ((elapsed - rotateEnd) / this.moveDuration));
        } else {
            LIBS.rotateY(this.top.MOVE_MATRIX, Math.PI / 2);
            LIBS.translateZ(this.MOVE_MATRIX, -2);
        }
    }
}
