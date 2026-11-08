import { MyObject } from "./projectPunishingBird/projecte/myObject.js";
import { createGridMesh } from "./projectPunishingBird/projecte/surfaceMesh.js";

export class Cone extends MyObject {
    constructor(GL, SHADER_PROGRAM, position, color, Mmatrix, a = 1, b = 1, height = 2, stack = 32, step = 32) {
        super(GL, SHADER_PROGRAM, position, color, Mmatrix);

        var mesh = createGridMesh(stack, step, function (u, v) {
            var angle = v * 2 * Math.PI;
            var radius = 1 - u;

            return {
                x: a * radius * Math.cos(angle),
                y: height * (u - 0.5),
                z: b * radius * Math.sin(angle)
            };
        });

        var centerIndex = mesh.vertices.length / 6;
        mesh.vertices.push(0, -height / 2, 0, 0.5, 0.5, 0);

        for (var j = 0; j < step; j++) {
            var first = j;
            var second = j + 1;
            mesh.faces.push(centerIndex, first, second);
        }

        this.vertex = mesh.vertices;
        this.faces = mesh.faces;
    }
}
