
import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>DutGen - Daily Reflection</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.iconify.design/3/3.1.0/iconify.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    animation: {
                        'blob': 'blob 7s infinite',
                    },
                    keyframes: {
                        blob: {
                            '0%': { transform: 'translate(0px, 0px) scale(1)' },
                            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                            '100%': { transform: 'translate(0px, 0px) scale(1)' },
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        /* Custom scrollbar */
        textarea::-webkit-scrollbar {
            width: 6px;
        }
        textarea::-webkit-scrollbar-track {
            background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
            background-color: #e2e8f0;
            border-radius: 20px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
            background-color: #cbd5e1;
        }
        
        /* Color Input Styling */
        input[type="color"] {
            -webkit-appearance: none;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; }

        /* Wheel Arrow */
        .wheel-arrow {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-top: 20px solid #1e293b;
            z-index: 20;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .wheel-arrow-highlight {
            transform: translateX(-50%) scale(1.2) translateY(5px);
        }

        /* Notifications */
        .notification {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 16px 20px;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255,255,255,0.5);
            transform: translateY(150px) scale(0.9);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            z-index: 100;
            font-size: 0.875rem;
            font-weight: 500;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .notification.show { transform: translateY(0) scale(1); opacity: 1; }
        .notification.success .icon-box { background-color: #d1fae5; color: #059669; }
        .notification.warning .icon-box { background-color: #fef3c7; color: #d97706; }
        .notification.info .icon-box { background-color: #dbeafe; color: #2563eb; }

        /* Glass Cards */
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.5);
        }

        /* Emoji Hover Effects */
        .emoji-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .emoji-btn:hover { transform: translateY(-5px); }
        .emoji-btn:active { transform: scale(0.95); }
    </style>
</head>
<body class="bg-[#f0f4f8] text-slate-600 selection:bg-violet-200 selection:text-violet-800 min-h-screen relative overflow-x-hidden">

    <!-- Background Blobs for Color/Vibrancy -->
    <div class="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <main class="max-w-5xl mx-auto px-6 py-10">
        
        <!-- Header -->
        <header class="flex flex-col md:flex-row items-center justify-between mb-10 animate__animated animate__fadeInDown">
            <div class="text-center md:text-left">
                <div class="inline-block relative">
                    <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 pb-1">DutGen</h1>
                    <div class="absolute -top-1 -right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <p class="text-sm font-medium text-slate-500 mt-1">Design your day, track your soul.</p>
            </div>
            
            <div class="mt-6 md:mt-0 flex items-center gap-4 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/60 shadow-sm transition-transform hover:scale-105">
                <label for="bgColorPicker" class="text-xs font-bold text-slate-500 uppercase tracking-wider">Accent</label>
                <div class="h-4 w-[1px] bg-slate-200"></div>
                <input type="color" id="bgColorPicker" value="#f0f4f8" title="Change Mood Color" />
            </div>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            <!-- Left Column -->
            <div class="md:col-span-7 space-y-8">
                
                <!-- Mood Section -->
                <section class="glass-card rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-100/40 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100 to-transparent rounded-bl-full opacity-50 transition-opacity group-hover:opacity-100"></div>
                    
                    <div class="flex items-center gap-3 mb-6 relative z-10">
                        <div class="p-2.5 bg-violet-100 text-violet-600 rounded-xl shadow-sm">
                            <span class="iconify w-5 h-5" data-icon="lucide:smile-plus"></span>
                        </div>
                        <h2 class="text-lg font-bold text-slate-800 tracking-tight">How's your vibe today?</h2>
                    </div>
                    
                    <!-- Decorative Image (Hidden as per structure req but available for logic) -->
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg" alt="Roda Emosi" class="hidden" />
                    
                    <div class="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
                        <button class="emoji emoji-btn bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 group" data-emotion="Good" data-color="text-emerald-600">
                            <span class="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">🥰</span>
                            <span class="text-xs font-semibold text-emerald-700/80">Good</span>
                        </button>
                        <button class="emoji emoji-btn bg-amber-50 hover:bg-amber-100 border border-amber-100 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 group" data-emotion="Neutral" data-color="text-amber-600">
                            <span class="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">😐</span>
                            <span class="text-xs font-semibold text-amber-700/80">Okay</span>
                        </button>
                        <button class="emoji emoji-btn bg-blue-50 hover:bg-blue-100 border border-blue-100 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 group" data-emotion="Bad" data-color="text-blue-600">
                            <span class="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">😢</span>
                            <span class="text-xs font-semibold text-blue-700/80">Bad</span>
                        </button>
                        <button class="emoji emoji-btn bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 group" data-emotion="Disappointed" data-color="text-indigo-600">
                            <span class="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">🫠</span>
                            <span class="text-xs font-semibold text-indigo-700/80">Low</span>
                        </button>
                        <button class="emoji emoji-btn bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 group" data-emotion="Sad" data-color="text-slate-600">
                            <span class="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">😔</span>
                            <span class="text-xs font-semibold text-slate-700/80">Sad</span>
                        </button>
                        <button class="emoji emoji-btn bg-orange-50 hover:bg-orange-100 border border-orange-100 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 group" data-emotion="Worried" data-color="text-orange-600">
                            <span class="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">😣</span>
                            <span class="text-xs font-semibold text-orange-700/80">Anxious</span>
                        </button>
                        <button class="emoji emoji-btn bg-purple-50 hover:bg-purple-100 border border-purple-100 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 group" data-emotion="Confused" data-color="text-purple-600">
                            <span class="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">😵‍💫</span>
                            <span class="text-xs font-semibold text-purple-700/80">Confused</span>
                        </button>
                        <button class="emoji emoji-btn bg-rose-50 hover:bg-rose-100 border border-rose-100 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 group" data-emotion="Angry" data-color="text-rose-600">
                            <span class="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">🤬</span>
                            <span class="text-xs font-semibold text-rose-700/80">Angry</span>
                        </button>
                    </div>
                    
                    <div class="result min-h-[28px] text-sm text-center font-medium bg-slate-50/80 rounded-lg py-2 text-slate-600 border border-slate-100" id="result">
                        Select an emoji above
                    </div>
                </section>
                
                <!-- Journal Section -->
                <section class="glass-card rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-100/40">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-3">
                            <div class="p-2.5 bg-pink-100 text-pink-600 rounded-xl shadow-sm">
                                <span class="iconify w-5 h-5" data-icon="lucide:book-heart"></span>
                            </div>
                            <h2 class="text-lg font-bold text-slate-800 tracking-tight">Daily Journal</h2>
                        </div>
                        
                        <!-- Vibrant Color Tags -->
                        <div class="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-xl">
                            <button class="color-picker w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 hover:scale-110 transition-transform shadow-sm" id="green" data-color="good" aria-label="Good day"></button>
                            <button class="color-picker w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 hover:scale-110 transition-transform shadow-sm" id="yellow" data-color="neutral" aria-label="Neutral day"></button>
                            <button class="color-picker w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 hover:scale-110 transition-transform shadow-sm" id="red" data-color="bad" aria-label="Bad day"></button>
                        </div>
                    </div>
                    
                    <div class="space-y-5">
                        <div class="relative group">
                             <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                                <span class="iconify w-4 h-4" data-icon="lucide:calendar-days"></span>
                            </div>
                            <input type="date" id="calendar" class="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all shadow-sm" />
                        </div>
                        
                        <div class="relative">
                            <textarea class="text-area w-full min-h-[160px] p-4 bg-white/60 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-100 resize-none transition-all shadow-sm" id="userText" placeholder="What made you smile (or frown) today?"></textarea>
                            <div class="absolute bottom-3 right-3 text-xs text-slate-400 font-medium bg-white/80 px-2 py-1 rounded-md">Draft saved</div>
                        </div>
                    </div>
                </section>
                
                <!-- Release Thoughts Section (More Colorful) -->
                <section class="rounded-3xl p-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 shadow-xl shadow-fuchsia-200/50">
                    <div class="bg-slate-900 rounded-[22px] p-6 md:p-8 relative overflow-hidden group">
                        <!-- Dynamic background inside card -->
                        <div class="absolute top-0 right-0 p-32 bg-fuchsia-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-fuchsia-500/30 transition-colors duration-500"></div>
                        <div class="absolute bottom-0 left-0 p-24 bg-indigo-500/20 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>
                        
                        <div class="relative z-10 text-white">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="iconify text-fuchsia-300 w-5 h-5" data-icon="lucide:wind"></span>
                                <h2 class="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Release Thoughts</h2>
                            </div>
                            <div class="relative">
                                <input type="text" class="thought-input w-full bg-white/10 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-fuchsia-400/50 focus:ring-4 focus:ring-fuchsia-500/20 transition-all backdrop-blur-sm" placeholder="Type a thought to let it go into the void...">
                                <button class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors">
                                    <span class="iconify w-4 h-4" data-icon="lucide:arrow-right"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                
            </div>
            
            <!-- Right Column -->
            <div class="md:col-span-5 space-y-8">
                
                <!-- Wheel Section -->
                <section class="glass-card rounded-3xl border border-white/60 shadow-xl shadow-indigo-100/40 p-6 md:p-8 flex flex-col items-center relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/50 pointer-events-none"></div>
                    
                    <div class="w-full flex items-center justify-between mb-8 relative z-10">
                        <h2 class="text-lg font-bold text-slate-800 tracking-tight">Mood Spinner</h2>
                        <div class="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <span class="iconify w-4 h-4" data-icon="lucide:loader-2"></span>
                        </div>
                    </div>
                    
                    <div class="emotion-wheel-section relative mb-8 z-10">
                        <!-- Decorative glow behind wheel -->
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-violet-200 to-fuchsia-200 rounded-full blur-2xl opacity-60"></div>
                        
                        <div class="wheel-container relative">
                            <div class="wheel-arrow"></div>
                            <svg id="emotionWheel" width="280" height="280" viewBox="0 0 320 320" class="transform transition-transform duration-700 ease-out origin-center cursor-pointer drop-shadow-lg"></svg>
                        </div>
                    </div>
                    
                    <div id="selectedEmotion" class="w-full mb-6 min-h-[60px] rounded-xl text-sm flex items-center justify-center p-3 relative z-10 bg-white/50 border border-white/60 backdrop-blur-sm">
                        <span class="text-slate-400 italic">Spin to discover...</span>
                    </div>
                    
                    <button id="spinWheel" class="relative w-full overflow-hidden group rounded-xl shadow-md hover:shadow-lg hover:shadow-violet-200 transition-all active:scale-95">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:from-violet-500 group-hover:to-indigo-500 transition-colors"></div>
                        <div class="relative px-5 py-3.5 flex items-center justify-center gap-2 text-white font-semibold tracking-wide">
                            <span class="iconify w-4 h-4 animate-spin-slow" data-icon="lucide:sparkles"></span>
                            Spin the Wheel
                        </div>
                    </button>
                </section>
                
                <!-- Reminder Section -->
                <section class="glass-card rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-100/40">
                    <div class="flex items-center gap-3 mb-5">
                        <div class="p-2.5 bg-sky-100 text-sky-600 rounded-xl shadow-sm">
                            <span class="iconify w-5 h-5" data-icon="lucide:bell-ring"></span>
                        </div>
                        <h2 class="text-lg font-bold text-slate-800 tracking-tight">Mindful Alert</h2>
                    </div>
                    
                    <div class="flex gap-3">
                        <div class="relative flex-1 group">
                             <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                <span class="iconify w-4 h-4" data-icon="lucide:clock-4"></span>
                            </div>
                            <input type="time" id="notifyTime" class="w-full pl-10 pr-3 py-3 bg-white/60 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all shadow-sm" />
                        </div>
                        <button id="setTime" class="bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-600 border border-slate-200 hover:border-sky-200 font-semibold px-6 rounded-xl transition-all shadow-sm flex items-center justify-center active:scale-95">
                            Set
                        </button>
                    </div>
                </section>

                <!-- Small Footer/Quote -->
                <div class="text-center py-2 animate__animated animate__fadeIn">
                    <p class="text-xs text-slate-400 font-medium">"Every color is a feeling."</p>
                </div>

            </div>
        </div>
    </main>
    
    <!-- Notifications -->
    <div id="notification" class="notification"></div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            
            // --- Helper: Dynamic Background from Color Picker ---
            const bgPicker = document.getElementById('bgColorPicker');
            if(bgPicker) {
                bgPicker.addEventListener('input', (e) => {
                    const color = e.target.value;
                    // Create a subtle gradient overlay based on selection
                    document.body.style.background = `linear-gradient(135deg, ${color}20 0%, #ffffff 100%)`;
                });
            }

            // --- Logic Core ---
            const IndexPage = {
                config: {
                    wheelAnimationDuration: 2500,   
                    rotationCircles: 5,             
                    notificationDuration: 3000,     
                },
                elements: {},
                state: {
                    currentRotation: 0,
                },
                data: {
                    emotions: [
                        { label: 'Joyful', color: '#fbbf24', emoji: '🤩', text: '#92400e' },  
                        { label: 'Melancholy', color: '#94a3b8', emoji: '🌧️', text: '#334155' },   
                        { label: 'Furious', color: '#f87171', emoji: '😡', text: '#7f1d1d' }, 
                        { label: 'Scared', color: '#a78bfa', emoji: '😨', text: '#5b21b6' },  
                        { label: 'Amazed', color: '#fb923c', emoji: '😲', text: '#9a3412' }, 
                        { label: 'Peaceful', color: '#34d399', emoji: '😌', text: '#065f46' },  
                        { label: 'Anxious', color: '#fca5a5', emoji: '😟', text: '#991b1b' }, 
                        { label: 'Lost', color: '#93c5fd', emoji: '🌫️', text: '#1e40af' } 
                    ],
                    sadEmotions: ["Bad", "Disappointed", "Sad", "Worried", "Angry"]
                },
                
                init() {
                    this.cacheElements();
                    this.setupBoxAnimations();
                    this.setupEmojiListeners();
                    this.setupReminderListeners();
                    this.setupColorPickerListeners();
                    this.setupEmotionWheel();
                    this.setupThoughtInput();
                },
              
                cacheElements() {
                    this.elements = {
                        emojis: document.querySelectorAll('.emoji'),
                        result: document.getElementById('result'),
                        setTimeButton: document.getElementById('setTime'),
                        notifyTimeInput: document.getElementById('notifyTime'),
                        calendarInput: document.getElementById('calendar'),
                        colorPickers: document.querySelectorAll('.color-picker'),
                        userText: document.getElementById('userText'),
                        boxes: document.querySelectorAll('section'),
                        wheel: document.getElementById('emotionWheel'),
                        spinBtn: document.getElementById('spinWheel'),
                        selectedDiv: document.getElementById('selectedEmotion'),
                        arrow: document.querySelector('.wheel-arrow'),
                        thoughtInput: document.querySelector('.thought-input')
                    };
                },

                setupThoughtInput() {
                    if(this.elements.thoughtInput) {
                        this.elements.thoughtInput.addEventListener('keypress', (e) => {
                            if (e.key === 'Enter') {
                                const val = this.elements.thoughtInput.value;
                                if (!val) return;
                                
                                this.elements.thoughtInput.value = '';
                                this.elements.thoughtInput.blur();
                                
                                // Save thought to local storage (preserving feature)
                                this.saveThought(val);
                                
                                this.showNotification('Thought released into the ether...', 2500, 'info');
                                
                                // Visual feedback visual
                                const btn = this.elements.thoughtInput.nextElementSibling;
                                if(btn) {
                                    btn.innerHTML = '<span class="iconify w-4 h-4 text-emerald-300" data-icon="lucide:check"></span>';
                                    setTimeout(() => btn.innerHTML = '<span class="iconify w-4 h-4" data-icon="lucide:arrow-right"></span>', 2000);
                                }
                            }
                        });
                    }
                },
                
                /**
                 * Save thought to local storage (for potential history feature)
                 * @param {string} thought - The thought text to save
                 */
                saveThought(thought) {
                    try {
                        const thoughts = JSON.parse(localStorage.getItem('dutgen_thoughts') || '[]');
                        thoughts.push({
                            text: thought,
                            timestamp: new Date().toISOString()
                        });
                        localStorage.setItem('dutgen_thoughts', JSON.stringify(thoughts.slice(-20))); // Keep last 20
                    } catch (error) {
                        console.warn('Failed to save thought to local storage:', error);
                    }
                },
                
                setupBoxAnimations() {
                    this.elements.boxes.forEach((box, index) => {
                        box.classList.add('animate__animated', 'animate__fadeInUp');
                        box.style.animationDelay = `${index * 0.15}s`;
                    });
                },
                
                setupEmojiListeners() {
                    this.elements.emojis.forEach(emoji => {
                        emoji.addEventListener('click', () => {
                            // Reset state
                            this.elements.emojis.forEach(e => {
                                e.classList.remove('ring-2', 'ring-offset-2', 'ring-violet-400', 'bg-white');
                                e.style.transform = 'scale(1)';
                            });
                            
                            // Active state
                            emoji.classList.add('ring-2', 'ring-offset-2', 'ring-violet-400', 'bg-white');
                            emoji.style.transform = 'scale(1.05)';

                            const emotion = emoji.getAttribute('data-emotion');
                            const colorClass = emoji.getAttribute('data-color'); 
                            
                            this.elements.result.innerHTML = `Current Vibe: <span class="${colorClass} font-bold text-lg ml-1">${emotion}</span>`;
                            this.elements.result.className = "result min-h-[28px] text-sm text-center font-medium bg-white rounded-lg py-2 border border-violet-100 shadow-sm transition-all";
                            
                            if (this.data.sadEmotions.includes(emotion)) {
                                this.showNotification(`It's okay to feel ${emotion}. Redirecting to support...`, 3000, 'info');
                                setTimeout(() => {
                                    window.location.href = "badMood.html";
                                }, 2000);
                            } else {
                                this.showNotification("That's a great vibe! Keep it up!", 2500, 'success');
                            }
                        });
                    });
                },
                
                setupReminderListeners() {
                    if (this.elements.setTimeButton) {
                        this.elements.setTimeButton.addEventListener('click', () => {
                            const timeValue = this.elements.notifyTimeInput.value;
                            if (!timeValue) {
                                this.showNotification('Please pick a time first', null, 'warning');
                                return;
                            }
                            
                            // Visual feedback on button
                            const originalText = this.elements.setTimeButton.innerText;
                            this.elements.setTimeButton.innerHTML = '<span class="iconify w-4 h-4" data-icon="lucide:check"></span>';
                            this.elements.setTimeButton.classList.add('bg-emerald-50', 'text-emerald-600', 'border-emerald-200');
                            
                            setTimeout(() => {
                                this.elements.setTimeButton.innerText = originalText;
                                this.elements.setTimeButton.classList.remove('bg-emerald-50', 'text-emerald-600', 'border-emerald-200');
                            }, 2000);
                            
                            this.showNotification(`Reminder set for ${timeValue}`, null, 'success');
                        });
                    }
                },
                
                setupColorPickerListeners() {
                    this.elements.colorPickers.forEach(picker => {
                        picker.addEventListener('click', () => {
                            const selectedColor = picker.getAttribute('data-color');
                            const selectedDate = this.elements.calendarInput.value;
                            
                            if (!selectedDate) {
                                this.elements.calendarInput.focus();
                                this.showNotification("Pick a date to mark", null, 'warning');
                                return;
                            }
                            
                            const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            
                            let colorName = '';
                            let colorHex = '';
                            if(selectedColor === 'good') { colorName = 'Amazing'; colorHex = 'text-emerald-500'; }
                            if(selectedColor === 'neutral') { colorName = 'Okay'; colorHex = 'text-amber-500'; }
                            if(selectedColor === 'bad') { colorName = 'Rough'; colorHex = 'text-rose-500'; }

                            this.showNotification(`Marked ${formattedDate} as <span class="${colorHex} font-bold ml-1">${colorName}</span>`, 3000, 'success');
                        });
                    });
                },

                setupEmotionWheel() {
                    if (!this.elements.wheel) return;
                    this.drawWheel();
                    if (this.elements.spinBtn) {
                        this.elements.spinBtn.addEventListener('click', () => this.spinWheel());
                    }
                },
                
                drawWheel() {
                    const cx = 160, cy = 160, r = 140;
                    const n = this.data.emotions.length;
                    const angle = 2 * Math.PI / n;
                    this.elements.wheel.innerHTML = '';
                    
                    // Filter shadow defs
                    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    defs.innerHTML = `<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000000" flood-opacity="0.1"/></filter>`;
                    this.elements.wheel.appendChild(defs);

                    const wheelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    this.elements.wheel.appendChild(wheelGroup);
                    
                    for (let i = 0; i < n; i++) {
                        const startAngle = i * angle - Math.PI/2;
                        const endAngle = (i+1) * angle - Math.PI/2;
                        const x1 = cx + r * Math.cos(startAngle);
                        const y1 = cy + r * Math.sin(startAngle);
                        const x2 = cx + r * Math.cos(endAngle);
                        const y2 = cy + r * Math.sin(endAngle);
                        
                        const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
                        
                        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
                        path.setAttribute('d', pathData);
                        path.setAttribute('fill', this.data.emotions[i].color);
                        path.setAttribute('stroke', 'white');
                        path.setAttribute('stroke-width', '2');
                        path.style.cursor = 'pointer';
                        
                        // Interaction
                        path.addEventListener('mouseenter', () => {
                            path.setAttribute('fill', this.getLighterColor(this.data.emotions[i].color, -20)); // darken slightly
                        });
                        path.addEventListener('mouseleave', () => {
                            path.setAttribute('fill', this.data.emotions[i].color);
                        });
                        path.addEventListener('click', () => this.selectEmotion(i));
                        
                        wheelGroup.appendChild(path);
                        
                        // Text/Emoji
                        const labelAngle = startAngle + angle/2;
                        const lx = cx + (r-35) * Math.cos(labelAngle);
                        const ly = cy + (r-35) * Math.sin(labelAngle) + 8;
                        
                        const text = document.createElementNS('http://www.w3.org/2000/svg','text');
                        text.setAttribute('x', lx);
                        text.setAttribute('y', ly);
                        text.setAttribute('text-anchor', 'middle');
                        text.setAttribute('font-size', '22');
                        text.setAttribute('pointer-events', 'none');
                        text.style.filter = "drop-shadow(0px 1px 1px rgba(0,0,0,0.1))";
                        text.textContent = this.data.emotions[i].emoji;
                        wheelGroup.appendChild(text);
                    }
                    
                    // Center Decor
                    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    centerCircle.setAttribute('cx', cx);
                    centerCircle.setAttribute('cy', cy);
                    centerCircle.setAttribute('r', 30);
                    centerCircle.setAttribute('fill', '#ffffff');
                    centerCircle.setAttribute('filter', 'url(#shadow)');
                    wheelGroup.appendChild(centerCircle);
                    
                    const centerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    centerDot.setAttribute('cx', cx);
                    centerDot.setAttribute('cy', cy);
                    centerDot.setAttribute('r', 8);
                    centerDot.setAttribute('fill', '#475569');
                    wheelGroup.appendChild(centerDot);
                },
                
                // Helper to darken color for hover
                getLighterColor(col, amt) {
                    var usePound = false;
                    if (col[0] == "#") { col = col.slice(1); usePound = true; }
                    var num = parseInt(col,16);
                    var r = (num >> 16) + amt;
                    if (r > 255) r = 255; else if  (r < 0) r = 0;
                    var b = ((num >> 8) & 0x00FF) + amt;
                    if (b > 255) b = 255; else if  (b < 0) b = 0;
                    var g = (num & 0x0000FF) + amt;
                    if (g > 255) g = 255; else if (g < 0) g = 0;
                    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
                },

                spinWheel() {
                    const n = this.data.emotions.length;
                    const randomIdx = Math.floor(Math.random() * n);
                    const anglePer = 360 / n;
                    // Add extra rotations + target
                    const targetRotation = 360 * this.config.rotationCircles + (360 - randomIdx * anglePer - anglePer/2);
                    
                    const arrow = document.querySelector('.wheel-arrow');
                    arrow.classList.remove('wheel-arrow-highlight');
                    this.elements.selectedDiv.style.opacity = '0.5';
                    
                    this.elements.wheel.style.transition = `transform ${this.config.wheelAnimationDuration/1000}s cubic-bezier(.15,.95,.65,1)`;
                    this.elements.wheel.style.transform = `rotate(${targetRotation}deg)`;
                    
                    this.elements.spinBtn.disabled = true;
                    this.elements.spinBtn.classList.add('opacity-75', 'cursor-not-allowed');

                    setTimeout(() => {
                        this.elements.spinBtn.disabled = false;
                        this.elements.spinBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                        
                        this.elements.wheel.style.transition = 'none';
                        this.elements.wheel.style.transform = `rotate(${targetRotation % 360}deg)`;
                        
                        this.selectEmotion(randomIdx);
                    }, this.config.wheelAnimationDuration);
                },
                
                selectEmotion(idx) {
                    const emotion = this.data.emotions[idx];
                    
                    // Styled Result
                    this.elements.selectedDiv.innerHTML = `
                        <div class="flex items-center gap-4 animate__animated animate__zoomIn">
                            <div class="text-4xl filter drop-shadow-md">${emotion.emoji}</div>
                            <div class="text-left">
                                <div class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Wheel Result</div>
                                <div class="text-xl font-bold" style="color:${emotion.text}">${emotion.label}</div>
                            </div>
                        </div>
                    `;
                    this.elements.selectedDiv.style.opacity = '1';
                    this.elements.selectedDiv.className = "w-full mb-6 min-h-[70px] rounded-xl text-sm flex items-center justify-center p-3 relative z-10 transition-all border shadow-sm";
                    this.elements.selectedDiv.style.backgroundColor = 'white';
                    this.elements.selectedDiv.style.borderColor = emotion.color;
                    this.elements.selectedDiv.style.boxShadow = `0 4px 15px -3px ${emotion.color}40`;
                    
                    if (this.elements.arrow) {
                        this.elements.arrow.style.borderTopColor = '#1e293b'; // reset to dark
                        setTimeout(() => {
                             this.elements.arrow.style.borderTopColor = emotion.color;
                             this.elements.arrow.classList.add('wheel-arrow-highlight');
                        }, 50);
                    }
                },
                
                showNotification(message, duration = null, type = 'info') {
                    const notification = document.createElement('div');
                    notification.className = `notification ${type}`;
                    
                    let icon = 'lucide:info';
                    if(type === 'success') icon = 'lucide:check-circle-2';
                    if(type === 'warning') icon = 'lucide:alert-triangle';

                    notification.innerHTML = `
                        <div class="icon-box p-1.5 rounded-full flex items-center justify-center">
                            <span class="iconify w-4 h-4" data-icon="${icon}"></span>
                        </div>
                        <span>${message}</span>
                    `;
                    
                    document.querySelectorAll('.notification').forEach(n => n.remove());
                    document.body.appendChild(notification);
                    
                    setTimeout(() => notification.classList.add('show'), 10);
                    
                    setTimeout(() => {
                        notification.classList.remove('show');
                        setTimeout(() => notification.remove(), 400);
                    }, duration || this.config.notificationDuration);
                }
            };
            
            IndexPage.init();
        });
    </script>
</body>
</html>"""

with open(r"c:\Users\ASUS\OneDrive\ドキュメント\buat tugas\DutGen\dugen html\index.html", "w", encoding="utf-8") as f:
    f.write(html_content)
