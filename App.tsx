import Snowfall from "./components/Snowfall";
import ChristmasLights from "./components/ChristmasLights";
import Countdown from "./components/Countdown";
import Activities from "./components/Activities";
import WishWall from "./components/WishWall";
import Scene3D from "./components/Scene3D";
import { motion, useScroll, useTransform } from "framer-motion";

function App() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen w-full relative bg-[#05100a] text-white overflow-hidden selection:bg-red-500 selection:text-white">
      <Snowfall />
      <ChristmasLights />

      {/* Hero Section with 3D Background */}
      <header className="relative w-full h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden">
        {/* 3D Scene Background */}
        <div className="absolute inset-0 z-0">
          <Scene3D />
        </div>

        {/* Overlay Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05100a] z-0 pointer-events-none" />

        <motion.div
          style={{ y: y1, opacity }}
          className="relative z-10 text-center px-4"
        >
          <motion.h1
            initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-7xl md:text-9xl lg:text-[10rem] mb-2 font-bold tracking-wider drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] festive-font gradient-text leading-tight"
          >
            Merry <br />{" "}
            <span
              className="text-red-500 drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]"
              style={{ WebkitTextFillColor: "currentcolor" }}
            >
              Christmas
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-xl md:text-2xl font-light mb-12 tracking-wide text-green-100 max-w-xl mx-auto glass-panel py-2 px-6 rounded-full inline-block"
          >
            Let the magic of the season fill your heart ✨
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="glass-panel-heavy p-8 rounded-3xl inline-block max-w-3xl w-full mx-auto transform hover:scale-[1.02] transition-transform duration-500"
          >
            <p className="uppercase text-xs tracking-[0.3em] mb-6 text-green-300 font-bold">
              Santa's Arrival Countdown
            </p>
            <Countdown />
          </motion.div>
        </motion.div>
      </header>

      {/* Main Content with Parallax Background */}
      <main className="relative z-10">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none fixed"></div>

        <div className="relative">
          {/* Glowing orb decorations */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

          <section id="activities">
            <Activities />
          </section>

          <section id="wishes" className="mt-12">
            <WishWall />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#022c22] border-t border-white/5 text-green-100 py-12 text-center relative z-10">
        <div className="container mx-auto px-4">
          <p className="festive-font text-3xl mb-4 text-glow">
            Happy Holidays!
          </p>
          <div className="flex justify-center space-x-4 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150"></div>
          </div>
          <p className="text-sm opacity-50 font-light tracking-wider">
            &copy; {new Date().getFullYear()} PTSFDTZ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
