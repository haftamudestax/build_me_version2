import { Typography } from "@mui/material";
import { motion } from "framer-motion";

export function HeroIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex max-w-xl flex-col items-start text-left"
    >
      <Typography
        component="span"
        className="rounded-full! bg-blue-900! px-6! py-3! text-md! font-bold! uppercase! tracking-wide! text-white!"
      >
        Technology Ownership
      </Typography>

      <Typography
        component="h1"
        className="mt-6! text-5xl! font-extrabold! leading-tight! text-black!"
      >
        Build Better
        <span className="block">Digital Experiences</span>
      </Typography>

      <Typography
        component="h2"
        className="mt-4! text-2xl! font-bold! text-blue-900!"
      >
        Simple, fast, and beautiful platforms that win and get real results.
      </Typography>

      <Typography
        component="p"
        className="mt-6! text-lg! font-normal! leading-relaxed! text-black!"
      >
        Must-see websites and apps that are easy to use, look great, and work
        fast. Get more customers with ease. No stress, no confusion. Just
        simple, reliable solutions that help you grow.
      </Typography>
    </motion.div>
  );
}
