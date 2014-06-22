var GameController = Class.extend({
    init: function(canvas_element) {
        this.canvas = canvas_element;
        this.context = this.canvas.getContext('2d');
        this.gravity = 0.2;

        var self = this;
        Mousetrap.bind('space', function(e) {
          self.bird.flap();
        });

        this.bird = this.createBird();

        this.pipes = this.createPipes(1);
        this.sandwiches = this.createSandwiches(6);
        this.score = 0;

        this.layoutPipes();

        this.update();
    },


    createBird: function() {
      return new FlabbyBird({
        x: 300,
        y: 200,
        width: 20,
        height: 20,
        y_velocity: 1
      }, 1);
    },

    createPipes: function(numPipes) {
      var pipes = [];
      for (var i = 0; i < numPipes; i++) {
        pipes.push(new MoveableEntity({
          x: 550,
          y: 75,
          height: 200,
          width: 50
        }));
      }
      return pipes;
    },


    layoutPipes: function() {
        this.pipes.forEach(function(pipe) {
            pipe.x = Math.random() * this.canvas.width / 2 + this.canvas.width / 2;
        }.bind(this));
    },

    createSandwiches: function(num_sandwiches) {
        var sandwiches = [];
        for (var i = 0; i < num_sandwiches; i++) {
            sandwiches.push(new FlyingSandwich({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                height: 25,
                width: 25
            }));
        }
        return sandwiches;
    },

    // game world updates go here 
    update: function() {
        requestAnimationFrame(this.update.bind(this));

        if (this.bird.dead) {
            this.render();
            return;
        }

        this.bird.y_velocity += this.gravity;
        this.bird.y += this.bird.y_velocity;
        this.bird.y = Math.max(0, Math.min(this.bird.y, 380));
        //this.bird.eat(0.01);

        this.pipes.forEach(function(pipe) {
            pipe.x -= 2;
            if (pipe.x < -pipe.width) {
                pipe.x = this.canvas.width;
                pipe.height = Math.random() * this.canvas.height * 0.5;
            }
        }.bind(this));

        this.sandwiches.forEach(function(sandwich) {
            sandwich.x -= 2;
            if (sandwich.x < -sandwich.width) {
                sandwich.x = this.canvas.width;
                sandwich.y = Math.random() * this.canvas.height * 0.5;
            }
        }.bind(this));

        this.render();
        this.detectCollisions();
    },

    // rendering calls go here 
    render: function() {
        if (this.bird.dead) {
            document.body.innerHTML = "<h1>your dead lol!! youre score was " + this.score + "!!!!!</h1>";
            return;
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.bird.dead) {
            this.context.fillStyle = "red";
        } else {
            this.context.fillRect(this.bird.x, this.bird.y, this.bird.getWidth(), this.bird.getHeight());
        }
        this.context.fillStyle = 'green';

        this.pipes.forEach((function(pipe) {
           this.context.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
        }).bind(this));

        this.resetFill();

        this.sandwiches.forEach((function(sandwich) {
          this.context.fillRect(sandwich.x, sandwich.y, sandwich.width, sandwich.height);
        }).bind(this));

        this.resetFill();
    },

    resetFill: function() {
        this.context.fillStyle = 'black';
    },

    detectCollisions: function() {
        this.pipes.forEach(function(pipe) {
            if (this.isColliding(this.bird, pipe)) {
                this.bird.dead = true;
                console.log('died');
            }
        }.bind(this));
        this.sandwiches.forEach(function(sandwich) {
            if (this.isColliding(this.bird, sandwich)) {
                this.bird.eat(0.3);
                sandwich.x = this.canvas.width;
                sandwich.y = Math.random() * this.canvas.height * 0.5;
                console.log('ate');
                this.score++;
                document.getElementById('score').innerHTML = this.score;
            }
        }.bind(this));
    },

    isColliding: function(a, b) {
        if (a.x + a.getWidth() >= b.x &&
            a.y + a.getHeight() >= b.y &&
            a.x <= b.x + b.getWidth() &&
            a.y <= b.y + b.getHeight()) {
            return true;
        }
        return false;
    }
});
