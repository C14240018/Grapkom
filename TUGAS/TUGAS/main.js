import { createBottom } from "./Bottom.js";
import { createMiddle } from "./Middle.js";
import { createTop } from "./Top.js";
import { MyObject } from "./MyObject.js";
import { Room } from "./Room.js";

function main() {
    /** @type {HTMLCanvasElement} */
    var CANVAS = document.getElementById("mycanvas");
    if (!(CANVAS instanceof HTMLCanvasElement)) {
        console.error('The canvas element with id "mycanvas" was not found.');
        return;
    }
    var MATRIX_LIBS = window.LIBS;
    if (!MATRIX_LIBS) {
        console.error("The matrix library in libs.js could not be found.");
        return;
    }

    /** @type {WebGLRenderingContext} */
    var GL;
    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch (e) {
        console.error("WebGL context cannot be initialized.", e);
        alert("WebGL context cannot be initialized");
        return;
    }
    if (!GL) {
        alert("WebGL is not available in this browser.");
        return;
    }

    var shader_vertex_source = `
        attribute vec3 position;
        uniform mat4 Pmatrix, Vmatrix, Mmatrix;
        attribute vec3 color;
        varying vec3 vColor;

        void main(void) {
            gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
            vColor = color;
        }`;


    var shader_fragment_source = `
        precision mediump float;
        varying vec3 vColor;

        void main(void) {
            gl_FragColor = vec4(vColor, 1.);
        }`;


    var compile_shader = function (source, type, typeString) {
        var shader = GL.createShader(type);
        if (!shader) {
            console.error("Unable to create the " + typeString + " shader.");
            return null;
        }
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            console.error(typeString + " shader compilation failed: " + GL.getShaderInfoLog(shader));
            GL.deleteShader(shader);
            return null;
        }
        return shader;
    };
    var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "Vertex");
    var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "Fragment");
    if (!shader_vertex || !shader_fragment) {
        alert("The illustration could not start because its shaders failed to compile.");
        return;
    }

    var SHADER_PROGRAM = GL.createProgram();
    if (!SHADER_PROGRAM) {
        console.error("Unable to create a WebGL program.");
        return;
    }
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);
    GL.linkProgram(SHADER_PROGRAM);
    if (!GL.getProgramParameter(SHADER_PROGRAM, GL.LINK_STATUS)) {
        console.error("WebGL program linking failed: " + GL.getProgramInfoLog(SHADER_PROGRAM));
        alert("The illustration could not start because its WebGL program failed to link.");
        return;
    }

    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
    var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
    var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
    var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");
    if (_position < 0 || _color < 0 || _Pmatrix === null || _Vmatrix === null || _Mmatrix === null) {
        console.error("A required WebGL shader input could not be found.");
        return;
    }

    GL.useProgram(SHADER_PROGRAM);
    GL.enableVertexAttribArray(_position);
    GL.enableVertexAttribArray(_color);

    var multiplyMatrices = function (left, right, result) {
        for (var column = 0; column < 4; column++) {
            for (var row = 0; row < 4; row++) {
                result[column * 4 + row] =
                    left[row] * right[column * 4] +
                    left[4 + row] * right[column * 4 + 1] +
                    left[8 + row] * right[column * 4 + 2] +
                    left[12 + row] * right[column * 4 + 3];
            }
        }
    };

    var room = new Room([
        new MyObject(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, createBottom()),
        new MyObject(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, createMiddle()),
        new MyObject(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, createTop())
    ]);
    room.setup();

    var MODEL_MATRIX = new Float32Array(MATRIX_LIBS.get_I4());
    var PARENT_MATRIX = new Float32Array(MATRIX_LIBS.get_I4());
    var TOP_LOCAL_MATRIX = new Float32Array(MATRIX_LIBS.get_I4());
    var THETA = 0.24, PHI = 0.04;
    var drag = false;
    var x_prev = 0, y_prev = 0;
    var FRICTION = 0.95;
    var dX = 0, dY = 0;
    var SPEED = 0.5;
    // Animation timing variables
    var shockDuration = 1500;
    var topTurnDuration = 800;
    var forwardMoveDuration = 100;
    var shockStartTime = null;

    var mouseDown = function (e) {
        if (e.isPrimary === false) return;
        drag = true;
        x_prev = e.pageX;
        y_prev = e.pageY;
        if (e.pointerId !== undefined && CANVAS.setPointerCapture) {
            CANVAS.setPointerCapture(e.pointerId);
        }
        CANVAS.style.cursor = "grabbing";
        e.preventDefault();
    };

    var mouseUp = function () {
        drag = false;
        CANVAS.style.cursor = "grab";
    };

    var mouseMove = function (e) {
        if (!drag) return;
        dX = (e.pageX - x_prev) * 2 * Math.PI / CANVAS.width;
        dY = (e.pageY - y_prev) * 2 * Math.PI / CANVAS.height;
        THETA += dX;
        PHI = Math.max(-1.2, Math.min(1.2, PHI + dY));
        x_prev = e.pageX;
        y_prev = e.pageY;
        e.preventDefault();
    };

    CANVAS.style.cursor = "grab";
    CANVAS.style.touchAction = "none";
    CANVAS.addEventListener("pointerdown", mouseDown, false);
    CANVAS.addEventListener("pointerup", mouseUp, false);
    CANVAS.addEventListener("pointercancel", mouseUp, false);
    CANVAS.addEventListener("lostpointercapture", mouseUp, false);
    CANVAS.addEventListener("pointermove", mouseMove, false);

    var keyDown = function (e) {
        if (e.key === "w" || e.key === "ArrowUp") {
            dY -= SPEED;
        } else if (e.key === "a" || e.key === "ArrowLeft") {
            dX -= SPEED;
        } else if (e.key === "s" || e.key === "ArrowDown") {
            dY += SPEED;
        } else if (e.key === "d" || e.key === "ArrowRight") {
            dX += SPEED;
        }
    };
    window.addEventListener("keydown", keyDown, false);

    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearDepth(1.0);
    GL.clearColor(20 / 255, 85 / 255, 192 / 255, 1);

    var animate = function (time) {
        if (typeof time !== "number") time = performance.now();
        if (shockStartTime === null) shockStartTime = time;
        var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        var width = Math.max(1, Math.floor(CANVAS.clientWidth * pixelRatio));
        var height = Math.max(1, Math.floor(CANVAS.clientHeight * pixelRatio));
        if (CANVAS.width !== width || CANVAS.height !== height) {
            CANVAS.width = width;
            CANVAS.height = height;
        }

        GL.viewport(0, 0, width, height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        var aspect = width / height;
        var horizontalScale = Math.min(2.45, Math.max(0.32, 0.65 / aspect));
        if (!drag) {
            THETA += dX;
            PHI = Math.max(-1.2, Math.min(1.2, PHI + dY));
            dX *= FRICTION;
            dY *= FRICTION;
        }

        var shockProgress = Math.min(1, (time - shockStartTime) / shockDuration);
        var shockAmount = shockProgress < 1 ? Math.sin(Math.PI * shockProgress) : 0;
        var turnProgress = Math.min(1, Math.max(0,
            (time - shockStartTime - shockDuration) / topTurnDuration
        ));
        var easedTurnProgress = turnProgress * turnProgress * (3 - 2 * turnProgress);
        var topRotation = -Math.PI / 2 * easedTurnProgress;
        var forwardProgress = Math.min(1, Math.max(0,
            (time - shockStartTime - shockDuration - topTurnDuration) / forwardMoveDuration
        ));
        var easedForwardProgress = forwardProgress * forwardProgress * (3 - 2 * forwardProgress);

        var projectionMatrix = new Float32Array([
            horizontalScale, 0, 0, 0,
            0, 0.92, 0, 0,
            0, 0, 0.35, 1 / 3,
            0, 0, 0, 1
        ]);
        var viewMatrix = new Float32Array(MATRIX_LIBS.get_I4());
        GL.uniformMatrix4fv(_Pmatrix, false, projectionMatrix);
        GL.uniformMatrix4fv(_Vmatrix, false, viewMatrix);

        MATRIX_LIBS.set_I4(PARENT_MATRIX);
        MATRIX_LIBS.rotateX(PARENT_MATRIX, PHI);
        MATRIX_LIBS.rotateY(PARENT_MATRIX, THETA);
        MATRIX_LIBS.translateZ(PARENT_MATRIX, -1 * easedForwardProgress);

        room.render(PARENT_MATRIX, function (meshNode, i) {
            MODEL_MATRIX.set(PARENT_MATRIX);
            if (i === 2) {
                var topYScale = 1 - 0.25 * shockAmount;
                var pivotX = -0.01;
                var pivotZ = -0.05;
                var rotationCos = Math.cos(topRotation);
                var rotationSin = Math.sin(topRotation);
                TOP_LOCAL_MATRIX.set([
                    rotationCos, 0, -rotationSin, 0,
                    0, topYScale, 0, 0,
                    rotationSin, 0, rotationCos, 0,
                    pivotX - rotationCos * pivotX - rotationSin * pivotZ,
                    0.1 * (1 - topYScale),
                    pivotZ + rotationSin * pivotX - rotationCos * pivotZ,
                    1
                ]);
                multiplyMatrices(PARENT_MATRIX, TOP_LOCAL_MATRIX, MODEL_MATRIX);
            }

            var matrix = MODEL_MATRIX;
            var determinant =
                matrix[0] * (matrix[5] * matrix[10] - matrix[9] * matrix[6]) -
                matrix[4] * (matrix[1] * matrix[10] - matrix[9] * matrix[2]) +
                matrix[8] * (matrix[1] * matrix[6] - matrix[5] * matrix[2]);
            var inverseDeterminant = 1 / determinant;
            var lightX = -0.45, lightY = 0.72, lightZ = -0.85;
            var lightLength = Math.hypot(lightX, lightY, lightZ);
            lightX /= lightLength;
            lightY /= lightLength;
            lightZ /= lightLength;
            var baseVertexData = meshNode.baseVertexData;
            var vertexData = meshNode.vertexData;
            for (var vertex = 0; vertex < vertexData.length; vertex += 9) {
                var positionX = baseVertexData[vertex];
                var positionY = baseVertexData[vertex + 1];
                var positionZ = baseVertexData[vertex + 2];
                var viewX = matrix[0] * positionX + matrix[4] * positionY +
                    matrix[8] * positionZ + matrix[12];
                var viewY = matrix[1] * positionX + matrix[5] * positionY +
                    matrix[9] * positionZ + matrix[13];
                var viewZ = matrix[2] * positionX + matrix[6] * positionY +
                    matrix[10] * positionZ + matrix[14] - 3;
                var normalX = baseVertexData[vertex + 6];
                var normalY = baseVertexData[vertex + 7];
                var normalZ = baseVertexData[vertex + 8];
                var transformedNormalX = (
                    (matrix[5] * matrix[10] - matrix[9] * matrix[6]) * normalX +
                    (matrix[9] * matrix[2] - matrix[1] * matrix[10]) * normalY +
                    (matrix[1] * matrix[6] - matrix[5] * matrix[2]) * normalZ
                ) * inverseDeterminant;
                var transformedNormalY = (
                    (matrix[8] * matrix[6] - matrix[4] * matrix[10]) * normalX +
                    (matrix[0] * matrix[10] - matrix[8] * matrix[2]) * normalY +
                    (matrix[4] * matrix[2] - matrix[0] * matrix[6]) * normalZ
                ) * inverseDeterminant;
                var transformedNormalZ = (
                    (matrix[4] * matrix[9] - matrix[8] * matrix[5]) * normalX +
                    (matrix[8] * matrix[1] - matrix[0] * matrix[9]) * normalY +
                    (matrix[0] * matrix[5] - matrix[4] * matrix[1]) * normalZ
                ) * inverseDeterminant;
                var normalLength = Math.hypot(transformedNormalX, transformedNormalY, transformedNormalZ);
                transformedNormalX /= normalLength;
                transformedNormalY /= normalLength;
                transformedNormalZ /= normalLength;

                var viewDirectionX = -viewX;
                var viewDirectionY = -viewY;
                var viewDirectionZ = -viewZ;
                var viewLength = Math.hypot(viewDirectionX, viewDirectionY, viewDirectionZ);
                viewDirectionX /= viewLength;
                viewDirectionY /= viewLength;
                viewDirectionZ /= viewLength;
                if (transformedNormalX * viewDirectionX + transformedNormalY * viewDirectionY +
                    transformedNormalZ * viewDirectionZ < 0) {
                    transformedNormalX = -transformedNormalX;
                    transformedNormalY = -transformedNormalY;
                    transformedNormalZ = -transformedNormalZ;
                }

                var diffuse = Math.max(0,
                    transformedNormalX * lightX + transformedNormalY * lightY + transformedNormalZ * lightZ
                );
                var fill = Math.max(0, -transformedNormalZ);
                var halfX = lightX + viewDirectionX;
                var halfY = lightY + viewDirectionY;
                var halfZ = lightZ + viewDirectionZ;
                var halfLength = Math.hypot(halfX, halfY, halfZ);
                halfX /= halfLength;
                halfY /= halfLength;
                halfZ /= halfLength;
                var specular = Math.pow(Math.max(0,
                    transformedNormalX * halfX + transformedNormalY * halfY + transformedNormalZ * halfZ
                ), 40);
                var lighting = 0.32 + diffuse * 0.6 + fill * 0.08;
                for (var channel = 0; channel < 3; channel++) {
                    vertexData[vertex + 3 + channel] =
                        Math.min(1,
                            baseVertexData[vertex + 3 + channel] * lighting + 0.08 * specular
                        );
                }
            }
            return MODEL_MATRIX;
        });
        GL.flush();
        window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
}
window.addEventListener("load", main);
