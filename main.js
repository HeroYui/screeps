var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    var tower = Game.getObjectById('TOWER_ID');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    var newName;
    if (harvesters.length < 2) {
        newName = Game.spawns['Hydrogen'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: 'harvester'});
    } else if (upgraders.length < 2) {
        newName = Game.spawns['Hydrogen'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: 'upgrader'});
    } else if (builders.length < 2) {
        newName = Game.spawns['Hydrogen'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: 'builder'});
    }

    if (Game.spawns['Hydrogen'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Hydrogen'].spawning.name];
        console.log('Spawning new ' + spawningCreep.memory.role + ' : ' + spawningCreep);
        Game.spawns['Hydrogen'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Hydrogen'].pos.x + 1,
            Game.spawns['Hydrogen'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

}