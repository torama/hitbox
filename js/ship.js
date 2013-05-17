function Ship() {
    this._Container = false;

    this.PathFinder = {
        paths: [],

        find: function(startRoom, targetRoom) {
            this.paths = [];
            this.findAllRoutes([startRoom], targetRoom);
            return this.paths;
        },

        findBestRoute: function() {

        },

        findAllRoutes: function(path, targetRoom) {
            var currentRoom = path[path.length - 1];

            var possibleWays = currentRoom.getPossibleWays();

            if (currentRoom === targetRoom) {
                this.paths.push(path);
            }

            for (var i=0; i<possibleWays.length; i++) {
                if (path.indexOf(possibleWays[i]) < 0) {
                    var nextPath = path.slice();
                    nextPath.push(possibleWays[i]);
                    this.findAllRoutes(nextPath, targetRoom);
                }
            }
        }
    };

    this.getRoom = function(x, y) {
        var rooms = this._Container.getElementsByTagName('room');
        for (var i=0, len=rooms.length; i<len; i++) {
            if (parseInt(rooms[i].getAttribute('data-pos-x')) === x && parseInt(rooms[i].getAttribute('data-pos-y')) === y) {
                return rooms[i];
            }
        }
        return false;
    };

    this.load = function(data) {
        this._Container = document.createElement('div');
        document.body.appendChild(this._Container);
        this._Container.className = 'ship';
        if (typeof data === 'undefined') {
            return false;
        }
        if (data.rooms.length > 0) {
            for (var i=0, len=data.rooms.length; i<len; i++) {
                var room = document.createElement('room');
                room.doors = {};
                for (var j=0, jlen=data.rooms[i].doors.length; j<jlen; j++) {
                    var door = document.createElement('door');
                    door.className = data.rooms[i].doors[j] + ' close';
                    room.setAttribute('data-door-' + data.rooms[i].doors[j], 'true');
                    room.appendChild(door);

                    room.doors[data.rooms[i].doors[j]] = door;
                }

                this._Container.appendChild(room);

                room.style.margin = 
                    data.rooms[i].position[1] * room.offsetHeight + 'px ' + ' 0 0 ' +
                    data.rooms[i].position[0] * room.offsetWidth + 'px';

                room.setAttribute('data-pos-x', data.rooms[i].position[0]);
                room.setAttribute('data-pos-y', data.rooms[i].position[1]);

                room.position = [data.rooms[i].position[0], data.rooms[i].position[1]];

                room.getRelativeRoom = function(position) {
                    switch(position) {
                        case 'left':
                            return this.ship.getRoom(this.position[0] - 1, this.position[1]);
                        break;
                        case 'right':
                            return this.ship.getRoom(this.position[0] + 1, this.position[1]);
                        break;
                        case 'top':
                            return this.ship.getRoom(this.position[0], this.position[1] - 1);
                        break;
                        case 'bottom':
                            return this.ship.getRoom(this.position[0], this.position[1] + 1);
                        break;
                    }
                };

                room.getDoor = function(position) {

                    if (this.doors[position]) {
                        return this.doors[position];
                    }

                    var nextRoomDoor = {
                        'left' : 'right',
                        'right' : 'left',
                        'top' : 'bottom',
                        'bottom' : 'top'
                    }

                    var door = this.getRelativeRoom(position).doors[nextRoomDoor[position]];

                    if (door) {
                        return door;
                    }

                    return false;
                };

                room.getPossibleWays = function() {
                    var ways = ['left', 'right', 'top', 'bottom'];
                    var possibleWays = [];

                    for (var i=0; i<4; i++) {
                        var room = this.getRelativeRoom(ways[i]);

                        if (room) {
                            var door = this.getDoor(ways[i]);
                            if (door) {
                                possibleWays.push(room);
                            }
                        }
                    }
                    return possibleWays;
                };

                room.openDoor = function(position) {
                    if (this.getDoor(position)) {
                        this.getDoor(position).open();
                        return true;
                    } else {
                        return false;
                    }
                };

                room.ship = this;
            }
        } else {
            return false;
        }
        return this._Container;
    };
}