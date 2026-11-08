import { MyObject } from "./projectPunishingBird/projecte/myObject.js";
import { createGridMesh } from "./projectPunishingBird/projecte/surfaceMesh.js";

export class EllipticParaboloid extends MyObject {
    constructor(GL, SHADER_PROGRAM, position, color, Mmatrix, a = 1.2, b = 1, height = 2, stack = 32, step = 32) {
        super(GL, SHADER_PROGRAM, position, color, Mmatrix);

        var mesh = createGridMesh(stack, step, function (u, v) {
            var angle = v * 2 * Math.PI;
            var radius = u;

            return {
                x: a * radius * Math.cos(angle),
                y: height * radius * radius,
                z: b * radius * Math.sin(angle)
            };
        });

        this.vertex = mesh.vertices;
        this.faces = mesh.faces;
    }
}
