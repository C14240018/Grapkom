import { MyObject } from "./projectPunishingBird/projecte/myObject.js";
import { createGridMesh } from "./projectPunishingBird/projecte/surfaceMesh.js";

export class Ellipsoid extends MyObject {
    constructor(GL, SHADER_PROGRAM, position, color, Mmatrix, a = 1, b = 1, c = 1, stack = 32, step = 32) {
        super(GL, SHADER_PROGRAM, position, color, Mmatrix);

        var mesh = createGridMesh(stack, step, function (u, v) {
            var latitude = u * Math.PI - Math.PI / 2;
            var longitude = v * 2 * Math.PI;
            var radius = Math.cos(latitude);

            return {
                x: a * radius * Math.cos(longitude),
                y: b * Math.sin(latitude),
                z: c * radius * Math.sin(longitude)
            };
        });

        this.vertex = mesh.vertices;
        this.faces = mesh.faces;
    }
}