import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import { BackgroundBeams } from "./components/ui/background-beams";

import Home from "./pages/Home";
import Movies from "./pages/movies";
import MovieDetails from "./pages/movie-details";
import Trending from "./pages/Trending";
import NotFound from "./pages/NotFound";
import PersonDetails from "./pages/person-details";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Discover from "./pages/Discover";
import ScrollToTop from "./components/scroll-to-top";

function App() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-black pointer-events-none" />

      {/* Background animation*/}
      <div className="pointer-events-none">
        <BackgroundBeams />
      </div>

      {/* App Layer */}
      <div className="relative z-10">
        <Navbar />
        <ScrollToTop />

        <div className="max-w-7xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/trending/:id" element={<MovieDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/person/:id" element={<PersonDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/discover" element={<Discover />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
      </div>
    </div>
  );
}

export default App;
