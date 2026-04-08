import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Dashboard from "./features/dashboard/Dashboard.jsx";
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

const RequireAuth = ({ children }) => {
  const isLoggedIn = Boolean(localStorage.getItem("qazaq-email"));
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-bean">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout>
                <Dashboard />
              </Layout>
            </RequireAuth>
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

