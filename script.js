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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HouseVisualizationApp();
});

console.log('AI House Visualization loaded successfully!'); 