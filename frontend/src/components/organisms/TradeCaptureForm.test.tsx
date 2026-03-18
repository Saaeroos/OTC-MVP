import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TradeCaptureForm } from './TradeCaptureForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('TradeCaptureForm Organism', () => {
  it('renders all form fields and titles', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TradeCaptureForm />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/New Trade Capture/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Seller/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Buyer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByText(/Capture Trade/i)).toBeInTheDocument();
  });
});
