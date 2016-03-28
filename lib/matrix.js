/**
 * Created by filles-dator on 2016-02-17.
 */
///<reference path="./vector.ts"/>
var Matrix = (function () {
    function Matrix(dimension) {
        this._dimension = dimension;
        for (var x = 0; x < dimension; x++) {
            for (var y = 0; y < dimension; y++) {
                this._elements[x][y] = 0;
            }
        }
    }
    Matrix.prototype.inverse = function () {
    };
    Matrix.prototype.transpose = function () {
        var transposedMatrix = this.clone();
        for (var x = 0; x < this._dimension; x++) {
            for (var y = 0; y < this._dimension; y++) {
                this._elements[x][y] = transposedMatrix[y][x];
            }
        }
    };
    Matrix.prototype.clone = function () {
        var newMatrix = new Matrix(this.dimension);
        for (var x = 0; x < this._dimension; x++) {
            for (var y = 0; y < this._dimension; y++) {
                newMatrix[x][y] = this._elements[x][y];
            }
        }
        return newMatrix;
    };
    Matrix.prototype.determinant = function () {
        var det = 0;
        var sign = 1;
        if (this._dimension == 1) {
            det = this._elements[0][0];
        }
        else {
            var b = new Matrix(this._dimension - 1);
            for (var x = 0; x < this._dimension; x++) {
                var p = 0;
                var q = 0;
                for (var i = 1; i < this._dimension; i++) {
                    for (var j = 0; j < this._dimension; j++) {
                        if (j != x) {
                            b._elements[p][q++] = this._elements[i][j];
                            if (q % (this._dimension - 1) == 0) {
                                p++;
                                q = 0;
                            }
                        }
                    }
                }
                det += this._elements[0][x] * this.determinant();
            }
        }
        return det;
    };
    Object.defineProperty(Matrix.prototype, "elements", {
        get: function () {
            return this._elements;
        },
        set: function (value) {
            this._elements = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "dimension", {
        get: function () {
            return this._dimension;
        },
        set: function (value) {
            this._dimension = value;
        },
        enumerable: true,
        configurable: true
    });
    return Matrix;
})();
//# sourceMappingURL=matrix.js.map