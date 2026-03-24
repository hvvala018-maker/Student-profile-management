import React, { useEffect, useState } from "react";
import { getProfile } from "../Services/AuthService";
import { Link } from "react-router-dom";

const PersonalDetails = () => {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		getProfile()
			.then((res) => {
				setProfile(res.data);
			})
			.catch((err) => {
				if (err.message === 'NO_TOKEN') {
					setError('Please login to view personal details.');
				} else {
					setError('Unable to load personal details.');
				}
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
				<p style={{marginTop: '20px'}}>Loading personal details...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="error-container">
				<div className="error-icon">🔒</div>
				<h2>Access Required</h2>
				<p className="error-message">{error}</p>
				<Link to="/login" className="btn btn-primary" style={{marginTop: '20px'}}>
					Go to Login
				</Link>
			</div>
		);
	}

	const personal = profile?.personalDetails || {};

	return (
		<div className="page-container">
			<div className="details-card">
				<div className="details-header">
					<h2>👤 Personal Information</h2>
				</div>
				<div className="details-body">
					<div className="detail-row">
						<span className="detail-label">Full Name</span>
						<span className="detail-value">{profile?.name || 'Not Set'}</span>
					</div>
					<div className="detail-row">
						<span className="detail-label">Email Address</span>
						<span className="detail-value">{profile?.email || 'Not Set'}</span>
					</div>
					<div className="detail-row">
						<span className="detail-label">Phone Number</span>
						<span className="detail-value">{personal.phone || 'Not Set'}</span>
					</div>
					<div className="detail-row">
						<span className="detail-label">Address</span>
						<span className="detail-value">{personal.address || 'Not Set'}</span>
					</div>
					<div className="detail-row">
						<span className="detail-label">Date of Birth</span>
						<span className="detail-value">
							{personal.dob ? new Date(personal.dob).toLocaleDateString() : 'Not Set'}
						</span>
					</div>
				</div>
			</div>
			<div style={{marginTop: '25px', display: 'flex', gap: '15px'}}>
				<Link to="/edit" className="btn btn-primary">
					✏️ Edit Details
				</Link>
				<Link to="/dashboard" className="btn btn-success">
					🏠 Back to Dashboard
				</Link>
			</div>
		</div>
	);
};

export default PersonalDetails;
