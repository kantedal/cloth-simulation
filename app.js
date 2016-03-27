/**
 * Created by filles-dator on 2016-03-26.
 */
///<reference path="./renderer.ts"/>
///<reference path="./cloth.ts"/>
///<reference path="./point_mass.ts"/>
///<reference path="./math/stats.d.ts"/>
///<reference path="./threejs/three.d.ts"/>
var App = (function () {
    function App() {
        var _this = this;
        this.mouseDown = function (ev) {
            if (_this._shouldDrag) {
                for (var _i = 0, _a = _this._cloth.points; _i < _a.length; _i++) {
                    var point = _a[_i];
                    if (point.currentPos.distanceTo(_this._raycasterSelector.position) < Math.sqrt(0.5 * 0.5 * 2)) {
                        _this._selectedPointMass = point;
                        _this._selectedPointMass.isAttatchment = true;
                        break;
                    }
                }
            }
        };
        this.mouseUp = function (ev) {
            if (_this._selectedPointMass != null) {
                _this._selectedPointMass.isAttatchment = false;
                _this._selectedPointMass = null;
            }
        };
        this.mouseMove = function (ev) {
            _this._mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
            _this._mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
            if (_this._selectedPointMass != null) {
                _this._selectedPointMass.currentPos.copy(_this._raycasterSelector.position);
            }
        };
        this._renderer = new Renderer();
        this._clock = new THREE.Clock();
        this._stats = new Stats();
        this._cloth = new Cloth(30, 30, this._renderer);
        this._raycaster = new THREE.Raycaster();
        this._raycasterIntersects = [];
        this._mouse = new THREE.Vector2(0, 0);
        this._shouldDrag = false;
        var geometry = new THREE.SphereGeometry(0.3, 8, 8);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this._raycasterSelector = new THREE.Mesh(geometry, material);
        this._renderer.scene.add(this._raycasterSelector);
        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);
        window.addEventListener("mousemove", this.mouseMove);
    }
    App.prototype.start = function () {
        this._renderer.start();
        this._stats.setMode(0); // 0: fps, 1: ms, 2: mb
        this._stats.domElement.style.position = 'absolute';
        this._stats.domElement.style.left = '20px';
        this._stats.domElement.style.top = '20px';
        document.body.appendChild(this._stats.domElement);
        this.update();
    };
    App.prototype.update = function () {
        var _this = this;
        this._stats.begin();
        this._raycaster.setFromCamera(this._mouse, this._renderer.camera);
        this._raycasterIntersects = this._raycaster.intersectObject(this._cloth.clothMesh);
        if (this._raycasterIntersects.length != 0) {
            this._shouldDrag = true;
            this._raycasterSelector.visible = true;
            this._raycasterSelector.position.copy(this._raycasterIntersects[0].point.clone());
        }
        else {
            if (this._selectedPointMass == null) {
                this._shouldDrag = false;
                this._raycasterSelector.visible = false;
            }
        }
        this._cloth.update(this._clock.getElapsedTime(), 0.01);
        this._renderer.render();
        this._stats.end();
        requestAnimationFrame(function () { return _this.update(); });
    };
    App.DEVELOPER_MODE = false;
    return App;
})();
window.onload = function () {
    var app = new App();
    app.start();
};
//# sourceMappingURL=app.js.map