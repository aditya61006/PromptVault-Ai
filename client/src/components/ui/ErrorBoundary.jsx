import { Component } from 'react';
import Button from './Button.jsx';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI error boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-ink px-4 text-center text-white">
          <div className="glass max-w-lg rounded-3xl p-8">
            <h1 className="text-3xl font-black">Something went wrong</h1>
            <p className="mt-3 text-slate-300">Refresh the page or return home. If this repeats, check the browser console and API logs.</p>
            <Button className="mt-6" onClick={() => window.location.assign('/')}>Return home</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
