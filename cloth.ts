/**
 * Created by filles-dator on 2016-03-26.
 */

///<reference path="./point_mass.ts"/>
///<reference path="./renderer.ts"/>
///<reference path="./app.ts"/>
///<reference path="./spring_constraint.ts"/>
///<reference path="./bend_constraint.ts"/>
///<reference path="./threejs/three.d.ts"/>

class Cloth {
    private _dimensionX: number;
    private _dimensionY: number;
    private _renderer: Renderer;
    private _points: PointMass[];
    private _pointMesh: THREE.Mesh[];
    private _constraints: SpringConstraint[];
    private _bendConstraints: BendConstraint[];
    private _gravity: THREE.Vector3;
    private _clothMesh: THREE.Mesh;

    private _dampingFactor: number = 0.03;
    private _stiffnessFactor: number = 0.5;

    constructor(dimX: number, dimY: number, renderer: Renderer){
        this._dimensionX = dimX;
        this._dimensionY = dimY;
        this._renderer = renderer;
        this._gravity = new THREE.Vector3(0,-9.82,0);

        this.generateCloth();
    }

    public generateCloth(){
        if(this._clothMesh)
            this._renderer.scene.remove(this._clothMesh);

        this._points = [];
        this._constraints = [];
        this._bendConstraints = [];
        this._pointMesh = [];

        //var cloth_material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        var cloth_material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: 0x444499,
            specular: 0xcccccc,
            shininess: 1000
        });
        var cloth_geometry = new THREE.PlaneGeometry( this._dimensionX-1, this._dimensionY-1, this._dimensionX-1, this._dimensionY-1 );
        cloth_geometry.rotateY(Math.PI);
        cloth_geometry.translate(-0.5,-0.5, 0)

        this._clothMesh = new THREE.Mesh( cloth_geometry, cloth_material );
        if(!App.DEVELOPER_MODE)
            this._renderer.scene.add( this._clothMesh );


        for(var y=0; y<this._dimensionY; y++){
            for(var x=0; x<this._dimensionX; x++){
                var new_pos = new THREE.Vector3(x-this._dimensionX/2, y-this._dimensionY/2, 0);

                var vertex_idx = 0;
                for(var i=0; i<this._clothMesh.geometry.vertices.length; i++){
                    var vert_pos : THREE.Vector3 = this._clothMesh.geometry.vertices[i].clone();
                    vert_pos.applyMatrix4( this._clothMesh.matrixWorld );

                    if(vert_pos.x == new_pos.x && vert_pos.y == new_pos.y) {
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
            for(var x=0; x<this._dimensionX; x++) {
                if (x != 0)
                    this._constraints.push(new SpringConstraint(1, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x - 1, y)], this._renderer));

                if (y != 0)
                    this._constraints.push(new SpringConstraint(1, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y - 1)], this._renderer));

                if (x != this._dimensionX-1)
                    this._constraints.push(new SpringConstraint(1, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x + 1, y)], this._renderer));

                if (y != this._dimensionY-1)
                    this._constraints.push(new SpringConstraint(1, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y + 1)], this._renderer));


                if(x != 0 && y != 0)
                    this._bendConstraints.push(new BendConstraint(Math.sqrt(2), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x-1, y - 1)], this._renderer));

                if(x != this._dimensionX-1 && y != 0)
                    this._bendConstraints.push(new BendConstraint(Math.sqrt(2), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x+1, y - 1)], this._renderer));

                if(x != 0 && y != this._dimensionY-1)
                    this._bendConstraints.push(new BendConstraint(Math.sqrt(2), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x-1, y + 1)], this._renderer));

                if(x != this._dimensionX-1 && y != this._dimensionY-1)
                    this._bendConstraints.push(new BendConstraint(Math.sqrt(2), this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x+1, y + 1)], this._renderer));


                if(x > 1)
                    this._bendConstraints.push(new BendConstraint(2, this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x-2, y)], this._renderer));

                if(y > 1)
                    this._bendConstraints.push(new BendConstraint(2, this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y-2)], this._renderer));

                if(x < this._dimensionX-2)
                    this._bendConstraints.push(new BendConstraint(2, this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x+2, y)], this._renderer));

                if(y < this._dimensionY-2)
                    this._bendConstraints.push(new BendConstraint(2, this._stiffnessFactor, this._points[this.getClothIndexAt(x, y)], this._points[this.getClothIndexAt(x, y+2)], this._renderer));

            }
        }


        this._points[this.getClothIndexAt(0, this._dimensionY-1)].isAttatchment = true;
        //this._points[this.getClothIndexAt(dimX/2-1, 0)].isAttatchment = true;
        this._points[this.getClothIndexAt(this._dimensionX-1, this._dimensionY-1)].isAttatchment = true;
    }

    private getClothIndexAt(x:number, y:number):number{
        return x + this._dimensionX*y;
    }

    public update(time: number, delta: number){
        if(this._clothMesh.geometry) {
            for (var constraint of this._constraints)
                constraint.solve();

            for (var constraint of this._bendConstraints)
                constraint.solve();

            this._clothMesh.geometry.verticesNeedUpdate = true;

            for (var i = 0; i < this._points.length; i++) {
                var point = this._points[i];
                if (!point.isAttatchment) {
                    var acceleration = this._gravity.clone().add(point.constraintForce);
                    var velocity = point.currentPos.clone().sub(point.lastPos);
                    point.lastPos = point.currentPos.clone();
                    point.currentPos = point.currentPos.clone().add(velocity.multiplyScalar(1.0 - this._dampingFactor)).add(acceleration.multiplyScalar(delta * delta));
                }
                else {
                    //point.currentPos.add(new THREE.Vector3(Math.sin(time*2)*0.2, Math.cos(time*2)*0.2, Math.cos(time*2)*0.2));
                }

                this._clothMesh.geometry.vertices[point.vertexIndex].copy(point.currentPos);
            }

            this._clothMesh.geometry.verticesNeedUpdate = true;
            this._clothMesh.geometry.normalsNeedUpdate = true;
            this._clothMesh.geometry.computeFaceNormals();
            this._clothMesh.geometry.computeVertexNormals();
            this._clothMesh.geometry.computeBoundingSphere();
            //this._renderer.camera.lookAt(this._clothMesh.geometry.center().clone().multiplyScalar(-3));
        }
    }

    get clothMesh():THREE.Mesh {
        return this._clothMesh;
    }

    get points():PointMass[] {
        return this._points;
    }

    set points(value:Array) {
        this._points = value;
    }

    get dimensionY():number {
        return this._dimensionY;
    }
    get dimensionX():number {
        return this._dimensionX;
    }
    set dimensionX(value:number) {
        this._dimensionX = value;
    }
    set dimensionY(value:number) {
        this._dimensionY = value;
    }

    get gravity():THREE.Vector3 {
        return this._gravity;
    }
    set gravity(value:THREE.Vector3) {
        this._gravity = value;
    }

    get dampingFactor():number {
        return this._dampingFactor;
    }

    set dampingFactor(value:number) {
        this._dampingFactor = value;
    }

    get stiffnessFactor():number {
        return this._stiffnessFactor;
    }

    set stiffnessFactor(value:number) {
        this._stiffnessFactor = value;
        for(var constraint of this._bendConstraints)
            constraint.stiffness = this._stiffnessFactor;
    }
}