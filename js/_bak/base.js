var RenderManager = new function() {
    this._Container = null;
    this._CurrentFrame = 0;
    this._CurrentFPS = -1;

    this._MedianFPS = 0;

    this._LastFPSMeasurementStartTime = 0;
    this._FramesSinceLastMeasurement = 0;

    this._ResourceInitComplete = false;

    this._ElapsedTime = 0;

    this.init = function() {
        this._Container = $('#hitbox');
    };

    this.initResources = function() {
        SpaceShip.init();
        this._ResourceInitComplete = true;
    };

    this.render = function(elapsedTime) {
        if (!this._ResourceInitComplete) {
            this.initResources();
        }
        this._ElapsedTime = elapsedTime;
        this._CurrentFrame++;
        this._FramesSinceLastMeasurement++;

        if (KeyListener._LeftDown) {
            SpaceShip.rotateBy(-1);
        } else if (KeyListener._RightDown) {
            SpaceShip.rotateBy(1);
        }

        if (parseInt((this._ElapsedTime - this._LastFPSMeasurementStartTime) / 1000) >= 5) {
            this._LastFPSMeasurementStartTime = this._ElapsedTime;
            this._FramesSinceLastMeasurement = 0;
        }

        this._MedianFPS = parseInt(this._CurrentFrame / (this._ElapsedTime / 1000));
    };

    this.getCurrentFrame = function() {
        return this._CurrentFrame;
    };

    this.getContainer = function() {
        return this._Container;
    };

    this.getCurrentFPS = function() {
        if (parseInt((this._ElapsedTime - this._LastFPSMeasurementStartTime) / 1000) >= 2) {
            this._CurrentFPS = parseInt(this._FramesSinceLastMeasurement / ((this._ElapsedTime - this._LastFPSMeasurementStartTime) / 1000));
        }

        return this._CurrentFPS >= 0 ? this._CurrentFPS : this._MedianFPS;
    };

    this.getMedianFPS = function() {
        return this._MedianFPS;
    };
};

var KeyListener = new function() {
    this._LeftDown = false;
    this._RightDown = false;

    this.init = function() {
        document.addEventListener('keydown', function(evt) {
            switch (evt.keyCode) {
                case 37:
                    // Left was pressed
                    KeyListener.keyDown('_Left', true);
                break;
                case 39: 
                    // Right was pressed
                    KeyListener.keyDown('_Right', true);
                break;
            }
        });

        document.addEventListener('keyup', function(evt) {
            switch (evt.keyCode) {
                case 37:
                    // Left was pressed
                    KeyListener.keyDown('_Left', false);
                break;
                case 39: 
                    // Right was pressed
                    KeyListener.keyDown('_Right', false);
                break;
            }
        });
    };

    this.keyDown = function(key, isDown) {
        this[key + 'Down'] = isDown;
    };
};

// Testobjekt
var SpaceShip = new function() {
    this._Container = document.getElementById('probe-0');
    this._Rotation = 0;
    this._Scale = 0;

    this.init = function() {
        this._Container = document.getElementById('probe-0');
    };

    this.rotateBy = function(value) {
        this._Rotation += value;
        this._Container.style['-webkit-transform'] = 'rotate(' + this._Rotation + 'deg)';
    };
};

function render(elapsedTime) {
    RenderManager.render(elapsedTime);
    RenderManager.getContainer().html('Current FPS: ' + RenderManager.getCurrentFPS() + '<br />Median FPS: ' + RenderManager.getMedianFPS());
    requestAnimationFrame(render);
}

$(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || 
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;

    KeyListener.init();
    RenderManager.init();

    requestAnimationFrame(render);
});