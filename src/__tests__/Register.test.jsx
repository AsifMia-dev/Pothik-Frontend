import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Register from '../pages/Register'
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

describe('Register page', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        localStorage.clear()
    })

    it('shows validation error when passwords do not match', async () => {
        const login = jest.fn()

        render(
            <AuthContext.Provider value={{ login }}>
                <Register />
            </AuthContext.Provider>
        )

        fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Tusar Das' } })
        fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'tusar@gmail.com' } })
        fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '01700000000' } })
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } })
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'different123' } })

        fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

        expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
        expect(API.post).not.toHaveBeenCalled()
    })

    it('registers user and logs them in when backend returns user + token', async () => {
        const login = jest.fn()
        const userData = { user_id: 11, full_name: 'Tusar Das', role: 'customer' }

        API.post.mockResolvedValueOnce({
            data: {
                success: true,
                data: {
                    user: userData,
                    token: 'register-token',
                },
            },
        })

        render(
            <AuthContext.Provider value={{ login }}>
                <Register />
            </AuthContext.Provider>
        )

        fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Tusar Das' } })
        fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'tusar@gmail.com' } })
        fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '01700000000' } })
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } })
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'secret123' } })

        fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith('/auth/register', {
                full_name: 'Tusar Das',
                email: 'tusar@gmail.com',
                password: 'secret123',
                phone: '01700000000',
                role: 'customer',
            })
        })

        expect(localStorage.getItem('token')).toBe('register-token')
        expect(login).toHaveBeenCalledWith(userData)
        expect(mockNavigate).toHaveBeenCalledWith('/')
    })
})