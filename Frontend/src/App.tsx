import { Navigate, Route, Routes } from "react-router-dom";
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
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Pages/Dashboard";
import ProblemDetail from "./components/Pages/ProblemDetail";
import Session from "./components/Pages/Session";
import { useUserDetails } from "./hooks/useSessions";
import { useEffect } from "react";

function App() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Debug Logs
  // console.log("🔍 App Debug: ");
  // console.log("isLoaded:", isLoaded);
  // console.log("isSignedIn:", isSignedIn);
  // console.log("user:", user);

  // ✅ Only fetch user details when user.id exists
  const { data: loggedInUserDetails } = useUserDetails(user?.id || "");

  useEffect(() => {
    // console.log("✅ User Details UseEffect:");
    // console.log("LoggedInUserDetails:", loggedInUserDetails);

    if (isSignedIn && loggedInUserDetails?.user) {
      // console.log("Fetched logged in userDetals: ", loggedInUserDetails);
      sessionStorage.setItem("userId", loggedInUserDetails?.user?.id);
      sessionStorage.setItem("clerkId", loggedInUserDetails?.user?.clerkId);
    }
  }, [isSignedIn, loggedInUserDetails]);

  // Clear session storage on sign out
  useEffect(() => {
    if (!isSignedIn) {
      // console.log("🧹 Clearing out session storage");
      sessionStorage.clear();
    }
  }, [isSignedIn]);

  // Wait for clerk to load
  if (!isLoaded) {
    return (
      <div className="dark bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/60">Loading...</p>
        </div>
      </div>
    );
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
              <FooterSection />
            </>
          }
        />

        <Route
          path="/dashboard"
          element={isSignedIn ? <Dashboard /> : <Navigate to="/" replace />}
        />

        <Route
          path="/problems"
          element={
            isSignedIn ? (
              <>
                <Problems /> <FooterSection />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/problems/:problemId"
          element={isSignedIn ? <ProblemDetail /> : <Navigate to="/" />}
        />
        <Route
          path="/session/:sessionId"
          element={isSignedIn ? <Session /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
