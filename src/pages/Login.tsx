import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export function Login() {
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const login = useAuthStore((state) => state.login);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!id || !password) {
			setError('ID와 비밀번호를 입력해주세요.');
			return;
		}

		const success = login(id, password);
		if (!success) {
			setError('ID 또는 비밀번호가 올바르지 않습니다.');
		}
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<div className="login-logo">
					<img src="/codehero.png" alt="CodeHero" width={80} height={80} />
				</div>
				<h1 className="login-title">CodeHero</h1>
				<p className="login-subtitle">나만의 개발 여정을 시작하세요</p>

				<form onSubmit={handleSubmit} className="login-form">
					<div className="login-field">
						<label htmlFor="id">ID</label>
						<input
							type="text"
							id="id"
							value={id}
							onChange={(e) => setId(e.target.value)}
							placeholder="아이디를 입력하세요"
							autoComplete="username"
						/>
					</div>

					<div className="login-field">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="비밀번호를 입력하세요"
							autoComplete="current-password"
						/>
					</div>

					{error && <p className="login-error">{error}</p>}

					<button type="submit" className="login-button">
						로그인
					</button>
				</form>
			</div>
		</div>
	);
}
