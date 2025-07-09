// Simple Application Script
class HouseVisualizationApp {
  constructor() {
    this.currentViewIndex = 0;
    this.currentColor = 'Blue';
    this.houseViews = [
      { name: 'North View', description: 'Front elevation of the building', file: 'North' },
      { name: 'North-East View', description: 'Front-right corner view', file: 'North-east' },
      { name: 'East View', description: 'Right side elevation', file: 'East' },
      { name: 'South-East View', description: 'Back-right corner view', file: 'South-East' },
      { name: 'South View', description: 'Back elevation of the building', file: 'South' },
      { name: 'South-West View', description: 'Back-left corner view', file: 'South-West' },
      { name: 'West View', description: 'Left side elevation', file: 'West' },
      { name: 'North-West View', description: 'Front-left corner view', file: 'North-West' },
      { name: 'Top View', description: 'Aerial view from above', file: 'Top' }
    ];

    this.init();
  }

  init() {
    this.initMouseFollower();
    this.initHamburgerMenu();
    
    // Only initialize demo functionality if we're on demo page
    if (document.getElementById('chatbox-messages')) {
      this.initDemoPage();
    }
  }

  initDemoPage() {
    this.setupEventListeners();
    this.setupHouseViewer();
  }

  setupEventListeners() {
    // Chat functionality
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    
    if (sendBtn && chatInput) {
      sendBtn.addEventListener('click', () => this.sendMessage());
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }

    // Navigation arrows
    const prevBtn = document.getElementById('prev-view');
    const nextBtn = document.getElementById('next-view');
    
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => this.previousView());
      nextBtn.addEventListener('click', () => this.nextView());
    }

    // View dots
    const viewDots = document.querySelectorAll('.view-dot');
    viewDots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToView(index));
    });

    // Control buttons
    const resetBtn = document.getElementById('reset-btn');
    const downloadBtn = document.getElementById('download-btn');
    const uploadSection = document.getElementById('upload-section');

    if (resetBtn) resetBtn.addEventListener('click', () => this.resetView());
    if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadModel());
    if (uploadSection) uploadSection.addEventListener('click', () => this.startVisualization());

    // Material suggestions
    const suggestions = document.querySelectorAll('.suggestion-box');
    suggestions.forEach(box => {
      box.addEventListener('click', () => {
        const material = box.dataset.material;
        this.applySuggestion(material);
      });
    });
  }

  sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;

    this.addUserMessage(message);
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
      this.addAIResponse(message);
    }, 1000);
  }

  addUserMessage(message) {
    const messagesContainer = document.getElementById('chatbox-messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'message user-message';
    messageEl.innerHTML = `
      <div class="message-content">${message}</div>
      <div class="message-avatar">You</div>
    `;
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  addAIResponse(userMessage) {
    const messagesContainer = document.getElementById('chatbox-messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    
    const response = this.generateAIResponse(userMessage);
    messageEl.innerHTML = `
      <div class="message-avatar">AI</div>
      <div class="message-content">${response}</div>
    `;
    
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Start visualization if first meaningful message
    if (userMessage.length > 10) {
      setTimeout(() => this.startVisualization(), 2000);
    }
  }

  generateAIResponse(userMessage) {
    const responses = [
      "Great! I'll create a visualization based on your description. Let me process that for you.",
      "Interesting design concept! I'm generating a 3D model that matches your vision.",
      "Perfect! I understand your architectural requirements. Creating your building now.",
      "Excellent description! I'll incorporate those elements into your house design.",
      "I love that idea! Processing your request and building the 3D model."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  startVisualization() {
    const uploadSection = document.getElementById('upload-section');
    const loadingSection = document.getElementById('loading-section');
    const viewerSection = document.getElementById('viewer-section');
    const materialSuggestions = document.getElementById('material-suggestions');

    // Hide upload, show loading
    uploadSection.style.display = 'none';
    loadingSection.style.display = 'flex';

    // Simulate loading time
    setTimeout(() => {
      loadingSection.style.display = 'none';
      viewerSection.style.display = 'flex';
      materialSuggestions.style.display = 'block';
    }, 3000);
  }

  setupHouseViewer() {
    this.updateView();
  }

  updateView() {
    const view = this.houseViews[this.currentViewIndex];
    const imagePath = `./components/house views/${this.currentColor}-${view.file}.png`;
    
    const houseImage = document.getElementById('house-view-image');
    const viewTitle = document.getElementById('view-title');
    const viewDescription = document.getElementById('view-description');

    if (houseImage) houseImage.src = imagePath;
    if (viewTitle) viewTitle.textContent = view.name;
    if (viewDescription) viewDescription.textContent = view.description;

    // Update view dots
    document.querySelectorAll('.view-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentViewIndex);
    });
  }

  previousView() {
    this.currentViewIndex = (this.currentViewIndex - 1 + this.houseViews.length) % this.houseViews.length;
    this.updateView();
  }

  nextView() {
    this.currentViewIndex = (this.currentViewIndex + 1) % this.houseViews.length;
    this.updateView();
  }

  goToView(index) {
    this.currentViewIndex = index;
    this.updateView();
  }

  applySuggestion(material) {
    // Remove active class from all suggestions
    document.querySelectorAll('.suggestion-box').forEach(box => {
      box.classList.remove('active');
    });

    // Add active class to clicked suggestion
    document.querySelector(`[data-material="${material}"]`).classList.add('active');

    // Switch to green house for different material
    if (material === 'tile' || material === 'metal') {
      this.currentColor = 'Green';
    } else {
      this.currentColor = 'Blue';
    }

    this.updateView();
  }

  resetView() {
    this.currentViewIndex = 0;
    this.currentColor = 'Blue';
    this.updateView();
    
    // Reset material suggestions
    document.querySelectorAll('.suggestion-box').forEach(box => {
      box.classList.remove('active');
    });
  }

  downloadModel() {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'house-model.obj';
    
    // Show success message
    const messagesContainer = document.getElementById('chatbox-messages');
    if (messagesContainer) {
      const messageEl = document.createElement('div');
      messageEl.className = 'message';
      messageEl.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-content">Model download started! Your 3D house model is ready.</div>
      `;
      messagesContainer.appendChild(messageEl);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  initHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!hamburgerMenu || !mobileMenu) return;
    
    hamburgerMenu.addEventListener('click', () => {
      const isActive = hamburgerMenu.classList.contains('active');
      
      if (isActive) {
        // Close menu
        hamburgerMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        // Open menu
        hamburgerMenu.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburgerMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Close menu on window resize if it becomes desktop size
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        hamburgerMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  initMouseFollower() {
    const mouseFollower = document.querySelector('.mouse-follower');
    if (!mouseFollower) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animate follower
    const animateFollower = () => {
      const speed = 0.15;
      followerX += (mouseX - followerX) * speed;
      followerY += (mouseY - followerY) * speed;

      mouseFollower.style.left = followerX + 'px';
      mouseFollower.style.top = followerY + 'px';

      requestAnimationFrame(animateFollower);
    };

    animateFollower();

    // Add hover effects
    const interactiveElements = document.querySelectorAll('button, a, .suggestion-box, .nav-arrow, .view-dot');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        mouseFollower.classList.add('hover');
      });
      
      element.addEventListener('mouseleave', () => {
        mouseFollower.classList.remove('hover');
      });
      
      element.addEventListener('mousedown', () => {
        mouseFollower.classList.add('click');
      });
      
      element.addEventListener('mouseup', () => {
        mouseFollower.classList.remove('click');
      });
    });

    // Hide on touch devices
    if ('ontouchstart' in window) {
      mouseFollower.style.display = 'none';
    }
  }

  // Authentication Methods
  initAuthForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
      
      // Real-time validation for login form
      const emailInput = loginForm.querySelector('input[name="email"]');
      const passwordInput = loginForm.querySelector('input[name="password"]');
      
      if (emailInput) {
        emailInput.addEventListener('input', () => this.validateEmailField(emailInput));
        emailInput.addEventListener('blur', () => this.validateEmailField(emailInput));
      }
      
      if (passwordInput) {
        passwordInput.addEventListener('input', () => this.validatePasswordField(passwordInput, 6));
        passwordInput.addEventListener('blur', () => this.validatePasswordField(passwordInput, 6));
      }
    }

    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
      
      // Real-time validation for signup form
      const emailInput = signupForm.querySelector('input[name="email"]');
      const passwordInput = signupForm.querySelector('input[name="password"]');
      const confirmPasswordInput = signupForm.querySelector('input[name="confirmPassword"]');
      const firstNameInput = signupForm.querySelector('input[name="firstName"]');
      const lastNameInput = signupForm.querySelector('input[name="lastName"]');
      
      if (emailInput) {
        emailInput.addEventListener('input', () => this.validateEmailField(emailInput));
        emailInput.addEventListener('blur', () => this.validateEmailField(emailInput));
      }
      
      if (passwordInput) {
        passwordInput.addEventListener('input', () => {
          this.validatePasswordField(passwordInput, 8);
          this.validatePassword();
          if (confirmPasswordInput && confirmPasswordInput.value) {
            this.validatePasswordMatch();
          }
        });
        passwordInput.addEventListener('blur', () => this.validatePasswordField(passwordInput, 8));
      }
      
      if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
          this.validatePasswordMatch();
          this.validatePasswordField(confirmPasswordInput, 1);
        });
        confirmPasswordInput.addEventListener('blur', () => {
          this.validatePasswordMatch();
          this.validatePasswordField(confirmPasswordInput, 1);
        });
      }
      
      if (firstNameInput) {
        firstNameInput.addEventListener('input', () => this.validateRequiredField(firstNameInput));
        firstNameInput.addEventListener('blur', () => this.validateRequiredField(firstNameInput));
      }
      
      if (lastNameInput) {
        lastNameInput.addEventListener('input', () => this.validateRequiredField(lastNameInput));
        lastNameInput.addEventListener('blur', () => this.validateRequiredField(lastNameInput));
      }
    }

    // Forgot password form
    const forgotForm = document.getElementById('forgot-password-form');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
      
      // Real-time validation for forgot password form
      const emailInput = forgotForm.querySelector('input[name="email"]');
      if (emailInput) {
        emailInput.addEventListener('input', () => this.validateEmailField(emailInput));
        emailInput.addEventListener('blur', () => this.validateEmailField(emailInput));
      }
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember') === 'on';

    // Simulate login process
    this.showLoadingState(e.target);
    
    setTimeout(() => {
      if (this.validateEmail(email) && password.length >= 6) {
        // Simulate successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        if (remember) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        this.showSuccessMessage('Login successful! Redirecting to demo...');
        setTimeout(() => {
          window.location.href = 'demo.html';
        }, 2000);
      } else {
        this.showErrorMessage('Invalid email or password. Please try again.');
        this.hideLoadingState(e.target);
      }
    }, 1500);
  }

  handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms') === 'on';

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!this.validateEmail(email)) {
      this.showErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      this.showErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      this.showErrorMessage('Passwords do not match.');
      return;
    }

    if (!terms) {
      this.showErrorMessage('Please accept the Terms of Service.');
      return;
    }

    // Simulate signup process
    this.showLoadingState(e.target);
    
    setTimeout(() => {
      // Simulate successful signup
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', `${firstName} ${lastName}`);
      
      this.showSuccessMessage('Account created successfully! Redirecting to demo...');
      setTimeout(() => {
        window.location.href = 'demo.html';
      }, 2000);
    }, 2000);
  }

  handleForgotPassword(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');

    if (!this.validateEmail(email)) {
      this.showErrorMessage('Please enter a valid email address.');
      return;
    }

    // Simulate password reset
    this.showLoadingState(e.target);
    
    setTimeout(() => {
      this.hideLoadingState(e.target);
      // Show success modal
      const successModal = document.getElementById('reset-success');
      if (successModal) {
        successModal.style.display = 'flex';
      }
    }, 1500);
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateEmailField(input) {
    const email = input.value.trim();
    const isValid = email.length === 0 || this.validateEmail(email);
    
    if (email.length > 0) {
      if (isValid) {
        this.setFieldValid(input);
      } else {
        this.setFieldInvalid(input, 'Please enter a valid email address');
      }
    } else {
      this.setFieldNeutral(input);
    }
    
    return isValid;
  }

  validatePasswordField(input, minLength) {
    const password = input.value;
    const isValid = password.length === 0 || password.length >= minLength;
    
    if (password.length > 0) {
      if (isValid) {
        this.setFieldValid(input);
      } else {
        this.setFieldInvalid(input, `Password must be at least ${minLength} characters long`);
      }
    } else {
      this.setFieldNeutral(input);
    }
    
    return isValid;
  }

  validateRequiredField(input) {
    const value = input.value.trim();
    const isValid = value.length > 0;
    
    if (isValid) {
      this.setFieldValid(input);
    } else if (input === document.activeElement) {
      // Don't show error while user is typing
      this.setFieldNeutral(input);
    } else {
      this.setFieldInvalid(input, 'This field is required');
    }
    
    return isValid;
  }

  setFieldValid(input) {
    input.style.borderColor = '#4ade80';
    input.style.backgroundColor = 'rgba(74, 222, 128, 0.05)';
    this.removeFieldError(input);
  }

  setFieldInvalid(input, message) {
    input.style.borderColor = '#ef4444';
    input.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
    this.showFieldError(input, message);
  }

  setFieldNeutral(input) {
    input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    input.style.backgroundColor = 'var(--primary-black)';
    this.removeFieldError(input);
  }

  showFieldError(input, message) {
    this.removeFieldError(input);
    
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.style.cssText = `
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 0.25rem;
      animation: fadeIn 0.3s ease;
    `;
    
    input.parentElement.appendChild(errorEl);
  }

  removeFieldError(input) {
    const existingError = input.parentElement.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  validatePassword() {
    const passwordInput = document.querySelector('#signup-form input[name="password"]');
    const requirements = document.querySelector('.password-requirements small');
    
    if (!passwordInput || !requirements) return;

    const password = passwordInput.value;
    const isValid = password.length >= 8;
    
    if (password.length > 0) {
      requirements.textContent = isValid ? 
        '✓ Password meets requirements' : 
        '✗ Password must be at least 8 characters long';
      requirements.style.color = isValid ? '#4ade80' : '#f87171';
    } else {
      requirements.textContent = 'Password must be at least 8 characters long';
      requirements.style.color = 'rgba(255, 255, 255, 0.6)';
    }
  }

  validatePasswordMatch() {
    const password = document.querySelector('#signup-form input[name="password"]');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (!password || !confirmPassword) return;

    const isMatching = password.value === confirmPassword.value;
    const hasConfirmValue = confirmPassword.value.length > 0;
    const hasPasswordValue = password.value.length > 0;
    
    if (hasConfirmValue && hasPasswordValue) {
      if (isMatching) {
        this.setFieldValid(confirmPassword);
      } else {
        this.setFieldInvalid(confirmPassword, 'Passwords do not match');
      }
    } else if (hasConfirmValue && !hasPasswordValue) {
      this.setFieldInvalid(confirmPassword, 'Please enter a password first');
    } else {
      this.setFieldNeutral(confirmPassword);
    }
    
    return isMatching;
  }

  showLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div class="loading-spinner" style="width: 20px; height: 20px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
    }
  }

  hideLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      // Restore original button text based on form
      if (form.id === 'login-form') {
        submitBtn.textContent = 'Sign In';
      } else if (form.id === 'signup-form') {
        submitBtn.textContent = 'Create Account';
      } else if (form.id === 'forgot-password-form') {
        submitBtn.textContent = 'Send Reset Link';
      }
    }
  }

  showSuccessMessage(message) {
    this.showMessage(message, 'success');
  }

  showErrorMessage(message) {
    this.showMessage(message, 'error');
  }

  showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `auth-message ${type}`;
    messageEl.innerHTML = `
      <div class="message-content">
        <span>${message}</span>
        <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Add styles
    messageEl.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      color: white;
      font-weight: 500;
      backdrop-filter: blur(10px);
      animation: slideDown 0.3s ease;
      max-width: 400px;
      text-align: center;
      ${type === 'success' ? 
        'background: rgba(34, 197, 94, 0.9); border: 1px solid rgba(34, 197, 94, 0.3);' : 
        'background: rgba(239, 68, 68, 0.9); border: 1px solid rgba(239, 68, 68, 0.3);'
      }
    `;

    // Add close button styles
    const closeBtn = messageEl.querySelector('.close-btn');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      margin-left: 1rem;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `;

    document.body.appendChild(messageEl);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageEl.parentElement) {
        messageEl.remove();
      }
    }, 5000);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new HouseVisualizationApp();
  
  // Initialize auth forms if on auth pages
  if (document.querySelector('.auth-page')) {
    app.initAuthForms();
  }
});

console.log('AI House Visualization loaded successfully!'); 