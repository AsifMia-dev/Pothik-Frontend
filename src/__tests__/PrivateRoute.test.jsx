import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../routes/PrivateRoute'
import { AuthContext } from '../context/AuthContext'

const renderWithAuth = (authValue, role = 'customer') => {
    return render(
        <AuthContext.Provider value={authValue}>
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <PrivateRoute role={role}>
                                <div>Protected content</div>
                            </PrivateRoute>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    )
}

describe('PrivateRoute', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('shows loading state while auth is loading', () => {
        renderWithAuth({
            user: null,
            loading: true,
            isLoggingOut: false,
            resetLoggingOut: jest.fn(),
        })

        expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
    })

    it('renders nothing during logout and resets logout flag on location change', async () => {
        const resetLoggingOut = jest.fn()

        const { container } = renderWithAuth({
            user: null,
            loading: false,
            isLoggingOut: true,
            resetLoggingOut,
        })

        expect(container).toBeEmptyDOMElement()

        await waitFor(() => {
            expect(resetLoggingOut).toHaveBeenCalledTimes(1)
        })
    })

    it('redirects unauthenticated users to login', () => {
        renderWithAuth({
            user: null,
            loading: false,
            isLoggingOut: false,
            resetLoggingOut: jest.fn(),
        })

        expect(screen.getByText('Login Page')).toBeInTheDocument()
    })

    it('redirects users when role does not match', () => {
        renderWithAuth(
            {
                user: { role: 'owner' },
                loading: false,
                isLoggingOut: false,
                resetLoggingOut: jest.fn(),
            },
            'customer'
        )

        expect(screen.getByText('Login Page')).toBeInTheDocument()
    })

    it('renders protected content for authenticated user with matching role', () => {
        renderWithAuth({
            user: { role: 'customer' },
            loading: false,
            isLoggingOut: false,
            resetLoggingOut: jest.fn(),
        })

        expect(screen.getByText('Protected content')).toBeInTheDocument()
    })
})
