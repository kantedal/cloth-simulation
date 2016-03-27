/**
 * Created by filles-dator on 2016-03-26.
 */

///<reference path="./point_mass.ts"/>
///<reference path="./renderer.ts"/>

class SpringConstraint {
    private _renderer: Renderer;
    private _restingDistance: number = 1;
    private _tearingDistance: number = 2;
    private _stiffness: number = 0.8;

    private _pointMassA: PointMass;
    private _pointMassB: PointMass;

    private _connectorLine: THREE.Line;

    constructor(restingDistance: number, pointMassA: PointMass, pointMassB: PointMass, renderer: Renderer){
        this._renderer = renderer;
        this._restingDistance = restingDistance;
        this._pointMassA = pointMassA;
        this._pointMassB = pointMassB;

        if(App.DEVELOPER_MODE){
            var geometry = new THREE.Geometry();
            geometry.vertices.push(this._pointMassA.currentPos);
            geometry.vertices.push(this._pointMassB.currentPos);
            this._connectorLine = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0000ff}));
            this._renderer.scene.add(this._connectorLine);
        }
    }


    public solve() {
        var delta = this._pointMassB.currentPos.clone().sub(this._pointMassA.currentPos);
        delta.normalize();
        var length = this._pointMassA.currentPos.distanceTo(this._pointMassB.currentPos);
        var offset = delta.multiplyScalar(length - this._restingDistance);

        if (!this._pointMassA.isAttatchment)
            this._pointMassA.currentPos.add(offset.clone().multiplyScalar(0.5));

        if (!this._pointMassB.isAttatchment)
            this._pointMassB.currentPos.sub(offset.clone().multiplyScalar(0.5));

        if (App.DEVELOPER_MODE) {
            this._connectorLine.geometry.vertices[0].copy(this._pointMassA.currentPos);
            this._connectorLine.geometry.vertices[1].copy(this._pointMassB.currentPos);
            this._connectorLine.geometry.verticesNeedUpdate = true;
        }
    }
}