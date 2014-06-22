var MoveableEntity = Class.extend({
    init: function(coords) {
console.log('init');
        this.x = coords.x;
        this.y = coords.y;
        this.width = coords.width;
        this.height = coords.height;
    },

    // override
    update: function() {},

    getCoords: function() {
        return {
            x: this.x, 
            y: this.y,
            width: this.width,
            height: this.height
        };
    },

    getWidth: function() { return this.width; },
    getHeight: function() { return this.height; }
});

var FlabbyBird = MoveableEntity.extend({
    init: function(coords, flabbiness) {
        console.log('bird init')
        this._super(coords);
        this.y_velocity = coords.y_velocity || 0;
        this.flabbiness = flabbiness;
    },
    move: function(accel) {
      // this.x += something;
    },

    eat: function(howMuchFood) {
        this.flabbiness += howMuchFood;
    },

    getWidth: function() {
        return this.width * this.flabbiness;
    },

    getHeight: function() {
        return this.height * this.flabbiness;
    },

    flap: function() {
      this.y_velocity = -5;
      if (this.getWidth() <= 1 || this.getHeight() <= 1) {
          console.error("YOU DIED OF STARVATION");
          this.dead = true;
      } else {
         this.flabbiness -= .15;
      }
    }
});

var FlyingSandwich = MoveableEntity.extend({

});
