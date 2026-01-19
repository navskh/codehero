import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './components/layout/MainLayout';
import { AchievementPopup } from './components/gamification/AchievementPopup';
import { useAuthStore } from './stores/authStore';
import {
  Home,
  Tasks,
  Notes,
  Goals,
  Avatar,
  Skills,
  Achievements,
  Settings,
  Login,
} from './pages';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 1,
    },
  },
});

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 로그인 안됐으면 로그인 페이지 표시
  if (!isLoggedIn) {
    return (
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/avatar" element={<Avatar />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
        <AchievementPopup />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
