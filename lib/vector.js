/**
 * Created by filles-dator on 2016-02-17.
 */
var Vector = (function () {
    function Vector(dimension) {
        this._dimension = dimension;
        for (var dim = 0; dim < dimension; dim++) {
            this._elements[dim] = 0;
        }
    }
    Vector.prototype.angleBetween = function (vec) {
        return Math.acos(Vector.dotProduct(this, vec) / (this.magnitude() * vec.magnitude()));
    };
    Vector.prototype.magnitude = function () {
        var mag = 0;
        for (var dim = 0; dim < this._dimension; dim++) {
            mag += Math.pow(this._elements[dim], 2);
        }
        return Math.sqrt(mag);
    };
    Vector.dotProduct = function (vec1, vec2) {
        if (vec1.dimension == vec2.dimension) {
            var result = 0;
            for (var dim = 0; dim < vec1.dimension; dim++) {
                result += vec1.elements[dim] * vec2.elements[dim];
            }
            return result;
        }
        else {
            console.log("Dimension missmatch");
            return 0;
        }
    };
    Object.defineProperty(Vector.prototype, "dimension", {
        get: function () {
            return this._dimension;
        },
        set: function (value) {
            this._dimension = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "elements", {
        get: function () {
            return this._elements;
        },
        set: function (value) {
            this._elements = value;
        },
        enumerable: true,
        configurable: true
    });
    return Vector;
})();
//# sourceMappingURL=vector.js.map