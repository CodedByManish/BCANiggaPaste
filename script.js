document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const formatButtons = document.querySelectorAll('.format-btn');
    const editor = document.getElementById('editor');
    const fileUpload = document.getElementById('file-upload');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const urlInput = document.getElementById('url-input');
    const submitBtn = document.getElementById('submit-btn');
    const resultContainer = document.getElementById('result-container');
    const resultUrl = document.getElementById('result-url');
    const copyBtn = document.getElementById('copy-btn');
    const newPasteBtn = document.getElementById('new-paste-btn');
    const expirySelect = document.getElementById('expiry-select');
    const loadingOverlay = document.getElementById('loading-overlay');
    const successSound = document.getElementById('success-sound');

    // Initialize particles background
    createParticles();
    
    // Current active tab
    let activeTab = 'text';
    
    // File storage
    let selectedFile = null;

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => content.classList.add('hidden'));
            document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
            
            // Update active tab state
            activeTab = tab;
            
            // Update submit button text
            updateSubmitButtonText();
        });
    });

    // Text formatting functionality
    formatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.dataset.format;
            
            if (format === 'createLink') {
                const url = prompt('Enter the URL:');
                if (url) {
                    document.execCommand(format, false, url);
                }
            } else {
                document.execCommand(format, false, null);
            }
            
            editor.focus();
        });
    });

    // File upload handling
    fileUpload.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            selectedFile = this.files[0];
            fileName.textContent = selectedFile.name;
            fileSize.textContent = formatFileSize(selectedFile.size);
            fileInfo.classList.remove('hidden');
        }
    });

    // Drag and drop functionality
    const dropArea = document.querySelector('#tab-content-file .border-dashed');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('bg-blue-50', 'dark:bg-blue-900', 'bg-opacity-50');
    }
    
    function unhighlight() {
        dropArea.classList.remove('bg-blue-50', 'dark:bg-blue-900', 'bg-opacity-50');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files && files[0]) {
            fileUpload.files = files;
            selectedFile = files[0];
            fileName.textContent = selectedFile.name;
            fileSize.textContent = formatFileSize(selectedFile.size);
            fileInfo.classList.remove('hidden');
        }
    }

    // Submit button
    submitBtn.addEventListener('click', handleSubmit);

    // Copy URL button
    copyBtn.addEventListener('click', function() {
        resultUrl.select();
        document.execCommand('copy');
        
        // Play success sound
        successSound.play();
        
        // Change button text temporarily
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            this.innerHTML = originalHTML;
        }, 2000);
    });

    // New paste button
    newPasteBtn.addEventListener('click', function() {
        resetForm();
        resultContainer.classList.add('hidden');
    });

    // Helper Functions
    function updateSubmitButtonText() {
        switch(activeTab) {
            case 'text':
                submitBtn.innerHTML = '<span class="relative z-10 flex items-center justify-center"><i class="fas fa-paper-plane mr-2"></i>Create Paste</span>';
                break;
            case 'file':
                submitBtn.innerHTML = '<span class="relative z-10 flex items-center justify-center"><i class="fas fa-cloud-upload-alt mr-2"></i>Upload File</span>';
                break;
            case 'url':
                submitBtn.innerHTML = '<span class="relative z-10 flex items-center justify-center"><i class="fas fa-link mr-2"></i>Shorten URL</span>';
                break;
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function resetForm() {
        editor.innerHTML = '';
        fileUpload.value = '';
        fileInfo.classList.add('hidden');
        urlInput.value = '';
        expirySelect.value = 'never';
    }

    async function handleSubmit() {
        // Show loading overlay
        loadingOverlay.classList.remove('hidden');

        try {
            let response;
            
            switch(activeTab) {
                case 'text':
                    if (!editor.innerHTML.trim()) {
                        alert('Please enter some text');
                        loadingOverlay.classList.add('hidden');
                        return;
                    }
                    
                    response = await saveText(editor.innerHTML);
                    break;
                    
                case 'file':
                    if (!selectedFile) {
                        alert('Please select a file');
                        loadingOverlay.classList.add('hidden');
                        return;
                    }
                    
                    response = await uploadFile(selectedFile);
                    break;
                    
                case 'url':
                    if (!urlInput.value.trim() || !isValidURL(urlInput.value)) {
                        alert('Please enter a valid URL');
                        loadingOverlay.classList.add('hidden');
                        return;
                    }
                    
                    response = await shortenURL(urlInput.value);
                    break;
            }
            
            if (response && response.success) {
                resultUrl.value = response.url;
                resultContainer.classList.remove('hidden');
                document.querySelector('main').scrollTop = resultContainer.offsetTop;
                successSound.play();
            } else {
                throw new Error(response?.error || 'An error occurred');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    }

    async function saveText(content) {
        const id = generateRandomId();
        const formData = new FormData();
        formData.append('content', content);
        formData.append('id', id);

        const response = await fetch('php/save_paste.php', {
            method: 'POST',
            body: formData
        });

        return await response.json();
    }

    async function uploadFile(file) {
        const id = generateRandomId();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', id);

        const response = await fetch('php/upload.php', {
            method: 'POST',
            body: formData
        });

        return await response.json();
    }

    async function shortenURL(url) {
        const id = generateRandomId();
        const formData = new FormData();
        formData.append('url', url);
        formData.append('id', id);

        const response = await fetch('php/shorten_url.php', {
            method: 'POST',
            body: formData
        });

        return await response.json();
    }

    // URL validation
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function generateRandomId() {
        return Math.random().toString(36).substring(2, 8);
    }
    
    // Create particles for background effect
    function createParticles() {
        const container = document.querySelector('.particles-container');
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 6 + 2;
            
            // Random opacity
            const opacity = Math.random() * 0.3 + 0.1;
            
            // Set styles
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = opacity.toString();
            
            // Add animation
            particle.style.animation = `float ${Math.random() * 20 + 10}s linear infinite`;
            
            // Append to container
            container.appendChild(particle);
        }
    }

    // Add floating animation
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        @keyframes float {
            0% {
                transform: translate(0, 0);
            }
            25% {
                transform: translate(${Math.random() * 100}px, ${Math.random() * 100}px);
            }
            50% {
                transform: translate(${Math.random() * -100}px, ${Math.random() * 100}px);
            }
            75% {
                transform: translate(${Math.random() * -100}px, ${Math.random() * -100}px);
            }
            100% {
                transform: translate(0, 0);
            }
        }
    `, styleSheet.cssRules.length);

    // Initialize submit button text
    updateSubmitButtonText();
});