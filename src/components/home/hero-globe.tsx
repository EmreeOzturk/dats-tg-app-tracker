"use client";

import { globeConfig, sampleArcs } from "@/lib/consts"
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
    ssr: false,
});
const HeroGlobe = () => {
    return (
        <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full py-8  ">
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 1,
                }}
                className="div"
            >
                <div className="w-full flex items-center justify-center">
                    <Image src="/logo.png" alt="logo" width={400} height={400} />
                </div>
                <p className="text-center text-base md:text-xl font-bold  text-neutral-200 max-w-lg mt-4 mx-auto">
                    Telegram app data tracking platform
                </p>
            </motion.div>
            <div className="absolute w-full md:-bottom-4 h-96  md:h-[90%] z-10">
                <World data={sampleArcs} globeConfig={globeConfig} />
            </div>
        </div>
    )
}

export default HeroGlobe