"use client";
import React from "react";
import { ArrowRight, Loader } from "lucide-react";
import { useFormStatus } from "react-dom";
const ExpandButton = () => {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="group w-full overflow-hidden flex h-10 items-center gap-2 rounded-lg text-black bg-white pl-3 pr-4 transition-all duration-300 ease-in-out  hover:text-white active:bg-neutral-700">
            <span className=" bg-white p-1 text-sm transition-colors duration-300 group-hover:bg-white w-full flex items-center justify-center">
                {pending ? (<Loader size={20} className="animate-spin text-black" />) : <ArrowRight className="text-black transition-all duration-300 group-hover:translate-x-[520%] group-hover:text-lg group-hover:text-black group-active:-rotate-45" />}
            </span>
        </button>
    );
};

export default ExpandButton;