"use client"
import { authClient } from "@/lib/auth-client"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

const HomeView = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 text-center"
      >
        <img src="/logo.svg" alt="Tandemly Logo" className="mx-auto mb-4 w-20 h-20" />
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-2">
          Tandemly
        </h1>
        <p className="text-lg md:text-xl text-gray-700 font-medium">
          Meet with Intelligent Agents. Smarter, faster, easier.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="max-w-xl bg-white rounded-xl shadow-lg p-6 text-center"
      >
        <h2 className="text-xl font-semibold text-green-600 mb-2">
          What is Tandemly?
        </h2>
        <p className="text-gray-600 mb-4">
          Tandemly is your AI-powered meeting platform. Instantly schedule and join meetings where AI Agents helps you take notes, answer questions, and keep everyone on track.
        </p>
        <ul className="list-disc list-inside text-gray-500 text-left mx-auto max-w-md">
          <li>Effortless meeting setup</li>
          <li>AI assistant for summaries & follow-ups</li>
          <li>Real-time chat and collaboration</li>
        </ul>
        <Link href={"/sign-up"}>
        <button className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition">
          Get Started
        </button>
        </Link>
        <button
        onClick={() =>authClient.signOut({
          fetchOptions:{
            onSuccess: () => {
              router.push("/sign-in");
            }
          }
        })}
        className="mt-8  ml-8 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition">
         Sign Out
        </button>
        
      </motion.div>
    </div>
  )
}

export default HomeView;