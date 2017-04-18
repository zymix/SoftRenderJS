var meshes = [];
var mesh;
var device;
var mera;

document.addEventListener("DOMContentLoaded", init, false);

window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function init(){
	canvas = document.getElementById("gameCanvas");
	mera = new SoftRender.Camera();
	device = new SoftRender.Device(canvas);
	
	mera.Position = new Vector3(0, 0, 10);  
    mera.Target = new Vector3(0, 0, 0); 

	device.LoadJSONFileAsync("monkey.json", LoadCompleteCallback);
}

function LoadCompleteCallback(loadedMeshes){
	meshes = loadedMeshes;
	requestAnimationFrame(drawLoop);
}

function drawLoop(){
	//清除上一帧内容
	device.clear();

	//每帧调整旋转
    for (var i = 0; i < meshes.length; i++) {
        // 每帧都稍微转动一下立方体
        meshes[i].Rotation.x += 0.01;
        meshes[i].Rotation.y += 0.01;
    }

    //重新计算矩阵渲染
	device.render(mera, meshes);
	//刷新后台缓冲
	device.present();

	requestAnimationFrame(drawLoop);
}