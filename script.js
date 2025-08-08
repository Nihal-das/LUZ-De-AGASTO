const canvas = document.getElementById('rocketCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Rocket {
    constructor(x, color) {
        this.x = x;
        this.y = canvas.height;
        this.color = color;
        this.size = 5;
        this.speed = Math.random() * 4 + 6;
        this.exploded = false;
        this.particles = [];
    }
    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y < canvas.height / 3) {
                this.explode();
            }
        } else {
            this.particles.forEach(p => p.update());
        }
    }
    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            this.particles.forEach(p => p.draw());
        }
    }
    explode() {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 6;
        this.speedY = (Math.random() - 0.5) * 6;
        this.alpha = 1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
    }
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

let rockets = [
    new Rocket(canvas.width / 4, 'orange'),
    new Rocket(canvas.width / 2, 'white'),
    new Rocket((canvas.width / 4) * 3, 'green')
];

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rockets.forEach(r => {
        r.update();
        r.draw();
    });
    requestAnimationFrame(animate);
}

animate();

// Title fade-in after rockets
setTimeout(() => {
    gsap.to("#titleScreen", {opacity: 1, duration: 2});
}, 3000);

// Show main content after title
// Show main content after title
setTimeout(() => {
    gsap.to("#titleScreen", {opacity: 0, duration: 1});
    gsap.to("#mainContent", {
        opacity: 1, 
        duration: 2, 
        y: -20,
        onStart: () => {
            document.getElementById('mainContent').style.zIndex = 4; // Bring above rockets
        }
    });
    document.getElementById('rocketCanvas').style.display = 'none'; // Optional: remove rockets
    animatePrizes();
}, 6000);


function animatePrizes() {
    const p1 = { value: 0 };
    const p2 = { value: 0 };
    gsap.to(p1, {
        value: 1000,
        duration: 1.5,
        onUpdate: () => {
            document.getElementById('prize1').textContent = `₹${Math.floor(p1.value)}`;
        }
    });
    gsap.to(p2, {
        value: 500,
        duration: 1.5,
        delay: 0.5,
        onUpdate: () => {
            document.getElementById('prize2').textContent = `₹${Math.floor(p2.value)}`;
        }
    });
}
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});