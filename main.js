var meshes = [];
var mesh;
var device;
var mera;
var previousDate = Date.now();
var lastFPSValues = new Array(60);
var divCurrentFPS;
var divAverageFPS;
document.addEventListener("DOMContentLoaded", init, false);

window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function init() {
    canvas = document.getElementById("gameCanvas");
    divCurrentFPS = document.getElementById("currentFPS");
    divAverageFPS = document.getElementById("averageFPS");
    mera = new SoftRender.Camera();
    device = new SoftRender.Device(canvas);

    mera.Position = new Vector3(0, 0, 8);
    mera.Target = new Vector3(0, 0, 0);

    //device.LoadJSONFileAsync("monkey.json", LoadCompleteCallback);
    var mesh = new SoftRender.Mesh("Square", 4, 2);
    meshes.push(mesh);
    mesh.Vertices[0] = {};
    mesh.Vertices[1] = {};
    mesh.Vertices[2] = {};
    mesh.Vertices[3] = {};

    mesh.Vertices[0].Position = new Vector3(-2, 2, 0);
    mesh.Vertices[1].Position = new Vector3(2, 2, 0);
    mesh.Vertices[2].Position = new Vector3(-2, -2, 0);
    mesh.Vertices[3].Position = new Vector3(2, -2, 0);

    mesh.Vertices[0].Normal = new Vector3(0, 0, 1);
    mesh.Vertices[1].Normal = new Vector3(0, 0, 1);
    mesh.Vertices[2].Normal = new Vector3(0, 0, 1);
    mesh.Vertices[3].Normal = new Vector3(0, 0, 1);

    mesh.Vertices[0].UVCoord = new Vector2(0, 0);
    mesh.Vertices[1].UVCoord = new Vector2(2, 0);
    mesh.Vertices[2].UVCoord = new Vector2(0, -2);
    mesh.Vertices[3].UVCoord = new Vector2(2, -2);

    mesh.Faces[0] = { A: 0, B: 1, C: 2 };
    mesh.Faces[1] = { A: 1, B: 2, C: 3 };
    mesh.Texture = new Texture("timg.jpg", 512, 512);
    mesh.Rotation = new Vector3(-1.15, 0, 0);
    requestAnimationFrame(drawLoop);
}

function LoadCompleteCallback(loadedMeshes) {
    meshes = loadedMeshes;
    requestAnimationFrame(drawLoop);
}

function drawLoop() {
    var now = Date.now();
    var currentFPS = 1000 / (now - previousDate);
    previousDate = now;

    divCurrentFPS.textContent = currentFPS.toFixed(2);

    if (lastFPSValues.length < 60) {
        lastFPSValues.push(currentFPS);
    } else {
        lastFPSValues.shift();
        lastFPSValues.push(currentFPS);
        var totalValues = 0;
        for (var i = 0; i < lastFPSValues.length; i++) {
            totalValues += lastFPSValues[i];
        }

        var averageFPS = totalValues / lastFPSValues.length;
        divAverageFPS.textContent = averageFPS.toFixed(2);
    }
    //清除上一帧内容
    device.clear();

    //每帧调整旋转
    // for (var i = 0; i < meshes.length; i++) {
    //     // 每帧都稍微转动一下立方体
    //     meshes[i].Rotation.x += 0.01;
    //     //meshes[i].Rotation.y += 0.01;
    // }

    //重新计算矩阵渲染
    device.render(mera, meshes);
    //刷新后台缓冲
    device.present();

    requestAnimationFrame(drawLoop);
}
