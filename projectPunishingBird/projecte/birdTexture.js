function createTexture(GL, draw) {
    var canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;

    var context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Could not create the bird texture canvas.");
    }

    draw(context, canvas.width, canvas.height);

    var texture = GL.createTexture();
    if (!texture) {
        throw new Error("Could not create a WebGL texture for the bird.");
    }

    GL.bindTexture(GL.TEXTURE_2D, texture);
    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, canvas);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.generateMipmap(GL.TEXTURE_2D);

    return texture;
}

function createSolidTexture(GL, color) {
    return createTexture(GL, function (context, width, height) {
        context.fillStyle = color;
        context.fillRect(0, 0, width, height);
    });
}

export function createBirdTextures(GL) {
    var body = createTexture(GL, function (context, width, height) {
        context.fillStyle = "#f4f4f2";
        context.fillRect(0, 0, width, height);

        var shading = context.createLinearGradient(0, 0, 0, height);
        shading.addColorStop(0, "rgba(255, 255, 255, 0.24)");
        shading.addColorStop(1, "rgba(110, 120, 128, 0.12)");
        context.fillStyle = shading;
        context.fillRect(0, 0, width, height);

        // The body mesh faces +Z at longitude v=0.25; this places the bib on its chest.
        var centerX = width * 0.25;
        var centerY = height * 0.62;
        context.beginPath();
        context.moveTo(centerX - width * 0.12, centerY - height * 0.08);
        context.bezierCurveTo(centerX - width * 0.16, centerY - height * 0.2,
            centerX - width * 0.08, centerY - height * 0.24, centerX - width * 0.02, centerY - height * 0.16);
        context.bezierCurveTo(centerX + width * 0.04, centerY - height * 0.25,
            centerX + width * 0.13, centerY - height * 0.2, centerX + width * 0.11, centerY - height * 0.08);
        context.bezierCurveTo(centerX + width * 0.19, centerY + height * 0.02,
            centerX + width * 0.14, centerY + height * 0.14, centerX + width * 0.04, centerY + height * 0.15);
        context.bezierCurveTo(centerX - width * 0.05, centerY + height * 0.19,
            centerX - width * 0.17, centerY + height * 0.1, centerX - width * 0.14, centerY + height * 0.01);
        context.bezierCurveTo(centerX - width * 0.2, centerY - height * 0.02,
            centerX - width * 0.18, centerY - height * 0.08, centerX - width * 0.12, centerY - height * 0.08);
        context.closePath();

        var bib = context.createLinearGradient(0, centerY - height * 0.2, 0, centerY + height * 0.2);
        bib.addColorStop(0, "#e33238");
        bib.addColorStop(1, "#bd101a");
        context.fillStyle = bib;
        context.fill();
        context.lineWidth = 4;
        context.strokeStyle = "#8c2027";
        context.stroke();
    });

    return {
        body: body,
        white: createSolidTexture(GL, "#f3f3f1"),
        wing: createSolidTexture(GL, "#c7d0d3"),
        blue: createSolidTexture(GL, "#75b9d1"),
        black: createSolidTexture(GL, "#17191b")
    };
}
