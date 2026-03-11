import { motion } from 'motion/react';
import { BookOpen, Users, Star, Award, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="/uploads/about_photo1.png"
                alt="Asmar Burjaliyeva"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-brand-yellow rounded-full -z-10" />
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-brand-purple rounded-full -z-10 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            About the Teacher
          </h1>
          <h2 className="text-2xl font-display font-semibold text-brand-purple mb-6">
            Asmar Burjaliyeva
          </h2>
          
          <div className="space-y-4 text-lg text-gray-600 mb-8">
            <ul className="space-y-3">
              {[
                'English language teacher',
                'More than 10 years of teaching experience',
                'Certified TKT English teacher',
                'Specialized in speaking-focused English learning',
                'Helps students build confidence in speaking English',
                'Experienced in working with students of different levels',
                'Conducts speaking practice sessions and conversation clubs',
                'Focuses on practical English communication rather than only grammar',
                'Helps students overcome fear of speaking English',
                'Has trained hundreds of students'
              ].map((fact, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-brand-yellow flex-shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-display font-bold text-3xl text-brand-purple mb-2">10</h3>
              <p className="text-gray-600 font-medium">Years Experience</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-display font-bold text-3xl text-brand-yellow mb-2">100+</h3>
              <p className="text-gray-600 font-medium">Trained Students</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mb-24">
        <h2 className="text-3xl font-display font-bold text-center mb-12">Teaching Focus</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Users,
              title: "Speaking practice",
              desc: "Engage in real-life conversations to improve your fluency and pronunciation.",
              color: "bg-brand-pink"
            },
            {
              icon: BookOpen,
              title: "Real-life conversation skills",
              desc: "Learn useful expressions and vocabulary that you can apply in everyday situations.",
              color: "bg-brand-yellow"
            },
            {
              icon: Award,
              title: "Overcoming language barriers",
              desc: "Break down the walls that prevent you from expressing yourself clearly.",
              color: "bg-brand-purple"
            },
            {
              icon: Star,
              title: "Building self-confidence",
              desc: "Overcome the fear of speaking English in a supportive and interactive learning environment.",
              color: "bg-brand-blue"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center"
            >
              <div className={`w-16 h-16 mx-auto rounded-full ${item.color} flex items-center justify-center mb-6`}>
                <item.icon className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold font-display mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
