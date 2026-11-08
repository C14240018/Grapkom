import { createLitVertices } from "./PartGeometry.js";

export class MyObject {
    GL = null;
    SHADER_PROGRAM = null;
    _position = null;
    _color = null;
    _MMatrix = null;
    _textureLocation = null;
    _useTextureLocation = null;

    OBJECT_VERTEX = null;
    OBJECT_FACES = null;
    texture = null;
    vertex = [];
    faces = [];
    vertexData = null;
    baseVertexData = null;
    MODEL_MATRIX = null;

    POSITION_MATRIX = null;
    MOVE_MATRIX = null;
    parentScaleCompensation = null;
    childs = [];

    constructor(GL, SHADER_PROGRAM, position, color, MMatrix, mesh = null) {
        const matrixLibrary = globalThis.LIBS;
        if (!matrixLibrary) {
            throw new Error("Load libs.js before creating a MyObject.");
        }

        this.GL = GL;
        this.SHADER_PROGRAM = SHADER_PROGRAM;
        this._position = position;
        this._color = color;
        this._MMatrix = MMatrix;
        this._textureLocation = GL.getUniformLocation(SHADER_PROGRAM, "birdTexture");
        this._useTextureLocation = GL.getUniformLocation(SHADER_PROGRAM, "useTexture");
        this.POSITION_MATRIX = matrixLibrary.get_I4();
        this.MOVE_MATRIX = matrixLibrary.get_I4();

        const source = mesh || createDefaultCube();
        this.vertex = source.vertices;
        this.faces = source.faces;
    }

    setup() {
        if (this._position < 0 || this._color < 0) {
            throw new Error("The shader must provide position and color attributes.");
        }

        this.vertexData = createLitVertices({ vertices: this.vertex, faces: this.faces });
        this.baseVertexData = new Float32Array(this.vertexData);

        if (!this.OBJECT_VERTEX) {
            this.OBJECT_VERTEX = this.GL.createBuffer();
        }
        if (!this.OBJECT_VERTEX) {
            throw new Error("Unable to create the WebGL vertex buffer.");
        }
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
        this.GL.bufferData(this.GL.ARRAY_BUFFER, this.vertexData, this.GL.DYNAMIC_DRAW);

        if (!this.OBJECT_FACES) {
            this.OBJECT_FACES = this.GL.createBuffer();
        }
        if (!this.OBJECT_FACES) {
            throw new Error("Unable to create the WebGL element buffer.");
        }
        this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
        this.GL.bufferData(
            this.GL.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.faces),
            this.GL.STATIC_DRAW
        );

        this.GL.enableVertexAttribArray(this._position);
        this.GL.enableVertexAttribArray(this._color);
        this.childs.forEach(child => child.setup());
    }

    render(PARENT_MATRIX = null, modelMatrix = null) {
        const matrixLibrary = globalThis.LIBS;
        if (!matrixLibrary) {
            throw new Error("The matrix library (LIBS) is required to render a MyObject.");
        }
        if (!this.OBJECT_VERTEX || !this.OBJECT_FACES) {
            throw new Error("Call setup() before rendering a MyObject.");
        }

        PARENT_MATRIX = PARENT_MATRIX || matrixLibrary.get_I4();
        if (this.parentScaleCompensation) {
            PARENT_MATRIX = PARENT_MATRIX.slice();
            for (let column = 0; column < 3; column++) {
                for (let row = 0; row < 4; row++) {
                    PARENT_MATRIX[column * 4 + row] *= this.parentScaleCompensation[column];
                }
            }
        }

        this.MODEL_MATRIX = modelMatrix ||
            matrixLibrary.multiply(
                matrixLibrary.multiply(this.MOVE_MATRIX, this.POSITION_MATRIX),
                PARENT_MATRIX
            );

        this.GL.useProgram(this.SHADER_PROGRAM);
        if (this._MMatrix !== null) {
            this.GL.uniformMatrix4fv(this._MMatrix, false, this.MODEL_MATRIX);
        }

        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
        this.GL.bufferSubData(this.GL.ARRAY_BUFFER, 0, this.vertexData);
        this.GL.vertexAttribPointer(this._position, 3, this.GL.FLOAT, false, 36, 0);
        this.GL.vertexAttribPointer(this._color, 3, this.GL.FLOAT, false, 36, 12);

        const useTexture = Boolean(
            this.texture &&
            this._textureLocation !== null &&
            this._useTextureLocation !== null
        );
        if (this._useTextureLocation !== null) {
            this.GL.uniform1i(this._useTextureLocation, useTexture ? 1 : 0);
        }
        if (useTexture) {
            this.GL.activeTexture(this.GL.TEXTURE0);
            this.GL.bindTexture(this.GL.TEXTURE_2D, this.texture);
            this.GL.uniform1i(this._textureLocation, 0);
        }

        this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
        this.GL.drawElements(this.GL.TRIANGLES, this.faces.length, this.GL.UNSIGNED_SHORT, 0);

        this.childs.forEach(child => child.render(this.MODEL_MATRIX));
        if (this._useTextureLocation !== null) {
            this.GL.uniform1i(this._useTextureLocation, 0);
        }
    }
}

function createDefaultCube() {
    return {
        vertices: [
            -1, -1, -1, 0, 0, 0,
            1, -1, -1, 1, 0, 0,
            1, 1, -1, 1, 1, 0,
            -1, 1, -1, 0, 1, 0,
            -1, -1, 1, 0, 0, 1,
            1, -1, 1, 1, 0, 1,
            1, 1, 1, 1, 1, 1,
            -1, 1, 1, 0, 1, 1
        ],
        faces: [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            0, 3, 7, 0, 4, 7,
            1, 2, 6, 1, 5, 6,
            2, 3, 6, 3, 7, 6,
            0, 1, 5, 0, 4, 5
        ]
    };
}
