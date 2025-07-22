const { useState, useEffect, useMemo } = React;

// ... (getDistance function remains the same)
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
// UPDATED: Chat data now includes transaction types to match PhonePe UI
const mockData = {
    workers: [
        { id: 1, name: 'Sarah Johnson', profession: 'Professional Cleaner', rating: 4.9, experience: '5+ years', rate: 25, img: 'https://i.pravatar.cc/150?img=1', lat: 34.0522, lon: -118.2437 },
        { id: 2, name: 'Mike Rodriguez', profession: 'Handyman & Electrician', rating: 4.8, experience: '8+ years', rate: 35, img: 'https://i.pravatar.cc/150?img=2', lat: 34.1522, lon: -118.4437 },
        { id: 3, name: 'James Wilson', profession: 'Delivery & Moving', rating: 4.7, experience: '3+ years', rate: 20, img: 'https://i.pravatar.cc/150?img=3', lat: 33.9522, lon: -118.3437 },
    ],
    jobs: [
        { id: 1, title: 'House Cleaning Service', description: 'Need deep cleaning for 3-bedroom apartment.', price: 120, lat: 34.0592, lon: -118.2517 },
        { id: 2, title: 'Furniture Assembly', description: 'IKEA wardrobe and dresser assembly.', price: 80, lat: 34.2522, lon: -118.5437 },
    ],
    chats: {
        '1': [
            { type: 'text', from: 'them', text: 'I\'d be happy to help. What kind of cleaning do you need?', time: '10:31 AM' },
            { type: 'transaction', from: 'me', amount: 150, status: 'Sent Securely', time: '10:35 AM' }
        ],
        '2': [],
        '3': [
            { type: 'text', from: 'them', text: 'Sure, I can help with that.', time: 'Yesterday' },
            { type: 'text', from: 'me', text: 'Great!', time: 'Yesterday' }
        ]
    },
    // ... (rest of mockData is unchanged)
};

// --- Main App Component ---
function App() {
    const [activePage, setActivePage] = useState('chats'); // Default to chats now
    const [currentChatId, setCurrentChatId] = useState(null);
    // ... (other states remain the same)

    const navigateTo = (page) => {
        setActivePage(page);
    };

    const openChat = (workerId) => {
        setCurrentChatId(workerId);
        setActivePage('chatDetail');
    };
    
    const goBack = () => {
        if (currentChatId) {
            setCurrentChatId(null);
            setActivePage('chatList'); // Go back to the new chat list
        }
    };
    
    const renderPage = () => {
        switch (activePage) {
            case 'search': return <FindWorkPage />;
            case 'chatList': return <ChatListPage openChat={openChat} />;
            case 'chatDetail': return <ChatDetailPage workerId={currentChatId} goBack={goBack} />;
            case 'workspace': return <WorkspacePage />;
            case 'payments': return <PaymentsPage />;
            default: return <ChatListPage openChat={openChat} />;
        }
    };

    return (
        <div className="app-container">
            {/* Conditional Header: Don't show header on the new chat detail page */}
            {activePage !== 'chatDetail' && (
                <MainHeader />
            )}
            
            <main className="app-content" style={{padding: (activePage === 'chatDetail' || activePage === 'chatList') ? '0' : '1.2rem'}}>
                {renderPage()}
            </main>

            {/* Don't show bottom nav on chat detail page */}
            {activePage !== 'chatDetail' && (
                 <BottomNav activePage={activePage} navigateTo={navigateTo} />
            )}
        </div>
    );
}

// ... MainHeader component is largely the same, just simplified
function MainHeader() {
    return (
        <header className="main-header">
            <h1>Find Your Work</h1>
            <div className="header-icons">
                <div className="icon"><i className="fa-regular fa-bell"></i></div>
                <div className="icon"><i className="fa-solid fa-users"></i></div>
                <div className="icon"><i className="fa-regular fa-user-circle"></i></div>
            </div>
        </header>
    );
}

// UPDATED: Swapped Chats and Search
function BottomNav({ activePage, navigateTo }) {
    const navItems = [
        { id: 'chats', icon: 'fa-comment-dots', label: 'Chats' },
        { id: 'search', icon: 'fa-search', label: 'Search' },
        { id: 'workspace', icon: 'fa-briefcase', label: 'Workspace' },
        { id: 'payments', icon: 'fa-wallet', label: 'Payments' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <div key={item.id} className={`nav-item ${activePage === item.id || (activePage === 'chatDetail' && item.id === 'chatList') ? 'active' : ''}`} onClick={() => navigateTo(item.id)}>
                    <i className={`fa-solid ${item.icon}`}></i>
                    <span>{item.label}</span>
                </div>
            ))}
        </nav>
    );
}


// --- Pages Components ---
function ChatListPage({ openChat }) {
    const getLastMessage = (chat) => {
        if (!chat || chat.length === 0) return "No messages yet";
        const lastMsg = chat[chat.length - 1];
        if (lastMsg.type === 'transaction') {
            return `${lastMsg.from === 'me' ? 'You sent' : 'You received'} ₹${lastMsg.amount}`;
        }
        return lastMsg.text;
    }

    return (
        <div style={{padding: '1rem'}}>
             <div className="search-bar card">
                 <input type="text" placeholder="Search people..." style={{width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px'}}/>
            </div>
            {mockData.workers.map(worker => (
                 <div key={worker.id} className="card chat-list-item" onClick={() => openChat(worker.id)}>
                    <img src={worker.img} alt={worker.name} />
                    <div className="chat-info">
                        <div className="name">{worker.name}</div>
                        <div className="last-message">{getLastMessage(mockData.chats[worker.id])}</div>
                    </div>
                    <div className="chat-meta">
                        <div className="time">{mockData.chats[worker.id]?.slice(-1)[0]?.time}</div>
                    </div>
                 </div>
            ))}
        </div>
    );
}

// NEW/UPDATED: ChatDetailPage with PhonePe Theme
function ChatDetailPage({ workerId, goBack }) {
    const worker = mockData.workers.find(w => w.id === workerId);
    const [messages, setMessages] = useState(mockData.chats[workerId] || []);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim() === '') return;
        const newMsg = { type: 'text', from: 'me', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) };
        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    useEffect(() => {
        const chatBox = document.querySelector('.phonepe-messages');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, [messages]);

    return (
        <div className="phonepe-theme">
            <header className="phonepe-header">
                <i className="fa-solid fa-arrow-left back-arrow" onClick={goBack}></i>
                <img src={worker.img} alt={worker.name} />
                <div className="phonepe-header-info">
                    <div className="name">{worker.name}</div>
                    <div className="subtext">{worker.profession}</div>
                </div>
                <div className="phonepe-header-icons">
                    <i className="fa-solid fa-question-circle header-icon"></i>
                    <i className="fa-solid fa-ellipsis-v header-icon"></i>
                </div>
            </header>
            <div className="phonepe-messages">
                {messages.map((msg, index) => {
                    if (msg.type === 'transaction') {
                        return <TransactionMessage key={index} msg={msg} />;
                    }
                    return <TextMessage key={index} msg={msg} />;
                })}
            </div>
            <div className="phonepe-input-area">
                <i className="fa-solid fa-plus icon-btn"></i>
                <input type="text" placeholder="Enter amount or chat" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} />
                <div className="send-btn" onClick={handleSend}><i className="fa-solid fa-arrow-up"></i></div>
            </div>
        </div>
    );
}

// Helper components for the new chat
function TextMessage({ msg }) {
    return (
        <div className={`phonepe-bubble ${msg.from === 'me' ? 'sent' : 'received'}`}>
            <div>{msg.text}</div>
            <span className="time">{msg.time}</span>
        </div>
    );
}
function TransactionMessage({ msg }) {
    return (
         <div className={`transaction-bubble ${msg.from === 'me' ? 'sent' : 'received'}`}>
            <div className="logo">₹</div>
            <div className="transaction-info">
                <div className="amount">₹{msg.amount}</div>
                <div className="status">
                    <i className="fas fa-check-circle success-icon"></i>
                    {msg.status}
                </div>
            </div>
        </div>
    );
}


// ... (The rest of the components: FindWorkPage, WorkspacePage, PaymentsPage, etc., remain the same as the previous version)

// Keep the previous FindWorkPage, WorkspacePage, etc. here to make the app functional.
function FindWorkPage() { /* ... existing code ... */ return <div>Search Page</div>}
function WorkspacePage() { /* ... existing code ... */ return <div>Workspace Page</div>}
function PaymentsPage() { /* ... existing code ... */ return <div>Payments Page</div>}

ReactDOM.render(<App />, document.getElementById('root'));
