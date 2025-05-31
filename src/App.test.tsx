import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App component', () => {
  it('renders the main heading and subtext', () => {
    render(<App />);
    expect(screen.getByText('Learning Cards App')).toBeInTheDocument();
    expect(screen.getByText('testing GH actions')).toBeInTheDocument();
  });
});
