/**
 * Created by filles-dator on 2016-03-26.
 */

///<reference path="./renderer.ts"/>
///<reference path="./cloth.ts"/>
///<reference path="./point_mass.ts"/>
///<reference path="./math/stats.d.ts"/>
///<reference path="./threejs/three.d.ts"/>

class App {
    public static DEVELOPER_MODE = false;

    private _renderer: Renderer;
    private _stats: Stats;
    private _clock: THREE.Clock;
    private _cloth: Cloth;

    private _raycaster: THREE.Raycaster;
    private _raycasterIntersects: THREE.Intersection[];
    private _raycasterSelector: THREE.Mesh;
    private _selectedPointMass: PointMass;
    private _shouldDrag: boolean;
    private _mouse: THREE.Vector2;

    public constructor(){
        this._renderer = new Renderer();
        this._clock = new THREE.Clock();
        this._stats = new Stats();
        this._cloth = new Cloth(30,30,this._renderer);

        this._raycaster = new THREE.Raycaster();
        this._raycasterIntersects = [];
        this._mouse = new THREE.Vector2(0,0);
        this._shouldDrag = false;

        var geometry = new THREE.SphereGeometry( 0.3, 8, 8 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this._raycasterSelector = new THREE.Mesh( geometry, material );
        this._renderer.scene.add( this._raycasterSelector );

        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);
        window.addEventListener("mousemove", this.mouseMove);
    }

    public start():void{
        this._renderer.start();

        this._stats.setMode(0); // 0: fps, 1: ms, 2: mb
        this._stats.domElement.style.position = 'absolute';
        this._stats.domElement.style.left = '20px';
        this._stats.domElement.style.top = '20px';
        document.body.appendChild(this._stats.domElement);

        this.update();
    }

    private update(){
        this._stats.begin();

        this._raycaster.setFromCamera( this._mouse, this._renderer.camera );
        this._raycasterIntersects = this._raycaster.intersectObject( this._cloth.clothMesh );
        if(this._raycasterIntersects.length != 0){
            this._shouldDrag = true;
            this._raycasterSelector.visible = true;
            this._raycasterSelector.position.copy(this._raycasterIntersects[0].point.clone());
        }
        else{
            if(this._selectedPointMass == null){
                this._shouldDrag = false;
                this._raycasterSelector.visible = false;
            }
        }


        this._cloth.update(this._clock.getElapsedTime(), 0.01);

        this._renderer.render();
        this._stats.end();
        requestAnimationFrame(() => this.update());
    }

    mouseDown = (ev: MouseEvent) => {
        if(this._shouldDrag){
            for(var point of this._cloth.points){
                if(point.currentPos.distanceTo(this._raycasterSelector.position) < Math.sqrt(0.5*0.5*2)){
                    this._selectedPointMass = point;
                    this._selectedPointMass.isAttatchment = true;
                    break;
                }
            }
        }
    }

    mouseUp = (ev: MouseEvent) => {
        if(this._selectedPointMass != null){
            this._selectedPointMass.isAttatchment = false;
            this._selectedPointMass = null;
        }
    }

    mouseMove = (ev: MouseEvent) => {
        this._mouse.x = ( ev.clientX / window.innerWidth ) * 2 - 1;
        this._mouse.y = - ( ev.clientY / window.innerHeight ) * 2 + 1;

        if(this._selectedPointMass != null){
            this._selectedPointMass.currentPos.copy(this._raycasterSelector.position);
        }
    }
}


window.onload = () => {
    var app = new App();
    app.start();
};