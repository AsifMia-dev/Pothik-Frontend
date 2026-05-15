import { render, screen } from '@testing-library/react'
import SpotDetails from '../pages/SpotDetails'
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
    },
}))

jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
}))

const { useParams } = require('react-router-dom')

describe('SpotDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('loads and shows spots for the destination id from route params', async () => {
        useParams.mockReturnValue({ destinationId: '42' })
        api.get.mockResolvedValueOnce({
            data: {
                spots: [
                    {
                        spot_id: 1,
                        name: 'Niladri Lake',
                        description: 'Crystal clear water and hills.',
                        image: null,
                    },
                ],
            },
        })

        render(<SpotDetails />)

        expect(screen.getByText('Loading spots...')).toBeInTheDocument()

        expect(await screen.findByText('Niladri Lake')).toBeInTheDocument()
        expect(screen.getByText('Crystal clear water and hills.')).toBeInTheDocument()
        expect(api.get).toHaveBeenCalledWith('spot/destinations/42/spots')
    })

    it('shows empty-state message when no spots are returned', async () => {
        useParams.mockReturnValue({ destinationId: '99' })
        api.get.mockResolvedValueOnce({ data: { spots: [] } })

        render(<SpotDetails />)

        expect(await screen.findByText('No spots found for this destination.')).toBeInTheDocument()
        expect(api.get).toHaveBeenCalledWith('spot/destinations/99/spots')
    })
})