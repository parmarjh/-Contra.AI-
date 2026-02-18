import React from 'react';
import CulturalDemo from './components/CulturalDemo';
import { Code2, Brain, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-4 glass-panel border-b border-white-5" style={{ background: 'rgba(5,5,5,0.7)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-white">CONTRA</span><span className="text-cyan-400">.AI</span>
          </div>
          <div className="md-flex gap-8 text-sm font-medium text-gray-300 hidden">
            <a href="#features" className="text-white transition-opacity hover:opacity-80" style={{ textDecoration: 'none' }}>Features</a>
            <a href="#demo" className="text-white transition-opacity hover:opacity-80" style={{ textDecoration: 'none' }}>Live Demo</a>
            <a href="#enterprise" className="text-white transition-opacity hover:opacity-80" style={{ textDecoration: 'none' }}>Enterprise</a>
          </div>
          <button className="bg-white-10 text-white px-4 py-2 rounded-lg text-sm font-medium border-none cursor-pointer">
            Get Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section relative">
        <div className="absolute w-full h-full overflow-hidden" style={{ zIndex: -1, top: 0, left: 0 }}>
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full" style={{ background: 'rgba(147, 51, 234, 0.15)', filter: 'blur(100px)' }}></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full" style={{ background: 'rgba(8, 145, 178, 0.15)', filter: 'blur(100px)' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              The World's First <br />
              <span className="gradient-text">Cultural Language Model</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hero-subtitle mx-auto"
          >
            AIs today speak one language: Data. Contra speaks the language of Culture.
            Understanding context, nuance, and heritage to build truly global intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex gap-4 justify-center"
          >
            <button className="btn-primary flex items-center gap-2">
              Start Building <Code2 size={18} />
            </button>
            <button className="px-6 py-3 rounded-full border-white-5 text-white font-medium bg-transparent cursor-pointer hover:bg-white-10 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
              Read the Whitepaper
            </button>
          </motion.div>
        </div>
      </header>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experience Adaptive Intelligence</h2>
            <p className="text-gray-400">See how Contra adapts its reasoning and communication style in real-time.</p>
          </div>
          <CulturalDemo />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16"><span className="gradient-text">Beyond Translation</span></h2>

          <div className="feature-grid">
            <FeatureCard
              icon={<Brain className="text-purple-400" size={32} />}
              title="Cognitive Diversity"
              desc="Models trained not just on words, but on the reasoning frameworks of 120+ distinct cultures."
            />
            <FeatureCard
              icon={<Globe className="text-cyan-400" size={32} />}
              title="Hyper-Localization"
              desc="Go beyond translation. Adapt humor, formality, and reverence levels automatically."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-emerald-400" size={32} />}
              title="Cultural Safety"
              desc="Prevents cultural erasure by preserving distinct linguistic heritage in every interaction."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white-5 bg-black">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-gray-500 text-sm">
          <p>© 2024 Contra AI Inc. Building for the world.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400" style={{ textDecoration: 'none' }}>Privacy</a>
            <a href="#" className="text-gray-400" style={{ textDecoration: 'none' }}>Terms</a>
            <a href="#" className="text-gray-400" style={{ textDecoration: 'none' }}>Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-card"
  >
    <div className="mb-4 bg-white-10 w-14 h-14 rounded-lg flex items-center justify-center border-white-5" style={{ width: '3.5rem', height: '3.5rem' }}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default App;
