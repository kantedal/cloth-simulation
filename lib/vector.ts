/**
 * Created by filles-dator on 2016-02-17.
 */

class Vector {
    private _dimension : number;
    private _elements : number[];

    constructor(dimension : number){
        this._dimension = dimension;
        for(var dim=0; dim<dimension; dim++){
            this._elements[dim] = 0;
        }
    }

    public angleBetween(vec:Vector){
        return Math.acos(Vector.dotProduct(this,vec)/(this.magnitude()*vec.magnitude()));
    }

    public magnitude():number {
        var mag = 0;
        for(var dim=0; dim<this._dimension; dim++){
            mag += Math.pow(this._elements[dim], 2);
        }
        return Math.sqrt(mag);
    }

    public static dotProduct(vec1:Vector, vec2:Vector):number{
        if(vec1.dimension == vec2.dimension){
            var result:number = 0;
            for(var dim=0; dim<vec1.dimension; dim++){
                result += vec1.elements[dim] * vec2.elements[dim];
            }
            return result;
        }
        else {
            console.log("Dimension missmatch");
            return 0;
        }
    }

    get dimension():number {
        return this._dimension;
    }

    set dimension(value:number) {
        this._dimension = value;
    }

    get elements():number[] {
        return this._elements;
    }

    set elements(value:Array) {
        this._elements = value;
    }
}