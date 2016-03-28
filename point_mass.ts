/**
 * Created by filles-dator on 2016-03-26.
 */

///<reference path="./threejs/three.d.ts"/>
///<reference path="./renderer.ts"/>
///<reference path="./app.ts"/>

class PointMass {
    private _currentPos: THREE.Vector3;
    private _lastPos: THREE.Vector3;
    private _constraintForce: THREE.Vector3;
    private _mass: number;
    private _vertexIndex: number
    private _isAttatchment: boolean;

    constructor(position: THREE.Vector3, mass: number, vertex_idx: number){
        this._currentPos = position.clone();
        this._lastPos = position.clone();
        this._mass = mass;
        this._constraintForce = new THREE.Vector3(0,0,0);
        this._isAttatchment = false;
        this._vertexIndex = vertex_idx;
    }

    get lastPos():THREE.Vector3 {
        return this._lastPos;
    }

    set lastPos(value:THREE.Vector3) {
        this._lastPos = value;
    }

    get currentPos():THREE.Vector3 {
        return this._currentPos;
    }

    set currentPos(value:THREE.Vector3) {
        this._currentPos = value;
    }

    get mass():number {
        return this._mass;
    }

    get isAttatchment():boolean {
        return this._isAttatchment;
    }

    set isAttatchment(value:boolean) {
        this._isAttatchment = value;
    }

    get constraintForce():THREE.Vector3 {
        return this._constraintForce;
    }

    set constraintForce(value:THREE.Vector3) {
        this._constraintForce = value;
    }

    get vertexIndex():number {
        return this._vertexIndex;
    }
}