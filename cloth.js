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
        this._dampingFactor = 0.03;
        this._stiffnessFactor = 0.5;
        this._dimensionX = dimX;
        this._dimensionY = dimY;
        this._renderer = renderer;
        this._gravity = new THREE.Vector3(0, -9.82, 0);
        this._windDirection = new THREE.Vector3(1, 0, 0);
        this._windForce = 10;
        this.generateCloth();
    }
    Cloth.prototype.generateCloth = function () {
        if (this._clothMesh)
            this._renderer.scene.remove(this._clothMesh);
        this._points = [];
        this._constraints = [];
        this._bendConstraints = [];
        this._pointMesh = [];
        //var cloth_material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        var cloth_material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0x444499,
            specular: 0x222222,
            shininess: 1000
        });
        var cloth_geometry = new THREE.PlaneGeometry(this._dimensionX - 1, this._dimensionY - 1, this._dimensionX - 1, this._dimensionY - 1);
        cloth_geometry.rotateY(Math.PI);
        cloth_geometry.translate(-0.5, -0.5, 0);
        this._clothMesh = new THREE.Mesh(cloth_geometry, cloth_material);
        if (!App.DEVELOPER_MODE)
            this._renderer.scene.add(this._clothMesh);
        for (var y = 0; y < this._dimensionY; y++) {
            for (var x = 0; x < this._dimensionX; x++) {
                var new_pos = new THREE.Vector3(x - this._dimensionX / 2, y - this._dimensionY / 2, 0);
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
        for (var y = 0; y < this._dimensionY; y++) {
            for (var x = 0; x < this._dimensionX; x++) {
                if (x != 0)
                    this._constraints.push(new SpringConstraint(1, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 1, y)], this._renderer));
                if (y != 0)
                    this._constraints.push(new SpringConstraint(1, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y - 1)], this._renderer));
                if (x != this._dimensionX - 1)
                    this._constraints.push(new SpringConstraint(1, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x + 1, y)], this._renderer));
                if (y != this._dimensionY - 1)
                    this._constraints.push(new SpringConstraint(1, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y + 1)], this._renderer));
                if (x != 0 && y != 0)
                    this._bendConstraints.push(new BendConstraint(Math.sqrt(2), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 1, y - 1)], this._renderer));
                if (x != this._dimensionX - 1 && y != 0)
                    this._bendConstraints.push(new BendConstraint(Math.sqrt(2), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x + 1, y - 1)], this._renderer));
                if (x != 0 && y != this._dimensionY - 1)
                    this._bendConstraints.push(new BendConstraint(Math.sqrt(2), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 1, y + 1)], this._renderer));
                if (x != this._dimensionX - 1 && y != this._dimensionY - 1)
                    this._bendConstraints.push(new BendConstraint(Math.sqrt(2), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x + 1, y + 1)], this._renderer));
                if (x > 1)
                    this._bendConstraints.push(new BendConstraint(2, this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 2, y)], this._renderer));
                if (y > 1)
                    this._bendConstraints.push(new BendConstraint(2, this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y - 2)], this._renderer));
                if (x < this._dimensionX - 2)
                    this._bendConstraints.push(new BendConstraint(2, this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x + 2, y)], this._renderer));
                if (y < this._dimensionY - 2)
                    this._bendConstraints.push(new BendConstraint(2, this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y + 2)], this._renderer));
            }
        }
        this._points[this.getClothIndexAt(0, this._dimensionY - 1)].isAttatchment = true;
        //this._points[this.getClothIndexAt(dimX/2-1, 0)].isAttatchment = true;
        this._points[this.getClothIndexAt(this._dimensionX - 1, this._dimensionY - 1)].isAttatchment = true;
    };
    Cloth.prototype.getClothIndexAt = function (x, y) {
        return x + this._dimensionX * y;
    };
    Cloth.prototype.update = function (time, delta) {
        if (this._clothMesh.geometry) {
            for (var _i = 0, _a = this._constraints; _i < _a.length; _i++) {
                var constraint = _a[_i];
                constraint.solve();
            }
            for (var _b = 0, _c = this._bendConstraints; _b < _c.length; _b++) {
                var constraint = _c[_b];
                constraint.solve();
            }
            this._clothMesh.geometry.verticesNeedUpdate = true;
            for (var i = 0; i < this._points.length; i++) {
                var point = this._points[i];
                if (!point.isAttatchment) {
                    //point.constraintForce = this._windDirection.multiplyScalar(this._windDirection.dot())
                    var acceleration = this._gravity.clone().add(point.constraintForce);
                    var velocity = point.currentPos.clone().sub(point.lastPos);
                    point.lastPos = point.currentPos.clone();
                    point.currentPos = point.currentPos.clone().add(velocity.multiplyScalar(1.0 - this._dampingFactor)).add(acceleration.multiplyScalar(delta * delta));
                }
                else {
                }
                this._clothMesh.geometry.vertices[point.vertexIndex].copy(point.currentPos);
            }
            this._clothMesh.geometry.verticesNeedUpdate = true;
            this._clothMesh.geometry.normalsNeedUpdate = true;
            this._clothMesh.geometry.computeFaceNormals();
            this._clothMesh.geometry.computeVertexNormals();
            this._clothMesh.geometry.computeBoundingSphere();
        }
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
    Object.defineProperty(Cloth.prototype, "dimensionY", {
        get: function () {
            return this._dimensionY;
        },
        set: function (value) {
            this._dimensionY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cloth.prototype, "dimensionX", {
        get: function () {
            return this._dimensionX;
        },
        set: function (value) {
            this._dimensionX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cloth.prototype, "gravity", {
        get: function () {
            return this._gravity;
        },
        set: function (value) {
            this._gravity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cloth.prototype, "dampingFactor", {
        get: function () {
            return this._dampingFactor;
        },
        set: function (value) {
            this._dampingFactor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cloth.prototype, "stiffnessFactor", {
        get: function () {
            return this._stiffnessFactor;
        },
        set: function (value) {
            this._stiffnessFactor = value;
            for (var _i = 0, _a = this._bendConstraints; _i < _a.length; _i++) {
                var constraint = _a[_i];
                constraint.stiffness = this._stiffnessFactor;
            }
        },
        enumerable: true,
        configurable: true
    });
    return Cloth;
})();
//# sourceMappingURL=cloth.js.map