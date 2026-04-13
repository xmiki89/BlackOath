// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    checkRegistration();
    setupRegistrationForm();
    setupUserLogout();
    initializeChart();
    setupNavigation();
    setupRealTimeUpdates();
    setupActionButtons();
});

// Setup user logout functionality
function setupUserLogout() {
    const logoutBtn = document.getElementById('userLogoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            userLogout();
        });
    }
}

// User logout function
function userLogout() {
    if (confirm('Möchtest du dich wirklich ausloggen? Du musst dich erneut registrieren.')) {
        // Remove registration data
        localStorage.removeItem('userRegistered');
        localStorage.removeItem('userRegistration');
        
        showNotification('Erfolgreich ausgeloggt!', 'success');
        
        // Reload page to show registration overlay
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Check if user is registered
function checkRegistration() {
    const isRegistered = localStorage.getItem('userRegistered');
    const registrationOverlay = document.getElementById('registrationOverlay');
    const dashboardContent = document.getElementById('dashboardContent');
    const logoutBtn = document.getElementById('userLogoutBtn');
    
    if (isRegistered === 'true') {
        // User is registered, hide overlay and show dashboard
        registrationOverlay.classList.add('hidden');
        dashboardContent.classList.add('registered');
        
        // Show logout button
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
        }
    } else {
        // User is not registered, show overlay and hide dashboard
        registrationOverlay.classList.remove('hidden');
        dashboardContent.classList.remove('registered');
        
        // Hide logout button
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
    }
}

// Setup registration form
function setupRegistrationForm() {
    const form = document.getElementById('registrationForm');
    const messageDiv = document.getElementById('registrationMessage');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('regName').value.trim();
        const nachname = document.getElementById('regNachname').value.trim();
        const id = document.getElementById('regId').value.trim();
        
        // Clear previous messages
        messageDiv.innerHTML = '';
        messageDiv.className = '';
        
        // Validate inputs
        if (!name || !nachname || !id) {
            messageDiv.innerHTML = '<div class="registration-error">Bitte alle Felder ausfüllen!</div>';
            return;
        }
        
        if (name.length < 2 || nachname.length < 2) {
            messageDiv.innerHTML = '<div class="registration-error">Name und Nachname müssen mindestens 2 Zeichen lang sein!</div>';
            return;
        }
        
        if (id.length < 3) {
            messageDiv.innerHTML = '<div class="registration-error">ID muss mindestens 3 Zeichen lang sein!</div>';
            return;
        }
        
        // Save registration data
        const registrationData = {
            name: name,
            nachname: nachname,
            id: id,
            registrationDate: new Date().toISOString(),
            fullName: `${name} ${nachname}`
        };
        
        localStorage.setItem('userRegistration', JSON.stringify(registrationData));
        localStorage.setItem('userRegistered', 'true');
        
        // Save to text file
        saveMemberToFile(name, nachname, id);
        
        // Show success message
        messageDiv.innerHTML = '<div class="registration-success">Registrierung erfolgreich! Willkommen bei Black Oath.</div>';
        
        // Add to member list
        const memberList = loadMemberList();
        if (!memberList.some(m => m.name === registrationData.fullName)) {
            memberList.push({ name: registrationData.fullName });
            saveMemberList(memberList);
        }
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
            checkRegistration();
        }, 1500);
    });
}

// Save member data to text file
async function saveMemberToFile(name, nachname, id) {
    const timestamp = new Date().toLocaleString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    const memberData = `Name: ${name}, Nachname: ${nachname}, ID: ${id}, Datum: ${timestamp}\n`;
    
    try {
        // Save via server endpoint
        const response = await fetch('/save-member', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: memberData
        });
        
        if (response.ok) {
            console.log('Mitgliedsdaten erfolgreich in Datei gespeichert');
        } else {
            console.error('Fehler beim Speichern der Mitgliedsdaten');
        }
    } catch (error) {
        console.error('Server nicht erreichbar:', error);
    }
}
function initializeChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    // Chart deactivated - no data display
    return;
}

// Setup navigation functionality
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Here you could add page switching logic
            const pageName = this.textContent.toLowerCase();
            console.log(`Navigation zur ${pageName}-Seite`);
            handleNavigation(pageName);
        });
    });
}

// Setup real-time updates simulation
function setupRealTimeUpdates() {
    // All automatic updates deactivated
    // setInterval(updateActivityTimes, 30000);
}

// Aktualisieren Sie die Statistiken mit zufälligen Änderungen
function updateStats() {
    // Function deactivated - no more number updates
    return;
}

// Add new activity to the feed
function addNewActivity() {
    const activities = [
        { icon: '🔔', text: 'Neue Benutzerregistrierung festgestellt' },
        { icon: '💰', text: 'Zahlung verarbeitet' },
        { icon: '📊', text: 'Wochenbericht erfolgreich erstellt' },
        { icon: '⚠️', text: 'Serverlast über Schwellenwert' },
        { icon: '✅', text: 'System-Backup abgeschlossen' },
        { icon: '🚀', text: 'Neue Funktion erfolgreich bereitgestellt' },
        { icon: '📈', text: 'Traffic-Zunahme festgestellt' },
        { icon: '🔒', text: 'Sicherheits-Scan abgeschlossen' }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const timestamp = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    
    // Store activity in localStorage to persist across page changes
    const savedActivities = JSON.parse(localStorage.getItem('activities') || '[]');
    savedActivities.unshift({
        icon: randomActivity.icon,
        text: randomActivity.text,
        time: timestamp
    });
    
    // Keep only the latest 20 activities
    if (savedActivities.length > 20) {
        savedActivities.splice(20);
    }
    
    localStorage.setItem('activities', JSON.stringify(savedActivities));
    
    // Try to add to current activity list if it exists
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        addActivityItem(activityList);
    }
}

// Update activity time stamps
function updateActivityTimes() {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    const activityItems = document.querySelectorAll('.activity-item');
    const times = ['Gerade eben', 'Vor 1 Minute', 'Vor 2 Minuten', 'Vor 5 Minuten', 'Vor 15 Minuten', 'Vor 30 Minuten', 'Vor 1 Stunde', 'Vor 2 Stunden', 'Vor 3 Stunden'];
    
    activityItems.forEach((item, index) => {
        const timeElement = item.querySelector('.activity-time');
        if (timeElement && index < times.length) {
            timeElement.textContent = times[index];
        }
    });
    
    // Update localStorage with new time stamps
    activities.forEach((activity, index) => {
        if (index < times.length) {
            activity.time = times[index];
        }
    });
    localStorage.setItem('activities', JSON.stringify(activities));
}

// Setup action button functionality
function setupActionButtons() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            handleAction(action);
        });
    });
}

// Handle different actions
function handleAction(action) {
    switch(action) {
        case 'Bericht erstellen':
            generateReport();
            break;
        case 'Daten exportieren':
            exportData();
            break;
        case 'Benutzerverwaltung':
            openUserManagement();
            break;
        case 'Systemeinstellungen':
            openSettings();
            break;
        default:
            console.log(`Unbekannte Aktion: ${action}`);
    }
}

// Handle navigation clicks
function handleNavigation(pageName) {
    switch(pageName) {
        case 'mitglieder':
            showMitglieder();
            break;
        case 'dashboard':
            showDashboard();
            break;
        case 'analytik':
            showAnalytik();
            break;
        case 'admin':
            showEinstellungen(); // Admin page with password
            break;
        case 'verträge':
            showVertraege();
            break;
        default:
            console.log(`Unbekannte Seite: ${pageName}`);
    }
}

// Add role to member
function addRole(button) {
    const roleInput = button.previousElementSibling;
    const roleText = button.textContent;
    const mitgliedInfo = button.closest('.mitglied-info');
    
    // Remove input container and add role
    const roleContainer = button.closest('.role-input-container');
    roleContainer.remove();
    
    // Add role display
    const roleDisplay = document.createElement('p');
    roleDisplay.className = 'mitglied-role';
    roleDisplay.textContent = roleText;
    mitgliedInfo.appendChild(roleDisplay);
    
    // Save role to localStorage
    saveMemberRole('Bryan Cooper', roleText);
    
    showNotification(`Rolle "${roleText}" wurde gespeichert!`, 'success');
}

// Save member role to localStorage
function saveMemberRole(memberName, role) {
    const members = JSON.parse(localStorage.getItem('mitglieder') || '{}');
    members[memberName] = role;
    localStorage.setItem('mitglieder', JSON.stringify(members));
}

// Load saved member roles
function loadSavedRoles() {
    const members = JSON.parse(localStorage.getItem('mitglieder') || '{}');
    return members;
}

// Load saved member list
function loadMemberList() {
    const members = JSON.parse(localStorage.getItem('memberList') || '[]');
    return members;
}

// Save member list
function saveMemberList(members) {
    localStorage.setItem('memberList', JSON.stringify(members));
}

// Check admin access
function checkAdminAccess() {
    const password = localStorage.getItem('adminPassword');
    return password; // Accept any password
}

// Save registration to text file
async function saveRegistrationToFile(firstname, lastname, password) {
    const registrationData = `Registration: ${firstname} ${lastname} - Password: ${password}\n`;
    
    try {
        // Use fetch to save to server-side file
        const response = await fetch('/save-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: registrationData
        });
        
        if (response.ok) {
            showNotification('Registrierung wurde in Password.txt gespeichert!', 'success');
        } else {
            // Fallback to download if server save fails
            downloadPasswordFile(registrationData);
        }
    } catch (error) {
        // Fallback to download if fetch fails
        downloadPasswordFile(registrationData);
    }
}

// Fallback download function
function downloadPasswordFile(data) {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Password.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Registrierung wurde heruntergeladen (Server nicht erreichbar)!', 'info');
}

// Login to admin
function adminLogin() {
    const firstnameInput = document.getElementById('register-firstname');
    const lastnameInput = document.getElementById('register-lastname');
    const passwordInput = document.getElementById('register-password') || document.getElementById('login-password') || document.getElementById('admin-password');
    const password = passwordInput.value.trim();
    
    // Allow any password for registration
    if (password) {
        localStorage.setItem('adminPassword', password);
        
        // Save registration to file
        if (firstnameInput && lastnameInput) {
            const firstname = firstnameInput.value.trim();
            const lastname = lastnameInput.value.trim();
            const fullName = `${firstname} ${lastname}`;
            
            if (fullName.trim() !== ' ') {
                localStorage.setItem('adminName', fullName.trim());
                
                // Add member with "One for All" role
                const memberList = loadMemberList();
                if (!memberList.some(m => m.name === fullName.trim())) {
                    memberList.push({ name: fullName.trim() });
                    saveMemberList(memberList);
                }
                
                // Save role as "One for All"
                saveMemberRole(fullName.trim(), 'One for All');
                
                // Save to text file
                saveRegistrationToFile(firstname, lastname, password);
            }
        }
        
        showNotification('Erfolgreich als Admin registriert!', 'success');
        passwordInput.value = '';
        
        // Clear name inputs
        if (firstnameInput) firstnameInput.value = '';
        if (lastnameInput) lastnameInput.value = '';
        
        // Determine which page to refresh
        if (document.getElementById('register-password')) {
            showRegister();
        } else if (document.getElementById('login-password')) {
            showLogin();
        } else {
            showEinstellungen();
        }
    } else {
        showNotification('Bitte gib ein Passwort ein!', 'error');
        passwordInput.value = '';
    }
}

// Logout from admin
function adminLogout() {
    localStorage.removeItem('adminPassword');
    showNotification('Erfolgreich ausgeloggt!', 'success');
    showEinstellungen(); // Refresh admin page
}

// Delete member
function deleteMember(memberName) {
    if (!checkAdminAccess()) {
        showNotification('Nur Admins können Mitglieder löschen!', 'error');
        return;
    }
    
    if (confirm(`Möchtest du "${memberName}" wirklich löschen?`)) {
        // Remove from member list
        const memberList = loadMemberList();
        const updatedList = memberList.filter(m => m.name !== memberName);
        saveMemberList(updatedList);
        
        // Remove role
        const roles = loadSavedRoles();
        delete roles[memberName];
        localStorage.setItem('mitglieder', JSON.stringify(roles));
        
        // Remove member data
        const memberData = loadMemberData();
        delete memberData[memberName];
        localStorage.setItem('memberData', JSON.stringify(memberData));
        
        showNotification(`Mitglied "${memberName}" wurde gelöscht!`, 'success');
        showMitglieder(); // Refresh the page
    }
}

// Add new member
function addNewMember() {
    if (!checkAdminAccess()) {
        showNotification('Nur Admins können Mitglieder hinzufügen!', 'error');
        return;
    }
    
    const nameInput = document.getElementById('new-member-name');
    const memberName = nameInput.value.trim();
    
    if (!memberName) {
        showNotification('Bitte gib einen Namen ein!', 'error');
        return;
    }
    
    const memberList = loadMemberList();
    if (memberList.some(m => m.name === memberName)) {
        showNotification('Mitglied existiert bereits!', 'error');
        return;
    }
    
    memberList.push({ name: memberName });
    saveMemberList(memberList);
    
    nameInput.value = '';
    showMitglieder(); // Refresh the page
    showNotification(`Mitglied "${memberName}" wurde hinzugefügt!`, 'success');
}

// Load saved member data
function loadMemberData() {
    const members = JSON.parse(localStorage.getItem('memberData') || '{}');
    return members;
}

// Save member data
function saveMemberData(memberName, data) {
    const members = loadMemberData();
    members[memberName] = data;
    localStorage.setItem('memberData', JSON.stringify(members));
}

// Clear all members
function clearAllMembers() {
    localStorage.removeItem('memberList');
    localStorage.removeItem('mitglieder');
    localStorage.removeItem('memberData');
    showNotification('Alle Mitglieder wurden gelöscht!', 'success');
    showMitglieder(); // Refresh the page
}

// Show members page with saved roles
function showMitglieder() {
    const mainContent = document.querySelector('.dashboard-main');
    const savedRoles = loadSavedRoles();
    const memberList = loadMemberList();
    const memberData = loadMemberData();
    const isAdmin = checkAdminAccess();
    
    let membersHTML = '';
    
    memberList.forEach(member => {
        const memberName = member.name;
        const currentRole = savedRoles[memberName];
        const userData = memberData[memberName] || {};
        
        membersHTML += `
            <div class="mitglied-item">
                <div class="mitglied-avatar">${userData.gender === 'female' ? '👩' : userData.gender === 'male' ? '👨' : '👤'}</div>
                <div class="mitglied-info">
                    <h3>${memberName}</h3>
                    ${currentRole ? 
                        `<div class="role-display-container">
                            <p class="mitglied-role">${currentRole}</p>
                            <div class="member-details">
                                ${userData.gender ? `<span class="gender-badge">${userData.gender === 'female' ? 'Frau' : 'Mann'}</span>` : ''}
                                ${userData.canAdd ? `<span class="permission-badge">Kann hinzufügen</span>` : ''}
                            </div>
                            ${(currentRole === 'All for One' || currentRole === 'One for All') && isAdmin ? 
                                `<div class="admin-controls">
                                    <button class="change-role-btn" onclick="changeRole('${memberName}')">Rolle ändern</button>
                                    <button class="edit-gender-btn" onclick="editGender('${memberName}')">Geschlecht ändern</button>
                                    <button class="permission-btn" onclick="togglePermission('${memberName}')">${userData.canAdd ? 'Entfernen' : 'Hinzufügen'}</button>
                                </div>` : 
                                ''
                            }
                        </div>` : 
                        `<div class="role-input-container">
                            <input type="text" class="role-input" placeholder="Rolle eingeben...">
                            <div class="role-buttons">
                                <button class="add-role-btn" onclick="addRole(this, '${memberName}')">All for One</button>
                                <button class="add-role-btn" onclick="addRole(this, '${memberName}')">One for All</button>
                                <button class="add-role-btn" onclick="addRole(this, '${memberName}')">Inner Circle</button>
                                <button class="add-role-btn" onclick="addRole(this, '${memberName}')">Hund</button>
                                <button class="add-role-btn" onclick="addRole(this, '${memberName}')">Trusted Few</button>
                                <button class="add-role-btn" onclick="addRole(this, '${memberName}')">Chosen Ones</button>
                                <button class="add-role-btn" onclick="addRole(this, '${memberName}')">X Restricted X</button>
                            </div>
                        </div>`
                    }
                </div>
                ${isAdmin ? `<button class="delete-member-btn" onclick="deleteMember('${memberName}')">🗑️</button>` : ''}
            </div>
        `;
    });
    
    mainContent.innerHTML = `
        <div class="mitglieder-container">
            <h1 class="page-title">Mitglieder</h1>
            
            ${!isAdmin ? `
            <div class="access-denied">
                <p>⚠️ Nur Admins können Mitglieder hinzufügen oder löschen</p>
                <p>Bitte unter "Admin" einloggen mit Passwort "Black"</p>
            </div>` : ''
            }
            
            <!-- Add new member section -->
            ${isAdmin ? `
            <div class="add-member-section">
                <div class="add-member-form">
                    <input type="text" id="new-member-name" class="member-input" placeholder="Name eingeben...">
                    <button class="add-member-btn" onclick="addNewMember()">+</button>
                </div>
            </div>` : ''
            }
            
            <div class="mitglieder-list">
                ${membersHTML}
            </div>
        </div>
    `;
    
    // Re-setup navigation after content change
    setupNavigation();
}

// Edit member gender
function editGender(memberName) {
    if (!checkAdminAccess()) {
        showNotification('Nur Admins können Geschlecht ändern!', 'error');
        return;
    }
    
    const gender = prompt(`Geschlecht für ${memberName} ändern:\n1 für Mann, 2 für Frau`);
    
    if (gender === '1') {
        saveMemberData(memberName, { ...loadMemberData()[memberName], gender: 'male' });
        showNotification(`${memberName} ist jetzt ein Mann`, 'success');
    } else if (gender === '2') {
        saveMemberData(memberName, { ...loadMemberData()[memberName], gender: 'female' });
        showNotification(`${memberName} ist jetzt eine Frau`, 'success');
    } else {
        showNotification('Ungültige Eingabe', 'error');
        return;
    }
    
    showMitglieder(); // Refresh the page
}

// Toggle member permission to add others
function togglePermission(memberName) {
    if (!checkAdminAccess()) {
        showNotification('Nur Admins können Berechtigungen ändern!', 'error');
        return;
    }
    
    const currentData = loadMemberData()[memberName] || {};
    const newPermission = !currentData.canAdd;
    
    saveMemberData(memberName, { ...currentData, canAdd: newPermission });
    
    if (newPermission) {
        showNotification(`${memberName} kann jetzt Mitglieder hinzufügen`, 'success');
    } else {
        showNotification(`${memberName} kann keine Mitglieder mehr hinzufügen`, 'success');
    }
    
    showMitglieder(); // Refresh the page
}

// Add role to member
function addRole(button, memberName) {
    if (!checkAdminAccess()) {
        showNotification('Nur Admins können Rollen zuweisen!', 'error');
        return;
    }
    
    const roleText = button.textContent;
    const mitgliedInfo = button.closest('.mitglied-info');
    
    // Remove input container and add role
    const roleContainer = button.closest('.role-input-container');
    roleContainer.remove();
    
    // Add role display
    const roleDisplay = document.createElement('div');
    roleDisplay.className = 'role-display-container';
    roleDisplay.innerHTML = `
        <p class="mitglied-role">${roleText}</p>
        ${(roleText === 'All for One' || roleText === 'One for All') ? 
            `<button class="change-role-btn" onclick="changeRole('${memberName}')">Rolle ändern</button>` : 
            ''
        }
    `;
    mitgliedInfo.appendChild(roleDisplay);
    
    // Save role to localStorage
    saveMemberRole(memberName, roleText);
    
    showNotification(`Rolle "${roleText}" für ${memberName} wurde gespeichert!`, 'success');
}

// Save member role to localStorage
function saveMemberRole(memberName, role) {
    const members = JSON.parse(localStorage.getItem('mitglieder') || '{}');
    members[memberName] = role;
    localStorage.setItem('mitglieder', JSON.stringify(members));
}

// Change role function
function changeRole(memberName) {
    if (!checkAdminAccess()) {
        showNotification('Nur Admins können Rollen ändern!', 'error');
        return;
    }
    
    // Find the specific member's info container
    const mitgliedItems = document.querySelectorAll('.mitglied-item');
    let targetMitgliedInfo = null;
    
    mitgliedItems.forEach(item => {
        const nameElement = item.querySelector('h3');
        if (nameElement && nameElement.textContent === memberName) {
            targetMitgliedInfo = item.querySelector('.mitglied-info');
        }
    });
    
    if (!targetMitgliedInfo) return;
    
    // Remove current role display and show role selection again
    const roleDisplay = targetMitgliedInfo.querySelector('.role-display-container');
    
    if (roleDisplay) {
        roleDisplay.remove();
    }
    
    // Add role input container
    const roleInputContainer = document.createElement('div');
    roleInputContainer.className = 'role-input-container';
    roleInputContainer.innerHTML = `
        <input type="text" class="role-input" placeholder="Rolle eingeben...">
        <div class="role-buttons">
            <button class="add-role-btn" onclick="addRole(this, '${memberName}')">All for One</button>
            <button class="add-role-btn" onclick="addRole(this, '${memberName}')">One for All</button>
            <button class="add-role-btn" onclick="addRole(this, '${memberName}')">Inner Circle</button>
            <button class="add-role-btn" onclick="addRole(this, '${memberName}')">Hund</button>
            <button class="add-role-btn" onclick="addRole(this, '${memberName}')">Trusted Few</button>
            <button class="add-role-btn" onclick="addRole(this, '${memberName}')">Chosen Ones</button>
            <button class="add-role-btn" onclick="addRole(this, '${memberName}')">X Restricted X</button>
        </div>
    `;
    
    targetMitgliedInfo.appendChild(roleInputContainer);
}

// Show dashboard page
function showDashboard() {
    const mainContent = document.querySelector('.dashboard-main');
    mainContent.innerHTML = `
        <div class="dashboard-grid">
            <!-- Stats Cards -->
            <section class="stats-section">
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <h3>Gesamteinnahmen</h3>
                        <p class="stat-value"></p>
                        <span class="stat-change"></span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3>Aktive Benutzer</h3>
                        <p class="stat-value"></p>
                        <span class="stat-change"></span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-content">
                        <h3>Wachstumsrate</h3>
                        <p class="stat-value"></p>
                        <span class="stat-change"></span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-content">
                        <h3>Leistung</h3>
                        <p class="stat-value"></p>
                        <span class="stat-change"></span>
                    </div>
                </div>
            </section>

            <!-- Chart Section -->
            <section class="chart-section">
                <div class="chart-container">
                    <h2>Umsatzübersicht</h2>
                    <div class="chart-placeholder">
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>
            </section>

            <!-- Activity Feed -->
            <section class="activity-section">
                <div class="activity-card">
                    <h2>Aktuelle Aktivität</h2>
                    <div class="activity-list">
                    </div>
                </div>
            </section>
        </div>
    `;
    
    // Load activities from localStorage
    loadActivities();
    
    // Re-setup navigation after content change
    setupNavigation();
}

// Load activities from localStorage
function loadActivities() {
    // Clear all activities from localStorage
    localStorage.removeItem('activities');
    
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = ''; // Clear the display
    }
}

// Show contracts page
function showVertraege() {
    const mainContent = document.querySelector('.dashboard-main');
    const vertraege = [
        { id: 'metallurgie-i', title: 'Metallurgie I', menge: '860 Stück' }
    ];

    const rowsHtml = vertraege
        .map(
            (v) => `
                <li class="vertraege-list-item" data-vertrag-id="${v.id}">
                    <div class="vertraege-row">
                        <div class="vertraege-row-left">
                            <span class="vertraege-item-title">${v.title}</span>
                            <span class="vertraege-stueck-window">${v.menge}</span>
                        </div>
                        <div class="vertraege-row-actions">
                            <button class="vertraege-add-btn">+</button>
                        </div>
                    </div>
                </li>
            `
        )
        .join('');

    mainContent.innerHTML = `
        <div class="vertraege-container">
            <h1 class="page-title">Verträge</h1>
            <div class="vertraege-section">
                <div class="vertraege-item">
                    <div class="vertraege-header">
                        <h3>Metallurgie I</h3>
                        <button class="vertraege-plus-btn" onclick="addVertrag()">+</button>
                    </div>
                    <p>840 Stück</p>
                </div>
            </div>
        </div>
    `;
    
    // Re-setup navigation after content change
    setupNavigation();
}

// Add contract function
function addVertrag() {
    console.log('addVertrag function called'); // Debug
    
    // Check if contract already exists
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    const alreadyExists = activities.some(activity => 
        activity.text === 'Vertrag "Metallurgie I" hinzugefügt'
    );
    
    if (alreadyExists) {
        showNotification('Vertrag "Metallurgie I" wurde bereits hinzugefügt!', 'error');
        return;
    }
    
    // Add activity to dashboard
    addVertragInternal();
    
    showNotification('Vertrag hinzugefügt!', 'success');
}

function addVertragInternal() {
    const timestamp = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    
    // Store activity in localStorage to persist across page changes
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    activities.unshift({
        icon: '📄',
        text: 'Vertrag "Metallurgie I" hinzugefügt',
        time: timestamp
    });
    localStorage.setItem('activities', JSON.stringify(activities));
    
    // Try to add to current activity list if it exists
    const activityList = document.querySelector('.activity-list');
    console.log('activityList found:', activityList); // Debug
    
    if (activityList) {
        addActivityItem(activityList);
    }
}

function addActivityItem(activityList) {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    
    // Clear current list and rebuild from localStorage
    activityList.innerHTML = '';
    
    activities.forEach((activity, index) => {
        const newActivity = document.createElement('div');
        newActivity.className = 'activity-item';
        newActivity.innerHTML = `
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <p class="activity-text">${activity.text}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
            ${activity.text.includes('Vertrag') ? `
                <button class="activity-delete-btn" data-index="${index}">×</button>
            ` : ''}
        `;
        activityList.appendChild(newActivity);
        
        // Add event listener to delete button
        const deleteBtn = newActivity.querySelector('.activity-delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const indexToDelete = parseInt(deleteBtn.getAttribute('data-index'));
                console.log('Delete button clicked, index:', indexToDelete); // Debug
                deleteActivity(indexToDelete);
            });
        }
    });
}

// Delete activity function
function deleteActivity(index) {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    const deletedActivity = activities[index];
    activities.splice(index, 1);
    localStorage.setItem('activities', JSON.stringify(activities));
    
    console.log('Deleted activity:', deletedActivity); // Debug
    
    // Refresh activity list
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        addActivityItem(activityList);
    }
    
    showNotification('Aktivität gelöscht!', 'success');
}

// Show analytics page
function showAnalytik() {
    const mainContent = document.querySelector('.dashboard-main');
    mainContent.innerHTML = `
        <div class="analytik-container">
            <h1 class="page-title">Analytik</h1>
            <p>Analytics-Seite in Entwicklung...</p>
        </div>
    `;
    
    // Re-setup navigation after content change
    setupNavigation();
}

// Save admin name
function saveAdminName() {
    const nameInput = document.getElementById('admin-name');
    const adminName = nameInput.value.trim();
    
    if (adminName) {
        localStorage.setItem('adminName', adminName);
        
        // Add member with "One for All" role
        const memberList = loadMemberList();
        if (!memberList.some(m => m.name === adminName)) {
            memberList.push({ name: adminName });
            saveMemberList(memberList);
        }
        
        // Save role as "One for All"
        saveMemberRole(adminName, 'One for All');
        
        showNotification(`Name "${adminName}" als "One for All" gespeichert!`, 'success');
    } else {
        showNotification('Bitte gib einen Namen ein!', 'error');
    }
}

// Show register page
function showRegister() {
    const mainContent = document.querySelector('.dashboard-main');
    const isLoggedIn = checkAdminAccess();
    
    mainContent.innerHTML = `
        <div class="register-container">
            <h1 class="page-title">Register</h1>
            <div class="register-section">
                ${isLoggedIn ? 
                    `<div class="register-logged-in">
                        <span class="register-status">✅ Eingeloggt als Admin</span>
                        <button class="register-logout-btn" onclick="adminLogout()">Ausloggen</button>
                    </div>` :
                    `<div class="register-form">
                        <div class="register-inputs">
                            <input type="text" id="register-firstname" class="register-input" placeholder="Name">
                            <input type="text" id="register-lastname" class="register-input" placeholder="Nachname">
                            <input type="password" id="register-password" class="register-input" placeholder="Password">
                        </div>
                        <button class="register-btn" onclick="adminLogin()">Register</button>
                    </div>`
                }
            </div>
        </div>
    `;
    
    // Re-setup navigation after content change
    setupNavigation();
}

// Show login page
function showLogin() {
    const mainContent = document.querySelector('.dashboard-main');
    const isLoggedIn = checkAdminAccess();
    
    mainContent.innerHTML = `
        <div class="login-container">
            <h1 class="page-title">Login</h1>
            <div class="login-section">
                ${isLoggedIn ? 
                    `<div class="login-logged-in">
                        <span class="login-status">✅ Eingeloggt als Admin</span>
                        <button class="login-logout-btn" onclick="adminLogout()">Ausloggen</button>
                    </div>` :
                    `<div class="login-form">
                        <input type="password" id="login-password" class="login-input" placeholder="Passwort">
                        <button class="login-btn" onclick="adminLogin()">Login</button>
                    </div>`
                }
            </div>
        </div>
    `;
    
    // Re-setup navigation after content change
    setupNavigation();
}

// Show settings page
function showEinstellungen() {
    const mainContent = document.querySelector('.dashboard-main');
    const isAdmin = checkAdminAccess();
    const savedName = localStorage.getItem('adminName') || '';
    const userRegistration = JSON.parse(localStorage.getItem('userRegistration') || '{}');
    
    mainContent.innerHTML = `
        <div class="admin-container">
            <h1 class="page-title">Admin</h1>
            <div class="admin-section">
                ${isAdmin ? 
                    `<div class="admin-logged-in">
                        <span class="admin-status">✅ Erfolgreich</span>
                        <div class="admin-info">
                            <input type="text" id="admin-name" class="admin-name-input" placeholder="Dein Name" value="${savedName}">
                        </div>
                        <button class="admin-logout-btn" onclick="adminLogout()">Ausloggen</button>
                        
                        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color);">
                            <h3 style="color: var(--text-primary); margin-bottom: 1rem;">Registrierungs-Verwaltung</h3>
                            ${userRegistration.name ? `
                                <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                                    Aktuell registriert: <strong>${userRegistration.fullName}</strong> (ID: ${userRegistration.id})
                                </p>
                                <button class="admin-logout-btn" onclick="resetRegistration()">Registrierung zurücksetzen</button>
                            ` : '<p style="color: var(--text-secondary);">Keine Registrierung gefunden</p>'}
                        </div>
                    </div>` :
                    `<div class="admin-login-form">
                        <input type="password" id="admin-password" class="admin-input" placeholder="Passwort">
                        <button class="admin-login-btn" onclick="adminLogin()">Login</button>
                    </div>`
                }
            </div>
        </div>
    `;
    
    // Re-setup navigation after content change
    setupNavigation();
}

// Reset registration (admin only)
function resetRegistration() {
    if (!checkAdminAccess()) {
        showNotification('Nur Admins können die Registrierung zurücksetzen!', 'error');
        return;
    }
    
    if (confirm('Möchtest du die Registrierung wirklich zurücksetzen? Der Benutzer muss sich neu registrieren.')) {
        localStorage.removeItem('userRegistered');
        localStorage.removeItem('userRegistration');
        showNotification('Registrierung wurde zurückgesetzt!', 'success');
        
        // Reload page to show registration overlay
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Generate report functionality
function generateReport() {
    showNotification('Bericht wird erstellt...', 'info');
    
    setTimeout(() => {
        showNotification('Bericht erfolgreich erstellt!', 'success');
    }, 2000);
}

// Export data functionality
function exportData() {
    showNotification('Daten-Export wird vorbereitet...', 'info');
    
    setTimeout(() => {
        // Create a simple CSV export
        const data = [
            ['Metrik', 'Wert', 'Änderung'],
            ['Umsatz', '', ''],
            ['Aktive Benutzer', '', ''],
            ['Wachstumsrate', '', ''],
            ['Leistung', '', '']
        ];
        
        const csv = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dashboard_data.csv';
        a.click();
        
        showNotification('Daten erfolgreich exportiert!', 'success');
    }, 1500);
}

// Open user management (placeholder)
function openUserManagement() {
    showNotification('Benutzerverwaltung wird geöffnet...', 'info');
}

// Open settings (placeholder)
function openSettings() {
    showNotification('Systemeinstellungen werden geöffnet...', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Strg/Cmd + R für Bericht erstellen
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        generateReport();
    }
    
    // Strg/Cmd + E für Daten exportieren
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
    
    // Escape to close notifications
    if (e.key === 'Escape') {
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
    }
});
