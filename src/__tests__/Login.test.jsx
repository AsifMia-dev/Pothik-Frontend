import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Login from '../pages/Login'
import API from '../Helper/baseUrl.helper'
import { AuthContext } from '../context/AuthContext'

const mockNavigate = jest.fn()

jest.mock('../components/Layout', () => {
    return function MockLayout({ children }) {
        return <div>{children}</div>
    }
})

jest.mock('../firebase.config', () => ({
    auth: {},
    googleProvider: {},
}))

jest.mock('firebase/auth', () => ({
    signInWithPopup: jest.fn(),
}))

jest.mock('../Helper/baseUrl.helper', () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
    },
}))

jest.mock('react-router-dom', () => ({
    Link: ({ children }) => <>{children}</>,
    useNavigate: () => mockNavigate,
}))

describe('Login page', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        sessionStorage.clear()
    })

    it('logs in successfully and stores session data', async () => {
        const login = jest.fn()
        const userData = { user_id: 7, full_name: 'Tusar Das', role: 'customer' }

        API.post.mockResolvedValueOnce({
            data: {
                success: true,
                data: {
                    user: userData,
                    token: 'token-123',
                },
            },
        })

        render(
            <AuthContext.Provider value={{ login, user: null }}>
                <Login />
            </AuthContext.Provider>
        )

        fireEvent.change(screen.getByLabelText('Email Address'), {
            target: { value: 'tusar@gmail.com' },
        })
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'secret123' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith('/auth/login', {
                email: 'tusar@gmail.com',
                password: 'secret123',
            })
        })

        expect(login).toHaveBeenCalledWith(userData)
        expect(sessionStorage.getItem('token')).toBe('token-123')
        expect(sessionStorage.getItem('user_name')).toBe('Tusar Das')
    })
})