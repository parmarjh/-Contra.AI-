import React, { useState, useEffect, useRef } from 'react';
import { Globe, ArrowRight, User, Cpu, Activity, Fingerprint, Zap, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CULTURES = {
    'Universal': {
        id: 'MOD-001',
        label: 'Universal Standard',
        color: 'from-gray-400 to-gray-200',
        voice: 'Neutral, objective, and precise.',
        greetings: ['Hello, how can I assist you today?', 'Ready to process your request.'],
        responseStyle: 'Direct and factual.'
    },
    'Japanese (Keigo)': {
        id: 'JPN-KGO',
        label: 'Harmony Prime',
        color: 'from-pink-400 to-rose-400',
        voice: 'Highly polite, context-aware, humble.',
        greetings: ['Konnichiwa. It is an honor to assist you today.', 'I am at your humble service.'],
        responseStyle: 'Indirect, deferential, ensuring harmony.'
    },
    'American (NYC)': {
        id: 'NYC-ACT',
        label: 'Manhattan Velocity',
        color: 'from-yellow-400 to-orange-500',
        voice: 'Direct, fast-paced, action-oriented.',
        greetings: ['Hey! What’s up? Let’s get to it.', 'Yo, how can I help?'],
        responseStyle: 'Straight to the point, efficient.'
    },
    'Yoruba (Elder)': {
        id: 'YRB-ELD',
        label: 'Oral Wisdom V2',
        color: 'from-amber-400 to-orange-600',
        voice: 'Proverbial, wise, communal focus.',
        greetings: ['E ka aaro o. Peace be with you.', 'May your day be filled with wisdom.'],
        responseStyle: 'Uses metaphors and proverbs to explain concepts.'
    },
    'British (Aristocratic)': {
        id: 'UK-ROYAL',
        label: 'Windsor Protocol',
        color: 'from-blue-400 to-indigo-500',
        voice: 'Formal, witty, dry humor, understated.',
        greetings: ['Good day to you. Shall we proceed?', 'A pleasure to make your acquaintance.'],
        responseStyle: 'Polite but reserved, uses complex vocabulary.'
    },
    'Indian (Bangalore Tech)': {
        id: 'IND-BLR',
        label: 'Silicon Plateau',
        color: 'from-orange-400 to-red-500',
        voice: 'Warm, hospitable, slightly informal, distinct phrasing.',
        greetings: ['Namaste! Hope you are doing well today.', 'Hello ji! How can I help you regarding this?'],
        responseStyle: 'Helpful, uses "kindly" and "revert", mixes Hindi nuance.'
    },
    'German (Engineering)': {
        id: 'DEU-ENG',
        label: 'Precision Core',
        color: 'from-slate-400 to-slate-600',
        voice: 'Precise, efficient, no-nonsense, rule-oriented.',
        greetings: ['Guten Tag. Let us proceed efficiently.', 'Systems are ready. State your requirement.'],
        responseStyle: 'Structured, direct, focuses on accuracy and rules.'
    },
    'Brazilian (Carioca)': {
        id: 'BRA-RIO',
        label: 'Copacabana Flow',
        color: 'from-green-400 to-yellow-400',
        voice: 'Friendly, informal, expressive, enthusiastic.',
        greetings: ['Oi! Tudo bem? Let’s make something cool!', 'E aí! Ready to rock?'],
        responseStyle: 'Warm, uses exclamation marks, focuses on connection.'
    },
    'French (Parisian)': {
        id: 'FRA-PAR',
        label: 'Rive Gauche',
        color: 'from-blue-300 to-purple-400',
        voice: 'Artistic, slightly aloof, philosophical, critical.',
        greetings: ['Bonjour. Impress me.', 'Salut. Let us discuss the essence of your request.'],
        responseStyle: 'Elegant, questions assumptions, maybe slightly dismissive.'
    },
    'Gen Z (Internet)': {
        id: 'GNZ-VIBE',
        label: 'Zoomer Nexus',
        color: 'from-purple-400 to-pink-500',
        voice: 'Slang-heavy, emoji-rich, casual, ironic.',
        greetings: ['Yooo no cap, what’s the vibe?', 'Hey bestie, what we building?'],
        responseStyle: 'Uses "bet", "fr", "slay", lowercase typing.'
    },
    'Saudi (Formal)': {
        id: 'SAU-FRM',
        label: 'Desert Bloom',
        color: 'from-emerald-400 to-teal-500',
        voice: 'Hospitality-focused, religious/cultural references, respectful.',
        greetings: ['As-salamu alaykum. You are most welcome here.', 'Marhaba. It is a blessing to serve you.'],
        responseStyle: 'Respectful, starts with blessings, emphasizes trust.'
    },
    'Australian (Ocker)': {
        id: 'AUS-OCK',
        label: 'Outback Link',
        color: 'from-yellow-500 to-green-500',
        voice: 'Laid back, slangy, direct, egalitarian.',
        greetings: ['G’day mate! How’s it going?', 'No worries, what do you need?'],
        responseStyle: 'Relaxed, uses "mate", "reckon", avoids pretension.'
    }
};

const CulturalDemo = () => {
    const [selectedCulture, setSelectedCulture] = useState('Universal');
    const activeModel = CULTURES[selectedCulture];
    const [messages, setMessages] = useState([
        { role: 'ai', content: activeModel.greetings[0] }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleCultureChange = (culture) => {
        setSelectedCulture(culture);
        const newModel = CULTURES[culture];
        setMessages(prev => [
            ...prev,
            { role: 'system', content: `Switched to ${newModel.label} [${newModel.id}]` },
            { role: 'ai', content: newModel.greetings[0] }
        ]);
    };

    const verifySpeech = () => {
        if (!('speechSynthesis' in window)) {
            setMessages(prev => [...prev, { role: 'system', content: "Speech synthesis not supported in this browser." }]);
            return false;
        }
        return true;
    };

    const speak = (text) => {
        if (!verifySpeech()) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Select voice based on culture if possible (simplified mapping)
        const voices = window.speechSynthesis.getVoices();
        let voice = null;

        // Simple heuristic mapping - can be expanded
        if (selectedCulture.includes('Japanese')) voice = voices.find(v => v.lang.includes('ja'));
        else if (selectedCulture.includes('French')) voice = voices.find(v => v.lang.includes('fr'));
        else if (selectedCulture.includes('German')) voice = voices.find(v => v.lang.includes('de'));
        else if (selectedCulture.includes('British')) voice = voices.find(v => v.lang.includes('en-GB'));
        else if (selectedCulture.includes('Australian')) voice = voices.find(v => v.lang.includes('en-AU'));
        // Default to English

        if (voice) utterance.voice = voice;

        // Adjust pitch/rate based on persona
        if (activeModel.id === 'GNZ-VIBE') { utterance.rate = 1.2; utterance.pitch = 1.1; }
        if (activeModel.id === 'YRB-ELD') { utterance.rate = 0.9; utterance.pitch = 0.8; }

        window.speechSynthesis.speak(utterance);
    };


    const handleSend = async () => {
        if (!currentInput.trim()) return;

        // Add user message immediately
        const userMsg = { role: 'user', content: currentInput };
        setMessages(prev => [...prev, userMsg]);
        setCurrentInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: currentInput,
                    culture: selectedCulture
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
                speak(data.response); // Trigger speech
            } else {
                console.error("API Error:", data.error);
                setMessages(prev => [...prev, { role: 'system', content: `Error: ${data.error || 'Unknown server error'}` }]);
            }
        } catch (error) {
            console.error("Network Error:", error);
            setMessages(prev => [...prev, { role: 'system', content: "Error: Could not connect to AI backend. Ensure Flask server is running." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="demo-container w-full max-w-5xl mx-auto flex flex-col glass-card border-white-5 overflow-hidden shadow-2xl"
            style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', background: 'rgba(5,5,5,0.9)', minHeight: '700px' }}>

            {/* Active Model Header - Creative Design */}
            <div className="relative p-6 border-b border-white-5 overflow-hidden"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${activeModel.color} transition-all duration-1000`}></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white-10 rounded-xl border border-white-10 shadow-lg backdrop-blur-sm"
                            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                            <Cpu size={32} className={`text-cyan-400`} />
                        </div>
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={selectedCulture}
                            >
                                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                    {activeModel.label}
                                    <span className="text-xs px-2 py-0.5 rounded border border-white-10 text-gray-400 font-mono tracking-wider"
                                        style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                                        {activeModel.id}
                                    </span>
                                </h2>
                            </motion.div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                                <Activity size={14} className="text-green-400" />
                                <span>Online</span>
                                <span className="mx-1">•</span>
                                <span>Latency: 12ms</span>
                                <span className="mx-1">•</span>
                                <Fingerprint size={14} />
                                <span className="truncate max-w-[200px]">{activeModel.voice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Model Selector */}
                    <div className="relative flex items-center gap-2">
                        <button
                            onClick={() => window.speechSynthesis.cancel()}
                            className="p-2 rounded-lg bg-white-10 text-gray-300 hover:text-white transition-all border border-transparent hover:border-white-10"
                            title="Stop Speech"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                            <Volume2 size={18} />
                        </button>

                        <select
                            value={selectedCulture}
                            onChange={(e) => handleCultureChange(e.target.value)}
                            className="appearance-none bg-black text-white rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none transition-all cursor-pointer min-w-[200px]"
                            style={{
                                background: 'rgba(0,0,0,0.6)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            {Object.keys(CULTURES).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <Zap size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="demo-body flex-1 overflow-y-auto p-6 space-y-4" style={{ height: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${msg.role === 'system' ? 'justify-center' : ''}`}
                        >
                            <div
                                className={`
                  px-4 py-3 rounded-2xl text-sm leading-relaxed
                  ${msg.role === 'user' ? 'bg-cyan-600 text-white' : ''}
                  ${msg.role === 'ai' ? 'text-gray-100' : ''}
                  ${msg.role === 'system' ? 'bg-transparent text-xs text-cyan-400 text-center py-1 mt-2 mb-1' : ''}
                `}
                                style={{
                                    maxWidth: '85%',
                                    background: msg.role === 'ai' ? 'rgba(255,255,255,0.1)' : (msg.role === 'user' ? undefined : 'transparent'),
                                    border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                    borderBottomLeftRadius: msg.role === 'ai' ? '2px' : '1rem',
                                    borderBottomRightRadius: msg.role === 'user' ? '2px' : '1rem'
                                }}
                            >
                                {msg.role === 'ai' && (
                                    <div className="text-[10px] uppercase tracking-widest text-cyan-400 mb-1 opacity-70 font-bold" style={{ fontSize: '10px' }}>
                                        {activeModel.label}
                                    </div>
                                )}
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="px-4 py-3 rounded-2xl flex gap-1 items-center" style={{ background: 'rgba(255,255,255,0.1)', borderBottomLeftRadius: '2px' }}>
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white-5 backdrop-blur-sm"
                style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex gap-2 relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={`Message ${activeModel.label}...`}
                        className="w-full bg-black border-white-5 rounded-full px-5 py-3 text-white focus:outline-none"
                        style={{
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            width: '100%',
                            paddingRight: '3rem'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="absolute right-2 top-1.5 p-2 bg-cyan-600 rounded-full hover:bg-cyan-500 disabled:opacity-50 transition-all border-none cursor-pointer"
                        style={{ top: '5px', right: '5px' }}
                    >
                        <ArrowRight size={20} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CulturalDemo;
