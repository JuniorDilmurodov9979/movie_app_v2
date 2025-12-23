import { TypewriterEffect } from "../components/ui/typewriter-effect";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center text-white text-center">
      <div className="absolute top-[38%]">
        <TypewriterEffect
          words={[
            { text: "Welcome", className: "text-blue-300" },
            { text: "to", className: "text-blue-300" },
            { text: "MovieDB", className: "text-blue-700" },
          ]}
          className="text-4xl md:text-5xl xl:text-6xl font-bold "
        />
      </div>
    </div>
  );
}
