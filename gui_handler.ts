/**
 * Created by filles-dator on 2016-03-27.
 */

///<reference path="./cloth.ts"/>
/// <reference path="./lib/jquery.d.ts" />

class GuiHandler {

    public static MOVE_CLOTH = 0;
    public static ADD_PIM = 1;

    private _cloth: Cloth;
    private _selectionMode: number;

    constructor(cloth: Cloth){
        this._cloth = cloth;

        this.handlePropertiesChange();
        this.handleDimensionChange();
        this.handleGravityChange();
        this.handleSelctionChange();
    }

    private handlePropertiesChange(){
        var self: GuiHandler = this;

        $('#dampingFactor').val(self._cloth.dampingFactor);
        $('#stiffnessFactor').val(self._cloth.stiffnessFactor);

        $('#dampingFactor').on('change', function() {
            self._cloth.dampingFactor = Math.max(0,Math.min(2, $('#dampingFactor').val()));
            $('#dampingFactor').val(self._cloth.dampingFactor);
        });

        $('#stiffnessFactor').on('change', function() {
            self._cloth.stiffnessFactor = Math.max(0,Math.min(1.5, $('#stiffnessFactor').val()));
            $('#stiffnessFactor').val(self._cloth.stiffnessFactor);
        });
    }

    private handleDimensionChange(){
        var self: GuiHandler = this;

        $('#dimensionX').val(self._cloth.dimensionX);
        $('#dimensionY').val(self._cloth.dimensionY);

        $('#dimensionX').on('change', function() {
            self._cloth.dimensionX = Math.max(2,Math.min(100, $('#dimensionX').val()));
            $('#dimensionX').val(self._cloth.dimensionX);

            self._cloth.generateCloth();
        });

        $('#dimensionY').on('change', function() {
            self._cloth.dimensionY = Math.max(2,Math.min(100, $('#dimensionY').val()));
            $('#dimensionY').val(self._cloth.dimensionY);

            self._cloth.generateCloth();
        });
    }

    private handleGravityChange(){
        var self: GuiHandler = this;

        $('#gravityX').val(self._cloth.gravity.x);
        $('#gravityY').val(self._cloth.gravity.y);
        $('#gravityZ').val(self._cloth.gravity.z);

        $('#gravityX').on('change', function() {
            self._cloth.gravity.x = Math.max(-100,Math.min(100, $('#gravityX').val()));
            $('#gravityX').val(self._cloth.gravity.x);
        });

        $('#gravityY').on('change', function() {
            self._cloth.gravity.y = Math.max(-100,Math.min(100, $('#gravityY').val()));
            $('#gravityY').val(self._cloth.gravity.y);
        });

        $('#gravityZ').on('change', function() {
            self._cloth.gravity.z = Math.max(-100,Math.min(100, $('#gravityZ').val()));
            $('#gravityZ').val(self._cloth.gravity.z);
        });
    }

    private handleSelctionChange(){
        var self: GuiHandler = this;

        this._selectionMode = GuiHandler.MOVE_CLOTH;
        $('#moveCloth').css('background', 'rgba(184, 184, 184, 0.7)');
        $('#addPin').css('background-color', 'rgba(184, 184, 184, 0.3)');

        $('#moveCloth').val(self._cloth.gravity.x);
        $('#addPin').val(self._cloth.gravity.y);

        $('#moveCloth').click(function() {
            self._selectionMode = GuiHandler.MOVE_CLOTH;
            $('#moveCloth').css('background', 'rgba(184, 184, 184, 0.7)');
            $('#addPin').css('background-color', 'rgba(184, 184, 184, 0.3)');
        });

        $('#addPin').click(function() {
            self._selectionMode = GuiHandler.ADD_PIM;
            $('#addPin').css('background', 'rgba(184, 184, 184, 0.7)');
            $('#moveCloth').css('background-color', 'rgba(184, 184, 184, 0.3)');
        });
    }

    get selectionMode():number {
        return this._selectionMode;
    }
}