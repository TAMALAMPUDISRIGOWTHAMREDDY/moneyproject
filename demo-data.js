// Demo Data for Liquex App
// This file contains sample data to demonstrate the app's features

const demoData = {
    users: [
        {
            id: 1,
            username: "John Doe",
            phone: "+1-555-0101",
            location: { lat: 40.7128, lng: -74.0060 },
            rating: 4.8,
            completedTransactions: 15
        },
        {
            id: 2,
            username: "Jane Smith",
            phone: "+1-555-0102",
            location: { lat: 40.7130, lng: -74.0058 },
            rating: 4.9,
            completedTransactions: 23
        },
        {
            id: 3,
            username: "Mike Johnson",
            phone: "+1-555-0103",
            location: { lat: 40.7125, lng: -74.0062 },
            rating: 4.7,
            completedTransactions: 8
        },
        {
            id: 4,
            username: "Sarah Wilson",
            phone: "+1-555-0104",
            location: { lat: 40.7132, lng: -74.0055 },
            rating: 4.6,
            completedTransactions: 12
        }
    ],
    
    sampleRequests: [
        {
            id: 1,
            amount: 25.50,
            type: "money",
            description: "Need cash for lunch at the food court. Will pay back tomorrow!",
            requester: "John Doe",
            timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
            location: { lat: 40.7128, lng: -74.0060 },
            urgency: "medium",
            category: "food"
        },
        {
            id: 2,
            amount: 15.00,
            type: "service",
            description: "Help with grocery shopping. Need someone to pick up a few items.",
            requester: "Jane Smith",
            timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
            location: { lat: 40.7130, lng: -74.0058 },
            urgency: "low",
            category: "shopping"
        },
        {
            id: 3,
            amount: 50.00,
            type: "money",
            description: "Emergency cash needed for taxi fare. Will transfer immediately.",
            requester: "Mike Johnson",
            timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
            location: { lat: 40.7125, lng: -74.0062 },
            urgency: "high",
            category: "transport"
        },
        {
            id: 4,
            amount: 30.00,
            type: "goods",
            description: "Looking for someone to deliver a small package within the area.",
            requester: "Sarah Wilson",
            timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
            location: { lat: 40.7132, lng: -74.0055 },
            urgency: "medium",
            category: "delivery"
        }
    ],
    
    chatTemplates: {
        greetings: [
            "Hi! I'm interested in your request.",
            "Hello! I can help you with that.",
            "Hey there! I'd like to assist you.",
            "Good day! I'm available to help."
        ],
        questions: [
            "When do you need this by?",
            "Where would you like to meet?",
            "Is there anything specific I should know?",
            "What's the best time for you?"
        ],
        confirmations: [
            "Perfect! I'll be there soon.",
            "Great! See you in a bit.",
            "Excellent! I'm on my way.",
            "Awesome! I'll meet you there."
        ]
    },
    
    locationData: {
        nearbyPlaces: [
            { name: "Central Park", distance: 150, type: "landmark" },
            { name: "Coffee Shop", distance: 200, type: "business" },
            { name: "Subway Station", distance: 300, type: "transport" },
            { name: "Shopping Mall", distance: 450, type: "business" },
            { name: "Library", distance: 600, type: "public" }
        ],
        
        safeMeetupSpots: [
            { name: "Central Park Bench", coordinates: { lat: 40.7128, lng: -74.0060 }, safety: "high" },
            { name: "Coffee Shop Entrance", coordinates: { lat: 40.7130, lng: -74.0058 }, safety: "high" },
            { name: "Subway Station Platform", coordinates: { lat: 40.7125, lng: -74.0062 }, safety: "medium" },
            { name: "Shopping Mall Food Court", coordinates: { lat: 40.7132, lng: -74.0055 }, safety: "high" }
        ]
    },
    
    transactionHistory: [
        {
            id: "TXN001",
            amount: 20.00,
            type: "money",
            requester: "John Doe",
            responder: "DemoUser",
            status: "completed",
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            rating: 5
        },
        {
            id: "TXN002",
            amount: 35.50,
            type: "service",
            requester: "DemoUser",
            responder: "Jane Smith",
            status: "completed",
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            rating: 4
        }
    ],
    
    // Helper function to get random demo data
    getRandomUser() {
        return this.users[Math.floor(Math.random() * this.users.length)];
    },
    
    getRandomRequest() {
        return this.sampleRequests[Math.floor(Math.random() * this.sampleRequests.length)];
    },
    
    getRandomChatMessage(type = 'greetings') {
        const messages = this.chatTemplates[type] || this.chatTemplates.greetings;
        return messages[Math.floor(Math.random() * messages.length)];
    },
    
    // Generate a realistic OTP
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },
    
    // Calculate distance between two points (Haversine formula)
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
    },
    
    // Filter requests by distance
    getNearbyRequests(userLat, userLng, maxDistance = 700) {
        return this.sampleRequests.filter(request => {
            const distance = this.calculateDistance(
                userLat, userLng,
                request.location.lat, request.location.lng
            );
            return distance <= maxDistance;
        });
    }
};

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = demoData;
}

// Make available globally for the app
window.demoData = demoData;
