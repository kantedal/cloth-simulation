/**
 * Created by filles-dator on 2016-03-26.
 */

///<reference path="./renderer.ts"/>
///<reference path="./cloth.ts"/>
///<reference path="./gui_handler.ts"/>
///<reference path="./point_mass.ts"/>
///<reference path="lib/stats.d.ts"/>
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
    private _dragPosition: THREE.Vector3;
    private _mouse: THREE.Vector2;
    private _guiHandler: GuiHandler;

    public constructor(){
        this._renderer = new Renderer();
        this._clock = new THREE.Clock();
        this._stats = new Stats();
        this._cloth = new Cloth(30,50,this._renderer);

        this._raycaster = new THREE.Raycaster();
        this._raycasterIntersects = [];
        this._mouse = new THREE.Vector2(0,0);
        this._shouldDrag = false;
        this._dragPosition = new THREE.Vector3(0,0,0);

        var geometry = new THREE.SphereGeometry( 1, 8, 8 );
        var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
        this._raycasterSelector = new THREE.Mesh( geometry, material );
        this._renderer.scene.add( this._raycasterSelector );

        this._guiHandler = new GuiHandler(this._cloth);

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

        this._cloth.update(this._clock.getElapsedTime(), 0.05);

        this._renderer.camera.position.copy(
            this._renderer.cameraBasePosition.clone().add(
                new THREE.Vector3(
                    this._mouse.x*15,
                    -this._mouse.y*15,
                    0)
            )
        );
        this._renderer.camera.lookAt(new THREE.Vector3(0,-5,0));

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

        this._renderer.render();
        this._stats.end();
        requestAnimationFrame(() => this.update());
    }

    mouseDown = (ev: MouseEvent) => {
        if(this._shouldDrag){
            this._selectedPointMass = this._cloth.points[0];
            var closestDistance = 1000;
            for(var point of this._cloth.points){
                var distance = point.currentPos.distanceTo(this._raycasterSelector.position);
                if(distance < closestDistance){
                    this._selectedPointMass = point;
                    closestDistance = distance;
                }
            }
            this._selectedPointMass.isAttatchment = true;
        }
    }

    mouseUp = (ev: MouseEvent) => {
        if(this._selectedPointMass != null){

            if(this._guiHandler.selectionMode == GuiHandler.MOVE_CLOTH)
                this._selectedPointMass.isAttatchment = false;

            this._selectedPointMass.lastPos = this._selectedPointMass.currentPos.clone();

            this._selectedPointMass = null;
        }
    }

    mouseMove = (ev: MouseEvent) => {
        this._mouse.x = ( ev.clientX / window.innerWidth ) * 2 - 1;
        this._mouse.y = - ( ev.clientY / window.innerHeight ) * 2 + 1;

        if(this._selectedPointMass != null){
            this._selectedPointMass.currentPos.add(new THREE.Vector3(-ev.movementX/10, -ev.movementY/10, 0));
            this._raycasterSelector.position.copy(this._selectedPointMass.currentPos);
        }
    }
}


window.onload = () => {
    var app = new App();
    app.start();
};