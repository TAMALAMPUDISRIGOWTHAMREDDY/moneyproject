// Liquex App - Main JavaScript File

class LiquexApp {
    constructor() {
        this.currentUser = null;
        this.currentLocation = null;
        this.notifications = [];
        this.currentRequest = null;
        this.chatMessages = [];
        this.transactionHistory = [];
        this.userRatings = {};

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkLocationPermission();
        this.loadMockData();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('showSignup').addEventListener('click', (e) => this.showSignupPage(e));
        
        // Signup form
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));
        document.getElementById('showLogin').addEventListener('click', (e) => this.showLoginPage(e));
        
        // Password validation
        document.getElementById('signup-password').addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        document.getElementById('signup-confirm-password').addEventListener('input', (e) => this.checkPasswordMatch());
        
        // Welcome screen
        document.getElementById('continue-btn').addEventListener('click', () => this.showPage('main-hub'));
        
        // Main hub
        document.getElementById('request-btn').addEventListener('click', () => this.showPage('raise-request'));
        document.getElementById('notifications-btn').addEventListener('click', () => this.showPage('notifications-screen'));
        document.getElementById('transaction-history-btn').addEventListener('click', () => this.showPage('transaction-history'));
        document.getElementById('analytics-btn').addEventListener('click', () => this.showPage('analytics'));
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());
        
        // Raise request form
        document.getElementById('requestForm').addEventListener('submit', (e) => this.handleRaiseRequest(e));
        
        // Notifications
        document.getElementById('refresh-notifications').addEventListener('click', () => this.refreshNotifications());
        
        // Response actions
        document.getElementById('accept-btn').addEventListener('click', () => this.acceptRequest());
        document.getElementById('reject-btn').addEventListener('click', () => this.rejectRequest());
        
        // Payment verification
        document.getElementById('share-location').addEventListener('click', () => this.shareLocation());
        document.getElementById('send-message').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
        document.getElementById('verify-otp').addEventListener('click', () => this.verifyOTP());
        document.getElementById('back-to-hub').addEventListener('click', () => this.showPage('main-hub'));
        
        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetPage = e.target.closest('.back-btn').dataset.back;
                this.showPage(targetPage);
            });
        });
    }

    // Page Navigation
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        
        // Update page-specific content
        if (pageId === 'notifications-screen') {
            this.loadNotifications();
        } else if (pageId === 'main-hub') {
            this.updateNotificationCount();
        } else if (pageId === 'transaction-history') {
            this.loadTransactionHistory();
        } else if (pageId === 'analytics') {
            this.loadAnalytics();
        }
    }

    // User Authentication
    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !phone || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        this.showLoading(true);
        
        // Check if user exists (for demo, we'll also allow demo login)
        const userData = this.getUserData(username, phone);
        
        setTimeout(() => {
            if (userData) {
                // Verify password for registered users
                if (userData.password === password) {
                    this.currentUser = userData;
                    this.showLoading(false);
                    this.showPage('welcome-screen');
                    this.updateWelcomeMessage();
                    this.showToast(`Welcome back, ${username}!`, 'success');
                } else {
                    this.showLoading(false);
                    this.showToast('Invalid password. Please try again.', 'error');
                }
            } else if (username === 'demo' && phone === '1234567890' && password === 'demo123') {
                // Demo login
                this.currentUser = { 
                    username: username, 
                    phone: phone,
                    rating: 5.0,
                    completedTransactions: 0
                };
                
                this.showLoading(false);
                this.showPage('welcome-screen');
                this.updateWelcomeMessage();
                this.showToast('Demo login successful!', 'success');
            } else {
                // User not found
                this.showLoading(false);
                this.showToast('User not found. Please check your credentials or sign up.', 'error');
            }
        }, 1500);
    }

    showSignupPage(e) {
        e.preventDefault();
        this.showPage('signup-screen');
        this.clearForm('signupForm');
    }

    showLoginPage(e) {
        e.preventDefault();
        this.showPage('login-screen');
        this.clearForm('loginForm');
    }

    handleSignup(e) {
        e.preventDefault();
        
        // Get form values
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const phone = document.getElementById('signup-phone').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const termsAccepted = document.getElementById('signup-terms').checked;
        
        // Validation
        if (!this.validateSignupForm(username, email, phone, password, confirmPassword, termsAccepted)) {
            return;
        }
        
        this.showLoading(true);
        
        // Simulate signup process
        setTimeout(() => {
            // Create new user account
            const newUser = {
                id: Date.now(),
                username: username,
                email: email,
                phone: phone,
                password: password, // In real app, this would be hashed
                createdAt: new Date().toISOString(),
                rating: 5.0,
                completedTransactions: 0,
                isVerified: false
            };
            
            // Store user data (in real app, this would go to a database)
            this.storeUserData(newUser);
            
            this.showLoading(false);
            this.showToast('Account created successfully! Please login.', 'success');
            
            // Clear form and show login page
            this.clearForm('signupForm');
            this.showPage('login-screen');
        }, 2000);
    }

    validateSignupForm(username, email, phone, password, confirmPassword, termsAccepted) {
        // Username validation
        if (username.length < 3) {
            this.showToast('Username must be at least 3 characters long', 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return false;
        }
        
        // Phone validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            this.showToast('Please enter a valid phone number', 'error');
            return false;
        }
        
        // Password validation
        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters long', 'error');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return false;
        }
        
        // Terms acceptance
        if (!termsAccepted) {
            this.showToast('Please accept the terms and conditions', 'error');
            return false;
        }
        
        return true;
    }

    storeUserData(user) {
        // In a real app, this would be stored in a database
        // For demo purposes, we'll store in localStorage
        const users = JSON.parse(localStorage.getItem('liquex_users') || '[]');
        users.push(user);
        localStorage.setItem('liquex_users', JSON.stringify(users));
    }

    getUserData(username, phone) {
        const users = JSON.parse(localStorage.getItem('liquex_users') || '[]');
        return users.find(user => 
            (user.username === username || user.phone === phone)
        );
    }

    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        
        let strength = 0;
        let strengthClass = 'weak';
        let strengthLabel = 'Weak';
        
        // Length check
        if (password.length >= 6) strength += 1;
        if (password.length >= 8) strength += 1;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Determine strength level
        if (strength <= 2) {
            strengthClass = 'weak';
            strengthLabel = 'Weak';
        } else if (strength <= 3) {
            strengthClass = 'fair';
            strengthLabel = 'Fair';
        } else if (strength <= 4) {
            strengthClass = 'good';
            strengthLabel = 'Good';
        } else {
            strengthClass = 'strong';
            strengthLabel = 'Strong';
        }
        
        // Update UI
        strengthFill.className = `strength-fill ${strengthClass}`;
        strengthText.className = `strength-text ${strengthClass}`;
        strengthText.textContent = strengthLabel;
    }

    checkPasswordMatch() {
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const matchIndicator = document.getElementById('password-match');
        
        if (confirmPassword === '') {
            matchIndicator.innerHTML = '';
            return;
        }
        
        if (password === confirmPassword) {
            matchIndicator.innerHTML = '<i class="fas fa-check-circle"></i> Passwords match';
            matchIndicator.className = 'password-match match';
        } else {
            matchIndicator.innerHTML = '<i class="fas fa-times-circle"></i> Passwords do not match';
            matchIndicator.className = 'password-match no-match';
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.currentLocation = null;
        this.notifications = [];
        this.currentRequest = null;
        this.chatMessages = [];
        this.showPage('login-screen');
        this.clearForm('loginForm');
    }

    updateWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcome-message');
        if (this.currentUser) {
            welcomeMessage.textContent = `Welcome, ${this.currentUser.username}!`;
        }
    }

    // Location Services
    checkLocationPermission() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.showToast('Location access granted', 'success');
                },
                (error) => {
                    this.showToast('Location access denied. Some features may not work.', 'error');
                }
            );
        }
    }

    shareLocation() {
        if (!this.currentLocation) {
            this.showToast('Location not available', 'error');
            return;
        }
        
        this.showToast('Location shared successfully', 'success');
        document.getElementById('location-status').innerHTML = `
            <p><strong>Latitude:</strong> ${this.currentLocation.lat.toFixed(6)}</p>
            <p><strong>Longitude:</strong> ${this.currentLocation.lng.toFixed(6)}</p>
        `;
        
        // Show OTP section after location sharing
        setTimeout(() => {
            document.getElementById('otp-section').style.display = 'block';
            this.showToast('OTP verification required', 'info');
        }, 2000);
    }

    // Request Management
    handleRaiseRequest(e) {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const type = document.getElementById('request-type').value;
        const description = document.getElementById('description').value;
        const urgency = document.getElementById('request-urgency').value;
        const category = document.getElementById('request-category').value;
        
        if (!amount || !type || !urgency || !category) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        this.showLoading(true);
        
        // Simulate request creation
        setTimeout(() => {
            const newRequest = {
                id: Date.now(),
                amount: parseFloat(amount),
                type: type,
                description: description,
                urgency: urgency,
                category: category,
                requester: this.currentUser.username,
                timestamp: new Date().toISOString(),
                location: this.currentLocation,
                userRating: 5.0 // Default rating for new users
            };
            
            this.notifications.push(newRequest);
            this.showLoading(false);
            this.showToast('Request raised successfully!', 'success');
            this.showPage('main-hub');
            this.clearForm('requestForm');
        }, 1500);
    }

    loadNotifications() {
        const notificationsList = document.getElementById('notifications-list');
        notificationsList.innerHTML = '';

        // Filter out current user's own requests and show only nearby requests from other users
        const otherUsersRequests = this.notifications.filter(notification =>
            notification.requester !== this.currentUser.username
        );

        if (otherUsersRequests.length === 0) {
            notificationsList.innerHTML = '<p style="text-align: center; color: white; padding: 20px;">No requests from other users found</p>';
            return;
        }

        otherUsersRequests.forEach(notification => {
            const distance = this.currentLocation ?
                Math.round(this.calculateDistance(
                    this.currentLocation.lat, this.currentLocation.lng,
                    notification.location.lat, notification.location.lng
                )) : 'Unknown';

            const notificationItem = document.createElement('div');
            notificationItem.className = 'notification-item';
            notificationItem.innerHTML = `
                <div class="notification-header">
                    <span class="notification-amount">$${notification.amount}</span>
                    <div class="notification-meta">
                        <span class="notification-type">${notification.type}</span>
                        <span class="notification-urgency urgency-${notification.urgency}">${notification.urgency}</span>
                    </div>
                </div>
                <div class="notification-user">
                    <span>Requested by: ${notification.requester}</span>
                    <span class="user-rating">⭐ ${notification.userRating || 'N/A'}</span>
                </div>
                <div class="notification-details">
                    <span class="notification-distance">${distance}m away</span>
                    <span class="notification-category">${notification.category || 'General'}</span>
                </div>
                ${notification.description ? `<div class="notification-description">${notification.description}</div>` : ''}
                <div class="notification-time">${this.getTimeAgo(notification.timestamp)}</div>
            `;

            notificationItem.addEventListener('click', () => this.viewRequestDetails(notification));
            notificationsList.appendChild(notificationItem);
        });
    }

    viewRequestDetails(request) {
        this.currentRequest = request;
        const requestDetails = document.getElementById('request-details');
        
        requestDetails.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Amount:</span>
                <span class="detail-value">$${request.amount}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Type:</span>
                <span class="detail-value">${request.type}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Requester:</span>
                <span class="detail-value">${request.requester}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${new Date(request.timestamp).toLocaleString()}</span>
            </div>
            ${request.description ? `
                <div class="detail-row">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${request.description}</span>
                </div>
            ` : ''}
        `;
        
        this.showPage('notification-response');
    }

    acceptRequest() {
        if (!this.currentRequest) return;
        
        this.showToast('Request accepted! Proceeding to payment...', 'success');
        this.showPage('payment-verification');
        
        // Add initial chat message
        this.addChatMessage('Request accepted. Let\'s proceed with the payment.', 'sent');
        this.addChatMessage('Great! Please share your location so we can meet.', 'received');
    }

    rejectRequest() {
        this.showToast('Request rejected', 'info');
        this.showPage('main-hub');
    }

    // Chat System
    addChatMessage(message, type) {
        this.chatMessages.push({ message, type, timestamp: new Date() });
        this.updateChatDisplay();
    }

    updateChatDisplay() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';
        
        this.chatMessages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${msg.type}`;
            messageDiv.textContent = msg.message;
            chatMessages.appendChild(messageDiv);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addChatMessage(message, 'sent');
        input.value = '';
        
        // Simulate response
        setTimeout(() => {
            const responses = [
                'Thanks for the update!',
                'Perfect, I\'ll be there soon.',
                'Got it, see you shortly!',
                'Thanks for letting me know.'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addChatMessage(randomResponse, 'received');
        }, 1000);
    }

    // OTP Verification
    verifyOTP() {
        const otpInput = document.getElementById('otp-input');
        const otp = otpInput.value.trim();
        
        if (!otp || otp.length !== 6) {
            this.showToast('Please enter a valid 6-digit OTP', 'error');
            return;
        }
        
        this.showLoading(true);
        
        // Simulate OTP verification
        setTimeout(() => {
            this.showLoading(false);
            document.getElementById('otp-section').style.display = 'none';
            document.getElementById('payment-complete').style.display = 'block';
            
            // Add transaction to history
            if (this.currentRequest) {
                this.addTransaction({
                    amount: this.currentRequest.amount,
                    type: this.currentRequest.type,
                    requester: this.currentRequest.requester,
                    responder: this.currentUser.username,
                    status: 'completed',
                    rating: 5
                });
            }
            
            this.showToast('Payment completed successfully!', 'success');
        }, 2000);
    }

    // Utility Functions
    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    clearForm(formId) {
        document.getElementById(formId).reset();
    }

    updateNotificationCount() {
        const badge = document.getElementById('notification-count');
        badge.textContent = this.notifications.length;
    }

    refreshNotifications() {
        this.loadNotifications();
        this.showToast('Notifications refreshed', 'success');
    }



    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in kilometers
        return distance * 1000; // Convert to meters
    }

    // User Rating System
    rateUser(userId, rating, comment = '') {
        if (!this.userRatings[userId]) {
            this.userRatings[userId] = [];
        }
        
        this.userRatings[userId].push({
            rating: rating,
            comment: comment,
            timestamp: new Date().toISOString(),
            rater: this.currentUser.username
        });
        
        this.showToast('Rating submitted successfully!', 'success');
    }

    getUserAverageRating(userId) {
        if (!this.userRatings[userId] || this.userRatings[userId].length === 0) {
            return 0;
        }
        
        const totalRating = this.userRatings[userId].reduce((sum, rating) => sum + rating.rating, 0);
        return (totalRating / this.userRatings[userId].length).toFixed(1);
    }

    // Transaction History
    addTransaction(transaction) {
        this.transactionHistory.push({
            ...transaction,
            id: `TXN${Date.now()}`,
            timestamp: new Date().toISOString()
        });
    }

    getTransactionHistory() {
        return this.transactionHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Safe Meetup Spots
    getSafeMeetupSpots() {
        if (!window.demoData || !this.currentLocation) return [];
        
        return window.demoData.locationData.safeMeetupSpots.map(spot => {
            const distance = this.calculateDistance(
                this.currentLocation.lat, this.currentLocation.lng,
                spot.coordinates.lat, spot.coordinates.lng
            );
            return {
                ...spot,
                distance: Math.round(distance)
            };
        }).sort((a, b) => a.distance - b.distance);
    }

    // Enhanced Chat Features
    addTypingIndicator(userId) {
        const chatMessages = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = `typing-${userId}`;
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    removeTypingIndicator(userId) {
        const typingIndicator = document.getElementById(`typing-${userId}`);
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Request Analytics
    getRequestAnalytics() {
        const analytics = {
            totalRequests: this.notifications.length,
            byType: {},
            byUrgency: {},
            averageAmount: 0,
            totalAmount: 0
        };
        
        this.notifications.forEach(request => {
            // Count by type
            analytics.byType[request.type] = (analytics.byType[request.type] || 0) + 1;
            
            // Count by urgency
            analytics.byUrgency[request.urgency] = (analytics.byUrgency[request.urgency] || 0) + 1;
            
            // Calculate amounts
            analytics.totalAmount += request.amount;
        });
        
        analytics.averageAmount = analytics.totalAmount / analytics.totalRequests;
        
        return analytics;
    }

    // Load Transaction History
    loadTransactionHistory() {
        const transactionList = document.getElementById('transaction-list');
        transactionList.innerHTML = '';
        
        const transactions = this.getTransactionHistory();
        
        if (transactions.length === 0) {
            transactionList.innerHTML = '<p style="text-align: center; color: white; padding: 20px;">No transactions found</p>';
            return;
        }
        
        transactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
                <div class="transaction-header">
                    <span class="transaction-amount">$${transaction.amount}</span>
                    <span class="transaction-status status-${transaction.status}">${transaction.status}</span>
                </div>
                <div class="transaction-details">
                    <p><strong>Type:</strong> ${transaction.type}</p>
                    <p><strong>Requester:</strong> ${transaction.requester}</p>
                    <p><strong>Responder:</strong> ${transaction.responder}</p>
                    <p><strong>Time:</strong> ${this.getTimeAgo(transaction.timestamp)}</p>
                    ${transaction.rating ? `<p><strong>Rating:</strong> ⭐ ${transaction.rating}/5</p>` : ''}
                </div>
            `;
            
            transactionList.appendChild(transactionItem);
        });
    }

    // Load Analytics Dashboard
    loadAnalytics() {
        const analytics = this.getRequestAnalytics();
        
        // Update stats
        document.getElementById('total-requests').textContent = analytics.totalRequests;
        document.getElementById('avg-amount').textContent = `$${analytics.averageAmount.toFixed(2)}`;
        document.getElementById('total-value').textContent = `$${analytics.totalAmount.toFixed(2)}`;
        
        // Create simple charts
        this.createTypeChart(analytics.byType);
        this.createUrgencyChart(analytics.byUrgency);
    }

    createTypeChart(typeData) {
        const chartContainer = document.getElementById('type-chart');
        chartContainer.innerHTML = '';
        
        Object.entries(typeData).forEach(([type, count]) => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.cssText = `
                background: #667eea;
                height: ${(count / Math.max(...Object.values(typeData))) * 150}px;
                width: 60px;
                margin: 0 10px;
                border-radius: 4px 4px 0 0;
                position: relative;
            `;
            
            const label = document.createElement('div');
            label.textContent = type;
            label.style.cssText = `
                text-align: center;
                margin-top: 5px;
                font-size: 0.8rem;
                color: #666;
            `;
            
            const value = document.createElement('div');
            value.textContent = count;
            value.style.cssText = `
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-weight: 600;
                color: #667eea;
            `;
            
            bar.appendChild(value);
            
            const barContainer = document.createElement('div');
            barContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
            `;
            
            barContainer.appendChild(bar);
            barContainer.appendChild(label);
            chartContainer.appendChild(barContainer);
        });
        
        chartContainer.style.cssText = `
            display: flex;
            align-items: end;
            justify-content: center;
            gap: 20px;
            height: 200px;
            padding: 20px;
        `;
    }

    createUrgencyChart(urgencyData) {
        const chartContainer = document.getElementById('urgency-chart');
        chartContainer.innerHTML = '';
        
        const colors = { low: '#2ed573', medium: '#ffa502', high: '#ff4757' };
        
        Object.entries(urgencyData).forEach(([urgency, count]) => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.cssText = `
                background: ${colors[urgency] || '#667eea'};
                height: ${(count / Math.max(...Object.values(urgencyData))) * 150}px;
                width: 60px;
                margin: 0 10px;
                border-radius: 4px 4px 0 0;
                position: relative;
            `;
            
            const label = document.createElement('div');
            label.textContent = urgency;
            label.style.cssText = `
                text-align: center;
                margin-top: 5px;
                font-size: 0.8rem;
                color: #666;
            `;
            
            const value = document.createElement('div');
            value.textContent = count;
            value.style.cssText = `
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-weight: 600;
                color: ${colors[urgency] || '#667eea'};
            `;
            
            bar.appendChild(value);
            
            const barContainer = document.createElement('div');
            barContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
            `;
            
            barContainer.appendChild(bar);
            barContainer.appendChild(label);
            chartContainer.appendChild(barContainer);
        });
        
        chartContainer.style.cssText = `
            display: flex;
            align-items: end;
            justify-content: center;
            gap: 20px;
            height: 200px;
            padding: 20px;
        `;
    }

    // Utility Methods
    getTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInSeconds = Math.floor((now - past) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    // Mock Data for Demo
    loadMockData() {
        // Add some sample notifications for demo purposes
        this.notifications = [
            {
                id: 1,
                amount: 25.50,
                type: 'money',
                description: 'Need cash for lunch',
                requester: 'John Doe',
                timestamp: new Date(Date.now() - 300000).toISOString(),
                location: { lat: 40.7128, lng: -74.0060 },
                urgency: 'medium',
                category: 'food',
                userRating: 4.8
            },
            {
                id: 2,
                amount: 15.00,
                type: 'service',
                description: 'Help with grocery shopping',
                requester: 'Jane Smith',
                timestamp: new Date(Date.now() - 600000).toISOString(),
                location: { lat: 40.7128, lng: -74.0060 },
                urgency: 'low',
                category: 'shopping',
                userRating: 4.9
            },
            {
                id: 3,
                amount: 50.00,
                type: 'money',
                description: 'Emergency cash needed for taxi fare',
                requester: 'Mike Johnson',
                timestamp: new Date(Date.now() - 900000).toISOString(),
                location: { lat: 40.7125, lng: -74.0062 },
                urgency: 'high',
                category: 'transport',
                userRating: 4.7
            }
        ];
        
        // Load demo data from demo-data.js if available
        if (window.demoData) {
            this.notifications = window.demoData.sampleRequests;
            this.transactionHistory = window.demoData.transactionHistory;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LiquexApp();
});

// Add some additional utility functions
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance * 1000; // Convert to meters
}

// Simulate real-time location updates
setInterval(() => {
    if (window.liquexApp && window.liquexApp.currentLocation) {
        // Simulate small location changes for demo
        const change = (Math.random() - 0.5) * 0.0001;
        window.liquexApp.currentLocation.lat += change;
        window.liquexApp.currentLocation.lng += change;
    }
}, 30000); // Update every 30 seconds
