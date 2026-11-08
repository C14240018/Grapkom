import { MyObject } from "./projectPunishingBird/projecte/myObject.js";

function subtract(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    };
}

function cross(a, b) {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    };
}

function normalize(vector) {
    var length = Math.hypot(vector.x, vector.y, vector.z);
    if (length < 1e-8) {
        throw new Error("Curve has a point with no valid tangent.");
    }

    return {
        x: vector.x / length,
        y: vector.y / length,
        z: vector.z / length
    };
}

function projectOff(vector, direction) {
    var dot = vector.x * direction.x + vector.y * direction.y + vector.z * direction.z;
    return {
        x: vector.x - dot * direction.x,
        y: vector.y - dot * direction.y,
        z: vector.z - dot * direction.z
    };
}

function getCurvePoint(curve, t) {
    var point = curve(t);
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || !Number.isFinite(point.z)) {
        throw new Error("Curve function must return finite x, y, and z coordinates.");
    }

    return { x: point.x, y: point.y, z: point.z };
}

function createEndpointCurve(options) {
    var start = options.start || { x: 0, y: 0, z: 0 };
    var end = options.end || { x: 1, y: 0, z: 0 };
    var bend = options.bend === undefined ? 0 : options.bend;

    [start, end].forEach(function (point) {
        if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || !Number.isFinite(point.z)) {
            throw new TypeError("Curve start and end must have finite x, y, and z coordinates.");
        }
    });
    if (!Number.isFinite(bend)) {
        throw new TypeError("Curve bend must be a finite number.");
    }

    return function (t) {
        var bendAmount = 4 * bend * t * (1 - t);
        return {
            x: start.x + (end.x - start.x) * t,
            y: start.y + (end.y - start.y) * t + bendAmount,
            z: start.z + (end.z - start.z) * t
        };
    };
}

function createCurveMesh(curve, radius, segments, radialSegments) {
    var points = [];
    for (var i = 0; i <= segments; i++) {
        points.push(getCurvePoint(curve, i / segments));
    }

    var vertices = [];
    var faces = [];
    var previousNormal = null;

    for (var sample = 0; sample <= segments; sample++) {
        var previousPoint = points[Math.max(0, sample - 1)];
        var nextPoint = points[Math.min(segments, sample + 1)];
        var tangent = normalize(subtract(nextPoint, previousPoint));
        var normal;

        if (previousNormal) {
            normal = projectOff(previousNormal, tangent);
            if (Math.hypot(normal.x, normal.y, normal.z) < 1e-8) {
                previousNormal = null;
            }
        }

        if (!previousNormal) {
            var reference = Math.abs(tangent.x) < 0.9
                ? { x: 1, y: 0, z: 0 }
                : { x: 0, y: 1, z: 0 };
            normal = normalize(cross(tangent, reference));
        } else {
            normal = normalize(normal);
        }

        var binormal = normalize(cross(tangent, normal));
        var center = points[sample];
        var u = sample / segments;

        for (var side = 0; side <= radialSegments; side++) {
            var angle = side / radialSegments * 2 * Math.PI;
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);

            vertices.push(
                center.x + radius * (normal.x * cos + binormal.x * sin),
                center.y + radius * (normal.y * cos + binormal.y * sin),
                center.z + radius * (normal.z * cos + binormal.z * sin),
                u,
                side / radialSegments,
                1 - u
            );
        }

        previousNormal = normal;
    }

    for (var ring = 0; ring < segments; ring++) {
        for (var sideIndex = 0; sideIndex < radialSegments; sideIndex++) {
            var first = ring * (radialSegments + 1) + sideIndex;
            var second = first + radialSegments + 1;

            faces.push(first, first + 1, second);
            faces.push(first + 1, second + 1, second);
        }
    }

    return { vertices: vertices, faces: faces };
}

export class Curve extends MyObject {
    constructor(
        GL,
        SHADER_PROGRAM,
        position,
        color,
        Mmatrix,
        curve = function (t) {
            return {
                x: 2 * t - 1,
                y: Math.sin(t * 2 * Math.PI),
                z: 0
            };
        },
        radius = 0.1,
        segments = 64,
        radialSegments = 8
    ) {
        super(GL, SHADER_PROGRAM, position, color, Mmatrix);

        if (typeof curve === "function") {
            this.curveFunction = curve;
        } else if (curve && typeof curve === "object") {
            this.curveOptions = {
                start: curve.start || { x: 0, y: 0, z: 0 },
                end: curve.end || { x: 1, y: 0, z: 0 },
                bend: curve.bend === undefined ? 0 : curve.bend
            };
            this.curveFunction = createEndpointCurve(this.curveOptions);
        } else {
            throw new TypeError("Curve must be a function or an object with start, end, and bend values.");
        }
        if (!Number.isFinite(radius) || radius <= 0) {
            throw new RangeError("Curve radius must be a positive finite number.");
        }
        if (!Number.isInteger(segments) || segments < 1) {
            throw new RangeError("Curve segments must be a positive integer.");
        }
        if (!Number.isInteger(radialSegments) || radialSegments < 3) {
            throw new RangeError("Curve radialSegments must be an integer of at least 3.");
        }
        if ((segments + 1) * (radialSegments + 1) > 65536) {
            throw new RangeError("Curve mesh exceeds the 16-bit index limit.");
        }

        var mesh = createCurveMesh(this.curveFunction, radius, segments, radialSegments);
        this.vertex = mesh.vertices;
        this.faces = mesh.faces;
    }
}
