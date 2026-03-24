import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Navebar from "./Components/Navebar";
import { validateToken } from "./Services/AuthService";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Dashboard from "./Pages/Dashboard";
import AcademicDetails from "./Pages/AcademicDetails";
import PersonalDetails from "./Pages/PersonalDetails";
import ProfileEdit from "./Pages/ProfileEdit";
import TeacherDashboard from "./Pages/TeacherDashboard";
import ManageStudents from "./Pages/ManageStudents";
import ViewStudent from "./Pages/ViewStudent";
import TeacherProfileEdit from "./Pages/TeacherProfileEdit";
import SendNotification from "./Pages/SendNotification";
import Notifications from "./Pages/Notifications";
import ViewTeachers from "./Pages/ViewTeachers";
import AddMaterial from "./Pages/AddMaterial";
import ViewMaterials from "./Pages/ViewMaterials";

const Home = () => {
	return (
		<div className="home-container">
			<h1 className="home-title">Education Portal</h1>
			<p className="home-subtitle">
				A complete platform for students and teachers. Track progress, manage records, 
				and stay on top of your educational goals.
			</p>
			<div className="home-features">
				<Link to="/signup" className="feature-card" style={{textDecoration: 'none', color: 'inherit'}}>
					<div className="feature-icon">🎓</div>
					<h3 className="feature-title">For Students</h3>
					<p className="feature-desc">Track your academics, manage profile, and monitor your progress</p>
				</Link>
				<Link to="/signup" className="feature-card" style={{textDecoration: 'none', color: 'inherit'}}>
					<div className="feature-icon">👨‍🏫</div>
					<h3 className="feature-title">For Teachers</h3>
					<p className="feature-desc">Manage student records, view performance, and track class progress</p>
				</Link>
				<Link to="/login" className="feature-card" style={{textDecoration: 'none', color: 'inherit'}}>
					<div className="feature-icon">🔐</div>
					<h3 className="feature-title">Get Started</h3>
					<p className="feature-desc">Login to your account or create a new one to get started</p>
				</Link>
			</div>
		</div>
	);
};

const App = () => {
	const [authChecked, setAuthChecked] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			await validateToken();
			setAuthChecked(true);
		};
		checkAuth();
	}, []);

	if (!authChecked) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<BrowserRouter>
			<div className="app-layout">
				<Navebar />
				<div className="main-content">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						{/* Student Routes */}
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/academic" element={<AcademicDetails />} />
						<Route path="/personal" element={<PersonalDetails />} />
						<Route path="/edit" element={<ProfileEdit />} />
						<Route path="/notifications" element={<Notifications />} />
						<Route path="/teachers" element={<ViewTeachers />} />
						<Route path="/materials" element={<ViewMaterials />} />
						{/* Teacher Routes */}
						<Route path="/teacher/dashboard" element={<TeacherDashboard />} />
						<Route path="/teacher/students" element={<ManageStudents />} />
						<Route path="/teacher/student/:id" element={<ViewStudent />} />
						<Route path="/teacher/edit" element={<TeacherProfileEdit />} />
						<Route path="/teacher/notify" element={<SendNotification />} />
						<Route path="/teacher/materials" element={<AddMaterial />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
};

export default App;
