/**
 * Created by filles-dator on 2016-03-26.
 */
///<reference path="./threejs/three.d.ts"/>
///<reference path="./renderer.ts"/>
///<reference path="./app.ts"/>
var PointMass = (function () {
    function PointMass(position, mass, vertex_idx) {
        this._currentPos = position.clone();
        this._lastPos = position.clone();
        this._mass = mass;
        this._constraintForce = new THREE.Vector3(0, 0, 0);
        this._isAttatchment = false;
        this._vertexIndex = vertex_idx;
    }
    Object.defineProperty(PointMass.prototype, "lastPos", {
        get: function () {
            return this._lastPos;
        },
        set: function (value) {
            this._lastPos = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "currentPos", {
        get: function () {
            return this._currentPos;
        },
        set: function (value) {
            this._currentPos = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "mass", {
        get: function () {
            return this._mass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "isAttatchment", {
        get: function () {
            return this._isAttatchment;
        },
        set: function (value) {
            this._isAttatchment = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "constraintForce", {
        get: function () {
            return this._constraintForce;
        },
        set: function (value) {
            this._constraintForce = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointMass.prototype, "vertexIndex", {
        get: function () {
            return this._vertexIndex;
        },
        enumerable: true,
        configurable: true
    });
    return PointMass;
})();
//# sourceMappingURL=point_mass.js.map