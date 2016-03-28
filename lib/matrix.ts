/**
 * Created by filles-dator on 2016-02-17.
 */
///<reference path="./vector.ts"/>

class Matrix {
    private _dimension:number;
    private _elements:number[][];

    constructor(dimension:number){
        this._dimension = dimension;
        for(var x=0; x<dimension; x++){
            for(var y=0; y<dimension; y++){
                this._elements[x][y] = 0;
            }
        }
    }

    public inverse():void {

    }

    public transpose():void {
        var transposedMatrix:Matrix = this.clone();
        for(var x=0; x<this._dimension; x++){
            for(var y=0; y<this._dimension; y++){
                this._elements[x][y] = transposedMatrix[y][x];
            }
        }
    }

    public clone():Matrix {
        var newMatrix:Matrix = new Matrix(this.dimension);
        for(var x=0; x<this._dimension; x++){
            for(var y=0; y<this._dimension; y++){
                newMatrix[x][y] = this._elements[x][y];
            }
        }
        return newMatrix;
    }

    public determinant():number {
        var det:number = 0;
        var sign:number = 1;

        if(this._dimension == 1){
            det = this._elements[0][0];
        }
        else{
            var b:Matrix = new Matrix(this._dimension-1);

            for(var x=0; x<this._dimension; x++){
                var p = 0;
                var q = 0;

                for(var i=1; i<this._dimension; i++){
                    for(var j=0; j<this._dimension; j++){
                        if(j!=x){
                            b._elements[p][q++] = this._elements[i][j];
                            if(q % (this._dimension-1) == 0){
                                p++;
                                q=0;
                            }
                        }
                    }
                }

                det += this._elements[0][x]*this.determinant()
            }
        }

        return det;
    }

    get elements():number[][] {
        return this._elements;
    }

    set elements(value:Array) {
        this._elements = value;
    }

    get dimension():number[] {
        return this._dimension;
    }

    set dimension(value:Array) {
        this._dimension = value;
    }
}