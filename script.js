// Global variables
let currentUser = null;
let currentTopic = '';
let currentQuestion = null;
let questionNumber = 1;
let totalQuestions = 10;
let correctAnswers = 0;
let selectedOption = null;

// User authentication and data management
class UserManager {
    static getUsers() {
        return JSON.parse(localStorage.getItem('mathQuestUsers') || '{}');
    }
    
    static saveUsers(users) {
        localStorage.setItem('mathQuestUsers', JSON.stringify(users));
    }
    
    static getUserData(username) {
        const users = this.getUsers();
        return users[username] || null;
    }
    
    static saveUserData(username, data) {
        const users = this.getUsers();
        users[username] = data;
        this.saveUsers(users);
    }
    
    static createUser(username, password, fullName) {
        const users = this.getUsers();
        if (users[username]) {
            return { success: false, message: 'Username already exists' };
        }
        
        users[username] = {
            password: password,
            fullName: fullName,
            stats: {
                totalXP: 0,
                level: 1,
                badges: [],
                topicProgress: {},
                questionsAnswered: 0,
                correctAnswers: 0,
                createdAt: new Date().toISOString()
            }
        };
        
        this.saveUsers(users);
        return { success: true, message: 'Account created successfully' };
    }
    
    static authenticateUser(username, password) {
        const users = this.getUsers();
        const user = users[username];
        
        if (!user || user.password !== password) {
            return { success: false, message: 'Invalid username or password' };
        }
        
        return { success: true, user: user };
    }
}

// Math question generator
class MathGenerator {
    static generateQuestion(topic) {
        switch (topic) {
            case 'algebra':
                return this.generateAlgebraQuestion();
            case 'geometry':
                return this.generateGeometryQuestion();
            case 'trigonometry':
                return this.generateTrigonometryQuestion();
            case 'calculus':
                return this.generateCalculusQuestion();
            default:
                return this.generateAlgebraQuestion();
        }
    }
    
    static generateAlgebraQuestion() {
        const types = ['linear', 'quadratic', 'system'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch (type) {
            case 'linear':
                return this.generateLinearEquation();
            case 'quadratic':
                return this.generateQuadraticQuestion();
            case 'system':
                return this.generateSystemQuestion();
            default:
                return this.generateLinearEquation();
        }
    }
    
    static generateLinearEquation() {
        const a = this.randomInt(2, 8);
        const b = this.randomInt(1, 15);
        const x = this.randomInt(1, 10);
        const result = a * x + b;
        
        return {
            question: `Solve for x: ${a}x + ${b} = ${result}`,
            answer: x,
            type: 'input'
        };
    }
    
    static generateQuadraticQuestion() {
        const a = this.randomInt(1, 3);
        const root1 = this.randomInt(1, 5);
        const root2 = this.randomInt(1, 5);
        
        const b = -(a * root2 + root1);
        const c = root1 * root2;
        
        const answer = Math.max(root1, root2);
        
        return {
            question: `Find the larger root of: ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
            answer: answer,
            options: this.generateOptions(answer),
            type: 'multiple-choice'
        };
    }
    
    static generateSystemQuestion() {
        const x = this.randomInt(1, 8);
        const y = this.randomInt(1, 8);
        const a1 = this.randomInt(1, 4);
        const b1 = this.randomInt(1, 4);
        const a2 = this.randomInt(1, 4);
        const b2 = this.randomInt(1, 4);
        
        const c1 = a1 * x + b1 * y;
        const c2 = a2 * x + b2 * y;
        
        return {
            question: `Solve the system: ${a1}x + ${b1}y = ${c1} and ${a2}x + ${b2}y = ${c2}. Find x + y.`,
            answer: x + y,
            type: 'input'
        };
    }
    
    static generateGeometryQuestion() {
        const types = ['area-rectangle', 'area-circle', 'area-triangle', 'pythagorean'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch (type) {
            case 'area-rectangle':
                return this.generateRectangleArea();
            case 'area-circle':
                return this.generateCircleArea();
            case 'area-triangle':
                return this.generateTriangleArea();
            case 'pythagorean':
                return this.generatePythagoreanQuestion();
            default:
                return this.generateRectangleArea();
        }
    }
    
    static generateRectangleArea() {
        const length = this.randomInt(5, 15);
        const width = this.randomInt(3, 12);
        
        return {
            question: `Find the area of a rectangle with length ${length} units and width ${width} units.`,
            answer: length * width,
            type: 'input'
        };
    }
    
    static generateCircleArea() {
        const radius = this.randomInt(3, 10);
        const area = Math.round(Math.PI * radius * radius * 100) / 100;
        
        return {
            question: `Find the area of a circle with radius ${radius} units. (Use π ≈ 3.14159, round to 2 decimal places)`,
            answer: area,
            options: this.generateOptions(area, true),
            type: 'multiple-choice'
        };
    }
    
    static generateTriangleArea() {
        const base = this.randomInt(4, 12);
        const height = this.randomInt(3, 10);
        const area = (base * height) / 2;
        
        return {
            question: `Find the area of a triangle with base ${base} units and height ${height} units.`,
            answer: area,
            type: 'input'
        };
    }
    
    static generatePythagoreanQuestion() {
        const triples = [[3,4,5], [5,12,13], [8,15,17], [6,8,10]];
        const triple = triples[Math.floor(Math.random() * triples.length)];
        const [a, b, c] = triple.map(x => x * this.randomInt(1, 2));
        
        const missingType = Math.floor(Math.random() * 3);
        
        if (missingType === 0) {
            return {
                question: `In a right triangle, if one leg is ${a} and the hypotenuse is ${c}, find the other leg.`,
                answer: b,
                type: 'input'
            };
        } else if (missingType === 1) {
            return {
                question: `In a right triangle, if the legs are ${a} and ${b}, find the hypotenuse.`,
                answer: c,
                type: 'input'
            };
        } else {
            return {
                question: `In a right triangle, if one leg is ${b} and the hypotenuse is ${c}, find the other leg.`,
                answer: a,
                type: 'input'
            };
        }
    }
    
    static generateTrigonometryQuestion() {
        const angles = [0, 30, 45, 60, 90];
        const functions = ['sin', 'cos', 'tan'];
        
        const angle = angles[Math.floor(Math.random() * angles.length)];
        const func = functions[Math.floor(Math.random() * functions.length)];
        
        const values = {
            sin: { 0: 0, 30: 0.5, 45: 0.707, 60: 0.866, 90: 1 },
            cos: { 0: 1, 30: 0.866, 45: 0.707, 60: 0.5, 90: 0 },
            tan: { 0: 0, 30: 0.577, 45: 1, 60: 1.732, 90: 'undefined' }
        };
        
        const answer = values[func][angle];
        
        if (answer === 'undefined') {
            return this.generateTrigonometryQuestion(); // Regenerate
        }
        
        return {
            question: `Find ${func}(${angle}°). Round to 3 decimal places if necessary.`,
            answer: answer,
            options: this.generateOptions(answer, true),
            type: 'multiple-choice'
        };
    }
    
    static generateCalculusQuestion() {
        const types = ['derivative', 'integral', 'limit'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch (type) {
            case 'derivative':
                return this.generateDerivativeQuestion();
            case 'integral':
                return this.generateIntegralQuestion();
            case 'limit':
                return this.generateLimitQuestion();
            default:
                return this.generateDerivativeQuestion();
        }
    }
    
    static generateDerivativeQuestion() {
        const a = this.randomInt(1, 5);
        const b = this.randomInt(1, 8);
        const c = this.randomInt(1, 10);
        const x = this.randomInt(1, 3);
        
        const derivative = 3 * a * x * x + 2 * b * x + c;
        
        return {
            question: `Find f'(${x}) if f(x) = ${a}x³ + ${b}x² + ${c}x`,
            answer: derivative,
            type: 'input'
        };
    }
    
    static generateIntegralQuestion() {
        const coeff = this.randomInt(1, 6);
        const power = this.randomInt(2, 4);
        const result = Math.round((coeff / (power + 1)) * 1000) / 1000;
        
        return {
            question: `Find the coefficient of x^${power + 1} in ∫${coeff}x^${power} dx`,
            answer: result,
            options: this.generateOptions(result, true),
            type: 'multiple-choice'
        };
    }
    
    static generateLimitQuestion() {
        const a = this.randomInt(1, 5);
        const b = this.randomInt(1, 8);
        const x = this.randomInt(1, 4);
        const limit = a * x + b;
        
        return {
            question: `Find lim(x→${x}) (${a}x + ${b})`,
            answer: limit,
            type: 'input'
        };
    }
    
    static generateOptions(correct, isFloat = false) {
        const options = [correct];
        const range = Math.max(Math.abs(correct * 0.5), 5);
        
        while (options.length < 4) {
            let wrongAnswer;
            if (isFloat) {
                wrongAnswer = Math.round((correct + (Math.random() - 0.5) * range) * 100) / 100;
            } else {
                wrongAnswer = correct + Math.floor((Math.random() - 0.5) * range);
            }
            
            if (!options.includes(wrongAnswer) && wrongAnswer !== correct) {
                options.push(wrongAnswer);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Game logic
class GameLogic {
    static getXPForTopic(topic) {
        const xpMap = {
            algebra: 10,
            geometry: 12,
            trigonometry: 15,
            calculus: 20
        };
        return xpMap[topic] || 10;
    }
    
    static calculateLevel(xp) {
        return Math.floor(xp / 100) + 1;
    }
    
    static getXPForNextLevel(level) {
        return level * 100;
    }
    
    static getLevelProgress(xp, level) {
        const currentLevelXP = (level - 1) * 100;
        const progressInLevel = xp - currentLevelXP;
        return Math.max(0, Math.min(100, (progressInLevel / 100) * 100));
    }
    
    static checkForBadges(stats) {
        const badges = [];
        
        if (stats.correctAnswers >= 1 && !stats.badges.includes('First Blood')) {
            badges.push('First Blood');
        }
        if (stats.correctAnswers >= 5 && !stats.badges.includes('Quick Learner')) {
            badges.push('Quick Learner');
        }
        if (stats.correctAnswers >= 10 && !stats.badges.includes('Math Warrior')) {
            badges.push('Math Warrior');
        }
        if (stats.totalXP >= 100 && !stats.badges.includes('Century Club')) {
            badges.push('Century Club');
        }
        if (stats.totalXP >= 500 && !stats.badges.includes('Math Master')) {
            badges.push('Math Master');
        }
        
        return badges;
    }
    
    static getTopicDisplayName(topic) {
        const nameMap = {
            algebra: 'Algebra Island',
            geometry: 'Geometry Grove',
            trigonometry: 'Trigonometry Territory',
            calculus: 'Calculus Castle'
        };
        return nameMap[topic] || topic;
    }
    
    static isTopicUnlocked(topic, level) {
        const requirements = {
            algebra: 1,
            geometry: 1,
            trigonometry: 3,
            calculus: 5
        };
        return level >= requirements[topic];
    }
}

// UI Management
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId + 'Page').classList.add('active');
    
    // Update page content based on current page
    if (pageId === 'topicMap') {
        updateTopicMap();
    } else if (pageId === 'dashboard') {
        updateDashboard();
    }
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide forms
    if (tabName === 'login') {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
    } else {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
    }
    
    // Clear message
    document.getElementById('authMessage').textContent = '';
    document.getElementById('authMessage').className = 'message';
}

function showMessage(message, type) {
    const messageEl = document.getElementById('authMessage');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
}

function updateHeader() {
    if (!currentUser) return;
    
    const stats = currentUser.stats;
    document.getElementById('welcomeText').textContent = `Welcome, ${currentUser.fullName}!`;
    document.getElementById('headerXP').textContent = `${stats.totalXP} XP`;
    document.getElementById('headerLevel').textContent = `Level ${stats.level}`;
    document.getElementById('headerBadges').textContent = `${stats.badges.length} Badges`;
}

function updateTopicMap() {
    if (!currentUser) return;
    
    const stats = currentUser.stats;
    const topicCards = document.querySelectorAll('.topic-card');
    
    topicCards.forEach(card => {
        const topic = card.dataset.topic;
        const isUnlocked = GameLogic.isTopicUnlocked(topic, stats.level);
        const progress = stats.topicProgress[topic] || 0;
        
        // Update lock status
        if (isUnlocked) {
            card.classList.remove('locked');
            card.querySelector('.topic-btn').disabled = false;
            card.querySelector('.topic-btn').textContent = 'Start Quest';
        } else {
            card.classList.add('locked');
            card.querySelector('.topic-btn').disabled = true;
            card.querySelector('.topic-btn').textContent = 'Locked';
        }
        
        // Update progress
        card.querySelector('.progress').textContent = `${progress}% Complete`;
        card.querySelector('.progress-fill').style.width = `${progress}%`;
    });
}

function updateDashboard() {
    if (!currentUser) return;
    
    const stats = currentUser.stats;
    
    // Update stats overview
    document.getElementById('totalXP').textContent = stats.totalXP;
    document.getElementById('currentLevel').textContent = stats.level;
    document.getElementById('badgeCount').textContent = stats.badges.length;
    document.getElementById('badgesRemaining').textContent = `${5 - stats.badges.length} more to collect`;
    
    const nextLevelXP = GameLogic.getXPForNextLevel(stats.level);
    document.getElementById('xpToNext').textContent = `${nextLevelXP - stats.totalXP} XP to next level`;
    
    const levelProgress = GameLogic.getLevelProgress(stats.totalXP, stats.level);
    document.getElementById('levelProgressBar').style.width = `${levelProgress}%`;
    
    // Count mastered topics (80%+ completion)
    const masteredTopics = Object.values(stats.topicProgress).filter(progress => progress >= 80).length;
    document.getElementById('topicsMastered').textContent = masteredTopics;
    
    // Update topic progress
    updateTopicProgressList();
    
    // Update badge collection
    updateBadgeCollection();
    
    // Update statistics
    document.getElementById('questionsAttempted').textContent = stats.questionsAnswered;
    document.getElementById('correctAnswers').textContent = stats.correctAnswers;
    const accuracy = stats.questionsAnswered > 0 ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100) : 0;
    document.getElementById('accuracyRate').textContent = `${accuracy}%`;
    
    document.getElementById('dashboardWelcome').textContent = `Keep up the great work, ${currentUser.fullName}!`;
}

function updateTopicProgressList() {
    const container = document.getElementById('topicProgressList');
    container.innerHTML = '';
    
    const topics = ['algebra', 'geometry', 'trigonometry', 'calculus'];
    const topicNames = {
        algebra: 'Algebra Island',
        geometry: 'Geometry Grove',
        trigonometry: 'Trigonometry Territory',
        calculus: 'Calculus Castle'
    };
    
    topics.forEach(topic => {
        const progress = currentUser.stats.topicProgress[topic] || 0;
        
        const item = document.createElement('div');
        item.innerHTML = `
            <div class="topic-progress-item">
                <span class="topic-name">${topicNames[topic]}</span>
                <span class="topic-percent">${progress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%; background: ${getProgressColor(progress)}"></div>
            </div>
        `;
        
        container.appendChild(item);
    });
}

function getProgressColor(progress) {
    if (progress >= 80) return '#28a745';
    if (progress >= 60) return '#ffc107';
    if (progress >= 40) return '#fd7e14';
    return '#dc3545';
}

function updateBadgeCollection() {
    const container = document.getElementById('badgeCollection');
    container.innerHTML = '';
    
    const allBadges = {
        'First Blood': 'Answered your first question correctly',
        'Quick Learner': 'Got 5 questions right',
        'Math Warrior': 'Completed 10 questions correctly',
        'Century Club': 'Earned 100+ XP',
        'Math Master': 'Reached 500+ XP'
    };
    
    Object.entries(allBadges).forEach(([badge, description]) => {
        const hasEarned = currentUser.stats.badges.includes(badge);
        
        const item = document.createElement('div');
        item.className = `badge-item ${hasEarned ? 'earned' : ''}`;
        item.innerHTML = `
            <span class="badge-icon">🏆</span>
            <div class="badge-name">${badge}</div>
            <div class="badge-desc">${description}</div>
        `;
        
        container.appendChild(item);
    });
}

// Quiz functions
function startQuiz(topic) {
    currentTopic = topic;
    questionNumber = 1;
    correctAnswers = 0;
    
    document.getElementById('quizTopicTitle').textContent = GameLogic.getTopicDisplayName(topic);
    
    showPage('quiz');
    generateNewQuestion();
}

function generateNewQuestion() {
    currentQuestion = MathGenerator.generateQuestion(currentTopic);
    
    // Update question display
    document.getElementById('questionText').textContent = currentQuestion.question;
    document.getElementById('questionNumber').textContent = `Question ${questionNumber} of ${totalQuestions}`;
    document.getElementById('quizProgressBar').style.width = `${(questionNumber / totalQuestions) * 100}%`;
    
    // Show appropriate input method
    if (currentQuestion.type === 'input') {
        document.getElementById('inputAnswer').classList.remove('hidden');
        document.getElementById('multipleChoice').classList.add('hidden');
        document.getElementById('answerInput').value = '';
        document.getElementById('answerInput').focus();
    } else {
        document.getElementById('inputAnswer').classList.add('hidden');
        document.getElementById('multipleChoice').classList.remove('hidden');
        
        // Set up multiple choice options
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach((btn, index) => {
            btn.textContent = currentQuestion.options[index];
            btn.classList.remove('selected');
            btn.onclick = () => selectOption(btn, currentQuestion.options[index]);
        });
        selectedOption = null;
    }
    
    // Show/hide appropriate sections
    document.getElementById('quizActions').classList.remove('hidden');
    document.getElementById('resultSection').classList.add('hidden');
    
    // Update quiz stats
    updateQuizStats();
}

function selectOption(btn, value) {
    // Remove selection from all buttons
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    
    // Select clicked button
    btn.classList.add('selected');
    selectedOption = value;
}

function submitAnswer() {
    let userAnswer;
    
    if (currentQuestion.type === 'input') {
        userAnswer = parseFloat(document.getElementById('answerInput').value);
        if (isNaN(userAnswer)) {
            alert('Please enter a valid number');
            return;
        }
    } else {
        if (selectedOption === null) {
            alert('Please select an answer');
            return;
        }
        userAnswer = selectedOption;
    }
    
    // Check if answer is correct
    const isCorrect = Math.abs(userAnswer - currentQuestion.answer) < 0.01;
    
    // Update stats
    currentUser.stats.questionsAnswered++;
    if (isCorrect) {
        correctAnswers++;
        currentUser.stats.correctAnswers++;
        
        const xpGain = GameLogic.getXPForTopic(currentTopic);
        currentUser.stats.totalXP += xpGain;
        currentUser.stats.level = GameLogic.calculateLevel(currentUser.stats.totalXP);
        
        // Check for new badges
        const newBadges = GameLogic.checkForBadges(currentUser.stats);
        newBadges.forEach(badge => {
            if (!currentUser.stats.badges.includes(badge)) {
                currentUser.stats.badges.push(badge);
            }
        });
        
        // Show XP gained
        document.getElementById('xpGained').textContent = `+${xpGain} XP earned!`;
        document.getElementById('xpGained').classList.remove('hidden');
    } else {
        document.getElementById('xpGained').classList.add('hidden');
    }
    
    // Save user data
    UserManager.saveUserData(currentUser.username, currentUser);
    
    // Show result
    showQuizResult(isCorrect);
    
    // Update header
    updateHeader();
}

function showQuizResult(isCorrect) {
    // Hide quiz actions
    document.getElementById('quizActions').classList.add('hidden');
    
    // Show result section
    const resultSection = document.getElementById('resultSection');
    resultSection.classList.remove('hidden');
    resultSection.className = `result-section ${isCorrect ? 'correct' : 'incorrect'}`;
    
    // Update result content
    document.getElementById('resultIcon').textContent = isCorrect ? '✅' : '❌';
    document.getElementById('resultText').textContent = isCorrect ? 'Correct!' : 'Incorrect';
    document.getElementById('resultText').className = `result-text ${isCorrect ? 'correct' : 'incorrect'}`;
    document.getElementById('correctAnswer').textContent = `The correct answer is: ${currentQuestion.answer}`;
    
    // Update next button text
    const nextBtn = document.getElementById('nextQuestion');
    nextBtn.textContent = questionNumber >= totalQuestions ? 'Complete Quiz' : 'Next Question';
}

function nextQuestion() {
    if (questionNumber >= totalQuestions) {
        completeQuiz();
    } else {
        questionNumber++;
        generateNewQuestion();
    }
}

function completeQuiz() {
    // Update topic progress
    const progress = Math.round((correctAnswers / totalQuestions) * 100);
    const currentProgress = currentUser.stats.topicProgress[currentTopic] || 0;
    currentUser.stats.topicProgress[currentTopic] = Math.max(currentProgress, progress);
    
    // Save user data
    UserManager.saveUserData(currentUser.username, currentUser);
    
    // Return to topic map
    showPage('topicMap');
    
    // Show completion message
    alert(`Quiz completed! You got ${correctAnswers}/${totalQuestions} questions correct (${progress}%).`);
}

function updateQuizStats() {
    const attempted = questionNumber - 1;
    document.getElementById('currentScore').textContent = `${correctAnswers}/${attempted}`;
    
    const accuracy = attempted > 0 ? Math.round((correctAnswers / attempted) * 100) : 0;
    document.getElementById('currentAccuracy').textContent = `${accuracy}%`;
}

function logout() {
    currentUser = null;
    document.getElementById('header').classList.add('hidden');
    showPage('login');
    
    // Clear forms
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    document.getElementById('authMessage').textContent = '';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        const result = UserManager.authenticateUser(username, password);
        
        if (result.success) {
            currentUser = result.user;
            currentUser.username = username; // Store username for saving data
            
            document.getElementById('header').classList.remove('hidden');
            updateHeader();
            showPage('topicMap');
            showMessage('Login successful!', 'success');
        } else {
            showMessage(result.message, 'error');
        }
    });
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('registerName').value;
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        
        const result = UserManager.createUser(username, password, fullName);
        
        if (result.success) {
            showMessage(result.message, 'success');
            // Switch to login tab
            switchTab('login');
            document.querySelector('.tab-btn').click();
        } else {
            showMessage(result.message, 'error');
        }
    });
    
    // Topic card clicks
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                const topic = this.dataset.topic;
                startQuiz(topic);
            }
        });
    });
    
    // Quiz submit button
    document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
    
    // Next question button
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    
    // Enter key for answer input
    document.getElementById('answerInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
    
    // Start with login page
    showPage('login');
});