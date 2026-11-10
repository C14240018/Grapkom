import { Gito_Body, Room, Skull, Blood, holloweye } from "./Body.js";
import { Ellipsoid } from "./Elipsoid.js";
import { EllipticParaboloid } from "./EllipticParaboloid.js";
import { Cone } from "./Cone.js";
import { Curve } from "./curve.js";
import { createBirdTextures } from "./projectPunishingBird/projecte/birdTexture.js";

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

    //Jeff's Bird
    var BIRD_TEXTURES = createBirdTextures(GL);
    var Centre = new Ellipsoid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    room.childs.push(Centre);
    LIBS.scaleX(Centre.POSITION_MATRIX, 0.3);
    LIBS.scaleY(Centre.POSITION_MATRIX, 0.3);
    LIBS.scaleZ(Centre.POSITION_MATRIX, 0.3);
    LIBS.translateY(Centre.POSITION_MATRIX, -1.3);
    LIBS.translateX(Centre.POSITION_MATRIX, -1)
    var Head = new Ellipsoid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Beak = new Cone(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Eye_Left = new Ellipsoid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Eye_Right = new Ellipsoid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Wing_Start_Right = new EllipticParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Wing_End_Right = new EllipticParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Body = new Ellipsoid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Wing_Start_Left = new EllipticParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Wing_End_Left = new EllipticParaboloid(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var Leg_Left = new Curve(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, {
    start: { x: 0, y: 0, z: 0 },
    end:   { x: 0, y: 0.75, z: 0.3},
    bend: -0.5
    }, 0.1, 64, 8);
    var Leg_Right = new Curve(GL, SHADER_PROGRAM, _position, _color, _Mmatrix, {
    start: { x: 0, y: 0, z: 0 },
    end:   { x: 0, y: 0.75, z: 0.3},
    bend: -0.5
    }, 0.1, 64, 8);

    Centre.texture = BIRD_TEXTURES.white;
    Head.texture = BIRD_TEXTURES.white;
    Beak.texture = BIRD_TEXTURES.blue;
    Eye_Left.texture = BIRD_TEXTURES.black;
    Eye_Right.texture = BIRD_TEXTURES.black;
    Wing_Start_Right.texture = BIRD_TEXTURES.wing;
    Wing_End_Right.texture = BIRD_TEXTURES.wing;
    Body.texture = BIRD_TEXTURES.body;
    Wing_Start_Left.texture = BIRD_TEXTURES.wing;
    Wing_End_Left.texture = BIRD_TEXTURES.wing;
    Leg_Left.texture = BIRD_TEXTURES.blue;
    Leg_Right.texture = BIRD_TEXTURES.blue;


    Centre.childs.push(Body);
    Body.childs.push(Head);
    Head.parentScaleCompensation = [1 / 20, 1 / 17.5, 1 / 25];

    Head.childs.push(Beak);
    Head.childs.push(Eye_Left);
    Eye_Left.childs.push(Eye_Right);
    Body.childs.push(Wing_Start_Right);
    Wing_Start_Right.childs.push(Wing_End_Right);
    Body.childs.push(Wing_Start_Left);
    Wing_Start_Left.childs.push(Wing_End_Left);
    Body.childs.push(Leg_Left);
    Body.childs.push(Leg_Right);
    
    

    LIBS.scaleX(Centre.POSITION_MATRIX, 0.1);
    LIBS.scaleY(Centre.POSITION_MATRIX, 0.1);
    LIBS.scaleZ(Centre.POSITION_MATRIX, 0.1);

    LIBS.scaleX(Body.POSITION_MATRIX, 20);
    LIBS.scaleY(Body.POSITION_MATRIX, 17.5);
    LIBS.scaleZ(Body.POSITION_MATRIX, 25);

    var bodyRotation = -Math.PI / 16;
    LIBS.rotateX(Body.POSITION_MATRIX, bodyRotation);

    LIBS.scaleX(Head.POSITION_MATRIX, 15);
    LIBS.scaleY(Head.POSITION_MATRIX, 15);
    LIBS.scaleZ(Head.POSITION_MATRIX, 15);

    LIBS.rotateX(Head.POSITION_MATRIX, Math.PI / 16);
    LIBS.rotateY(Head.POSITION_MATRIX, Math.PI/4)

    LIBS.translateY(Head.POSITION_MATRIX, 10.7);
    LIBS.translateZ(Head.POSITION_MATRIX, 7.5);

    LIBS.scaleX(Beak.POSITION_MATRIX, 0.25);
    LIBS.scaleY(Beak.POSITION_MATRIX, 0.2);
    LIBS.scaleZ(Beak.POSITION_MATRIX, 0.15);

    LIBS.scaleX(Eye_Left.POSITION_MATRIX, 0.1);
    LIBS.scaleY(Eye_Left.POSITION_MATRIX, 0.1);
    LIBS.scaleZ(Eye_Left.POSITION_MATRIX, 0.1);

    LIBS.rotateX(Beak.POSITION_MATRIX, Math.PI / 2);
    LIBS.rotateY(Beak.POSITION_MATRIX, 0);
    LIBS.rotateZ(Beak.POSITION_MATRIX, 0);
    

    LIBS.translateY(Beak.POSITION_MATRIX, 0.2);  
    LIBS.translateZ(Beak.POSITION_MATRIX, 1.1);

    LIBS.translateX(Eye_Left.POSITION_MATRIX, -0.5);
    LIBS.translateY(Eye_Left.POSITION_MATRIX, 0.5);
    LIBS.translateZ(Eye_Left.POSITION_MATRIX, 0.7);

    LIBS.translateX(Eye_Right.POSITION_MATRIX, 10);

    LIBS.scaleX(Wing_Start_Right.POSITION_MATRIX, 0.3* 1.5);
    LIBS.scaleY(Wing_Start_Right.POSITION_MATRIX, 0.25* 1.75);
    LIBS.scaleZ(Wing_Start_Right.POSITION_MATRIX, 0.25* 1.2);

    LIBS.translateX(Wing_Start_Right.POSITION_MATRIX, 0.8);
    LIBS.translateY(Wing_Start_Right.POSITION_MATRIX, 0.4);
    LIBS.translateZ(Wing_Start_Right.POSITION_MATRIX, 0.6);

    LIBS.rotateY(Wing_Start_Right.POSITION_MATRIX, Math.PI/ 1.75 );
    LIBS.rotateX(Wing_Start_Right.POSITION_MATRIX, -Math.PI / 1.5);
    LIBS.rotateZ(Wing_Start_Right.POSITION_MATRIX, Math.PI / 8);

    LIBS.scaleY(Wing_End_Right.POSITION_MATRIX, 0.5);

    LIBS.translateX(Wing_End_Right.POSITION_MATRIX, 0);
    LIBS.translateY(Wing_End_Right.POSITION_MATRIX, 3);

    LIBS.rotateX(Wing_End_Right.POSITION_MATRIX, -Math.PI);

    LIBS.scaleX(Wing_Start_Left.POSITION_MATRIX, 0.3* 1.5);
    LIBS.scaleY(Wing_Start_Left.POSITION_MATRIX, 0.25* 1.75);
    LIBS.scaleZ(Wing_Start_Left.POSITION_MATRIX, 0.25* 1.2);

    LIBS.translateX(Wing_Start_Left.POSITION_MATRIX, -0.8);
    LIBS.translateY(Wing_Start_Left.POSITION_MATRIX, 0.4);
    LIBS.translateZ(Wing_Start_Left.POSITION_MATRIX, 0.6);

    LIBS.rotateY(Wing_Start_Left.POSITION_MATRIX, -Math.PI/ 1.75 );
    LIBS.rotateX(Wing_Start_Left.POSITION_MATRIX, -Math.PI / 1.5);
    LIBS.rotateZ(Wing_Start_Left.POSITION_MATRIX, -Math.PI / 8);

    LIBS.scaleY(Wing_End_Left.POSITION_MATRIX, 0.5);

    LIBS.translateX(Wing_End_Left.POSITION_MATRIX, 0);
    LIBS.translateY(Wing_End_Left.POSITION_MATRIX, 3);

    LIBS.rotateX(Wing_End_Left.POSITION_MATRIX, -Math.PI);

    LIBS.rotateX(Leg_Left.POSITION_MATRIX, 90);
    LIBS.rotateZ(Leg_Left.POSITION_MATRIX, -Math.PI/32);

    LIBS.translateX(Leg_Left.POSITION_MATRIX,-0.25);
    LIBS.translateY(Leg_Left.POSITION_MATRIX, -0.75);
    LIBS.translateZ(Leg_Left.POSITION_MATRIX, -0.2);

    LIBS.rotateX(Leg_Right.POSITION_MATRIX, 90);
    LIBS.rotateZ(Leg_Right.POSITION_MATRIX, Math.PI/32)

    LIBS.translateX(Leg_Right.POSITION_MATRIX, 0.25);
    LIBS.translateY(Leg_Right.POSITION_MATRIX, -0.75);
    LIBS.translateZ(Leg_Right.POSITION_MATRIX, -0.2);

    var originalHeadPosition = Head.POSITION_MATRIX.slice();

    LIBS.translateZ(Centre.POSITION_MATRIX, -4)
    // Valen's code

    
    // Room Decor
    var pillar = new Gito_Body(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    room.childs.push(pillar);
    LIBS.translateY(pillar.POSITION_MATRIX, -4);
    LIBS.translateZ(pillar.POSITION_MATRIX, -4);
    LIBS.translateX(pillar.POSITION_MATRIX, -1);
    LIBS.scaleY(pillar.POSITION_MATRIX, 2);
    LIBS.scaleZ(pillar.POSITION_MATRIX, 0.5);
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
        //Jeff's Animation
        if (time <= 6300){
        LIBS.rotateY(Head.POSITION_MATRIX,-Math.PI/32* Math.sin(time * 0.01));
        LIBS.rotateX(Head.POSITION_MATRIX,-Math.PI/32* Math.sin(time * 0.02));
        } else if(time <= 6400){
            LIBS.rotateX(Head.POSITION_MATRIX,Math.PI/2*(0.1));
        } else if(time <= 6810) {
            LIBS.scaleY(Head.POSITION_MATRIX,1+0.15*Math.sin(time*0.01));
            LIBS.translateY(Head.POSITION_MATRIX,1*Math.sin(time*0.01));
            LIBS.translateZ(Head.POSITION_MATRIX,1*Math.sin(time*0.01));
        } else if(time <= 8000){
            Head.POSITION_MATRIX = originalHeadPosition.slice();
        } else if(time <= 9000) {
            LIBS.translateZ(Body.POSITION_MATRIX,3)
            
            LIBS.rotateZ(Wing_Start_Left.POSITION_MATRIX, 0.15 * Math.sin(time * 0.0075));
            LIBS.rotateZ(Wing_Start_Right.POSITION_MATRIX, -0.15 * Math.sin(time * 0.0075));
        } else if(time <= 10000){
            LIBS.rotateY(Body.POSITION_MATRIX,-Math.PI/12*0.1);
            LIBS.rotateZ(Wing_Start_Left.POSITION_MATRIX, 0.15 * Math.sin(time * 0.0075));
            LIBS.rotateZ(Wing_Start_Right.POSITION_MATRIX, -0.15 * Math.sin(time * 0.0075));
        } else if(time <= 20000){
            LIBS.rotateZ(Wing_Start_Left.POSITION_MATRIX, 0.15 * Math.sin(time * 0.0075));
            LIBS.rotateZ(Wing_Start_Right.POSITION_MATRIX, -0.15 * Math.sin(time * 0.0075));
            LIBS.rotateY(Centre.POSITION_MATRIX,-Math.PI*0.01)
        }else if(time <= 21000){
            LIBS.rotateY(Body.POSITION_MATRIX,-Math.PI/12*0.1);
            LIBS.rotateZ(Wing_Start_Left.POSITION_MATRIX, 0.15 * Math.sin(time * 0.0075));
            LIBS.rotateZ(Wing_Start_Right.POSITION_MATRIX, -0.15 * Math.sin(time * 0.0075));
        }else if(time <= 22000){
            LIBS.translateZ(Body.POSITION_MATRIX,-3)
            LIBS.rotateZ(Wing_Start_Left.POSITION_MATRIX, 0.15 * Math.sin(time * 0.0075));
            LIBS.rotateZ(Wing_Start_Right.POSITION_MATRIX, -0.15 * Math.sin(time * 0.0075));
        }else if(time <= 23000){
            LIBS.rotateY(Body.POSITION_MATRIX,Math.PI/6*0.1);
            LIBS.rotateZ(Wing_Start_Left.POSITION_MATRIX, 0.15 * Math.sin(time * 0.0075));
            LIBS.rotateZ(Wing_Start_Right.POSITION_MATRIX, -0.15 * Math.sin(time * 0.0075));
        }
        //
        GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
        GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
        LIBS.set_I4(ROTATION_MATRIX);
        LIBS.rotateY(ROTATION_MATRIX, THETA);
        LIBS.rotateX(ROTATION_MATRIX, PHI);
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