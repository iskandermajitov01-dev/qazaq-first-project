import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import MentorPanel from "./features/mentor/MentorPanel.jsx";
import VerifierPanel from "./features/verifier/VerifierPanel.jsx";
import AdminPanel from "./features/admin/AdminPanel.jsx";
import KanbanBoard from "./features/kanban/KanbanBoard.jsx";
import TalentFinder from "./features/matchmaking/TalentFinder.jsx";
import AIChat from "./features/learning/AIChat.jsx";
import Lessons from "./features/learning/Lessons.jsx";
import Login from "./features/auth/Login.jsx";
import Profile from "./features/profile/Profile.jsx";
import InstallBanner from "./components/Shared/InstallBanner.jsx";
import TeamChat from "./features/communication/TeamChat.jsx";
import NewsFeed from "./features/communication/NewsFeed.jsx";
import Events from "./features/communication/Events.jsx";
import Leaderboard from "./features/leaderboard/Leaderboard.jsx";
import TryoutMode from "./features/tryouts/TryoutMode.jsx";

const RequireAuth = ({ children }) => {
  const isLoggedIn = Boolean(localStorage.getItem("qazaq-email"));
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

function RoleDashboard() {
  const role = localStorage.getItem("qazaq-role") || "participant";
  if (role === "mentor") return <MentorPanel />;
  if (role === "verifier") return <VerifierPanel />;
  if (role === "admin") return <AdminPanel />;
  return <Dashboard />;
}

function App() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-bean">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route
          path="/"
          element={
            <Layout>
              <RoleDashboard />
            </Layout>
          }
        />
        <Route
          path="/mentor"
          element={
            <Layout>
              <MentorPanel />
            </Layout>
          }
        />
        <Route
          path="/verifier"
          element={
            <Layout>
              <VerifierPanel />
            </Layout>
          }
        />
        <Route
          path="/admin"
          element={
            <Layout>
              <AdminPanel />
            </Layout>
          }
        />
        <Route
          path="/matchmaking"
          element={
            <RequireAuth>
              <Layout>
                <TalentFinder />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/kanban"
          element={
            <RequireAuth>
              <Layout>
                <KanbanBoard />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/learning"
          element={
            <RequireAuth>
              <Layout>
                <AIChat />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/lessons"
          element={
            <RequireAuth>
              <Layout>
                <Lessons />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Layout>
                <Profile />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <RequireAuth>
              <Layout>
                <Leaderboard />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/tryouts"
          element={
            <RequireAuth>
              <Layout>
                <TryoutMode />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <Layout>
                <TeamChat />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/news"
          element={
            <RequireAuth>
              <Layout>
                <NewsFeed />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/events"
          element={
            <RequireAuth>
              <Layout>
                <Events />
              </Layout>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <InstallBanner />
    </div>
  );
}

export default App;

