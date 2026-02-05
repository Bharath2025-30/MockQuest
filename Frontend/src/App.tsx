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
import ProblemDetail from "./components/Pages/ProblemDetail";
import { useUserDetails } from "./hooks/useSessions";

function App() {
  const {isSignedIn, user} = useUser();

  if(isSignedIn){
    const {data: loggedInUserDetails} = useUserDetails(user.id);
    console.log(loggedInUserDetails);
    sessionStorage.setItem("userId", loggedInUserDetails?.user?.id);
  }

  return (
    <div className="dark bg-background text-foreground ">
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Logos />
              <Items />
              <FAQ />
              <CTA />
              </>
          }
        />

        <Route path="/dashboard" element={ <Dashboard /> } />

        <Route path="/problems" element={ <Problems />}/>
        <Route path="/problems/:problemId" element={<ProblemDetail />}/>

      </Routes>
      <FooterSection />
      <Toaster/>
    </div>
  );
}

export default App;
