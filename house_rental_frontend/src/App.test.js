import { render, screen } from '@testing-library/react';
import App from './App';

test('landing page shows hero and features', () => {
  render(<App />);
  // heading from hero
  expect(screen.getByText(/find your perfect home/i)).toBeInTheDocument();
  // features section
  expect(screen.getByText(/Why choose us\?/i)).toBeInTheDocument();
});
