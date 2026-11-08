export function white(a, b, c, stack, step) {
    var vertices = [];
    var faces = [];
    for (var i = 0; i <= stack; i++) {
    var t = -1 + (2 * i / stack);
    var z = t * c / 2;

    var radiusScale = Math.sqrt(1 - t * t);

    for (var j = 0; j <= step; j++) {
        var angle = j / step * 2 * Math.PI;

        var x = a * radiusScale * Math.cos(angle);
        var y = b * radiusScale * Math.sin(angle);

        vertices.push(x, y, z);
        vertices.push(150/255, 150/255, 150/255);
    }
}

    for (var i = 0; i < stack; i++) {
        for (var j = 0; j < step; j++) {
            var first = i * (step + 1) + j;
            var second = first + 1;
            var third = first + (step + 1);
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    var bottomCenter = vertices.length / 6;
    vertices.push(0, 0, -c / 2, 1, 1, 1);
    var topCenter = vertices.length / 6;
    vertices.push(0, 0, c / 2, 1, 1, 1);
    var topRingStart = stack * (step + 1);
    for (var j = 0; j < step; j++) {
        var next = j + 1;
        faces.push(bottomCenter, next, j);

        faces.push(topCenter, topRingStart + j, topRingStart + next);

    }

    return { vertices, faces };
}
export function eyesreal(a, b, c, stack, step) {
    var vertices = [];
    var faces = [];
    for (var i = 0; i <= stack; i++) {
        var z = -c / 2 + i / stack * c;
        for (var j = 0; j <= step; j++) {
            var angle = j / step * 2 * Math.PI;
            var x = a * Math.cos(angle);
            var y = b * Math.sin(angle);
            vertices.push(x, y, z);
            vertices.push(...[0, 120/255, 0]);
        }
    }

    for (var i = 0; i < stack; i++) {
        for (var j = 0; j < step; j++) {
            var first = i * (step + 1) + j;
            var second = first + 1;
            var third = first + (step + 1);
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    var bottomCenter = vertices.length / 6;
    vertices.push(0, 0, -c / 2, 0, 10/255, 0);
    var topCenter = vertices.length / 6;
    vertices.push(0, 0, c / 2, 0, 10/255, 0);
    var topRingStart = stack * (step + 1);
    for (var j = 0; j < step; j++) {
        var next = j + 1;
        faces.push(bottomCenter, next, j);

        faces.push(topCenter, topRingStart + j, topRingStart + next);

    }

    return { vertices, faces };
}