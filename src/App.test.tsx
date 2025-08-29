import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Layout } from './app/layout'
import { LandingPage } from './features/landing/LandingPage'

describe('App Components', () => {
  it('renders navigation with title', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>
    )
    expect(screen.getByText('The Destiny Ledger')).toBeInTheDocument()
  })

  it('renders landing page content', () => {
    render(<LandingPage />)
    expect(screen.getByText('Welcome to The Destiny Ledger')).toBeInTheDocument()
    expect(screen.getByText('The ultimate D&D 5e character optimizer and comparison tool')).toBeInTheDocument()
  })
})