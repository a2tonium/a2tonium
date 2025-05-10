import { motion } from "framer-motion";

export function AnimQuiz({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.38 }}
            style={{ position: "absolute", width: "100%", top: 0, left: 0 }}
        >
            {children}
        </motion.div>
    );
}
