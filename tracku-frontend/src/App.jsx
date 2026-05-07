import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider }  from "./context/AuthContext";
import { TaskProvider }  from "./context/TaskContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute    from "./routes/ProtectedRoute";
import LoginPage         from "./pages/LoginPage";
import RegisterPage      from "./pages/RegisterPage";
import DashboardPage     from "./pages/DashboardPage";
import ProgressPage      from "./pages/ProgressPage";

// Single layout that wraps ALL protected routes with one TaskProvider
// This means TaskContext is NOT destroyed when navigating between pages
const ProtectedLayout = () => (
  <ProtectedRoute>
    <TaskProvider>
      <Outlet />
    </TaskProvider>
  </ProtectedRoute>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected — ONE TaskProvider for all protected pages */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/progress"  element={<ProgressPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;