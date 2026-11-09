import { Gito_Body, legs, keyhole, Room, Skull, Blood, holloweye } from "./Body.js";
import { eyes } from "./eyes.js";
import {eyes1} from "./eyes.js";
import {eyes3} from "./eyes.js";
import {eyes4} from "./eyes.js";
import { flesh } from "./Body.js";
import { HyperJoints } from "./HyperJoints.js";
import { Drills, MiniDrills } from "./Drill.js";
import { Keyhole1 } from "./eyes.js";
import { Cornea, Iris } from "./ActualEyes.js";
import { Saw } from "./buzzsaw.js";
import { Arteries, Veins } from "./CurvedDetails.js";
import { Ellipsoid } from "./Elipsoid.js";
import { EllipticParaboloid } from "./EllipticParaboloid.js";
import { Cone } from "./Cone.js";
import { Curve } from "./curve.js";
import { createBirdTextures } from "./projectPunishingBird/projecte/birdTexture.js";
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
    var Body1 = new Gito_Body(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    room.childs.push(Body1);
    LIBS.translateY(Body1.POSITION_MATRIX, -3.5);
    var eyesOne = new eyes(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var eyesOne1 = new eyes1(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var eyeTwo = new eyes3(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var eyeTwo1 = new eyes4(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var flesh1 = new flesh(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var CenterBody = new Gito_Body(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    var CenterFlesh = new flesh(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Body1.childs.push(CenterBody);
    flesh1.childs.push(CenterFlesh);
    LIBS.scaleX(CenterFlesh.POSITION_MATRIX, 0.01);
    LIBS.scaleY(CenterFlesh.POSITION_MATRIX, 0.01);
    LIBS.scaleZ(CenterFlesh.POSITION_MATRIX, 0.01);
    LIBS.scaleX(CenterBody.POSITION_MATRIX, 0.01);
    LIBS.scaleY(CenterBody.POSITION_MATRIX, 0.01);
    LIBS.scaleZ(CenterBody.POSITION_MATRIX, 0.01);
    Body1.childs.push(eyesOne);
    Body1.childs.push(eyeTwo);
    Body1.childs.push(flesh1);
    LIBS.scaleX(flesh1.POSITION_MATRIX, 1.2);
    LIBS.scaleY(flesh1.POSITION_MATRIX, 0.3);
    LIBS.scaleZ(flesh1.POSITION_MATRIX, 1.2);
    LIBS.translateY(flesh1.POSITION_MATRIX, -1.3);
    LIBS.scaleX(Body1.POSITION_MATRIX, 1.5);
    LIBS.scaleY(Body1.POSITION_MATRIX, 1.5);
    LIBS.scaleZ(Body1.POSITION_MATRIX, 1.5);
    LIBS.scaleZ(eyesOne.POSITION_MATRIX, 8.01);
    LIBS.scaleX(eyesOne.POSITION_MATRIX, 0.9);
    LIBS.scaleY(eyesOne.POSITION_MATRIX, 0.9);
    LIBS.translateX(eyesOne.POSITION_MATRIX, 0.7);
    LIBS.translateY(eyesOne.POSITION_MATRIX, 0.7);
    LIBS.scaleZ(eyeTwo.POSITION_MATRIX, 8.01);
    LIBS.scaleX(eyeTwo.POSITION_MATRIX, 0.8);
    LIBS.scaleY(eyeTwo.POSITION_MATRIX, 0.8);
    LIBS.translateX(eyeTwo.POSITION_MATRIX, -1);
    LIBS.translateY(eyeTwo.POSITION_MATRIX, -0.4);
    eyesOne.childs.push(eyesOne1);
    eyeTwo.childs.push(eyeTwo1);
    LIBS.scaleZ(eyesOne1.POSITION_MATRIX, 1.01);
    LIBS.scaleX(eyesOne1.POSITION_MATRIX, 0.7);
    LIBS.scaleY(eyesOne1.POSITION_MATRIX, 0.7);
    LIBS.scaleZ(eyeTwo1.POSITION_MATRIX, 1.01);
    LIBS.scaleX(eyeTwo1.POSITION_MATRIX, 0.7);
    LIBS.scaleY(eyeTwo1.POSITION_MATRIX, 0.7);
    var Joint1 = new flesh(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    CenterFlesh.childs.push(Joint1);
    LIBS.translateX(Joint1.POSITION_MATRIX, 70);
    LIBS.translateZ(Joint1.POSITION_MATRIX, 75);
    LIBS.translateY(Joint1.POSITION_MATRIX, 85);
    LIBS.rotateY(Joint1.POSITION_MATRIX, -45*Math.PI/180);
    // LIBS.rotateZ(Joint1.POSITION_MATRIX, 10*Math.PI/180);
    var leg1 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Joint1.childs.push(leg1);
    LIBS.scaleX(leg1.POSITION_MATRIX, 180);
    LIBS.scaleY(leg1.POSITION_MATRIX, 10);
    LIBS.scaleZ(leg1.POSITION_MATRIX, 10);
    LIBS.rotateZ(leg1.POSITION_MATRIX, 80*Math.PI/180);
    LIBS.translateY(leg1.POSITION_MATRIX, 130);
    LIBS.translateX(leg1.POSITION_MATRIX, 60);
    var HyperJoints11 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    leg1.childs.push(HyperJoints11);
    LIBS.scaleZ(HyperJoints11.POSITION_MATRIX, 20);
    LIBS.scaleY(HyperJoints11.POSITION_MATRIX, 5);
    LIBS.translateY(HyperJoints11.POSITION_MATRIX, 5.9);
    LIBS.translateX(HyperJoints11.POSITION_MATRIX, 1);
    LIBS.rotateX(HyperJoints11.POSITION_MATRIX, 90*Math.PI/180);
    var HyperJoints12 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints11.childs.push(HyperJoints12);
    LIBS.rotateY(HyperJoints12.POSITION_MATRIX, 5*Math.PI/180);
    var HyperJoints13 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints12.childs.push(HyperJoints13);
    LIBS.rotateY(HyperJoints13.POSITION_MATRIX, 5*Math.PI/180);
    var smallLeg11 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints13.childs.push(smallLeg11);
    LIBS.scaleX(smallLeg11.POSITION_MATRIX, 0.05);
    LIBS.scaleY(smallLeg11.POSITION_MATRIX, 0.1);
    LIBS.translateZ(smallLeg11.POSITION_MATRIX, 0.50);
    LIBS.translateY(smallLeg11.POSITION_MATRIX, 0.2);
    LIBS.translateX(smallLeg11.POSITION_MATRIX, -1.14);
    LIBS.rotateY(smallLeg11.POSITION_MATRIX, -80*Math.PI/180);
    var smallLeg12 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints13.childs.push(smallLeg12);
    LIBS.scaleX(smallLeg12.POSITION_MATRIX, 0.05);
    LIBS.scaleY(smallLeg12.POSITION_MATRIX, 0.1);
    LIBS.translateZ(smallLeg12.POSITION_MATRIX, 0.50);
    LIBS.translateY(smallLeg12.POSITION_MATRIX, -0.2);
    LIBS.translateX(smallLeg12.POSITION_MATRIX, -1.14);
    LIBS.rotateY(smallLeg12.POSITION_MATRIX, -80*Math.PI/180);
    var Drill1 = new Drills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    smallLeg12.childs.push(Drill1);
    LIBS.translateZ(Drill1.POSITION_MATRIX, 3.20);
    LIBS.translateY(Drill1.POSITION_MATRIX, 2);
    LIBS.rotateY(Drill1.POSITION_MATRIX, 180*Math.PI/180);
    LIBS.scaleX(Drill1.POSITION_MATRIX, 4);
    LIBS.scaleY(Drill1.POSITION_MATRIX, 6);
    LIBS.scaleZ(Drill1.POSITION_MATRIX, 6);
    var miniDrills11 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill1.childs.push(miniDrills11);
    LIBS.translateY(miniDrills11.POSITION_MATRIX, 2.5);
    LIBS.translateZ(miniDrills11.POSITION_MATRIX, 0.37);
    LIBS.scaleY(miniDrills11.POSITION_MATRIX, 0.045);
    LIBS.scaleX(miniDrills11.POSITION_MATRIX, 0.45)
    LIBS.scaleZ(miniDrills11.POSITION_MATRIX, 5)
    LIBS.rotateX(miniDrills11.POSITION_MATRIX, 90*Math.PI/180);
    var miniDrills12 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill1.childs.push(miniDrills12);
    LIBS.translateY(miniDrills12.POSITION_MATRIX, 1.9);
    LIBS.translateZ(miniDrills12.POSITION_MATRIX, 0.32);
    LIBS.scaleY(miniDrills12.POSITION_MATRIX, 0.03);
    LIBS.scaleX(miniDrills12.POSITION_MATRIX, 0.3)
    LIBS.scaleZ(miniDrills12.POSITION_MATRIX, 4)
    LIBS.rotateX(miniDrills12.POSITION_MATRIX, 90*Math.PI/180);
    var miniDrills13 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill1.childs.push(miniDrills13);
    LIBS.translateY(miniDrills13.POSITION_MATRIX, 1.4);
    LIBS.translateZ(miniDrills13.POSITION_MATRIX, 0.28);
    LIBS.scaleY(miniDrills13.POSITION_MATRIX, 0.02);
    LIBS.scaleX(miniDrills13.POSITION_MATRIX, 0.2)
    LIBS.scaleZ(miniDrills13.POSITION_MATRIX, 3)
    LIBS.rotateX(miniDrills13.POSITION_MATRIX, 90*Math.PI/180);
    //
    var Joint2 = new flesh(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    CenterFlesh.childs.push(Joint2);
    LIBS.translateX(Joint2.POSITION_MATRIX, -70);
    LIBS.translateZ(Joint2.POSITION_MATRIX, 75);
    LIBS.translateY(Joint2.POSITION_MATRIX, 85);
    LIBS.rotateY(Joint2.POSITION_MATRIX, -135*Math.PI/180);
    // LIBS.rotateZ(Joint2.POSITION_MATRIX, 10*Math.PI/180);
    var leg2 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Joint2.childs.push(leg2);
    LIBS.scaleX(leg2.POSITION_MATRIX, 180);
    LIBS.scaleY(leg2.POSITION_MATRIX, 10);
    LIBS.scaleZ(leg2.POSITION_MATRIX, 10);
    LIBS.rotateZ(leg2.POSITION_MATRIX, 80*Math.PI/180);
    LIBS.translateY(leg2.POSITION_MATRIX, 130);
    LIBS.translateX(leg2.POSITION_MATRIX, 60);
    var HyperJoints21 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    leg2.childs.push(HyperJoints21);
    LIBS.scaleZ(HyperJoints21.POSITION_MATRIX, 20);
    LIBS.scaleY(HyperJoints21.POSITION_MATRIX, 5);
    LIBS.translateY(HyperJoints21.POSITION_MATRIX, 5.9);
    LIBS.translateX(HyperJoints21.POSITION_MATRIX, 1);
    LIBS.rotateX(HyperJoints21.POSITION_MATRIX, 90*Math.PI/180);
    var HyperJoints22 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints21.childs.push(HyperJoints22);
    LIBS.rotateY(HyperJoints22.POSITION_MATRIX, 5*Math.PI/180);
    var HyperJoints23 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints22.childs.push(HyperJoints23);
    LIBS.rotateY(HyperJoints23.POSITION_MATRIX, 5*Math.PI/180);
    var smallLeg21 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints23.childs.push(smallLeg21);
    LIBS.scaleX(smallLeg21.POSITION_MATRIX, 0.05);
    LIBS.scaleY(smallLeg21.POSITION_MATRIX, 0.1);
    LIBS.translateZ(smallLeg21.POSITION_MATRIX, 0.50);
    LIBS.translateY(smallLeg21.POSITION_MATRIX, 0.2);
    LIBS.translateX(smallLeg21.POSITION_MATRIX, -1.14);
    LIBS.rotateY(smallLeg21.POSITION_MATRIX, -80*Math.PI/180);
    var smallLeg22 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints23.childs.push(smallLeg22);
    LIBS.scaleX(smallLeg22.POSITION_MATRIX, 0.05);
    LIBS.scaleY(smallLeg22.POSITION_MATRIX, 0.1);
    LIBS.translateZ(smallLeg22.POSITION_MATRIX, 0.50);
    LIBS.translateY(smallLeg22.POSITION_MATRIX, -0.2);
    LIBS.translateX(smallLeg22.POSITION_MATRIX, -1.14);
    LIBS.rotateY(smallLeg22.POSITION_MATRIX, -80*Math.PI/180);
    var Drill2 = new Drills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    smallLeg22.childs.push(Drill2);
    LIBS.translateZ(Drill2.POSITION_MATRIX, 3.20);
    LIBS.translateY(Drill2.POSITION_MATRIX, 2);
    LIBS.rotateY(Drill2.POSITION_MATRIX, 180*Math.PI/180);
    LIBS.scaleX(Drill2.POSITION_MATRIX, 4);
    LIBS.scaleY(Drill2.POSITION_MATRIX, 6);
    LIBS.scaleZ(Drill2.POSITION_MATRIX, 6);
    var miniDrills11 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill2.childs.push(miniDrills11);
    LIBS.translateY(miniDrills11.POSITION_MATRIX, 2.5);
    LIBS.translateZ(miniDrills11.POSITION_MATRIX, 0.37);
    LIBS.scaleY(miniDrills11.POSITION_MATRIX, 0.045);
    LIBS.scaleX(miniDrills11.POSITION_MATRIX, 0.45)
    LIBS.scaleZ(miniDrills11.POSITION_MATRIX, 5)
    LIBS.rotateX(miniDrills11.POSITION_MATRIX, 90*Math.PI/180);
    var miniDrills12 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill2.childs.push(miniDrills12);
    LIBS.translateY(miniDrills12.POSITION_MATRIX, 1.9);
    LIBS.translateZ(miniDrills12.POSITION_MATRIX, 0.32);
    LIBS.scaleY(miniDrills12.POSITION_MATRIX, 0.03);
    LIBS.scaleX(miniDrills12.POSITION_MATRIX, 0.3)
    LIBS.scaleZ(miniDrills12.POSITION_MATRIX, 4)
    LIBS.rotateX(miniDrills12.POSITION_MATRIX, 90*Math.PI/180);
    var miniDrills13 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill2.childs.push(miniDrills13);
    LIBS.translateY(miniDrills13.POSITION_MATRIX, 1.4);
    LIBS.translateZ(miniDrills13.POSITION_MATRIX, 0.28);
    LIBS.scaleY(miniDrills13.POSITION_MATRIX, 0.02);
    LIBS.scaleX(miniDrills13.POSITION_MATRIX, 0.2)
    LIBS.scaleZ(miniDrills13.POSITION_MATRIX, 3)
    LIBS.rotateX(miniDrills13.POSITION_MATRIX, 90*Math.PI/180);
    //
    var Joint3 = new flesh(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    CenterFlesh.childs.push(Joint3);
    LIBS.translateX(Joint3.POSITION_MATRIX, 70);
    LIBS.translateZ(Joint3.POSITION_MATRIX, -75);
    LIBS.translateY(Joint3.POSITION_MATRIX, 85);
    LIBS.rotateY(Joint3.POSITION_MATRIX, 45*Math.PI/180);
    // LIBS.rotateZ(Joint3.POSITION_MATRIX, 10*Math.PI/180);
    var leg3 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Joint3.childs.push(leg3);
    LIBS.scaleX(leg3.POSITION_MATRIX, 180);
    LIBS.scaleY(leg3.POSITION_MATRIX, 10);
    LIBS.scaleZ(leg3.POSITION_MATRIX, 10);
    LIBS.rotateZ(leg3.POSITION_MATRIX, 80*Math.PI/180);
    LIBS.translateY(leg3.POSITION_MATRIX, 130);
    LIBS.translateX(leg3.POSITION_MATRIX, 60);
    var HyperJoints31 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    leg3.childs.push(HyperJoints31);
    LIBS.scaleZ(HyperJoints31.POSITION_MATRIX, 20);
    LIBS.scaleY(HyperJoints31.POSITION_MATRIX, 5);
    LIBS.translateY(HyperJoints31.POSITION_MATRIX, 5.9);
    LIBS.translateX(HyperJoints31.POSITION_MATRIX, 1);
    LIBS.rotateX(HyperJoints31.POSITION_MATRIX, 90*Math.PI/180);
    var HyperJoints32 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints31.childs.push(HyperJoints32);
    LIBS.rotateY(HyperJoints32.POSITION_MATRIX, 5*Math.PI/180);
    var HyperJoints33 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints32.childs.push(HyperJoints33);
    LIBS.rotateY(HyperJoints33.POSITION_MATRIX, 5*Math.PI/180);
    var smallLeg31 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints33.childs.push(smallLeg31);
    LIBS.scaleX(smallLeg31.POSITION_MATRIX, 0.05);
    LIBS.scaleY(smallLeg31.POSITION_MATRIX, 0.1);
    LIBS.translateZ(smallLeg31.POSITION_MATRIX, 0.50);
    LIBS.translateY(smallLeg31.POSITION_MATRIX, 0.2);
    LIBS.translateX(smallLeg31.POSITION_MATRIX, -1.14);
    LIBS.rotateY(smallLeg31.POSITION_MATRIX, -80*Math.PI/180);
    var smallLeg32 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints33.childs.push(smallLeg32);
    LIBS.scaleX(smallLeg32.POSITION_MATRIX, 0.05);
    LIBS.scaleY(smallLeg32.POSITION_MATRIX, 0.1);
    LIBS.translateZ(smallLeg32.POSITION_MATRIX, 0.50);
    LIBS.translateY(smallLeg32.POSITION_MATRIX, -0.2);
    LIBS.translateX(smallLeg32.POSITION_MATRIX, -1.14);
    LIBS.rotateY(smallLeg32.POSITION_MATRIX, -80*Math.PI/180);
    var Drill3 = new Drills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    smallLeg32.childs.push(Drill3);
    LIBS.translateZ(Drill3.POSITION_MATRIX, 3.20);
    LIBS.translateY(Drill3.POSITION_MATRIX, 2);
    LIBS.rotateY(Drill3.POSITION_MATRIX, 180*Math.PI/180);
    LIBS.scaleX(Drill3.POSITION_MATRIX, 4);
    LIBS.scaleY(Drill3.POSITION_MATRIX, 6);
    LIBS.scaleZ(Drill3.POSITION_MATRIX, 6);
    var miniDrills11 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill3.childs.push(miniDrills11);
    LIBS.translateY(miniDrills11.POSITION_MATRIX, 2.5);
    LIBS.translateZ(miniDrills11.POSITION_MATRIX, 0.37);
    LIBS.scaleY(miniDrills11.POSITION_MATRIX, 0.045);
    LIBS.scaleX(miniDrills11.POSITION_MATRIX, 0.45)
    LIBS.scaleZ(miniDrills11.POSITION_MATRIX, 5)
    LIBS.rotateX(miniDrills11.POSITION_MATRIX, 90*Math.PI/180);
    var miniDrills12 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill3.childs.push(miniDrills12);
    LIBS.translateY(miniDrills12.POSITION_MATRIX, 1.9);
    LIBS.translateZ(miniDrills12.POSITION_MATRIX, 0.32);
    LIBS.scaleY(miniDrills12.POSITION_MATRIX, 0.03);
    LIBS.scaleX(miniDrills12.POSITION_MATRIX, 0.3)
    LIBS.scaleZ(miniDrills12.POSITION_MATRIX, 4)
    LIBS.rotateX(miniDrills12.POSITION_MATRIX, 90*Math.PI/180);
    var miniDrills13 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill3.childs.push(miniDrills13);
    LIBS.translateY(miniDrills13.POSITION_MATRIX, 1.4);
    LIBS.translateZ(miniDrills13.POSITION_MATRIX, 0.28);
    LIBS.scaleY(miniDrills13.POSITION_MATRIX, 0.02);
    LIBS.scaleX(miniDrills13.POSITION_MATRIX, 0.2)
    LIBS.scaleZ(miniDrills13.POSITION_MATRIX, 3)
    LIBS.rotateX(miniDrills13.POSITION_MATRIX, 90*Math.PI/180);
    //
    var Joint4 = new flesh(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    CenterFlesh.childs.push(Joint4);
    LIBS.translateX(Joint4.POSITION_MATRIX, -70);
    LIBS.translateZ(Joint4.POSITION_MATRIX, -75);
    LIBS.translateY(Joint4.POSITION_MATRIX, 85);
    LIBS.rotateY(Joint4.POSITION_MATRIX, 135*Math.PI/180);
    // LIBS.rotateZ(Joint4.POSITION_MATRIX, 10*Math.PI/180);
    var leg4 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Joint4.childs.push(leg4);
    LIBS.scaleX(leg4.POSITION_MATRIX, 180);
    LIBS.scaleY(leg4.POSITION_MATRIX, 10);
    LIBS.scaleZ(leg4.POSITION_MATRIX, 10);
    LIBS.rotateZ(leg4.POSITION_MATRIX, 80*Math.PI/180);
    LIBS.translateY(leg4.POSITION_MATRIX, 130);
    LIBS.translateX(leg4.POSITION_MATRIX, 60);
    var HyperJoints41 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    leg4.childs.push(HyperJoints41);
    LIBS.scaleZ(HyperJoints41.POSITION_MATRIX, 20);
    LIBS.scaleY(HyperJoints41.POSITION_MATRIX, 5);
    LIBS.translateY(HyperJoints41.POSITION_MATRIX, 5.9);
    LIBS.translateX(HyperJoints41.POSITION_MATRIX, 1);
    LIBS.rotateX(HyperJoints41.POSITION_MATRIX, 90*Math.PI/180);
    var HyperJoints42 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints41.childs.push(HyperJoints42);
    LIBS.rotateY(HyperJoints42.POSITION_MATRIX, 5*Math.PI/180);
    var HyperJoints43 = new HyperJoints(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints42.childs.push(HyperJoints43);
    LIBS.rotateY(HyperJoints43.POSITION_MATRIX, 5*Math.PI/180);
    var smallLeg41 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints43.childs.push(smallLeg41);
    LIBS.scaleX(smallLeg41.POSITION_MATRIX, 0.05);
    LIBS.scaleY(smallLeg41.POSITION_MATRIX, 0.1);
    LIBS.translateZ(smallLeg41.POSITION_MATRIX, 0.50);
    LIBS.translateY(smallLeg41.POSITION_MATRIX, 0.2);
    LIBS.translateX(smallLeg41.POSITION_MATRIX, -1.14);
    LIBS.rotateY(smallLeg41.POSITION_MATRIX, -80*Math.PI/180);
    var smallLeg42 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    HyperJoints43.childs.push(smallLeg42);
    LIBS.scaleX(smallLeg42.POSITION_MATRIX, 0.05);
    LIBS.scaleY(smallLeg42.POSITION_MATRIX, 0.1);
    LIBS.translateZ(smallLeg42.POSITION_MATRIX, 0.50);
    LIBS.translateY(smallLeg42.POSITION_MATRIX, -0.2);
    LIBS.translateX(smallLeg42.POSITION_MATRIX, -1.14);
    LIBS.rotateY(smallLeg42.POSITION_MATRIX, -80*Math.PI/180);
    var Drill4 = new Drills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    smallLeg42.childs.push(Drill4);
    LIBS.translateZ(Drill4.POSITION_MATRIX, 3.20);
    LIBS.translateY(Drill4.POSITION_MATRIX, 2);
    LIBS.rotateY(Drill4.POSITION_MATRIX, 180*Math.PI/180);
    LIBS.scaleX(Drill4.POSITION_MATRIX, 4);
    LIBS.scaleY(Drill4.POSITION_MATRIX, 6);
    LIBS.scaleZ(Drill4.POSITION_MATRIX, 6);
    var miniDrills11 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill4.childs.push(miniDrills11);
    LIBS.translateY(miniDrills11.POSITION_MATRIX, 2.5);
    LIBS.translateZ(miniDrills11.POSITION_MATRIX, 0.37);
    LIBS.scaleY(miniDrills11.POSITION_MATRIX, 0.045);
    LIBS.scaleX(miniDrills11.POSITION_MATRIX, 0.45)
    LIBS.scaleZ(miniDrills11.POSITION_MATRIX, 5)
    LIBS.rotateX(miniDrills11.POSITION_MATRIX, 90*Math.PI/180);
    var miniDrills12 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill4.childs.push(miniDrills12);
    LIBS.translateY(miniDrills12.POSITION_MATRIX, 1.9);
    LIBS.translateZ(miniDrills12.POSITION_MATRIX, 0.32);
    LIBS.scaleY(miniDrills12.POSITION_MATRIX, 0.03);
    LIBS.scaleX(miniDrills12.POSITION_MATRIX, 0.3)
    LIBS.scaleZ(miniDrills12.POSITION_MATRIX, 4)
    LIBS.rotateX(miniDrills12.POSITION_MATRIX, 90*Math.PI/180);
    var miniDrills13 = new MiniDrills(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Drill4.childs.push(miniDrills13);
    LIBS.translateY(miniDrills13.POSITION_MATRIX, 1.4);
    LIBS.translateZ(miniDrills13.POSITION_MATRIX, 0.28);
    LIBS.scaleY(miniDrills13.POSITION_MATRIX, 0.02);
    LIBS.scaleX(miniDrills13.POSITION_MATRIX, 0.2)
    LIBS.scaleZ(miniDrills13.POSITION_MATRIX, 3)
    LIBS.rotateX(miniDrills13.POSITION_MATRIX, 90*Math.PI/180);
    var keyhole1 = new Keyhole1(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Body1.childs.push(keyhole1);
    LIBS.translateZ(keyhole1.POSITION_MATRIX, 1);
    LIBS.scaleX(keyhole1.POSITION_MATRIX, 0.9);
    LIBS.scaleY(keyhole1.POSITION_MATRIX, 0.9);
    LIBS.scaleZ(keyhole1.POSITION_MATRIX, 0.01);
    var keyhole2 = new keyhole(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Body1.childs.push(keyhole2);
    LIBS.translateZ(keyhole2.POSITION_MATRIX, 1);
    LIBS.translateY(keyhole2.POSITION_MATRIX, -0.25);
    LIBS.scaleX(keyhole2.POSITION_MATRIX, 0.43);
    LIBS.scaleY(keyhole2.POSITION_MATRIX, 0.1);
    LIBS.scaleZ(keyhole2.POSITION_MATRIX, 0.01);
    var keyhole3 = new keyhole(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Body1.childs.push(keyhole3);
    LIBS.translateZ(keyhole3.POSITION_MATRIX, 1);
    LIBS.translateY(keyhole3.POSITION_MATRIX, -0.36);
    LIBS.scaleX(keyhole3.POSITION_MATRIX, 0.45);
    LIBS.scaleY(keyhole3.POSITION_MATRIX, 0.1);
    LIBS.scaleZ(keyhole3.POSITION_MATRIX, 0.01);
    var keyhole4 = new keyhole(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Body1.childs.push(keyhole4);
    LIBS.translateZ(keyhole4.POSITION_MATRIX, 1);
    LIBS.translateY(keyhole4.POSITION_MATRIX, -0.47);
    LIBS.scaleX(keyhole4.POSITION_MATRIX, 0.48);
    LIBS.scaleY(keyhole4.POSITION_MATRIX, 0.1);
    LIBS.scaleZ(keyhole4.POSITION_MATRIX, 0.01);
    var keyhole5 = new keyhole(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Body1.childs.push(keyhole5);
    LIBS.translateZ(keyhole5.POSITION_MATRIX, 1);
    LIBS.translateY(keyhole5.POSITION_MATRIX, -0.58);
    LIBS.scaleX(keyhole5.POSITION_MATRIX, 0.5);
    LIBS.scaleY(keyhole5.POSITION_MATRIX, 0.1);
    LIBS.scaleZ(keyhole5.POSITION_MATRIX, 0.01);
    var cornea = new Cornea(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    keyhole1.childs.push(cornea);
    LIBS.scaleX(cornea.POSITION_MATRIX, 0.7);
    LIBS.scaleY(cornea.POSITION_MATRIX, 0.4);
    LIBS.scaleZ(cornea.POSITION_MATRIX, 80);
    LIBS.translateZ(cornea.POSITION_MATRIX, 5);
    LIBS.translateY(cornea.POSITION_MATRIX, 0.1);
    var iris = new Iris(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    cornea.childs.push(iris);
    LIBS.translateZ(iris.POSITION_MATRIX, 0.001);
    LIBS.scaleX(iris.POSITION_MATRIX, 0.4);
    LIBS.scaleY(iris.POSITION_MATRIX, 0.7);
    var Joint5 = new flesh(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    CenterFlesh.childs.push(Joint5);
    // LIBS.translateX(Joint5.POSITION_MATRIX, 70);
    LIBS.scaleX(Joint5.POSITION_MATRIX, 10);
    LIBS.scaleY(Joint5.POSITION_MATRIX, 10);
    LIBS.scaleZ(Joint5.POSITION_MATRIX, 10);
    LIBS.translateZ(Joint5.POSITION_MATRIX, 75);
    LIBS.translateY(Joint5.POSITION_MATRIX, 40);
    LIBS.rotateY(Joint5.POSITION_MATRIX, -90*Math.PI/180);
    // LIBS.rotateZ(Joint1.POSITION_MATRIX, 10*Math.PI/180);
    var leg5 = new legs(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    Joint5.childs.push(leg5);
    LIBS.translateX(leg5.POSITION_MATRIX, 9);
    LIBS.scaleX(leg5.POSITION_MATRIX, 110);
    LIBS.scaleY(leg5.POSITION_MATRIX, 10);
    LIBS.scaleZ(leg5.POSITION_MATRIX, 10);
    LIBS.scaleX(leg5.POSITION_MATRIX, 0.1);
    LIBS.scaleY(leg5.POSITION_MATRIX, 0.1);
    LIBS.scaleZ(leg5.POSITION_MATRIX, 0.1);
    var saw = new Saw(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    leg5.childs.push(saw);
    LIBS.translateX(saw.POSITION_MATRIX, 1.5);
    LIBS.scaleX(saw.POSITION_MATRIX, 1/11);
    LIBS.scaleX(saw.POSITION_MATRIX, 20);
    LIBS.scaleY(saw.POSITION_MATRIX, 3.5);
    LIBS.scaleZ(saw.POSITION_MATRIX, 2);
    // LIBS.rotateX(saw.POSITION_MATRIX, 90*Math.PI/180);
    LIBS.rotateZ(saw.POSITION_MATRIX, 90*Math.PI/180);
    var artery1 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery1);
    LIBS.translateY(artery1.POSITION_MATRIX, 1);
    LIBS.translateX(artery1.POSITION_MATRIX, 0.85);
    LIBS.translateZ(artery1.POSITION_MATRIX, 0.5)
    var vein1 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery1.childs.push(vein1);
    LIBS.translateZ(vein1.POSITION_MATRIX, 0.2)
    var artery2 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery2);
    LIBS.translateY(artery2.POSITION_MATRIX, 1);
    LIBS.translateX(artery2.POSITION_MATRIX, 0.85);
    var vein2 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery2.childs.push(vein2);
    LIBS.translateZ(vein2.POSITION_MATRIX, 0.2);
    var artery3 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery3);
    LIBS.translateY(artery3.POSITION_MATRIX, 1);
    LIBS.translateX(artery3.POSITION_MATRIX, 0.85);
    LIBS.translateZ(artery3.POSITION_MATRIX, -0.5);
    var vein3 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery3.childs.push(vein3);
    LIBS.translateZ(vein3.POSITION_MATRIX, 0.2);
    var artery4 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery4);
    LIBS.translateY(artery4.POSITION_MATRIX, 1);
    LIBS.translateX(artery4.POSITION_MATRIX, -0.85);
    LIBS.translateZ(artery4.POSITION_MATRIX, 0.5)
    LIBS.rotateY(artery4.POSITION_MATRIX, 180*Math.PI/180);
    var vein4 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery4.childs.push(vein4);
    LIBS.translateZ(vein4.POSITION_MATRIX, 0.2)
    var artery5 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery5);
    LIBS.translateY(artery5.POSITION_MATRIX, 1);
    LIBS.translateX(artery5.POSITION_MATRIX, -0.85);
    LIBS.rotateY(artery5.POSITION_MATRIX, 180*Math.PI/180);
    var vein5 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery5.childs.push(vein5);
    LIBS.translateZ(vein5.POSITION_MATRIX, 0.2);
    var artery6 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery6);
    LIBS.translateY(artery6.POSITION_MATRIX, 1);
    LIBS.translateX(artery6.POSITION_MATRIX, -0.85);
    LIBS.translateZ(artery6.POSITION_MATRIX, -0.5);
     LIBS.rotateY(artery6.POSITION_MATRIX, 180*Math.PI/180);
    var vein6 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery6.childs.push(vein6);
    LIBS.translateZ(vein6.POSITION_MATRIX, 0.2)
    var artery7 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery7);
    LIBS.translateY(artery7.POSITION_MATRIX, 1);
    LIBS.translateX(artery7.POSITION_MATRIX, 0.75);
    LIBS.translateZ(artery7.POSITION_MATRIX, 0.85);
    LIBS.rotateY(artery7.POSITION_MATRIX, -90*Math.PI/180);
    var vein7 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery7.childs.push(vein7);
    LIBS.translateZ(vein7.POSITION_MATRIX, 0.2)
    var artery8 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery8);
    LIBS.translateY(artery8.POSITION_MATRIX, 1);
    LIBS.translateX(artery8.POSITION_MATRIX, 0.35);
    LIBS.translateZ(artery8.POSITION_MATRIX, 0.85);
    LIBS.rotateY(artery8.POSITION_MATRIX, -90*Math.PI/180);
    var vein8 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery8.childs.push(vein8);
    LIBS.translateZ(vein8.POSITION_MATRIX, 0.2);
     var artery9 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery9);
    LIBS.translateY(artery9.POSITION_MATRIX, 1);
    LIBS.translateX(artery9.POSITION_MATRIX, -0.1);
    LIBS.translateZ(artery9.POSITION_MATRIX, 0.85);
    LIBS.rotateY(artery9.POSITION_MATRIX, -90*Math.PI/180);
    var vein9 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery9.childs.push(vein9);
    LIBS.translateZ(vein9.POSITION_MATRIX, 0.2);
    var artery10 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery10);
    LIBS.translateY(artery10.POSITION_MATRIX, 1);
    LIBS.translateX(artery10.POSITION_MATRIX, -0.5);
    LIBS.translateZ(artery10.POSITION_MATRIX, 0.85);
    LIBS.rotateY(artery10.POSITION_MATRIX, -90*Math.PI/180);
    var vein10 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery10.childs.push(vein10);
    LIBS.translateZ(vein10.POSITION_MATRIX, 0.2);
    var artery11 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery11);
    LIBS.translateY(artery11.POSITION_MATRIX, 1);
    LIBS.translateX(artery11.POSITION_MATRIX, 0.55);
    LIBS.translateZ(artery11.POSITION_MATRIX, -0.85);
    LIBS.rotateY(artery11.POSITION_MATRIX, 90*Math.PI/180);
    var vein11 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery11.childs.push(vein11);
    LIBS.translateZ(vein11.POSITION_MATRIX, 0.2)
    var artery12 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery12);
    LIBS.translateY(artery12.POSITION_MATRIX, 1);
    LIBS.translateX(artery12.POSITION_MATRIX, 0.15);
    LIBS.translateZ(artery12.POSITION_MATRIX, -0.85);
    LIBS.rotateY(artery12.POSITION_MATRIX, 90*Math.PI/180);
    var vein12 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery12.childs.push(vein12);
    LIBS.translateZ(vein12.POSITION_MATRIX, 0.2);
     var artery13 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery13);
    LIBS.translateY(artery13.POSITION_MATRIX, 1);
    LIBS.translateX(artery13.POSITION_MATRIX, -0.3);
    LIBS.translateZ(artery13.POSITION_MATRIX, -0.85);
    LIBS.rotateY(artery13.POSITION_MATRIX, 90*Math.PI/180);
    var vein13 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery13.childs.push(vein13);
    LIBS.translateZ(vein13.POSITION_MATRIX, 0.2);
    var artery14 = new Arteries(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    flesh1.childs.push(artery14);
    LIBS.translateY(artery14.POSITION_MATRIX, 1);
    LIBS.translateX(artery14.POSITION_MATRIX, -0.65);
    LIBS.translateZ(artery14.POSITION_MATRIX, -0.85);
    LIBS.rotateY(artery14.POSITION_MATRIX, 90*Math.PI/180);
    var vein14 = new Veins(GL, SHADER_PROGRAM, _position, _color, _Mmatrix);
    artery14.childs.push(vein14);
    LIBS.translateZ(vein14.POSITION_MATRIX, 0.2);
    LIBS.translateZ(Body1.POSITION_MATRIX, -4);

    
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
        console.log(Math.floor(time/1000));
        if (Math.floor(time/1000) === 0) {
            LIBS.scaleY(cornea.POSITION_MATRIX, 1/1.01);
            LIBS.translateX(iris.POSITION_MATRIX, dt * 0.0001);
            LIBS.rotateY(iris.POSITION_MATRIX, dt * 0.0001);
            LIBS.rotateY(Joint5.POSITION_MATRIX, dt * 0.0005);
            console.log("rotate");
        }
        if (Math.floor(time/1000) === 5) {
            LIBS.scaleY(cornea.POSITION_MATRIX, 1.005);
            LIBS.translateX(iris.POSITION_MATRIX, -dt * 0.0001);
            LIBS.rotateY(iris.POSITION_MATRIX, -dt * 0.0001);
             LIBS.rotateY(Joint5.POSITION_MATRIX,- dt * 0.001);
            console.log("rotate");
        }
        if (Math.floor(time/1000) === 6) {
            LIBS.translateX(iris.POSITION_MATRIX, -dt * 0.0001);
            LIBS.rotateY(iris.POSITION_MATRIX, -dt * 0.0001);
            LIBS.rotateY(Joint5.POSITION_MATRIX,-dt * 0.0005);

            console.log("rotate");
        }
        if (Math.floor(time/1000) === 10) {
            LIBS.translateX(iris.POSITION_MATRIX, dt * 0.0001);
            LIBS.rotateY(iris.POSITION_MATRIX, dt * 0.0001);
            LIBS.rotateY(Joint5.POSITION_MATRIX, dt * 0.0005);

            console.log("rotate");
        
        }
        if (Math.floor(time/1000) === 12) {
            LIBS.rotateZ(Joint5.POSITION_MATRIX, dt * 0.0009);

            console.log("rotate");
        
        }
        //Arbitrary rotations
        if (Math.floor(time/1000) === 1) {
            LIBS.rotateX(Joint5.POSITION_MATRIX, dt * -0.0009);

            console.log("rotate");
        
        }
        if (Math.floor(time/1000) === 2) {
            LIBS.rotateX(Joint5.POSITION_MATRIX, dt * -0.00001);

            console.log("rotate");
        
        }
        if (Math.floor(time/1000) === 12) {
            LIBS.rotateX(Joint5.POSITION_MATRIX, dt * 0.0009);

            console.log("rotate");
        
        }



        if (Math.floor(time/1000)%2 === 0){
            LIBS.scaleY(artery1.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery1.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery3.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery3.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery5.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery5.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery7.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery7.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery9.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery9.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery11.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery11.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery13.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery13.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery2.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery2.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery4.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery4.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery6.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery6.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery8.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery8.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery10.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery10.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery12.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery12.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery14.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery14.POSITION_MATRIX, 1/1.001);
        }
        else{
            LIBS.scaleY(artery1.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery1.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery3.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery3.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery5.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery5.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery7.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery7.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery9.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery9.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery11.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery11.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery13.POSITION_MATRIX, 1/1.003);
            LIBS.scaleZ(artery13.POSITION_MATRIX, 1/1.001);
            LIBS.scaleY(artery2.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery2.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery4.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery4.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery6.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery6.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery8.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery8.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery10.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery10.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery12.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery12.POSITION_MATRIX, 1.001);
            LIBS.scaleY(artery14.POSITION_MATRIX, 1.003);
            LIBS.scaleZ(artery14.POSITION_MATRIX, 1.001);

        }
        LIBS.rotateZ(saw.POSITION_MATRIX, dt * 0.1);
        LIBS.rotateZ(Drill1.POSITION_MATRIX, dt * 0.01);
        LIBS.rotateZ(Drill2.POSITION_MATRIX, dt * 0.01);
        LIBS.rotateZ(Drill3.POSITION_MATRIX, dt * 0.01);
        LIBS.rotateZ(Drill4.POSITION_MATRIX, dt * 0.01);
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