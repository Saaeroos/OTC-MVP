import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination Molecule', () => {
  it('does not render if there is only 1 page', () => {
    const { container } = render(
      <Pagination page={1} pages={1} total={5} size={10} onPageChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with multiple pages', () => {
    render(<Pagination page={2} pages={5} total={45} size={10} onPageChange={vi.fn()} />);

    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  it('calls onPageChange when previous button is clicked', () => {
    const handlePageChange = vi.fn();
    render(<Pagination page={2} pages={5} total={45} size={10} onPageChange={handlePageChange} />);

    const prevButton = screen.getByLabelText('Previous');
    fireEvent.click(prevButton);
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when next button is clicked', () => {
    const handlePageChange = vi.fn();
    render(<Pagination page={2} pages={5} total={45} size={10} onPageChange={handlePageChange} />);

    const nextButton = screen.getByLabelText('Next');
    fireEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page', () => {
    render(<Pagination page={1} pages={5} total={45} size={10} onPageChange={vi.fn()} />);

    const prevButton = screen.getByLabelText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination page={5} pages={5} total={45} size={10} onPageChange={vi.fn()} />);

    const nextButton = screen.getByLabelText('Next');
    expect(nextButton).toBeDisabled();
  });
});
