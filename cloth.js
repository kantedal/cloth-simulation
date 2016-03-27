/**
 * Created by filles-dator on 2016-03-26.
 */
///<reference path="./point_mass.ts"/>
///<reference path="./renderer.ts"/>
///<reference path="./app.ts"/>
///<reference path="./spring_constraint.ts"/>
///<reference path="./bend_constraint.ts"/>
///<reference path="./threejs/three.d.ts"/>
var Cloth = (function () {
    function Cloth(dimX, dimY, renderer) {
        this._dampingFactor = 0.01;
        this._dimensionX = dimX;
        this._dimensionY = dimY;
        this._renderer = renderer;
        this._points = [];
        this._constraints = [];
        this._bendConstraints = [];
        this._pointMesh = [];
        this._gravity = new THREE.Vector3(0, -9.82, 4);
        //var cloth_material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        var cloth_material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0x990099
        });
        var cloth_geometry = new THREE.PlaneGeometry(dimX - 1, dimY - 1, dimX - 1, dimY - 1);
        cloth_geometry.rotateY(Math.PI);
        cloth_geometry.translate(-0.5, -0.5, 0);
        this._clothMesh = new THREE.Mesh(cloth_geometry, cloth_material);
        this._renderer.scene.add(this._clothMesh);
        for (var x = 0; x < dimX; x++) {
            for (var y = 0; y < dimY; y++) {
                var new_pos = new THREE.Vector3(x - dimX / 2, y - dimY / 2, 0);
                var vertex_idx = 0;
                for (var i = 0; i < this._clothMesh.geometry.vertices.length; i++) {
                    var vert_pos = this._clothMesh.geometry.vertices[i].clone();
                    vert_pos.applyMatrix4(this._clothMesh.matrixWorld);
                    if (vert_pos.x == new_pos.x && vert_pos.y == new_pos.y) {
                        vertex_idx = i;
                        break;
                    }
                }
                new_pos.z = Math.sin(x);
                var new_point = new PointMass(new_pos, 1, vertex_idx);
                this._points.push(new_point);
            }
        }
        for (var x = 0; x < dimX; x++) {
            for (var y = 0; y < dimY; y++) {
                if (x != 0)
                    this._constraints.push(new SpringConstraint(1.1, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 1, y)], this._renderer));
                if (y != 0) {
                    this._constraints.push(new SpringConstraint(1.1, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y - 1)], this._renderer));
                }
                if (x != 0 && y != 0)
                    this._bendConstraints.push(new BendConstraint(Math.sqrt(2), this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 1, y - 1)], this._renderer));
                if (x != dimX - 1 && y != 0)
                    this._bendConstraints.push(new BendConstraint(Math.sqrt(2), this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x + 1, y - 1)], this._renderer));
                if (x > 1)
                    this._bendConstraints.push(new BendConstraint(2, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 2, y)], this._renderer));
                if (y > 1)
                    this._bendConstraints.push(new BendConstraint(2, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y - 2)], this._renderer));
            }
        }
        this._points[this.getClothIndexAt(dimX - 1, 0)].isAttatchment = true;
        this._points[this.getClothIndexAt(dimX - 1, dimY - 1)].isAttatchment = true;
    }
    Cloth.prototype.getClothIndexAt = function (x, y) {
        return x + this._dimensionX * y;
    };
    Cloth.prototype.update = function (time, delta) {
        for (var _i = 0, _a = this._constraints; _i < _a.length; _i++) {
            var constraint = _a[_i];
            constraint.solve();
        }
        for (var _b = 0, _c = this._bendConstraints; _b < _c.length; _b++) {
            var constraint = _c[_b];
            constraint.solve();
        }
        for (var i = 0; i < this._points.length; i++) {
            var point = this._points[i];
            if (!point.isAttatchment) {
                var acceleration = this._gravity.clone().add(point.constraintForce);
                var velocity = point.currentPos.clone().sub(point.lastPos);
                point.lastPos = point.currentPos.clone();
                point.currentPos = point.currentPos.clone().add(velocity.multiplyScalar(1.0 - this._dampingFactor)).add(acceleration.multiplyScalar(delta * delta));
                this._clothMesh.geometry.vertices[point.vertexIndex].copy(point.currentPos);
                this._clothMesh.geometry.verticesNeedUpdate = true;
            }
        }
        this._clothMesh.geometry.computeVertexNormals();
        this._clothMesh.geometry.computeFaceNormals();
    };
    Object.defineProperty(Cloth.prototype, "clothMesh", {
        get: function () {
            return this._clothMesh;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cloth.prototype, "points", {
        get: function () {
            return this._points;
        },
        set: function (value) {
            this._points = value;
        },
        enumerable: true,
        configurable: true
    });
    return Cloth;
})();
//# sourceMappingURL=cloth.js.map