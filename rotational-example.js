// console.clear();

// document.getElementById('version')
//   .textContent = 'Phaser v' + Phaser.VERSION;

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      debugShowBody: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var SPEED = 100;
var ROTATION_SPEED = 1 * Math.PI; // 0.5 arc per sec, 2 sec per arc
var ROTATION_SPEED_DEGREES = Phaser.Math.RadToDeg(ROTATION_SPEED);
var TOLERANCE = 0.02 * ROTATION_SPEED;

var velocityFromRotation = Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation;
var ship;

function preload() {
  this.load.image('ship', './assets/gunguyup.png')
};

function create() {
  
  ship = this.physics.add.image(200, 150, 'ship')
    .setVelocity(SPEED, 0);
}

function update() {
  pointerMove(this.input.activePointer);
  velocityFromRotation(ship.rotation, SPEED, ship.body.velocity);
  ship.body.debugBodyColor = (ship.body.angularVelocity === 0) ? 0xff0000 : 0xffff00;
}

function pointerMove (pointer) {
  // if (!pointer.manager.isOver) return;
  
  // Also see alternative method in
  // <https://codepen.io/samme/pen/gOpPLLx>
  
  var angleToPointer = Phaser.Math.Angle.Between(ship.x, ship.y, pointer.worldX, pointer.worldY);
  var angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - ship.rotation);
    
  if (Phaser.Math.Within(angleDelta, 0, TOLERANCE)) {
    ship.rotation = angleToPointer;
    ship.setAngularVelocity(0);
  } else {
    ship.setAngularVelocity(Math.sign(angleDelta) * ROTATION_SPEED_DEGREES);
  }
}
