/**
 * Created by filles-dator on 2016-03-26.
 */

///<reference path="./point_mass.ts"/>
///<reference path="./renderer.ts"/>

class BendConstraint {
    private _renderer: Renderer;
    private _restingDistance: number = 1;
    private _tearingDistance: number = 2;
    private _stiffness: number;

    private _pointMassA: PointMass;
    private _pointMassB: PointMass;

    constructor(restingDistance: number, stiffness: number, pointMassA: PointMass, pointMassB: PointMass, renderer: Renderer){
        this._renderer = renderer;
        this._restingDistance = restingDistance;
        this._stiffness = stiffness;
        this._pointMassA = pointMassA;
        this._pointMassB = pointMassB;
    }


    public solve() {
        var delta = this._pointMassB.currentPos.clone().sub(this._pointMassA.currentPos);
        delta.normalize();
        var length = this._pointMassA.currentPos.distanceTo(this._pointMassB.currentPos);
        var offset = delta.multiplyScalar(length - this._restingDistance);

        offset.multiplyScalar(this._stiffness);

        var multiplier = 0.5;
        if (this._pointMassA.isAttatchment || this._pointMassB.isAttatchment)
            multiplier = 1;

        if (!this._pointMassA.isAttatchment)
            this._pointMassA.currentPos.add(offset.clone().multiplyScalar(multiplier));

        if (!this._pointMassB.isAttatchment)
            this._pointMassB.currentPos.sub(offset.clone().multiplyScalar(multiplier));
    }

    set stiffness(value:number) {
        this._stiffness = value;
    }
}