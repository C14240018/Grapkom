export function drill(a, b, c, stack, step) {
    var vertices = [];
    var faces = [];
    var apex = 0;
    var segments = Math.max(1, stack);
    var slices = Math.max(3, step);

    vertices.push(0, 0, c, 30/255, 74/255, 50/255);

    for (var i = 1; i <= segments; i++) {
        var parameter = i / segments;
        var radius = Math.tan(parameter);
        var z = c * Math.cosh(parameter);
        for (var j = 0; j <= slices; j++) {
            var angle = j / slices * 2 * Math.PI;
            var x = a * radius * Math.cos(angle);
            var y = b * radius * Math.sin(angle);
            vertices.push(x, y, z);
            vertices.push(...[30/255, 74/255, 50/255]);
        }
    }

    for (var j = 0; j < slices; j++) {
        faces.push(apex, 1 + j + 1, 1 + j);
    }

    for (var i = 0; i < segments - 1; i++) {
        var lowerRing = 1 + i * (slices + 1);
        var upperRing = lowerRing + slices + 1;
        for (var j = 0; j < slices; j++) {
            var first = lowerRing + j;
            var second = first + 1;
            var third = upperRing + j;
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    return { vertices, faces };
}
export function Minidrill(a, b, c, stack, step) {
    var vertices = [];
    var faces = [];
    var apex = 0;
    var segments = Math.max(1, stack);
    var slices = Math.max(3, step);

    vertices.push(0, 0, c, 30/255, 74/255, 50/255);

    for (var i = 1; i <= segments; i++) {
        var parameter = i / segments;
        var radius = Math.tan(parameter);
        var z = c * Math.cosh(parameter);
        for (var j = 0; j <= slices; j++) {
            var angle = j / slices * 2 * Math.PI;
            var x = a * radius * Math.cos(angle);
            var y = b * radius * Math.sin(angle);
            vertices.push(x, y, z);
            vertices.push(...[10/255, 10/255, 50/255]);
        }
    }

    for (var j = 0; j < slices; j++) {
        faces.push(apex, 1 + j + 1, 1 + j);
    }

    for (var i = 0; i < segments - 1; i++) {
        var lowerRing = 1 + i * (slices + 1);
        var upperRing = lowerRing + slices + 1;
        for (var j = 0; j < slices; j++) {
            var first = lowerRing + j;
            var second = first + 1;
            var third = upperRing + j;
            var fourth = third + 1;
            faces.push(first, second, fourth);
            faces.push(first, fourth, third);
        }
    }

    return { vertices, faces };
}
