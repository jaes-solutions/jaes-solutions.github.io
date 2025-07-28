//game
    const container = document.getElementById('cont');

    const cursor = document.createElement('div');
    cursor.className = 'cursor';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = 0;
    svg.style.left = 0;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filterX = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filterX.setAttribute('id', 'filter-noise-x');
    const turbulenceX = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
    turbulenceX.setAttribute('type', 'fractalNoise');
    turbulenceX.setAttribute('baseFrequency', '0.000001');
    turbulenceX.setAttribute('numOctaves', '1');
    const dispX = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    dispX.setAttribute('in', 'SourceGraphic');
    dispX.setAttribute('scale', '40');
    filterX.appendChild(turbulenceX);
    filterX.appendChild(dispX);

    const filterY = filterX.cloneNode(true);
    filterY.setAttribute('id', 'filter-noise-y');

    defs.appendChild(filterX);
    defs.appendChild(filterY);
    svg.appendChild(defs);

    const hLine = document.createElement('div');
    hLine.className = 'line-horizontal';
    const vLine = document.createElement('div');
    vLine.className = 'line-vertical';

    cursor.appendChild(svg);
    cursor.appendChild(hLine);
    cursor.appendChild(vLine);
    container.appendChild(cursor);

    let mouse = { x: 0, y: 0 };

    const getMousePos = (e, container) => {
      const bounds = container.getBoundingClientRect();
      return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      };
    };

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 },
    };

    const primitiveValues = { turbulence: 0 };

    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        hLine.style.filter = 'url(#filter-noise-x)';
        vLine.style.filter = 'url(#filter-noise-y)';
      },
      onUpdate: () => {
        turbulenceX.setAttribute('baseFrequency', primitiveValues.turbulence);
        turbulenceY.setAttribute('baseFrequency', primitiveValues.turbulence);
      },
      onComplete: () => {
        hLine.style.filter = 'none';
        vLine.style.filter = 'none';
      },
    }).to(primitiveValues, {
      duration: 0.5,
      ease: 'power1',
      startAt: { turbulence: 1 },
      turbulence: 0,
    });

    const crosshairText = document.getElementById('crosshair-text');
    const hoverTarget = document.getElementById('hover-target');
    console.log('Hover target:', hoverTarget);

    let messageIndex = 0;

    const render = () => {
      renderedStyles.tx.current = mouse.x;
      renderedStyles.ty.current = mouse.y;
      for (let key in renderedStyles) {
        const style = renderedStyles[key];
        style.previous = lerp(style.previous, style.current, style.amt);
      }
      gsap.set(vLine, { x: renderedStyles.tx.previous });
      gsap.set(hLine, { y: renderedStyles.ty.previous });
      requestAnimationFrame(render);
    };

    // Track mouse position and show crosshair lines
    container.addEventListener('mousemove', (e) => {
      mouse = getMousePos(e, container);
      gsap.to([hLine, vLine], { opacity: 1, duration: 0.9, ease: 'power3.out' });
    });

    if (hoverTarget) {
      hoverTarget.addEventListener('mouseenter', () => {
        tl.restart();
        hoverTarget.textContent = 'Shoot!';
      });

    hoverTarget.addEventListener('mouseleave', () => {
      tl.progress(1).kill();
      hoverTarget.textContent = 'Aim.. and..';
    });

    hoverTarget.addEventListener('click', () => {
      window.location.href = 'contact.html'; // Replace with your desired URL or path
    });

    container.addEventListener('click', (e) => {
      const target = e.target;
      if (target !== hoverTarget) {
        const messages = [
          'Haha, you missed!',
'You can’t shoot, can you?',
'Try again, sharpshooter!',
'That’s not even close!',
'Keep practicing!',
'You missed by a mile!',
'Aim better next time!',
'Was that even a shot?',
'Your aim needs a GPS!',
'Are you even trying?',
'Maybe glasses would help!',
'Legend says that shot is still flying...',
'That was adorable!',
'Good effort... not!',
'Shooting air, are we?',
'Were you aiming at the sky?',
'Try moving your hand, not your hopes!',
'I’ve seen better aim from a potato!',
'That’s one way to miss everything!',
'Nice try... not!',
  'Was that even a shot?',
  'You call that aim?',
  'Missed!',
  'So close! (Not really)',
  'Epic miss, my friend.',
  'Nope!',
  'Oof!',
  'Swing and miss!',
  'Still warming up?',
  'You blinked, right?',
  'That was wild...',
  'Try harder!',
  'Try using both eyes!',
  'Your aim is on vacation.',
  'Classic misfire!',
  'Where were you aiming?',
  'You hit... nothing!',
  'Need a map to aim?',
  'You almost hit the air!',
  'Oopsie daisy!',
  'Practice makes... well, try again.',
  'Let’s pretend that didn’t happen.',
  'Reload your skills!',
  'Cursor gave up.',
  
  'Wrong way!',
  'Shoot again!',
  'You good?',
  'Seriously?',
  'Bruh...',
  'Yikes!',
  'Sad shot.'
        ];
        const currentMessage = messages[messageIndex];
        messageIndex = (messageIndex + 1) % messages.length;

        const msgEl = document.createElement('div');
        msgEl.textContent = currentMessage;
        msgEl.style.position = 'fixed';
        msgEl.style.left = `${e.clientX}px`;
        msgEl.style.top = `${e.clientY}px`;
        msgEl.style.transform = 'translate(-50%, -50%)';
        msgEl.style.color = 'white';
        msgEl.style.fontSize = '20px';
        msgEl.style.fontFamily = 'sans-serif';
        msgEl.style.pointerEvents = 'none';
        msgEl.style.zIndex = '10002';
        msgEl.style.opacity = '0';
        msgEl.style.transition = 'opacity 1.5s ease';
        container.appendChild(msgEl);

        // Trigger fade-in
        requestAnimationFrame(() => {
          msgEl.style.opacity = '1';
        });

        // Trigger fade-out after 3.5 seconds
        setTimeout(() => {
          msgEl.style.opacity = '0';
        }, 1200);

        // Remove after fade-out completes (1.5s transition, so after 5s total)
        setTimeout(() => {
          msgEl.remove();
        }, 2000);
      }
    });
    }

    requestAnimationFrame(render);
 
//index js 
//aos
AOS.init({
  duration: 1000, // animation duration
  once: true      // animation happens only once
});
// Load navbar.html into the #navbar-placeholder div
document.addEventListener("DOMContentLoaded", () => {
  fetch('navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar-placeholder').innerHTML = data;

    // Now safe to access elements from navbar.html
    document.querySelector('.nav-ser')?.addEventListener('mouseover', () => {
      document.querySelector('.dropdown-menu')?.classList.remove('hidden');
    });

    document.querySelector('.nav-item')?.addEventListener('mouseleave', () => {
      document.querySelector('.dropdown-menu')?.classList.add('hidden');
    });
  
  const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  })
  .catch(error => {
    console.error('Error loading navbar:', error);
  });
});

//footer

document.addEventListener("DOMContentLoaded", () => {
    fetch("footer.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("footer-placeholder").innerHTML = data;
      })
      .catch(error => console.error("Footer load error:", error));
  });
  
// Parallax scroll text effect
window.addEventListener('scroll', () => {
  const innovate = document.getElementById('innovate');
  const lead = document.getElementById('lead');
  const section = document.querySelector('.parallax');
  const sectionTop = section.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;
  const scrollFactor = Math.min(1, (windowHeight - sectionTop) / windowHeight);
  
  innovate.style.transform = `translateX(${(-200 + scrollFactor * 200)}px)`;
  lead.style.transform = `translateX(${(200 - scrollFactor * 200)}px)`;
});

// Dropdown hover logic
document.querySelector('.nav-ser').addEventListener('mouseover', function () {
  document.querySelector('.dropdown-menu').classList.remove('hidden');
});

document.querySelector('.nav-item').addEventListener('mouseleave', function () {
  document.querySelector('.dropdown-menu').classList.add('hidden');
});




// Mobile menu toggle
function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}

// Circle follow animation
const circle = document.getElementById('circle');
const button = document.querySelector('.cta-btn');

let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  currentX += (mouseX - currentX) * 0.1;
  currentY += (mouseY - currentY) * 0.1;
  circle.style.left = `${currentX}px`;
  circle.style.top = `${currentY}px`;
  requestAnimationFrame(animate);
}
animate();

button.addEventListener('mouseenter', () => {
  circle.style.opacity = '0';
});
button.addEventListener('mouseleave', () => {
  circle.style.opacity = '1';
});

// Video player controls
const video = window.innerWidth <= 768 
  ? document.getElementById("myVideoMobile") 
  : document.getElementById("myVideo");

const playPauseBtn = document.getElementById("playPauseBtn");
const muteUnmuteBtn = document.getElementById("muteUnmuteBtn");
const playPauseIcon = document.getElementById("playPauseIcon");
const muteUnmuteIcon = document.getElementById("muteUnmuteIcon");

playPauseBtn.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    playPauseIcon.src = "assets/pause.png";
  } else {
    video.pause();
    playPauseIcon.src = "assets/play.png";
  }
});

muteUnmuteBtn.addEventListener("click", () => {
  video.muted = !video.muted;
  muteUnmuteIcon.src = video.muted 
    ? "assets/volume.png"
    : "assets/unmute.png";
});


