// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas-bg'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create floating particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00ffff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Create rotating torus
const torusGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});

const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

camera.position.z = 10;

// Animation function
function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;
    torus.rotation.x += 0.005;
    torus.rotation.y += 0.005;
    renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Navigation functions
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    const navButtons = document.querySelectorAll('.nav-menu button');
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    navButtons.forEach(button => {
        if (button.textContent.toLowerCase() === sectionId) {
            button.classList.add('active');
        }
    });
    
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.style.display = 'none';
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
}

// Form validation and submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Validate name
    if (!name) {
        showError('nameError', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (!message) {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Disable submit button
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Prepare email data
    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_name: 'Endrit'
    };
    
    // Send email using EmailJS
    emailjs.send('service_c5t4mad', 'template_gk7cc4n', templateParams)
        .then(function(response) {
            showFormMessage('Message sent successfully!', 'success');
            document.getElementById('contactForm').reset();
        }, function(error) {
            console.error('EmailJS error:', error);
            showFormMessage('Failed to send message. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
});

// Helper functions for form validation
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = '';
    formMessage.className = 'form-message';
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', function() {
    // Set up navigation
    const navButtons = document.querySelectorAll('.nav-menu button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.textContent.toLowerCase();
            showSection(sectionId);
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu.style.display === 'block' && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileMenu.style.display = 'none';
        }
    });
});