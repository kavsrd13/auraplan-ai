/**
 * Integration and accessibility tests for the AuraPlan AI application.
 * Verifies form inputs, ARIA attributes, demo loading, and tab navigation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '@/App';

describe('App Component Integration & A11y', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders skip link as the first navigation anchor for accessibility', () => {
    render(<App />);
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders the initial event planning form with all required fields & ARIA attributes', () => {
    render(<App />);

    // Check main heading
    expect(screen.getByRole('heading', { name: /plan your next celebration/i })).toBeInTheDocument();

    // Check form inputs
    const themeInput = screen.getByLabelText(/Theme & Aesthetic Concept/i);
    expect(themeInput).toBeInTheDocument();
    expect(themeInput).toHaveAttribute('aria-required', 'true');

    const guestInput = screen.getByLabelText(/Guest Count/i);
    expect(guestInput).toBeInTheDocument();
    expect(guestInput).toHaveAttribute('aria-required', 'true');

    const budgetInput = screen.getByLabelText(/Total Budget/i);
    expect(budgetInput).toBeInTheDocument();
    expect(budgetInput).toHaveAttribute('aria-required', 'true');

    const dateInput = screen.getByLabelText(/Event Date/i);
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute('aria-required', 'true');

    const locationInput = screen.getByLabelText(/Location \/ Venue/i);
    expect(locationInput).toBeInTheDocument();
    expect(locationInput).toHaveAttribute('aria-required', 'true');
  });

  it('loads the rich demo event and transitions seamlessly to the dashboard', async () => {
    render(<App />);

    // Click "Load Demo Event"
    const loadDemoButtons = screen.getAllByRole('button', { name: /load demo event/i });
    fireEvent.click(loadDemoButtons[0]);

    // Should now show the dashboard view with the demo title
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Enchanted Rustic Garden Romance/i })).toBeInTheDocument();
    });

    // Check that dashboard tabs are rendered with proper role="tablist"
    const tablist = screen.getByRole('tablist', { name: /event planning dashboard sections/i });
    expect(tablist).toBeInTheDocument();

    const budgetTab = screen.getByRole('tab', { name: /budget breakdown/i });
    expect(budgetTab).toHaveAttribute('aria-selected', 'true');
  });

  it('allows switching between all dashboard tabs and updates tabpanels properly', async () => {
    render(<App />);

    // Load demo event to enter dashboard
    const loadDemoButtons = screen.getAllByRole('button', { name: /load demo event/i });
    fireEvent.click(loadDemoButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /timeline/i })).toBeInTheDocument();
    });

    // Switch to Timeline tab
    const timelineTab = screen.getByRole('tab', { name: /timeline/i });
    fireEvent.click(timelineTab);
    expect(timelineTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Chronological Run-of-Show/i)).toBeInTheDocument();

    // Switch to Vendor Checklist tab
    const vendorTab = screen.getByRole('tab', { name: /vendor/i });
    fireEvent.click(vendorTab);
    expect(vendorTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Vendor Directory & Vetting Suite/i)).toBeInTheDocument();

    // Switch to Ideas tab
    const ideasTab = screen.getByRole('tab', { name: /ideas/i });
    fireEvent.click(ideasTab);
    expect(ideasTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Curated Themes & Color Palettes/i)).toBeInTheDocument();

    // Switch to Export tab
    const exportTab = screen.getByRole('tab', { name: /export/i });
    fireEvent.click(exportTab);
    expect(exportTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Export & Persistence Hub/i)).toBeInTheDocument();
  });

  it('opens and closes the API key configuration modal cleanly', async () => {
    render(<App />);

    const apiKeyButton = screen.getByRole('button', { name: /configure gemini api key/i });
    fireEvent.click(apiKeyButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Gemini API Key Configuration/i)).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close dialog/i });
    fireEvent.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
