var ship;
window.addEventListener('load', function(e) {
    ship = new Ship();
    ship.load({
        dimensions: [3, 3],
        weaponSlots: [
            []
        ],
        rooms: [
            { position: [0,0], doors: [] },
            { position: [1,0], doors: ['bottom', 'left'] },
            { position: [2,0], doors: ['left'] },
            { position: [0,1], doors: ['right'] },
            { position: [1,1], doors: [] },
            { position: [2,1], doors: ['left'] },
            { position: [1,2], doors: ['top'] },
            { position: [2,2], doors: ['top', 'left'] }
        ]
    });
    DoorManager.initDoors();
});