"use client"
import { authClient } from "@/lib/auth-client"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

const HomeView = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 text-center"
      >
       
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
          Tandemly
        </h1>
        <p className="text-lg md:text-xl text-foreground font-medium">
          Learn with Intelligent Agents. Smarter, faster, easier.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="max-w-xl bg-card rounded-xl shadow-lg p-6 text-center border border-border"
      >
        <h2 className="text-xl font-semibold text-primary mb-2">
          What is Tandemly?
        </h2>
        <p className="text-sidebar-accent-background  mb-4">
          Tandemly is your AI-powered Learning platform. Instantly schedule and join meetings where AI Agents help you take notes, answer questions, and keep everyone on track.
        </p>
        <ul className="list-disc list-inside text-sidebar-accent-background text-left mx-auto max-w-md">
          <li>Effortless meeting setup</li>
          <li>AI assistant for summaries & follow-ups</li>
          <li>Real-time chat and collaboration</li>
        </ul>

        <div className="flex justify-center mt-8 gap-4 flex-wrap">
          <Link href="/sign-up">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow hover:ring-2 ring-ring transition">
              Get Started
            </button>
          </Link>

          <button
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/sign-in");
                  },
                },
              })
            }
            className="px-6 py-3 bg-sidebar-accent text-sidebar-accent-foreground rounded-lg font-semibold shadow hover:ring-2 ring-sidebar-ring transition"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeView;
