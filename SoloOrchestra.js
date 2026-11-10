import { Room, Skull, Blood, holloweye } from "./Body.js";
import { SilentOrchestra } from "./SilentOrchestra.js";


function main() {
    /** @type {HTMLCanvasElement} */
    var CANVAS = document.getElementById("mycanvas");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;


    /*===================== GET WEBGL CONTEXT ===================== */
    /** @type {WebGLRenderingContext} */
    var GL;
    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }


    /*========================= SHADERS ========================= */
    var shader_vertex_source = `
        attribute vec3 position;
        uniform mat4 Pmatrix, Vmatrix, Mmatrix;
        attribute vec3 color;
        varying vec3 vColor;
        varying vec2 vTexCoord;

        void main(void) {
            gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
            vColor = color;
            vTexCoord = vec2(color.y, color.x);
        }`;


    var shader_fragment_source = `
        precision mediump float;
        varying vec3 vColor;
        varying vec2 vTexCoord;
        uniform sampler2D birdTexture;
        uniform bool useTexture;

        void main(void) {
            gl_FragColor = useTexture
                ? texture2D(birdTexture, vTexCoord)
                : vec4(vColor, 1.);
        }`;



    var compile_shader = function (source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };
    var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    
    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);


    GL.linkProgram(SHADER_PROGRAM);


    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
    GL.enableVertexAttribArray(_position);


    var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    GL.enableVertexAttribArray(_color);

    var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
    var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
    var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");

    GL.useProgram(SHADER_PROGRAM);
    var room = new Room(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    // Valen's code

    var orchestra = new SilentOrchestra(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    room.childs.push(orchestra);
    LIBS.scaleX(orchestra.POSITION_MATRIX, 4);
    LIBS.scaleY(orchestra.POSITION_MATRIX, 4);
    LIBS.scaleZ(orchestra.POSITION_MATRIX, 4);
    LIBS.rotateY(orchestra.POSITION_MATRIX, Math.PI*180/180);
    LIBS.translateY(orchestra.POSITION_MATRIX, -2);
    LIBS.translateX(orchestra.POSITION_MATRIX, 6);
    LIBS.translateZ(orchestra.POSITION_MATRIX, -5)

    
    // Room Decor
    var skull1 = new Skull(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    room.childs.push(skull1);
    LIBS.translateY(skull1.POSITION_MATRIX, -5.5);
    LIBS.translateZ(skull1.POSITION_MATRIX, 3);
    LIBS.translateX(skull1.POSITION_MATRIX, 10);
    LIBS.rotateZ(skull1.POSITION_MATRIX, 90*Math.PI/180);
    LIBS.rotateX(skull1.POSITION_MATRIX, 90*Math.PI/180);
    var lefteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull1.childs.push(lefteye);
    LIBS.translateX(lefteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(lefteye.POSITION_MATRIX, 0.25);
    LIBS.translateY(lefteye.POSITION_MATRIX, 0.1);
    var righteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull1.childs.push(righteye);
    LIBS.translateX(righteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(righteye.POSITION_MATRIX, -0.25);
    LIBS.translateY(righteye.POSITION_MATRIX, 0.1);
    var blood1 = new Blood(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull1.childs.push(blood1);
    LIBS.rotateY(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.rotateX(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.translateZ(blood1.POSITION_MATRIX, 0.5);
    LIBS.translateX(blood1.POSITION_MATRIX, 2);
    LIBS.translateY(blood1.POSITION_MATRIX, -1);
     var skull2 = new Skull(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    room.childs.push(skull2);
    LIBS.translateY(skull2.POSITION_MATRIX, -5.5);
    LIBS.translateZ(skull2.POSITION_MATRIX, 5);
    LIBS.translateX(skull2.POSITION_MATRIX, -10);
    LIBS.rotateZ(skull2.POSITION_MATRIX, 180*Math.PI/180);
    LIBS.rotateX(skull2.POSITION_MATRIX, 90*Math.PI/180);
    var lefteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull2.childs.push(lefteye);
    LIBS.translateX(lefteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(lefteye.POSITION_MATRIX, 0.25);
    LIBS.translateY(lefteye.POSITION_MATRIX, 0.1);
    var righteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull2.childs.push(righteye);
    LIBS.translateX(righteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(righteye.POSITION_MATRIX, -0.25);
    LIBS.translateY(righteye.POSITION_MATRIX, 0.1);
    var blood1 = new Blood(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull2.childs.push(blood1);
    LIBS.rotateY(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.rotateX(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.translateZ(blood1.POSITION_MATRIX, 0.5);
    LIBS.translateX(blood1.POSITION_MATRIX, 2);
    LIBS.translateY(blood1.POSITION_MATRIX, -1);
    var skull3 = new Skull(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    room.childs.push(skull3);
    LIBS.translateY(skull3.POSITION_MATRIX, -5.5);
    LIBS.translateZ(skull3.POSITION_MATRIX, 4.3);
    LIBS.translateX(skull3.POSITION_MATRIX, 2);
    LIBS.rotateZ(skull3.POSITION_MATRIX, 90*Math.PI/180);
    LIBS.rotateX(skull3.POSITION_MATRIX, 270*Math.PI/180);
    var lefteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull3.childs.push(lefteye);
    LIBS.translateX(lefteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(lefteye.POSITION_MATRIX, 0.25);
    LIBS.translateY(lefteye.POSITION_MATRIX, 0.1);
    var righteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull3.childs.push(righteye);
    LIBS.translateX(righteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(righteye.POSITION_MATRIX, -0.25);
    LIBS.translateY(righteye.POSITION_MATRIX, 0.1);
    var blood1 = new Blood(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull3.childs.push(blood1);
    LIBS.rotateY(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.rotateX(blood1.POSITION_MATRIX, 90*Math.PI/180);
    LIBS.translateZ(blood1.POSITION_MATRIX, -0.5);
    LIBS.translateX(blood1.POSITION_MATRIX, 2);
    LIBS.translateY(blood1.POSITION_MATRIX, 1);
     var skull4 = new Skull(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    room.childs.push(skull4);
    LIBS.translateY(skull4.POSITION_MATRIX, -5.5);
    LIBS.translateZ(skull4.POSITION_MATRIX, 4);
    LIBS.translateX(skull4.POSITION_MATRIX, -5);
    LIBS.rotateZ(skull4.POSITION_MATRIX, 90*Math.PI/180);
    LIBS.rotateX(skull4.POSITION_MATRIX, 90*Math.PI/180);
    var lefteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull4.childs.push(lefteye);
    LIBS.translateX(lefteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(lefteye.POSITION_MATRIX, 0.25);
    LIBS.translateY(lefteye.POSITION_MATRIX, 0.1);
    var righteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull4.childs.push(righteye);
    LIBS.translateX(righteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(righteye.POSITION_MATRIX, -0.25);
    LIBS.translateY(righteye.POSITION_MATRIX, 0.1);
    var blood1 = new Blood(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull4.childs.push(blood1);
    LIBS.rotateY(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.rotateX(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.translateZ(blood1.POSITION_MATRIX, 0.5);
    LIBS.translateX(blood1.POSITION_MATRIX, 2);
    LIBS.translateY(blood1.POSITION_MATRIX, -1);
    var skull5 = new Skull(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    room.childs.push(skull5);
    LIBS.translateY(skull5.POSITION_MATRIX, -5.5);
    LIBS.translateZ(skull5.POSITION_MATRIX, -3);
    LIBS.translateX(skull5.POSITION_MATRIX, 15);
    LIBS.rotateZ(skull5.POSITION_MATRIX, 90*Math.PI/180);
    LIBS.rotateX(skull5.POSITION_MATRIX, 90*Math.PI/180);
    var lefteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull5.childs.push(lefteye);
    LIBS.translateX(lefteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(lefteye.POSITION_MATRIX, 0.25);
    LIBS.translateY(lefteye.POSITION_MATRIX, 0.1);
    var righteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull5.childs.push(righteye);
    LIBS.translateX(righteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(righteye.POSITION_MATRIX, -0.25);
    LIBS.translateY(righteye.POSITION_MATRIX, 0.1);
    var blood1 = new Blood(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull5.childs.push(blood1);
    LIBS.rotateY(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.rotateX(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.translateZ(blood1.POSITION_MATRIX, 0.5);
    LIBS.translateX(blood1.POSITION_MATRIX, 2);
    LIBS.translateY(blood1.POSITION_MATRIX, -1);
     var skull6 = new Skull(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    room.childs.push(skull6);
    LIBS.translateY(skull6.POSITION_MATRIX, -5.5);
    LIBS.translateZ(skull6.POSITION_MATRIX, -10);
    LIBS.translateX(skull6.POSITION_MATRIX, -7);
    LIBS.rotateZ(skull6.POSITION_MATRIX, 90*Math.PI/180);
    LIBS.rotateX(skull6.POSITION_MATRIX, 90*Math.PI/180);
    var lefteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull6.childs.push(lefteye);
    LIBS.translateX(lefteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(lefteye.POSITION_MATRIX, 0.25);
    LIBS.translateY(lefteye.POSITION_MATRIX, 0.1);
    var righteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull6.childs.push(righteye);
    LIBS.translateX(righteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(righteye.POSITION_MATRIX, -0.25);
    LIBS.translateY(righteye.POSITION_MATRIX, 0.1);
    var blood1 = new Blood(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull6.childs.push(blood1);
    LIBS.rotateY(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.rotateX(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.translateZ(blood1.POSITION_MATRIX, 0.5);
    LIBS.translateX(blood1.POSITION_MATRIX, 2);
    LIBS.translateY(blood1.POSITION_MATRIX, -1);
    var skull7 = new Skull(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    room.childs.push(skull7);
    LIBS.translateY(skull7.POSITION_MATRIX, -5.5);
    LIBS.translateZ(skull7.POSITION_MATRIX, -10);
    LIBS.translateX(skull7.POSITION_MATRIX, 7);
    LIBS.rotateZ(skull7.POSITION_MATRIX, 90*Math.PI/180);
    LIBS.rotateX(skull7.POSITION_MATRIX, 90*Math.PI/180);
    var lefteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull7.childs.push(lefteye);
    LIBS.translateX(lefteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(lefteye.POSITION_MATRIX, 0.25);
    LIBS.translateY(lefteye.POSITION_MATRIX, 0.1);
    var righteye = new holloweye(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull7.childs.push(righteye);
    LIBS.translateX(righteye.POSITION_MATRIX, 0.4);
    LIBS.translateZ(righteye.POSITION_MATRIX, -0.25);
    LIBS.translateY(righteye.POSITION_MATRIX, 0.1);
    var blood1 = new Blood(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    skull7.childs.push(blood1);
    LIBS.rotateY(blood1.POSITION_MATRIX, 90*Math.PI/180);
    LIBS.rotateX(blood1.POSITION_MATRIX, -90*Math.PI/180);
    LIBS.translateZ(blood1.POSITION_MATRIX, 0.5);
    LIBS.translateX(blood1.POSITION_MATRIX, 1);
    LIBS.translateY(blood1.POSITION_MATRIX, 1);
    //Room Positioning changes -- camera
    LIBS.translateY(room.POSITION_MATRIX, 5);
    var PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    // var MOVEMATRIX = LIBS.get_I4();
    var VIEWMATRIX = LIBS.get_I4();
    var ROTATION_MATRIX = LIBS.get_I4();
    

    LIBS.translateZ(VIEWMATRIX, -12);
     var THETA = 0, PHI = 0;
    var drag = false;
    var x_prev, y_prev;
    var FRICTION = 0.05;
    var dX = 0, dY = 0;

    var mouseDown = function (e) {
        drag = true;
        x_prev = e.pageX, y_prev = e.pageY;
        e.preventDefault();
        return false;
    };

    var mouseUp = function (e) {
        drag = false;
    };

    var mouseMove = function (e) {
        if (!drag) return false;
        dX = (e.pageX - x_prev) * 2 * Math.PI / CANVAS.width;
        dY = (e.pageY - y_prev) * 2 * Math.PI / CANVAS.height;
        THETA += dX;
        PHI += dY;
        x_prev = e.pageX, y_prev = e.pageY;
        e.preventDefault();
    };

    CANVAS.addEventListener("mousedown", mouseDown, false);
    CANVAS.addEventListener("mouseup", mouseUp, false);
    CANVAS.addEventListener("mouseout", mouseUp, false);
    CANVAS.addEventListener("mousemove", mouseMove, false);

    var SPEED = 0.05;

    var keyDown = function (e) {
        if (e.key === 'w') {
            dY -= SPEED;
        }
        else if (e.key === 'a') {
            dX -= SPEED;
        }
        else if (e.key === 's') {
            dY += SPEED;
        }
        else if (e.key === 'd') {
            dX += SPEED;
        }
    };

    window.addEventListener("keydown", keyDown, false);
    // LIBS.rotateY(Object2.MOVE_MATRIX,1)
    /*========================= DRAWING ========================= */
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.clearDepth(1.0);

    room.setup();

    var time_prev = 0;
    var animate = function (time) {
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT);
        // LIBS.rotateY(Joint1.POSITION_MATRIX, dt * 0.001);
        // LIBS.rotateY(HyperJoints11.POSITION_MATRIX, -dt * 0.001);
        var dt = time - time_prev;
        time_prev = time;
        GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
        GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
        LIBS.set_I4(ROTATION_MATRIX);
        LIBS.rotateY(ROTATION_MATRIX, THETA);
        LIBS.rotateX(ROTATION_MATRIX, PHI);
        orchestra.animate(time);
        room.render(ROTATION_MATRIX);
        if (!drag) {
            dX *= (1 - FRICTION);
            dY *= (1 - FRICTION);
            THETA += dX;
            PHI += dY;
        }
        GL.flush();
        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener('load', main);