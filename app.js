const { useState, useEffect, useMemo } = React;

// --- Haversine Formula for Distance Calculation ---
function getDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 === lat2) && (lon1 === lon2)) return 0;
    const R = 3959; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// --- Mock Data ---
const mockData = {
    // ... (existing data remains unchanged)
    workers: [
        { id: 1, name: 'Sarah Johnson', profession: 'Professional Cleaner', rating: 4.9, experience: '5+ years', rate: 25, img: 'https://i.pravatar.cc/150?img=1', lat: 34.0522, lon: -118.2437 },
        { id: 2, name: 'Mike Rodriguez', profession: 'Handyman & Electrician', rating: 4.8, experience: '8+ years', rate: 35, img: 'https://i.pravatar.cc/150?img=2', lat: 34.1522, lon: -118.4437 },
        { id: 3, name: 'James Wilson', profession: 'Delivery & Moving', rating: 4.7, experience: '3+ years', rate: 20, img: 'https://i.pravatar.cc/150?img=3', lat: 33.9522, lon: -118.3437 },
        { id: 4, name: 'Lisa Chen', profession: 'Garden Maintenance', rating: 4.9, experience: '6+ years', rate: 30, img: 'https://i.pravatar.cc/150?img=4', lat: 34.4522, lon: -118.7437 },
    ],
    jobs: [
        { id: 1, title: 'House Cleaning Service', description: 'Need deep cleaning for 3-bedroom apartment.', price: 120, duration: '4-5 hours', lat: 34.0592, lon: -118.2517 },
        { id: 2, title: 'Furniture Assembly', description: 'IKEA wardrobe and dresser assembly.', price: 80, duration: '2-3 hours', lat: 34.2522, lon: -118.5437 },
        { id: 3, title: 'Moving Help Required', description: 'Help with loading/unloading moving truck.', price: 200, duration: '6 hours', lat: 33.8522, lon: -118.1437 },
    ],
     chats: {
        '1': [{ from: 'them', text: 'Hello! I\'m interested in your cleaning service.', time: '10:30 AM' }, { from: 'me', text: 'I\'d be happy to help. What kind of cleaning do you need?', time: '10:31 AM' }],
        '3': [{ from: 'them', text: 'Hi, I need help moving some furniture next Saturday.', time: 'Yesterday' }, { from: 'me', text: 'Sure, I can help with that. What time works for you?', time: 'Yesterday' }],
    },
    notifications: [
        { id: 1, title: 'Job Completed', body: 'Sarah Johnson completed house cleaning service', time: '5 min ago', icon: 'fa-check-circle' },
        { id: 2, title: 'New Application', body: 'Mike Rodriguez applied for plumbing job', time: '15 min ago', icon: 'fa-user-plus' },
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
    const [receivedApplications, setReceivedApplications] = useState([]);
    
    // NEW: State for wallet and transactions
    const [wallet, setWallet] = useState({
        balance: 1250.50,
        transactions: [
             { id: 1, name: 'Sarah Johnson', service: 'House cleaning service', amount: 150, type: 'income', date: 'Today, 2:30 PM'},
             { id: 2, name: 'Mike Rodriguez', service: 'Plumbing repair', amount: -75, type: 'expense', date: 'Yesterday, 4:15 PM'},
        ]
    });
    
    const navigateTo = (page) => {
        setActivePage(page);
        setActivePopup(null);
    };

    const togglePopup = (popup) => setActivePopup(activePopup === popup ? null : popup);
    const openChat = (workerId) => {
        setCurrentChatId(workerId);
        setActivePage('chatDetail');
    };
    
    const handleApplyForJob = (job) => {
        const newApplication = { id: Date.now(), jobTitle: job.title, applicantName: "John Smith (You)", date: new Date() };
        setReceivedApplications(prev => [newApplication, ...prev]);
    };

    // NEW: Function to handle a completed payment
    const handlePayment = (amount) => {
        const newTransaction = {
            id: Date.now(),
            name: "Quick Send",
            service: "UPI Transfer",
            amount: -amount,
            type: 'expense',
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setWallet(prev => ({
            balance: prev.balance - amount,
            transactions: [newTransaction, ...prev.transactions]
        }));
    };

    const goBack = () => {
        if (currentChatId) {
            setCurrentChatId(null);
            setActivePage('chatList');
        }
    };
    
    const renderPage = () => {
        switch (activePage) {
            case 'search': return <FindWorkPage openChat={openChat} handleApplyForJob={handleApplyForJob} />;
            case 'chatList': return <ChatListPage openChat={openChat} />;
            case 'chatDetail': return <ChatDetailPage workerId={currentChatId} goBack={goBack} />;
            case 'workspace': return <WorkspacePage applications={receivedApplications} />;
            // UPDATED: Pass wallet data and payment handler to PaymentsPage
            case 'payments': return <PaymentsPage wallet={wallet} handlePayment={handlePayment} />;
            default: return <FindWorkPage openChat={openChat} handleApplyForJob={handleApplyForJob} />;
        }
    };

    return (
        <div className="app-container">
            {activePage !== 'chatDetail' && <MainHeader togglePopup={togglePopup} activePopup={activePopup} />}
            <main className="app-content" style={{padding: activePage === 'chatDetail' ? '0' : '1.2rem'}}>
                {renderPage()}
            </main>
            {activePage !== 'chatDetail' && <BottomNav activePage={activePage} navigateTo={navigateTo} />}
        </div>
    );
}

// ... Header & Navigation Components remain the same ...
function MainHeader({ togglePopup, activePopup }) {
    return (
        <header className="main-header">
            <h1>Find Your Work</h1>
            <div className="header-icons">
                <div className="icon" onClick={() => togglePopup('notifications')}><i className="fa-regular fa-bell"></i>{activePopup === 'notifications' && <NotificationPopup />}</div>
                <div className="icon" onClick={() => togglePopup('applications')}><i className="fa-solid fa-users"></i>{activePopup === 'applications' && <ApplicationPopup />}</div>
                <div className="icon" onClick={() => togglePopup('profile')}><i className="fa-regular fa-user-circle"></i>{activePopup === 'profile' && <ProfilePopup />}</div>
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
                    <i className={`fa-solid ${item.icon}`}></i><span>{item.label}</span>
                </div>
            ))}
        </nav>
    );
}

// ... Pages Components ...
function FindWorkPage({ openChat, handleApplyForJob }) {
    const [activeTab, setActiveTab] = useState('workers');
    const [showToast, setShowToast] = useState('');
    const [searchRadius, setSearchRadius] = useState(15);
    const userLocation = { lat: 34.0622, lon: -118.2537 };

    const displayToast = (message) => {
        setShowToast(message);
        setTimeout(() => setShowToast(''), 2000);
    };
    
    const onApply = (job) => {
        handleApplyForJob(job);
        displayToast('Application Submitted!');
    };

    const filteredWorkers = useMemo(() => mockData.workers.map(w => ({ ...w, distance: getDistance(userLocation.lat, userLocation.lon, w.lat, w.lon) })).filter(w => w.distance <= searchRadius), [searchRadius]);
    const filteredJobs = useMemo(() => mockData.jobs.map(j => ({ ...j, distance: getDistance(userLocation.lat, userLocation.lon, j.lat, j.lon) })).filter(j => j.distance <= searchRadius), [searchRadius]);

    return (
        <div>
            <div className="location-filter"><div className="location-filter-header"><span>Search Radius</span><span>{searchRadius} miles</span></div><input type="range" min="1" max="50" value={searchRadius} onChange={e => setSearchRadius(Number(e.target.value))} className="radius-slider"/></div>
            <div className="tabs"><div className={`tab-btn ${activeTab === 'workers' ? 'active' : ''}`} onClick={() => setActiveTab('workers')}>Available Workers ({filteredWorkers.length})</div><div className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>Find Jobs ({filteredJobs.length})</div></div>
            {activeTab === 'workers' && filteredWorkers.map(worker => <WorkerCard key={worker.id} worker={worker} openChat={openChat}/>)}
            {activeTab === 'jobs' && filteredJobs.map(job => <JobCard key={job.id} job={job} displayToast={displayToast} onApply={onApply} />)}
            {showToast && <div className="toast">{showToast}</div>}
        </div>
    );
}

// ... ChatListPage and ChatDetailPage remain the same ...
function ChatListPage({ openChat }) {
    return (
        <div>
            <div className="search-bar card"><input type="text" placeholder="Search people..." style={{width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px'}}/></div>
            {mockData.workers.slice(0, 3).map(worker => (
                 <div key={worker.id} className="card chat-list-item" onClick={() => openChat(worker.id)}>
                    <img src={worker.img} alt={worker.name} /><div className="chat-info"><div className="name">{worker.name}</div><div className="last-message">{mockData.chats[worker.id] ? mockData.chats[worker.id].slice(-1)[0].text.substring(0,25)+'...' : "No messages yet"}</div></div><div className="chat-meta"><div className="time">{mockData.chats[worker.id] ? mockData.chats[worker.id].slice(-1)[0].time : ""}</div></div>
                 </div>
            ))}
        </div>
    );
}

function ChatDetailPage({ workerId, goBack }) {
    const worker = mockData.workers.find(w => w.id === workerId);
    const [messages, setMessages] = useState(mockData.chats[workerId] || []);
    const [newMessage, setNewMessage] = useState('');
    const handleSend = () => { if (newMessage.trim() === '') return; const newMsg = { from: 'me', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; setMessages([...messages, newMsg]); setNewMessage(''); };
    useEffect(() => { const chatBox = document.querySelector('.chat-messages'); if (chatBox) chatBox.scrollTop = chatBox.scrollHeight; }, [messages]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header className="chat-header"><i className="fa-solid fa-arrow-left icon" onClick={goBack}></i><img src={worker.img} alt={worker.name} /><div className="chat-header-info"><div className="name">{worker.name}</div><div className="status">Online</div></div><i className="fa-solid fa-phone icon"></i><i className="fa-solid fa-ellipsis-v icon"></i></header>
            <div className="chat-messages">{messages.map((msg, index) => <div key={index} className={`message-bubble ${msg.from === 'me' ? 'sent' : 'received'}`}><div>{msg.text}</div><div className="message-time">{msg.time}</div></div>)}</div>
            <div className="chat-input"><input type="text" placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} /><button className="btn btn-primary" onClick={handleSend}><i className="fa-solid fa-paper-plane"></i></button></div>
        </div>
    );
}

// ... WorkspacePage remains the same ...
function WorkspacePage({ applications }) {
    return (
        <div>
            <div className="card workspace-summary"><div className="summary-card"><div className="value">12</div> <div className="label">Total Workers</div></div><div className="summary-card"><div className="value">8</div> <div className="label">Active Jobs</div></div><div className="summary-card"><div className="value">$15,420</div> <div className="label">Monthly Revenue</div></div><div className="summary-card"><div className="value">94%</div> <div className="label">Completion Rate</div></div></div>
            <div className="card inbox-section"><div className="section-header"><h3>Recent Applications ({applications.length})</h3></div>{applications.length > 0 ? applications.map(app => <div key={app.id} className="application-inbox-item"><div className="icon"><i className="fa-solid fa-file-import"></i></div><div className="application-inbox-info"><div className="job-title">{app.jobTitle}</div><div className="applicant-info">New application from {app.applicantName} on {app.date.toLocaleDateString()}</div></div></div>) : <p style={{color: '#777', textAlign: 'center', padding: '1rem'}}>No new applications.</p>}</div>
        </div>
    );
}

// UPDATED: PaymentsPage now initiates the UPI modal flow
function PaymentsPage({ wallet, handlePayment }) {
    const [showUpiModal, setShowUpiModal] = useState(false);
    const [amount, setAmount] = useState('');

    const startPayment = () => {
        if (Number(amount) > 0 && Number(amount) <= wallet.balance) {
            setShowUpiModal(true);
        } else {
            alert("Invalid amount or insufficient balance.");
        }
    };

    const onPaymentComplete = () => {
        handlePayment(Number(amount));
        setShowUpiModal(false);
        setAmount('');
    };

    return (
        <div>
            <div className="card wallet-balance-card"><div>Wallet Balance</div><div className="balance">${wallet.balance.toFixed(2)}</div><div className="wallet-actions"><div className="wallet-action"><div className="icon-bg"><i className="fa-solid fa-paper-plane"></i></div> Send</div><div className="wallet-action"><div className="icon-bg"><i className="fa-solid fa-credit-card"></i></div> Add Card</div><div className="wallet-action"><div className="icon-bg"><i className="fa-solid fa-qrcode"></i></div> QR Code</div><div className="wallet-action"><div className="icon-bg"><i className="fa-solid fa-university"></i></div> UPI</div></div></div>
            <div className="card quick-send"><h3>Quick Send</h3><input type="number" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} /><button className="btn btn-primary" onClick={startPayment}>Send Money</button></div>
            <div className="card">
                <div className="section-header"><h3>Recent Transactions</h3><a>View All</a></div>
                {wallet.transactions.map(t => <TransactionItem key={t.id} transaction={t} />)}
            </div>
            {showUpiModal && <UpiPaymentModal amount={Number(amount)} onComplete={onPaymentComplete} onClose={() => setShowUpiModal(false)} />}
        </div>
    );
}

// --- Card & Item Components ---
function WorkerCard({ worker, openChat }) {
    return (<div className="card worker-card"><img src={worker.img} alt={worker.name} /><div className="worker-info"><div className="name">{worker.name}</div><div className="profession">{worker.profession}</div><div className="profession">⭐ {worker.rating} ({worker.experience})</div><div className="distance-display">{worker.distance.toFixed(1)} miles away</div><div style={{fontSize: '1.2rem', fontWeight: 700, color: '#28a745', marginTop: '4px'}}>${worker.rate}/hr</div></div><div className="actions"><button className="btn btn-secondary">Call</button><button className="btn btn-primary" onClick={() => openChat(worker.id)}>Message</button></div></div>);
}

function JobCard({ job, displayToast, onApply }) {
    return (<div className="card job-card"><div className="job-info"><div className="title">{job.title}</div><div className="distance-display">{job.distance.toFixed(1)} miles away</div><div className="details" style={{marginTop: '4px'}}>{job.description}</div><div style={{fontSize: '1.2rem', fontWeight: 700, color: '#28a745', marginTop: '8px'}}>${job.price} <span style={{color: '#777', fontSize: '0.9rem'}}>({job.duration})</span></div></div><div className="actions"><i className="fa-regular fa-bookmark" onClick={() => displayToast('Job Saved!')}></i><button className="btn btn-primary" onClick={() => onApply(job)}>Apply Now</button></div></div>);
}

function TransactionItem({ transaction }) {
    return (
        <div className="transaction-item"><div className="transaction-info"><div>{transaction.name}</div><div style={{fontSize: '0.8rem', color: '#777'}}>{transaction.service}</div></div><div className={`transaction-amount ${transaction.type}`}>{transaction.type === 'income' ? `+$${transaction.amount}` : `-$${Math.abs(transaction.amount)}`}</div></div>
    )
}

// --- Popup Components ---
function NotificationPopup() { return (<div className="popup-overlay"><div className="popup-header">Notifications</div><div className="popup-content">{mockData.notifications.map(n => <div key={n.id} className="notification-item"><i className={`fa-solid ${n.icon}`}></i><div className="notification-text"><div className="title">{n.title}</div><div className="body">{n.body}</div><div className="time">{n.time}</div></div></div>)}</div></div>); }
function ApplicationPopup() { return (<div className="popup-overlay"><div className="popup-header">Worker Applications</div><div className="popup-content">{mockData.applications.map(app => <div key={app.id} className="application-item"><img src={app.img} alt={app.name} /><div className="application-info"><div style={{fontWeight: 700}}>{app.name}</div><div>{app.profession}</div><div className="application-buttons"><button className="btn btn-secondary" style={{padding: '0.3rem 0.8rem'}}>Decline</button><button className="btn btn-primary" style={{padding: '0.3rem 0.8rem'}}>Accept</button></div></div></div>)}</div></div>); }
function ProfilePopup() { return (<div className="popup-overlay"><div className="profile-summary"><div className="initials">JS</div><div className="name">John Smith</div><div className="email">johnsmith@example.com</div></div><div className="profile-links"><div className="link">Edit Profile</div><div className="link">Settings</div><div className="link" style={{color: '#dc3545'}}>Sign Out</div></div></div>); }

// --- NEW: UPI Payment Modal Component ---
function UpiPaymentModal({ amount, onComplete, onClose }) {
    const [step, setStep] = useState('select'); // 'select', 'processing', 'success'
    const [selectedApp, setSelectedApp] = useState(null);

    const handleAppSelect = (appName) => {
        setSelectedApp(appName);
        setStep('processing');
        // Simulate processing delay
        setTimeout(() => {
            setStep('success');
        }, 2500);
    };
    
    const handleFinish = () => {
        onComplete();
    };

    const renderStep = () => {
        switch (step) {
            case 'select':
                return (
                    <div>
                        <p>Payable Amount: <span style={{fontWeight: 700}}>${amount.toFixed(2)}</span></p>
                        <h4>Select UPI App</h4>
                        <div className="upi-app-list">
                            <UpiApp name="GPay" icon="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" onSelect={handleAppSelect} />
                            <UpiApp name="PhonePe" icon="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" onSelect={handleAppSelect} />
                            <UpiApp name="Paytm" icon="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo.svg/1200px-Paytm_Logo.svg.png" onSelect={handleAppSelect} />
                        </div>
                    </div>
                );
            case 'processing':
                return (
                    <div className="upi-processing-screen">
                        <div className="spinner"><i className="fas fa-spinner"></i></div>
                        <h4>Processing Payment</h4>
                        <p>Redirecting to {selectedApp}... Do not press back or close the window.</p>
                    </div>
                );
            case 'success':
                 return (
                    <div className="upi-processing-screen">
                        <div className="success-icon"><i className="fas fa-check-circle"></i></div>
                        <h4>Payment Successful</h4>
                        <p>Your payment of</p>
                        <div className="amount">${amount.toFixed(2)}</div>
                        <p>has been completed successfully.</p>
                        <button className="btn btn-primary" onClick={handleFinish} style={{width: '100%', marginTop: '1rem'}}>Done</button>
                    </div>
                );
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                {step === 'select' && (
                    <div className="modal-header">
                        <h3>UPI Payment</h3>
                        <div className="close-btn" onClick={onClose}><i className="fas fa-times"></i></div>
                    </div>
                )}
                <div className="modal-body">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
}

function UpiApp({ name, icon, onSelect }) {
    return (
        <div className="upi-app" onClick={() => onSelect(name)}>
            <img src={icon} alt={name} />
            <span>{name}</span>
        </div>
    );
}


ReactDOM.render(<App />, document.getElementById('root'));
