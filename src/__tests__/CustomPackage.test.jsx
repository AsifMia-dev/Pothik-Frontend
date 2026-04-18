import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import CustomPackage from '../pages/user/CustomPackage'
import api from '../Helper/baseUrl.helper'

jest.mock('../components/Layout', () => {
    return function MockLayout({ children }) {
        return <div data-testid="layout">{children}</div>
    }
})

jest.mock('../Helper/baseUrl.helper', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
    },
}))

jest.mock('react-router-dom', () => ({
    Link: ({ children, to }) => <a href={to}>{children}</a>,
    Navigate: () => <div>navigate</div>,
}))

const mockInitialGets = () => {
    api.get.mockImplementation((url) => {
        if (url === '/destination/destinations') {
            return Promise.resolve({
                data: {
                    destinations: [
                        {
                            destination_id: 1,
                            name: 'Sajek',
                            spots: [{ name: 'Konglak Hill' }],
                        },
                    ],
                },
            })
        }

        if (url === '/transport/transports') {
            return Promise.resolve({ data: { transports: [] } })
        }

        if (url === '/hotel/hotels') {
            return Promise.resolve({ data: { hotels: [] } })
        }

        if (url === '/guide/guides') {
            return Promise.resolve({ data: { guides: [] } })
        }

        return Promise.resolve({ data: {} })
    })
}

describe('CustomPackage (Package Builder)', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        sessionStorage.clear()
        sessionStorage.setItem('user_id', '12')
    })

    it('loads initial builder data from APIs', async () => {
        mockInitialGets()

        render(<CustomPackage />)

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/destination/destinations')
            expect(api.get).toHaveBeenCalledWith('/transport/transports')
            expect(api.get).toHaveBeenCalledWith('/hotel/hotels')
            expect(api.get).toHaveBeenCalledWith('/guide/guides')
        })

        expect(screen.getByText('Trip Configuration')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Generate My Package →' })).toBeInTheDocument()
    })

    it('shows validation error when destination and valid dates are missing', async () => {
        mockInitialGets()

        render(<CustomPackage />)

        fireEvent.click(screen.getByRole('button', { name: 'Generate My Package →' }))

        expect(await screen.findByText('Please select a destination and valid travel dates.')).toBeInTheDocument()
        expect(api.post).not.toHaveBeenCalled()
    })

    it('submits package successfully and shows success banner', async () => {
        api.post.mockResolvedValue({ data: { success: true } })

        api.get.mockImplementation((url) => {
            if (url === '/destination/destinations') {
                return Promise.resolve({
                    data: {
                        destinations: [
                            { destination_id: 1, name: 'Sajek', spots: [] },
                        ],
                    },
                })
            }

            if (url === '/transport/transports') return Promise.resolve({ data: { transports: [] } })
            if (url === '/hotel/hotels') return Promise.resolve({ data: { hotels: [] } })
            if (url === '/guide/guides') return Promise.resolve({ data: { guides: [] } })

            if (url.startsWith('/package/packages/name/')) {
                return Promise.resolve({ data: { package: { package_id: 123 } } })
            }

            return Promise.resolve({ data: {} })
        })

        const { container } = render(<CustomPackage />)

        const dateInputs = container.querySelectorAll('input[type="date"]')
        fireEvent.change(dateInputs[0], { target: { value: '2026-05-10' } })
        fireEvent.change(dateInputs[1], { target: { value: '2026-05-15' } })

        await waitFor(() => {
            const select = container.querySelector('select')
            expect(select).not.toBeNull()
            expect(select.querySelectorAll('option').length).toBeGreaterThan(1)
        })

        const destinationSelect = container.querySelector('select')
        fireEvent.change(destinationSelect, { target: { value: '1' } })

        fireEvent.click(screen.getByRole('button', { name: 'Generate My Package →' }))

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/package/packages', expect.objectContaining({
                name: '12_20260510',
                description: 'custom',
                duration_days: 5,
            }))
        })

        expect(api.post).toHaveBeenCalledWith('/packageDestination/add', {
            package_id: 123,
            destination_id: '1',
        })

        expect(await screen.findByText('Package Generated Successfully!')).toBeInTheDocument()
    })
})
