import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useContext } from 'react'
import AuthProvider, { AuthContext } from '../context/AuthContext'

const TestConsumer = () => {
    const { user, login, logout, isLoggingOut, resetLoggingOut } = useContext(AuthContext)

    return (
        <div>
            <p data-testid="user-name">{user?.full_name || 'no-user'}</p>
            <p data-testid="logout-flag">{String(isLoggingOut)}</p>
            <button onClick={() => login({ full_name: 'Tusar', role: 'customer' })}>Login</button>
            <button onClick={logout}>Logout</button>
            <button onClick={resetLoggingOut}>Reset Logout</button>
        </div>
    )
}

describe('AuthContext', () => {
    beforeEach(() => {
        sessionStorage.clear()
        localStorage.clear()
    })

    it('hydrates user from sessionStorage on initial load', async () => {
        sessionStorage.setItem('authUser', JSON.stringify({ full_name: 'Stored User', role: 'customer' }))

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('user-name')).toHaveTextContent('Stored User')
        })
    })

    it('login stores user data and updates context state', async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        )

        await screen.findByText('Login')
        fireEvent.click(screen.getByText('Login'))

        expect(screen.getByTestId('user-name')).toHaveTextContent('Tusar')
        expect(sessionStorage.getItem('authUser')).toEqual(
            JSON.stringify({ full_name: 'Tusar', role: 'customer' })
        )
    })

    it('logout clears auth data and sets logout flag', async () => {
        sessionStorage.setItem('authUser', JSON.stringify({ full_name: 'Stored User', role: 'customer' }))
        sessionStorage.setItem('token', 'session-token')
        localStorage.setItem('token', 'local-token')

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('user-name')).toHaveTextContent('Stored User')
        })

        fireEvent.click(screen.getByText('Logout'))

        expect(screen.getByTestId('user-name')).toHaveTextContent('no-user')
        expect(screen.getByTestId('logout-flag')).toHaveTextContent('true')
        expect(sessionStorage.getItem('authUser')).toBeNull()
        expect(sessionStorage.getItem('token')).toBeNull()
        expect(localStorage.getItem('token')).toBeNull()
    })

    it('resetLoggingOut sets logout flag back to false', async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        )

        await screen.findByText('Logout')
        fireEvent.click(screen.getByText('Logout'))
        expect(screen.getByTestId('logout-flag')).toHaveTextContent('true')

        fireEvent.click(screen.getByText('Reset Logout'))
        expect(screen.getByTestId('logout-flag')).toHaveTextContent('false')
    })
})
