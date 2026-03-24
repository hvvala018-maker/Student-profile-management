import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getUnreadCount, logout } from "../Services/AuthService";

const Navebar = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem('userToken');
	const role = localStorage.getItem('userRole');
	const [unreadCount, setUnreadCount] = useState(0);
	
	useEffect(() => {
		const fetchUnread = async () => {
			if (token && role === 'student') {
				try {
					const res = await getUnreadCount();
					setUnreadCount(res.data.unreadCount);
				} catch (err) {
					console.log('Failed to fetch unread count');
				}
			}
		};
		fetchUnread();
		// Refresh every 30 seconds
		const interval = setInterval(fetchUnread, 30000);
		return () => clearInterval(interval);
	}, [token, role]);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<nav className="navbar">
			<NavLink to="/" className="navbar-brand">
				<span>Education Portal</span>
			</NavLink>
			<div className="nav-links">
				<NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
					🏠 <span>Home</span>
				</NavLink>
				{!token ? (
					<>
						<NavLink to="/login" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							🔐 <span>Login</span>
						</NavLink>
						<NavLink to="/signup" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							✨ <span>Signup</span>
						</NavLink>
					</>
				) : role === 'teacher' ? (
					<>
						<NavLink to="/teacher/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							📊 <span>Dashboard</span>
						</NavLink>
						<NavLink to="/teacher/students" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							👥 <span>Students</span>
						</NavLink>
						<NavLink to="/teacher/materials" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							📚 <span>Materials</span>
						</NavLink>
						<NavLink to="/teacher/notify" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							📢 <span>Notify</span>
						</NavLink>
						<NavLink to="/teacher/edit" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							✏️ <span>Profile</span>
						</NavLink>
					<NavLink to="/login" onClick={handleLogout} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
						🚪 <span>Logout</span>
					</NavLink>
					</>
				) : (
					<>
						<NavLink to="/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							📊 <span>Dashboard</span>
						</NavLink>
						<NavLink to="/materials" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							📚 <span>Materials</span>
						</NavLink>
						<NavLink to="/notifications" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							🔔 <span>Alerts</span>
							{unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
						</NavLink>
						<NavLink to="/teachers" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							👨‍🏫 <span>Teachers</span>
						</NavLink>
						<NavLink to="/academic" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							🎓 <span>Academic</span>
						</NavLink>
						<NavLink to="/edit" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							✏️ <span>Edit</span>
						</NavLink>
						<NavLink to="/login" onClick={handleLogout} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
							🚪 <span>Logout</span>
						</NavLink>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navebar;
