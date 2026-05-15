import { render, screen } from '@testing-library/react'

jest.mock('../routes/RouteComponents', () => {
    return function MockRouteComponents() {
        return <div>RouteComponents rendered</div>
    }
})

jest.mock('../pages/Homepage', () => {
    return function MockHomepage() {
        return <div>Homepage</div>
    }
})

jest.mock('../components/Layout-componets/Footer', () => {
    return function MockFooter() {
        return <div>Footer</div>
    }
})

jest.mock('primereact/button', () => ({
    Button: () => <button type="button">Mock Button</button>,
}))

jest.mock('../context/AuthContext', () => {
    return function MockAuthProvider({ children }) {
        return (
            <div data-testid="auth-provider">
                <span>AuthProvider wrapper</span>
                {children}
            </div>
        )
    }
})

jest.mock('primereact/api', () => ({
    PrimeReactProvider: ({ children }) => (
        <div data-testid="prime-provider">
            <span>PrimeReactProvider wrapper</span>
            {children}
        </div>
    ),
}))

const App = require('../App').default

describe('App', () => {
    it('renders routing inside PrimeReactProvider and AuthProvider wrappers', () => {
        render(<App />)

        expect(screen.getByTestId('prime-provider')).toBeInTheDocument()
        expect(screen.getByTestId('auth-provider')).toBeInTheDocument()
        expect(screen.getByText('RouteComponents rendered')).toBeInTheDocument()
    })
})
