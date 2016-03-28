/**
 * Created by filles-dator on 2016-03-26.
 */
///<reference path="./point_mass.ts"/>
///<reference path="./renderer.ts"/>
var SpringConstraint = (function () {
    function SpringConstraint(restingDistance, pointMassA, pointMassB, renderer) {
        this._restingDistance = 1;
        this._tearingDistance = 2;
        this._renderer = renderer;
        this._restingDistance = restingDistance;
        this._pointMassA = pointMassA;
        this._pointMassB = pointMassB;
        if (App.DEVELOPER_MODE) {
            var geometry = new THREE.Geometry();
            geometry.vertices.push(this._pointMassA.currentPos);
            geometry.vertices.push(this._pointMassB.currentPos);
            this._connectorLine = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));
            this._renderer.scene.add(this._connectorLine);
        }
    }
    SpringConstraint.prototype.solve = function () {
        var delta = this._pointMassB.currentPos.clone().sub(this._pointMassA.currentPos);
        delta.normalize();
        var length = this._pointMassA.currentPos.distanceTo(this._pointMassB.currentPos);
        var offset = delta.multiplyScalar(length - this._restingDistance);
        var multiplier = 0.5;
        if (this._pointMassA.isAttatchment || this._pointMassB.isAttatchment)
            multiplier = 1;
        if (!this._pointMassA.isAttatchment)
            this._pointMassA.currentPos.add(offset.clone().multiplyScalar(multiplier));
        if (!this._pointMassB.isAttatchment)
            this._pointMassB.currentPos.sub(offset.clone().multiplyScalar(multiplier));
        if (App.DEVELOPER_MODE) {
            this._connectorLine.geometry.vertices[0].copy(this._pointMassA.currentPos);
            this._connectorLine.geometry.vertices[1].copy(this._pointMassB.currentPos);
            this._connectorLine.geometry.verticesNeedUpdate = true;
        }
    };
    return SpringConstraint;
})();
//# sourceMappingURL=spring_constraint.js.map