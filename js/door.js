var doors;

var DoorManager = new function() {
    this.initDoors = function() {
        
        doors = document.getElementsByTagName('door');

        for (var i=0, len=doors.length; i<len; i++) {
            
            doors[i].close = function() {
                this.className = this.className.replace('open', '');
                if (!/close/i.test(this.className)) {
                    this.className = this.className.replace(/^\s+|\s+$/g, '') + ' close';
                }
            };
            
            doors[i].open = function() {
                this.className = this.className.replace('close', '');
                if (!/open/i.test(this.className)) {
                    this.className = this.className.replace(/^\s+|\s+$/g, '') + ' open';
                }
            };
            
            doors[i].toggle = function() {
                if (/close/i.test(this.className)) {
                    this.open();
                } else {
                    if (/open/i.test(this.className)) {
                        this.close();
                    } else {
                        this.className = this.className.replace(/^\s+|\s+$/g, '') + ' open';
                    }
                }
            };

            doors[i].addEventListener('click', function(e) {
                this.toggle();
            });
        }
    }
}