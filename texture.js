var Texture = (function() {
    function Texture(filename, width, height) {
        this.width = width;
        this.height = height;
        this.load(filename);
    };

    Texture.prototype.load = function(filename) {
        var _this = this;
        var imageTexture = new Image();
        imageTexture.width = this.width;
        imageTexture.height = this.height;
        imageTexture.src = filename;
        imageTexture.onload = function() {
            var internalCanvas = document.createElement("canvas");
            internalCanvas.width = _this.width;
            internalCanvas.height = _this.height;
            var internalContext = internalCanvas.getContext("2d");
            internalContext.drawImage(imageTexture, 0, 0);
            _this.internalBuffer = internalContext.getImageData(0, 0, _this.width, _this.height);
            _this.textureData = _this.internalBuffer.data;
        };
    };

    Texture.prototype.map = function(u, v) {
        if (this.textureData) {
            var x = (Math.abs(u * this.width) % this.width) >> 0;
            var y = (Math.abs(v * this.height) % this.height) >> 0;
            var index = (x + this.width * y) * 4;

            var r = this.textureData[index] / 255;
            var g = this.textureData[index + 1] / 255;
            var b = this.textureData[index + 2] / 255;
            var a = this.textureData[index + 3] / 255;
            return new Color4(r, g, b, a);
        } else {
            return new Color4(1, 1, 1, 1);
        }
    };
    return Texture;
})();
SoftRender.Texture = Texture;
