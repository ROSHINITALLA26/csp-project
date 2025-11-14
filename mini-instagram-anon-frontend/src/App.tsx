import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Location,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import EchoGalaxy from "./pages/EchoGalaxy";
import ClubsPage from "./pages/Clubs";
import GamesPage from "./pages/Games";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BottomNav from "./components/BottomNav";
import TopBar from "./components/TopBar";

function Protected({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const loc = useLocation() as Location;

  // 👇 FIX: Return proper Navigate element
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: loc }}
        replace
      />
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="max-w-md mx-auto min-h-screen relative bg-gradient-to-b from-white to-gray-100">
        <TopBar />
        <div className="pb-24 pt-16">
          <Routes>
            <Route
              path="/"
              element={
                <Protected>
                  <Home />
                </Protected>
              }
            />
            <Route
              path="/echo"
              element={
                <Protected>
                  <EchoGalaxy />
                </Protected>
              }
            />
            <Route
              path="/clubs"
              element={
                <Protected>
                  <ClubsPage />
                </Protected>
              }
            />
            <Route
              path="/games"
              element={
                <Protected>
                  <GamesPage />
                </Protected>
              }
            />
            <Route
              path="/profile"
              element={
                <Protected>
                  <Profile />
                </Protected>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <BottomNav />
        <div className="safe-bottom"></div>
      </div>
    </AuthProvider>
  );
}
