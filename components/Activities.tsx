import React from "react";
import { Gift, Music, Utensils, Gamepad2 } from "lucide-react";
import { ActivityType } from "../types";
import { motion } from "framer-motion";

const Activities: React.FC = () => {
  const activities = [
    {
      type: ActivityType.GIFT,
      title: "Secret Santa",
      description: "Exchange surprise gifts with friends! Budget: $20.",
      icon: <Gift className="w-8 h-8 text-red-200" />,
      gradient: "from-red-900/40 to-red-600/10",
    },
    {
      type: ActivityType.MUSIC,
      title: "Carol Karaoke",
      description: "Singing 'Jingle Bells' and other classics together.",
      icon: <Music className="w-8 h-8 text-green-200" />,
      gradient: "from-green-900/40 to-green-600/10",
    },
    {
      type: ActivityType.DINNER,
      title: "Christmas Feast",
      description: "Turkey, ham, gingerbread cookies, and eggnog.",
      icon: <Utensils className="w-8 h-8 text-yellow-200" />,
      gradient: "from-yellow-900/40 to-yellow-600/10",
    },
    {
      type: ActivityType.GAME,
      title: "Reindeer Games",
      description: "Fun party games and Christmas trivia quiz.",
      icon: <Gamepad2 className="w-8 h-8 text-blue-200" />,
      gradient: "from-blue-900/40 to-blue-600/10",
    },
  ];

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl text-white mb-6 festive-font text-glow"
        >
          Holiday Activities
        </motion.h2>
        <p className="text-green-100/80 max-w-2xl mx-auto text-lg font-light">
          Join us for a day full of joy, laughter, and warm memories.
          <br />
          Hover over the cards to see the magic!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, rotateY: 10, rotateX: 5 }}
            className={`p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md bg-gradient-to-br ${activity.gradient} group cursor-pointer overflow-hidden relative`}
          >
            {/* Glossy sheen */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-inner mx-auto group-hover:scale-110 transition-transform duration-300">
              {activity.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center festive-font tracking-wide">
              {activity.title}
            </h3>
            <p className="text-gray-300 text-center text-sm leading-relaxed">
              {activity.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
