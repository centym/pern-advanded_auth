import Navbar from "./components/Navbar";

import ProductHomePage from "./pages/ProductHomePage";
import ProductPage from "./pages/ProductPage";

import { Navigate, Routes, Route } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";

import { Toaster } from "react-hot-toast";

//import FloatingShape from "./components/FloatingShape";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import LoadingSpinner from "./components/LoadingSpinner";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState} from "react";

//import i18n from './utils/i18n';



//console.log('VITE_API_URL',import.meta.env.VITE_API_URL);

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

 // alert("user: ", user);
//	if (!user.isVerified) {
//		return <Navigate to='/verify-email' replace />;
//		return <Navigate to='/login' replace />;
//	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/product/producthome' replace />;
	}

	return children;
};



function App() {
    const { theme } = useThemeStore();
//	const { isCheckingAuth, checkAuth } = useAuthStore();
	const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogin = () => setIsLoggedIn(true);
	const handleLogout = () => setIsLoggedIn(false);


	useEffect(() => {
		checkAuth(isAuthenticated);
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;
  
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        <Route path="/product/:id" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
        <Route path="/product/producthome" element={<ProtectedRoute><ProductHomePage /></ProtectedRoute>} />
        <Route
					path='/'
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage onLogin={handleLogin} />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/verify-email' element={<EmailVerificationPage />} />
				<Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

				<Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
