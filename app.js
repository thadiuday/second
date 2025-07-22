const { useState, useEffect } = React;

// --- Mock Data ---
const mockData = {
    workers: [
        { id: 1, name: 'Sarah Johnson', profession: 'Professional Cleaner', rating: 4.9, experience: '5+ years', rate: 25, img: 'https://i.pravatar.cc/150?img=1' },
        { id: 2, name: 'Mike Rodriguez', profession: 'Handyman & Electrician', rating: 4.8, experience: '8+ years', rate: 35, img: 'https://i.pravatar.cc/150?img=2' },
        { id: 3, name: 'James Wilson', profession: 'Delivery & Moving', rating: 4.7, experience: '3+ years', rate: 20, img: 'https://i.pravatar.cc/150?img=3' },
        { id: 4, name: 'Lisa Chen', profession: 'Garden Maintenance', rating: 4.9, experience: '6+ years', rate: 30, img: 'https://i.pravatar.cc/150?img=4' }
    ],
    jobs: [
        { id: 1, title: 'House Cleaning Service', location: 'Downtown, 0.5 miles away', description: 'Need deep cleaning for 3-bedroom apartment. Includes kitchen, bathrooms, and living areas.', price: 120, duration: '4-5 hours' },
        { id: 2, title: 'Furniture Assembly', location: 'Midtown, 1.2 miles away', description: 'IKEA wardrobe and dresser assembly. Tools will be provided.', price: 80, duration: '2-3 hours' },
        { id: 3, title: 'Moving Help Required', location: 'Uptown, 2.1 miles away', description: 'Help with loading/unloading moving truck. Heavy lifting required, 2 people needed.', price: 200, duration: '6 hours' }
    ],
    chats: {
        '1': [{ from: 'them', text: 'Hello! I\'m interested in your cleaning service.', time: '10:30 AM' }, { from: 'me', text: 'I\'d be happy to help. What kind of cleaning do you need?', time: '10:31 AM' }, { from: 'them', text: 'I need a deep cleaning for my 3-bedroom apartment.', time: '10:32 AM' }, { from: 'me', text: 'Perfect! I can do that. When would you like me to come?', time: '10:35 AM' }],
        '3': [{ from: 'them', text: 'Hi, I need help moving some furniture next Saturday.', time: 'Yesterday' }, { from: 'me', text: 'Sure, I can help with that. What time works for you?', time: 'Yesterday' }],
    },
    notifications: [
        { id: 1, title: 'Job Completed', body: 'Sarah Johnson completed house cleaning service', time: '5 min ago', icon: 'fa-check-circle' },
        { id: 2, title: 'New Application', body: 'Mike Rodriguez applied for plumbing job', time: '15 min ago', icon: 'fa-user-plus' },
        { id: 3, title: 'Payment Pending', body: 'Client payment for garden service is overdue', time: '1 hour ago', icon: 'fa-file-invoice-dollar' },
    ],
    applications: [
        { id: 1, name: 'Alex Thompson', profession: 'Electrical Repair', experience: '4.7 • 5 years', img: 'https://i.pravatar.cc/150?img=5' },
        { id: 2, name: 'Maria Garcia', profession: 'House Cleaning', experience: '4.9 • 3 years', img: 'https://i.pravatar.cc/150?img=6' },
    ]
};

// --- Main App Component ---
function App() {
    const [activePage, setActivePage] = useState('search');
    const [activePopup, setActivePopup] = useState(null);
    const [currentChatId, setCurrentChatId] = useState(null);

    const navigateTo = (page) => {
        setActivePage(page);
        setActivePopup(null); // Close any open popups on navigation
    };

    const togglePopup = (popup) => {
        setActivePopup(activePopup === popup ? null : popup);
    };

    const openChat = (workerId) => {
        setCurrentChatId(workerId);
        setActivePage('chatDetail');
    };

    const goBack = () => {
        if (currentChatId) {
            setCurrentChatId(null);
            setActivePage('chatList');
        }
    };
    
    const renderPage = () => {
        switch (activePage) {
            case 'search': return <FindWorkPage openChat={openChat} />;
            case 'chatList': return <ChatListPage openChat={openChat} />;
            case 'chatDetail': return <ChatDetailPage workerId={currentChatId} goBack={goBack} />;
            case 'workspace': return <WorkspacePage />;
            case 'payments': return <PaymentsPage />;
            default: return <FindWorkPage openChat={openChat} />;
        }
    };

    return (
        <div className="app-container">
            {activePage !== 'chatDetail' && (
                <MainHeader togglePopup={togglePopup} activePopup={activePopup} />
            )}
            
            <main className="app-content" style={{padding: activePage === 'chatDetail' ? '0' : '1.2rem'}}>
                {renderPage()}
            </main>

            {activePage !== 'chatDetail' && (
                 <BottomNav activePage={activePage} navigateTo={navigateTo} />
            )}
        </div>
    );
}

// --- Header & Navigation Components ---
function MainHeader({ togglePopup, activePopup }) {
    return (
        <header className="main-header">
            <h1>Find Your Work</h1>
            <div className="header-icons">
                <div className="icon" onClick={() => togglePopup('notifications')}>
                    <i className="fa-regular fa-bell"></i>
                    {activePopup === 'notifications' && <NotificationPopup />}
                </div>
                <div className="icon" onClick={() => togglePopup('applications')}>
                    <i className="fa-solid fa-users"></i>
                    {activePopup === 'applications' && <ApplicationPopup />}
                </div>
                <div className="icon" onClick={() => togglePopup('profile')}>
                    <i className="fa-regular fa-user-circle"></i>
                    {activePopup === 'profile' && <ProfilePopup />}
                </div>
            </div>
        </header>
    );
}

function BottomNav({ activePage, navigateTo }) {
    const navItems = [
        { id: 'search', icon: 'fa-search', label: 'Search' },
        { id: 'chatList', icon: 'fa-comment-dots', label: 'Chats' },
        { id: 'workspace', icon: 'fa-briefcase', label: 'Workspace' },
        { id: 'payments', icon: 'fa-wallet', label: 'Payments' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <div key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => navigateTo(item.id)}>
                    <i className={`fa-solid ${item.icon}`}></i>
                    <span>{item.label}</span>
                </div>
            ))}
        </nav>
    );
}


// --- Pages Components ---
function FindWorkPage({ openChat }) {
    const [activeTab, setActiveTab] = useState('workers');
    const [showToast, setShowToast] = useState('');

    const displayToast = (message) => {
        setShowToast(message);
        setTimeout(() => setShowToast(''), 2000);
    };

    return (
        <div>
            <div className="card visual-search-card">
                <h3>Visual Search</h3>
                <div className="visual-search-buttons">
                    <button className="btn btn-secondary"><i className="fa-solid fa-camera"></i> Take Photo</button>
                    <button className="btn btn-secondary"><i className="fa-solid fa-upload"></i> Upload</button>
                </div>
            </div>
            
            <div className="search-filters">
                <button className="filter-btn">Location</button>
                <button className="filter-btn">Price Range</button>
                <button className="filter-btn">Group/Single</button>
            </div>

            <div className="tabs">
                <div className={`tab-btn ${activeTab === 'workers' ? 'active' : ''}`} onClick={() => setActiveTab('workers')}>Available Workers</div>
                <div className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>Find Jobs</div>
            </div>

            {activeTab === 'workers' && mockData.workers.map(worker => (
                <WorkerCard key={worker.id} worker={worker} openChat={openChat}/>
            ))}
            
            {activeTab === 'jobs' && mockData.jobs.map(job => (
                <JobCard key={job.id} job={job} displayToast={displayToast} />
            ))}

            {showToast && <div className="toast">{showToast}</div>}
        </div>
    );
}

function ChatListPage({ openChat }) {
    return (
        <div>
            <div className="search-bar card">
                 <input type="text" placeholder="Search people..." style={{width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px'}}/>
            </div>
            {mockData.workers.slice(0, 3).map(worker => (
                 <div key={worker.id} className="card chat-list-item" onClick={() => openChat(worker.id)}>
                    <img src={worker.img} alt={worker.name} />
                    <div className="chat-info">
                        <div className="name">{worker.name}</div>
                        <div className="last-message">{mockData.chats[worker.id] ? mockData.chats[worker.id].slice(-1)[0].text.substring(0,25)+'...' : "No messages yet"}</div>
                    </div>
                    <div className="chat-meta">
                        <div className="time">{mockData.chats[worker.id] ? mockData.chats[worker.id].slice(-1)[0].time : ""}</div>
                    </div>
                 </div>
            ))}
        </div>
    );
}

function ChatDetailPage({ workerId, goBack }) {
    const worker = mockData.workers.find(w => w.id === workerId);
    const [messages, setMessages] = useState(mockData.chats[workerId] || []);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim() === '') return;
        const newMsg = { from: 'me', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    useEffect(() => {
        const chatBox = document.querySelector('.chat-messages');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, [messages]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header className="chat-header">
                <i className="fa-solid fa-arrow-left icon" onClick={goBack}></i>
                <img src={worker.img} alt={worker.name} />
                <div className="chat-header-info">
                    <div className="name">{worker.name}</div>
                    <div className="status">Online</div>
                </div>
                <i className="fa-solid fa-phone icon"></i>
                <i className="fa-solid fa-ellipsis-v icon"></i>
            </header>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-bubble ${msg.from === 'me' ? 'sent' : 'received'}`}>
                        <div>{msg.text}</div>
                        <div className="message-time">{msg.time}</div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input type="text" placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} />
                <button className="btn btn-primary" onClick={handleSend}><i className="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    );
}

function WorkspacePage() {
    return (
        <div>
            <div className="card workspace-summary">
                <div className="summary-card">
                    <div className="value">12</div>
                    <div className="label">Total Workers</div>
                </div>
                 <div className="summary-card">
                    <div className="value">8</div>
                    <div className="label">Active Jobs</div>
                </div>
                 <div className="summary-card">
                    <div className="value">$15,420</div>
                    <div className="label">Monthly Revenue</div>
                </div>
                 <div className="summary-card">
                    <div className="value">94%</div>
                    <div className="label">Completion Rate</div>
                </div>
            </div>
            <div className="card">
                <h3>Recent Activity</h3>
                {/* Mocked activity */}
            </div>
            <div className="quick-actions">
                <div className="action-btn"><i className="fa-solid fa-user-plus"></i> Add Worker</div>
                <div className="action-btn"><i className="fa-solid fa-calendar-alt"></i> Schedule Job</div>
                <div className="action-btn"><i className="fa-solid fa-dollar-sign"></i> View Payouts</div>
                <div className="action-btn"><i className="fa-solid fa-chart-line"></i> Reports</div>
            </div>
        </div>
    );
}

function PaymentsPage() {
    return (
        <div>
            <div className="card wallet-balance-card">
                <div>Wallet Balance</div>
                <div className="balance">$1250.50</div>
                <div className="wallet-actions">
                    <div className="wallet-action"><div className="icon-bg"><i className="fa-solid fa-paper-plane"></i></div> Send</div>
                    <div className="wallet-action"><div className="icon-bg"><i className="fa-solid fa-credit-card"></i></div> Add Card</div>
                    <div className="wallet-action"><div className="icon-bg"><i className="fa-solid fa-qrcode"></i></div> QR Code</div>
                    <div className="wallet-action"><div className="icon-bg"><i className="fa-solid fa-university"></i></div> UPI</div>
                </div>
            </div>
            <div className="card quick-send">
                <h3>Quick Send</h3>
                <input type="text" placeholder="Enter Amount" />
                <button className="btn btn-primary">Send Money</button>
            </div>
            <div className="card">
                <div className="section-header"><h3>Recent Transactions</h3><a>View All</a></div>
                <div className="transaction-item">
                    <img src={mockData.workers[0].img} />
                    <div className="transaction-info"><div>Sarah Johnson</div><div style={{fontSize: '0.8rem', color: '#777'}}>House cleaning service</div></div>
                    <div className="transaction-amount income">+$150</div>
                </div>
            </div>
        </div>
    )
}

// --- Card Components ---
function WorkerCard({ worker, openChat }) {
    return (
        <div className="card worker-card">
            <img src={worker.img} alt={worker.name} />
            <div className="worker-info">
                <div className="name">{worker.name}</div>
                <div className="profession">{worker.profession}</div>
                <div className="profession">⭐ {worker.rating} ({worker.experience})</div>
                <div style={{fontSize: '1.2rem', fontWeight: 700, color: '#28a745'}}>${worker.rate}/hr</div>
            </div>
            <div className="actions">
                <button className="btn btn-secondary">Call</button>
                <button className="btn btn-primary" onClick={() => openChat(worker.id)}>Message</button>
            </div>
        </div>
    );
}

function JobCard({ job, displayToast }) {
    return (
        <div className="card job-card">
            <div className="job-info">
                <div className="title">{job.title}</div>
                <div className="details">{job.location}</div>
                <div className="details">{job.description}</div>
                <div style={{fontSize: '1.2rem', fontWeight: 700, color: '#28a745', marginTop: '8px'}}>${job.price} <span style={{color: '#777', fontSize: '0.9rem'}}>({job.duration})</span></div>
            </div>
            <div className="actions">
                <i className="fa-regular fa-bookmark" onClick={() => displayToast('Job Saved!')}></i>
                <button className="btn btn-primary" onClick={() => displayToast('Application Submitted!')}>Apply Now</button>
            </div>
        </div>
    )
}

// --- Popup Components ---
function NotificationPopup() {
    return (
        <div className="popup-overlay">
            <div className="popup-header">Notifications</div>
            <div className="popup-content">
                {mockData.notifications.map(n => (
                    <div key={n.id} className="notification-item">
                        <i className={`fa-solid ${n.icon}`}></i>
                        <div className="notification-text">
                            <div className="title">{n.title}</div>
                            <div className="body">{n.body}</div>
                            <div className="time">{n.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ApplicationPopup() {
    return (
        <div className="popup-overlay">
            <div className="popup-header">Worker Applications</div>
            <div className="popup-content">
                {mockData.applications.map(app => (
                    <div key={app.id} className="application-item">
                        <img src={app.img} alt={app.name} />
                        <div className="application-info">
                            <div style={{fontWeight: 700}}>{app.name}</div>
                            <div>{app.profession}</div>
                            <div className="application-buttons">
                                <button className="btn btn-secondary" style={{padding: '0.3rem 0.8rem'}}>Decline</button>
                                <button className="btn btn-primary" style={{padding: '0.3rem 0.8rem'}}>Accept</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProfilePopup() {
    return (
        <div className="popup-overlay">
            <div className="profile-summary">
                <div className="initials">JS</div>
                <div className="name">John Smith</div>
                <div className="email">johnsmith@example.com</div>
            </div>
            <div className="profile-links">
                <div className="link">Edit Profile</div>
                <div className="link">Settings</div>
                <div className="link" style={{color: '#dc3545'}}>Sign Out</div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
