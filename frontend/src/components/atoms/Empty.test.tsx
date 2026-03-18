import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Empty from './Empty';

describe('Empty Atom', () => {
  it('renders empty text', () => {
    render(<Empty />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });
});
