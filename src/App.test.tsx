import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App component', () => {
  it('renders the main heading and subtext', () => {
    render(<App />);
    expect(screen.getByText('WaszBar - wyceny')).toBeInTheDocument();
    expect(screen.getByText('pull request test')).toBeInTheDocument();
  });
});
