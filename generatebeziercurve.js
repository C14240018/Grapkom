export function bezierCurve(
    controlPoints,
    radius = 0.05,
    segments = 32,
    radialSegments = 8,
    color = [150/255, 1/255, 30/255]
) {
    if (!Array.isArray(controlPoints) || controlPoints.length !== 4) {
        throw new TypeError("controlPoints must contain four 3D points");
    }
    if (controlPoints.some(point =>
        !Array.isArray(point) ||
        point.length !== 3 ||
        point.some(coordinate => !Number.isFinite(coordinate))
    )) {
        throw new TypeError("Each control point must contain three finite coordinates");
    }
    if (!Number.isFinite(radius) || radius <= 0) {
        throw new RangeError("radius must be a positive finite number");
    }
    if (!Number.isInteger(segments) || segments < 1) {
        throw new RangeError("segments must be a positive integer");
    }
    if (!Number.isInteger(radialSegments) || radialSegments < 3) {
        throw new RangeError("radialSegments must be an integer of at least 3");
    }
    if (!Array.isArray(color) || color.length !== 3 || color.some(channel => !Number.isFinite(channel))) {
        throw new TypeError("color must contain three finite channels");
    }
    if ((segments + 1) * (radialSegments + 1) > 65535) {
        throw new RangeError("The generated curve must contain no more than 65535 vertices");
    }

    var vertices = [];
    var faces = [];
    var points = [];
    var tangents = [];
    var [p0, p1, p2, p3] = controlPoints;

    for (var i = 0; i <= segments; i++) {
        var t = i / segments;
        var inverseT = 1 - t;
        var point = [0, 0, 0];
        var tangent = [0, 0, 0];

        for (var axis = 0; axis < 3; axis++) {
            point[axis] =
                inverseT ** 3 * p0[axis] +
                3 * inverseT ** 2 * t * p1[axis] +
                3 * inverseT * t ** 2 * p2[axis] +
                t ** 3 * p3[axis];
            tangent[axis] =
                3 * inverseT ** 2 * (p1[axis] - p0[axis]) +
                6 * inverseT * t * (p2[axis] - p1[axis]) +
                3 * t ** 2 * (p3[axis] - p2[axis]);
        }

        points.push(point);
        tangents.push(tangent);
    }

    for (var i = 0; i <= segments; i++) {
        var tangent = tangents[i];
        var tangentLength = Math.hypot(tangent[0], tangent[1], tangent[2]);

        if (tangentLength < 1e-8) {
            var previous = points[Math.max(0, i - 1)];
            var next = points[Math.min(segments, i + 1)];
            tangent = [
                next[0] - previous[0],
                next[1] - previous[1],
                next[2] - previous[2]
            ];
            tangentLength = Math.hypot(tangent[0], tangent[1], tangent[2]);
        }
        if (tangentLength < 1e-8) {
            throw new RangeError("The control points must define a non-degenerate curve");
        }

        tangent = tangent.map(component => component / tangentLength);
        var reference = Math.abs(tangent[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
        var normal = [
            tangent[1] * reference[2] - tangent[2] * reference[1],
            tangent[2] * reference[0] - tangent[0] * reference[2],
            tangent[0] * reference[1] - tangent[1] * reference[0]
        ];
        var normalLength = Math.hypot(normal[0], normal[1], normal[2]);
        normal = normal.map(component => component / normalLength);
        var binormal = [
            tangent[1] * normal[2] - tangent[2] * normal[1],
            tangent[2] * normal[0] - tangent[0] * normal[2],
            tangent[0] * normal[1] - tangent[1] * normal[0]
        ];

        for (var j = 0; j <= radialSegments; j++) {
            var angle = j / radialSegments * 2 * Math.PI;
            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);

            vertices.push(
                points[i][0] + radius * (normal[0] * cosAngle + binormal[0] * sinAngle),
                points[i][1] + radius * (normal[1] * cosAngle + binormal[1] * sinAngle),
                points[i][2] + radius * (normal[2] * cosAngle + binormal[2] * sinAngle),
                color[0],
                color[1],
                color[2]
            );
        }
    }

    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < radialSegments; j++) {
            var first = i * (radialSegments + 1) + j;
            var second = first + 1;
            var third = first + radialSegments + 1;
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    return { vertices, faces };
}
export function bezierCurveBlue(
    controlPoints,
    radius = 0.05,
    segments = 32,
    radialSegments = 8,
    color = [100/255, 1/255, 50/255]
) {
    if (!Array.isArray(controlPoints) || controlPoints.length !== 4) {
        throw new TypeError("controlPoints must contain four 3D points");
    }
    if (controlPoints.some(point =>
        !Array.isArray(point) ||
        point.length !== 3 ||
        point.some(coordinate => !Number.isFinite(coordinate))
    )) {
        throw new TypeError("Each control point must contain three finite coordinates");
    }
    if (!Number.isFinite(radius) || radius <= 0) {
        throw new RangeError("radius must be a positive finite number");
    }
    if (!Number.isInteger(segments) || segments < 1) {
        throw new RangeError("segments must be a positive integer");
    }
    if (!Number.isInteger(radialSegments) || radialSegments < 3) {
        throw new RangeError("radialSegments must be an integer of at least 3");
    }
    if (!Array.isArray(color) || color.length !== 3 || color.some(channel => !Number.isFinite(channel))) {
        throw new TypeError("color must contain three finite channels");
    }
    if ((segments + 1) * (radialSegments + 1) > 65535) {
        throw new RangeError("The generated curve must contain no more than 65535 vertices");
    }

    var vertices = [];
    var faces = [];
    var points = [];
    var tangents = [];
    var [p0, p1, p2, p3] = controlPoints;

    for (var i = 0; i <= segments; i++) {
        var t = i / segments;
        var inverseT = 1 - t;
        var point = [0, 0, 0];
        var tangent = [0, 0, 0];

        for (var axis = 0; axis < 3; axis++) {
            point[axis] =
                inverseT ** 3 * p0[axis] +
                3 * inverseT ** 2 * t * p1[axis] +
                3 * inverseT * t ** 2 * p2[axis] +
                t ** 3 * p3[axis];
            tangent[axis] =
                3 * inverseT ** 2 * (p1[axis] - p0[axis]) +
                6 * inverseT * t * (p2[axis] - p1[axis]) +
                3 * t ** 2 * (p3[axis] - p2[axis]);
        }

        points.push(point);
        tangents.push(tangent);
    }

    for (var i = 0; i <= segments; i++) {
        var tangent = tangents[i];
        var tangentLength = Math.hypot(tangent[0], tangent[1], tangent[2]);

        if (tangentLength < 1e-8) {
            var previous = points[Math.max(0, i - 1)];
            var next = points[Math.min(segments, i + 1)];
            tangent = [
                next[0] - previous[0],
                next[1] - previous[1],
                next[2] - previous[2]
            ];
            tangentLength = Math.hypot(tangent[0], tangent[1], tangent[2]);
        }
        if (tangentLength < 1e-8) {
            throw new RangeError("The control points must define a non-degenerate curve");
        }

        tangent = tangent.map(component => component / tangentLength);
        var reference = Math.abs(tangent[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
        var normal = [
            tangent[1] * reference[2] - tangent[2] * reference[1],
            tangent[2] * reference[0] - tangent[0] * reference[2],
            tangent[0] * reference[1] - tangent[1] * reference[0]
        ];
        var normalLength = Math.hypot(normal[0], normal[1], normal[2]);
        normal = normal.map(component => component / normalLength);
        var binormal = [
            tangent[1] * normal[2] - tangent[2] * normal[1],
            tangent[2] * normal[0] - tangent[0] * normal[2],
            tangent[0] * normal[1] - tangent[1] * normal[0]
        ];

        for (var j = 0; j <= radialSegments; j++) {
            var angle = j / radialSegments * 2 * Math.PI;
            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);

            vertices.push(
                points[i][0] + radius * (normal[0] * cosAngle + binormal[0] * sinAngle),
                points[i][1] + radius * (normal[1] * cosAngle + binormal[1] * sinAngle),
                points[i][2] + radius * (normal[2] * cosAngle + binormal[2] * sinAngle),
                color[0],
                color[1],
                color[2]
            );
        }
    }

    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < radialSegments; j++) {
            var first = i * (radialSegments + 1) + j;
            var second = first + 1;
            var third = first + radialSegments + 1;
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    return { vertices, faces };
}