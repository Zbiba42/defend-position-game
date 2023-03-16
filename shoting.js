let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

canvas.width = innerWidth - 3.5;
canvas.height = innerHeight - 3.5;

let score = 0;
let speed = 5;
if (speed < 14) {
  setInterval(() => {
    speed += 0.5;
  }, 5000);
}

class player {
  constructor(x, y, raduis, color) {
    this.x = x;
    this.y = y;
    this.raduis = raduis;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.raduis, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class projectiles {
  constructor(x, y, raduis, color, velocity) {
    this.x = x;
    this.y = y;
    this.raduis = raduis;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.raduis, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class enemy {
  constructor(x, y, raduis, color, velocity) {
    this.x = x;
    this.y = y;
    this.raduis = raduis;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.raduis, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player1 = new player(x, y, 15, "white");

const projectiless = [];
const enmies = [];

function SpawnEnemies() {
  setInterval(() => {
    const raduis = Math.random() * (30 - 15) + 15;

    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - raduis : canvas.width + raduis;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - raduis : canvas.height + raduis;
    }
    const color = `hsl(${Math.random() * 360} ,50%,50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };
    enmies.push(new enemy(x, y, raduis, color, velocity));
  }, 1000);
}

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, innerWidth, innerHeight);
  player1.draw();
  projectiless.forEach((projectile, index) => {
    projectile.update();
    if (
      projectile.x + projectile.raduis < 0 ||
      projectile.x - projectile.raduis > canvas.width ||
      projectile.y + projectile.raduis < 0 ||
      projectile.y - projectile.raduis > canvas.height
    ) {
      projectiless.splice(index, 1);
    }
  });

  enmies.forEach((enemy, index) => {
    enemy.update();
    const dist = Math.hypot(player1.x - enemy.x, player1.y - enemy.y);

    if (dist - enemy.raduis - player1.raduis < 1) {
      cancelAnimationFrame(animationId);
      setTimeout(() => {
        if (confirm("Game Over <3") == true) {
          location.reload()
        } 
        location.reload()
      }, 50);
    }

    projectiless.forEach((projectile, indexx) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      if (dist - enemy.raduis - projectile.raduis < 1) {
        setTimeout(() => {
          enmies.splice(index, 1);
          projectiless.splice(indexx, 1);
          score += 10;
          document.querySelector("span").innerHTML = `Score ${score}`;
        }, 0);
      }
    });
  });
}

window.addEventListener("click", (e) => {
  const angle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  };
  projectiless.push(
    new projectiles(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});

animate();
SpawnEnemies();
