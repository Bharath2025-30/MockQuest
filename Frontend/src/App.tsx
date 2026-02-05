import { Route, Routes } from "react-router-dom";
import "./App.css";
import Problems from "./components/Pages/Problems";
import CTA from "./components/sections/cta/default";
import FAQ from "./components/sections/faq/default";
import FooterSection from "./components/sections/footer/default";
import Hero from "./components/sections/hero/default";
import Items from "./components/sections/items/default";
import Logos from "./components/sections/logos/default";
import Navbar from "./components/sections/navbar/default";

import { useUser } from "@clerk/clerk-react";
import { Toaster } from 'react-hot-toast';
import Dashboard from "./components/Pages/Dashboard";
import ProblemDetail from "./components/Pages/ProblemDetail";
import Session from "./components/Pages/Session";
import { useUserDetails } from "./hooks/useSessions";

function App() {
  const {isSignedIn, user} = useUser();

  if(isSignedIn){
    const {data: loggedInUserDetails} = useUserDetails(user.id);
    console.log(loggedInUserDetails);
    sessionStorage.setItem("userId", loggedInUserDetails?.user?.id);
    sessionStorage.setItem("clerkId", loggedInUserDetails?.user?.clerkId);
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
        <Route path="/session/:sessionId" element={<Session />}/>

      </Routes>
      <FooterSection />
      <Toaster/>
    </div>
  );
}

export default App;
