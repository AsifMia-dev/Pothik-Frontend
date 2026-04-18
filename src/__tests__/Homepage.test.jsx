import { render, screen } from '@testing-library/react'
import Homepage from '../pages/Homepage'

jest.mock('../components/Layout', () => {
    return function MockLayout({ children }) {
        return <div data-testid="layout">{children}</div>
    }
})

jest.mock('../components/HomeComponents/Hero', () => {
    return function MockHero() {
        return <section>Hero section</section>
    }
})

jest.mock('../components/HomeComponents/TopDestination', () => {
    return function MockTopDestination() {
        return <section>Top destinations</section>
    }
})

jest.mock('../components/HomeComponents/Heroblog', () => {
    return function MockHeroBlog() {
        return <section>Latest blog posts</section>
    }
})

describe('Homepage', () => {
    it('renders the main home sections inside the layout', () => {
        render(<Homepage />)

        expect(screen.getByTestId('layout')).toBeInTheDocument()
        expect(screen.getByText('Hero section')).toBeInTheDocument()
        expect(screen.getByText('Top destinations')).toBeInTheDocument()
        expect(screen.getByText('Latest blog posts')).toBeInTheDocument()
    })
})