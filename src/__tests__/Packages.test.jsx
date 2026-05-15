import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Packages from '../pages/user/Package'
import api from '../Helper/baseUrl.helper'

jest.mock('../components/Layout', () => {
    return function MockLayout({ children }) {
        return <div data-testid="layout">{children}</div>
    }
})

jest.mock('../components/Layout-componets/PackageCard', () => {
    return function MockPackageCard({ title, packageId }) {
        return <div>{title} (#{packageId})</div>
    }
})

jest.mock('../Helper/baseUrl.helper', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
    },
}))

describe('Prebuilt Packages page', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('loads packages from API and renders prebuilt cards', async () => {
        api.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        package_id: 1,
                        name: 'Sajek Tour',
                        description: '3 days in the hills',
                        duration_days: 3,
                    },
                    {
                        package_id: 2,
                        name: 'Bandarban Trek',
                        description: '7 day adventure',
                        duration_days: 7,
                    },
                ],
            },
        })

        render(<Packages />)

        expect(screen.getByText('Loading packages...')).toBeInTheDocument()

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/^\/package\/packages\?ts=\d+$/))
        })

        expect(await screen.findByText('Sajek Tour (#1)')).toBeInTheDocument()
        expect(screen.getByText('Bandarban Trek (#2)')).toBeInTheDocument()
    })

    it('shows no packages available when only custom packages are returned', async () => {
        api.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        package_id: 99,
                        name: 'Custom Package',
                        description: 'custom',
                        duration_days: 5,
                    },
                ],
            },
        })

        render(<Packages />)

        expect(await screen.findByText('No packages available')).toBeInTheDocument()
    })

    it('filters package list by keyword search', async () => {
        api.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        package_id: 1,
                        name: 'Cox Bazar Beach Escape',
                        description: 'Beach holiday',
                        duration_days: 4,
                    },
                    {
                        package_id: 2,
                        name: 'Sundarban Wildlife Tour',
                        description: 'Mangrove and wildlife',
                        duration_days: 6,
                    },
                ],
            },
        })

        render(<Packages />)

        expect(await screen.findByText('Cox Bazar Beach Escape (#1)')).toBeInTheDocument()
        expect(screen.getByText('Sundarban Wildlife Tour (#2)')).toBeInTheDocument()

        fireEvent.change(screen.getByPlaceholderText('Search by keyword...'), {
            target: { value: 'cox' },
        })

        expect(screen.getByText('Cox Bazar Beach Escape (#1)')).toBeInTheDocument()
        expect(screen.queryByText('Sundarban Wildlife Tour (#2)')).not.toBeInTheDocument()
    })
})