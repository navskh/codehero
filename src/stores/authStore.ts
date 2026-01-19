import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IAuthState {
	isLoggedIn: boolean;
	login: (id: string, password: string) => boolean;
	logout: () => void;
}

// 하드코딩된 인증 정보
const VALID_ID = 'youngman';
const VALID_PW = '12345';

export const useAuthStore = create<IAuthState>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			login: (id: string, password: string) => {
				if (id === VALID_ID && password === VALID_PW) {
					set({ isLoggedIn: true });
					return true;
				}
				return false;
			},
			logout: () => {
				set({ isLoggedIn: false });
			},
		}),
		{
			name: 'codehero-auth',
		}
	)
);
