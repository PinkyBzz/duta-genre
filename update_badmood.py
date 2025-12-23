
import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DutGen - Bad Mood Support</title>
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
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.5);
        }
    </style>
</head>
<body class="bg-[#f0f4f8] text-slate-600 font-sans min-h-screen relative overflow-x-hidden">

    <!-- Background Blobs -->
    <div class="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-32 left-1/3 w-96 h-96 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <main class="max-w-5xl mx-auto px-6 py-10">
        
        <!-- Header -->
        <div class="text-center mb-12 animate__animated animate__fadeInDown">
            <div class="inline-block p-3 bg-blue-100 text-blue-600 rounded-2xl mb-4 shadow-sm">
                <span class="iconify w-8 h-8" data-icon="lucide:cloud-rain"></span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-slate-800 mb-3 tracking-tight">Having a rough day?</h1>
            <p class="text-lg text-slate-500 max-w-2xl mx-auto">It's completely okay to feel down sometimes. Take a deep breath, we're here for you.</p>
        </div>
        
        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            
            <!-- Meditation Card -->
            <div class="glass-card rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
                <div class="flex items-start justify-between mb-4">
                    <div class="p-3 bg-teal-100 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                        <span class="iconify w-6 h-6" data-icon="lucide:flower-2"></span>
                    </div>
                </div>
                <h2 class="text-xl font-bold text-slate-800 mb-2">Meditation Guide</h2>
                <p class="text-slate-500 mb-6 text-sm leading-relaxed">Feeling overwhelmed? This article might help you understand and handle your bad day so you can rest better.</p>
                <a href="https://www.alodokter.com/sering-sakit-dan-stres-coba-meditasi" target="_blank" class="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                    Read Article <span class="iconify" data-icon="lucide:arrow-right"></span>
                </a>
            </div>
            
            <!-- Breathing Card -->
            <div class="glass-card rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
                <div class="flex items-start justify-between mb-4">
                    <div class="p-3 bg-sky-100 text-sky-600 rounded-xl group-hover:scale-110 transition-transform">
                        <span class="iconify w-6 h-6" data-icon="lucide:wind"></span>
                    </div>
                </div>
                <h2 class="text-xl font-bold text-slate-800 mb-2">Breath Control</h2>
                <p class="text-slate-500 mb-6 text-sm leading-relaxed">Pausing for a moment to regulate your breath can calm your mind. Try watching this video guide.</p>
                <a href="https://youtu.be/MDqsn2oiYig?si=Ub6k2XjKxMavbSyM" target="_blank" class="inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-700 transition-colors">
                    Watch Video <span class="iconify" data-icon="lucide:play-circle"></span>
                </a>
            </div>
            
            <!-- Music Card -->
            <div class="glass-card rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group animate__animated animate__fadeInUp" style="animation-delay: 0.3s">
                <div class="flex items-start justify-between mb-4">
                    <div class="p-3 bg-violet-100 text-violet-600 rounded-xl group-hover:scale-110 transition-transform">
                        <span class="iconify w-6 h-6" data-icon="lucide:music"></span>
                    </div>
                </div>
                <h2 class="text-xl font-bold text-slate-800 mb-2">Relaxing Music</h2>
                <p class="text-slate-500 mb-6 text-sm leading-relaxed">Listening to calm music can soothe your bad day. Let these tunes relax your tired soul.</p>
                <a href="https://youtu.be/bP9gMpl1gyQ?si=oJkMnqXNN_BEi3RY" target="_blank" class="inline-flex items-center gap-2 text-violet-600 font-semibold hover:text-violet-700 transition-colors">
                    Listen Now <span class="iconify" data-icon="lucide:headphones"></span>
                </a>
            </div>
            
            <!-- Drawing Card -->
            <div class="glass-card rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
                <div class="flex items-start justify-between mb-4">
                    <div class="p-3 bg-rose-100 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
                        <span class="iconify w-6 h-6" data-icon="lucide:palette"></span>
                    </div>
                </div>
                <h2 class="text-xl font-bold text-slate-800 mb-2">Expressive Art</h2>
                <p class="text-slate-500 mb-6 text-sm leading-relaxed">Try drawing, but not with your hands... try using your nose! See what masterpiece your emotions can create.</p>
                <a href="gambar.html" class="inline-flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors">
                    Start Drawing <span class="iconify" data-icon="lucide:brush"></span>
                </a>
            </div>
        </div>
        
        <!-- Navigation -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate__animated animate__fadeInUp" style="animation-delay: 0.5s">
            <button onclick="window.location.href='pixelThoughts.html'" class="w-full sm:w-auto px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2">
                <span class="iconify" data-icon="lucide:stars"></span>
                Go to Pixel Thoughts
            </button>
            <button onclick="window.location.href='index.html'" class="w-full sm:w-auto px-8 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                <span class="iconify" data-icon="lucide:home"></span>
                Back Home
            </button>
        </div>
    </main>
    
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="badMood.js"></script>
</body>
</html>"""

with open(r"c:\Users\ASUS\OneDrive\ドキュメント\buat tugas\DutGen\dugen html\badMood.html", "w", encoding="utf-8") as f:
    f.write(html_content)
