import { fireEvent, render, screen } from '@testing-library/react'
import UserDashboardLayout from '../components/UserDashboardLayout'
import { AuthContext } from '../context/AuthContext'

const mockNavigate = jest.fn()

jest.mock('../components/Layout-componets/NavBar', () => {
    return function MockNavBar() {
        return <div>Nav</div>
    }
})

jest.mock('../components/Layout-componets/Footer', () => {
    return function MockFooter() {
        return <div>Footer</div>
    }
})

jest.mock('react-router-dom', () => ({
    Link: ({ children }) => <>{children}</>,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/user/profile' }),
}))

describe('Logout flow', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('calls logout and redirects to home when clicking Logout button', () => {
        const logout = jest.fn()

        render(
            <AuthContext.Provider value={{ user: { full_name: 'Tusar Das' }, logout }}>
                <UserDashboardLayout>
                    <div>Dashboard content</div>
                </UserDashboardLayout>
            </AuthContext.Provider>
        )

        fireEvent.click(screen.getByRole('button', { name: 'Logout' }))

        expect(logout).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith('/')
    })
})