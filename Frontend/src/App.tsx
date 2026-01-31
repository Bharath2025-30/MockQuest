import "./App.css";
import CTA from "./components/sections/cta/default";
import FAQ from "./components/sections/faq/default";
import Hero from "./components/sections/hero/default";
import Items from "./components/sections/items/default";
import Logos from "./components/sections/logos/default";
import Navbar from "./components/sections/navbar/default";
import FooterSection from "./components/sections/footer/default";
import { Routes, Route, Navigate } from "react-router-dom";
import Problems from "./components/Pages/Problems";

import { useUser } from "@clerk/clerk-react";
import {Toaster} from 'react-hot-toast'
import Dashboard from "./components/Pages/Dashboard";

function App() {
  const {isSignedIn} = useUser();
  return (
    <div className="dark bg-background text-foreground ">
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
            {!isSignedIn ? (
              <>
              <Hero />
              <Logos />
              <Items />
              <FAQ />
              <CTA />
              </>)
              : (
              <Navigate to="/dashboard" />
              )}
            </> 
          }
        />

        <Route path="/dashboard" element={ isSignedIn ? <Dashboard /> : <Navigate to={"/"} />}/>

        <Route path="/problems" element={ isSignedIn ? <Problems/> : <Navigate to={"/"}/> }/>
      </Routes>
      <FooterSection />
      <Toaster/>
    </div>
  );
}

export default App;
