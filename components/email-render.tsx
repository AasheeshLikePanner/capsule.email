import React, { useMemo } from 'react';

// Email Renderer Component - Can be used anywhere in your Next.js app
// This is a reusable component that compiles and renders JSX email templates

interface EmailRendererProps {
  jsxString: string;
  onError?: (error: string) => void;
  className?: string;
}

// Mock React Email Components - Replace these with real @react-email/components if needed
const createMockComponents = () => ({
  Html: ({ children, ...props }: any) => <div data-email-html {...props}>{children}</div>,
  Head: ({ children, ...props }: any) => <div data-email-head {...props}>{children}</div>,
  Tailwind: ({ children, ...props }: any) => <div data-email-tailwind {...props}>{children}</div>,
  Body: ({ children, className, ...props }: any) => (
    <div data-email-body className={`min-h-screen ${className || ''}`} style={{ backgroundColor: '#f9fafb', color: '#333', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }} {...props}>
      {children}
    </div>
  ),
  Container: ({ children, className, ...props }: any) => (
    <div data-email-container className={`container mx-auto ${className || ''}`} {...props}>
      {children}
    </div>
  ),
  Section: ({ children, className, ...props }: any) => (
    <section data-email-section className={className || ''} style={{ backgroundColor: '#fff' }} {...props}>
      {children}
    </section>
  ),
  Text: ({ children, className, ...props }: any) => (
    <p data-email-text className={className || ''} {...props}>
      {children}
    </p>
  ),
  Heading: ({ children, className, ...props }: any) => (
    <h2 data-email-heading className={className || ''} {...props}>
      {children}
    </h2>
  ),
  Img: ({ src, alt, className, ...props }: any) => (
    <img data-email-img src={src} alt={alt} className={className || ''} style={{ maxWidth: '100%', height: '48px', width: 'auto' }} {...props} />
  ),
  Button: ({ children, href, className, ...props }: any) =>
    href ? (
      <a data-email-button href={href} className={`inline-block ${className || ''}`} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }} {...props}>
        {children}
      </a>
    ) : (
      <button data-email-button className={className || ''} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: '8px' }} {...props}>
        {children}
      </button>
    ),
  Link: ({ children, href, className, ...props }: any) => (
    <a data-email-link href={href} className={className || ''} {...props}>
      {children}
    </a>
  ),
  Hr: ({ className, ...props }: any) => (
    <hr data-email-hr className={className || ''} {...props} />
  ),
  Column: ({ children, className, ...props }: any) => (
    <div data-email-column className={`inline-block align-top ${className || ''}`} {...props}>
      {children}
    </div>
  ),
  Row: ({ children, className, ...props }: any) => (
    <div data-email-row className={`table-row ${className || ''}`} {...props}>
      {children}
    </div>
  ),
  Preview: ({ children, ...props }: any) => (
    <div data-email-preview style={{ display: 'none', overflow: 'hidden', lineHeight: '1px', opacity: 0, maxHeight: 0, maxWidth: 0 }}>
      {children}
    </div>
  ),
});

export function EmailRenderer({ jsxString, onError, className }: EmailRendererProps) {
  const renderedComponent = useMemo(() => {
    if (!jsxString.trim()) {
      return <div className="p-8 text-center text-gray-500">Enter JSX code to see preview</div>;
    }

    // Check if the string is a full HTML document
    const isHtmlDocument = jsxString.startsWith('<!DOCTYPE html>') || jsxString.startsWith('<html');

    if (isHtmlDocument) {
      return (
        <iframe
          style={{ width: '100%', height: '100%', border: 'none' }}
          srcDoc={jsxString}
          title="Email Preview"
        />
      );
    }

    try {
      // Check if Babel is available (loaded via script tag)
      if (!window.Babel) {
        throw new Error('Babel is not loaded. Include @babel/standalone script.');
      }

      // Create the wrapper function that receives React and components
      const wrappedJSX = `(function(React, components) {
        const { Html, Head, Tailwind, Body, Container, Section, Text, Heading, Img, Button, Link, Hr, Column, Row, Preview, Divider } = components;
        return (${jsxString});
      })`;

      // Transform JSX using Babel (browser compilation)
      const transpiled = window.Babel.transform(wrappedJSX, {
        presets: [['react', { pragma: 'React.createElement' }]],
      }).code;

      // Execute the transpiled code
      const componentFunction = eval(transpiled);
      const components = createMockComponents();
      const reactElement = componentFunction(React, components);

      return reactElement;
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error occurred';
      onError?.(errorMessage);
      
      return (
        <div className="p-8 border-2 border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h3 className="font-medium text-red-800">Compilation Error</h3>
          </div>
          <p className="text-red-700 text-sm font-mono">{errorMessage}</p>
        </div>
      );
    }
  }, [jsxString, onError]);

  return <div className={`w-full h-full ${className || ''}`}>{renderedComponent}</div>;
}

// Hook for email compilation (reusable logic)
export function useEmailRenderer() {
  const compileEmail = (jsxString: string) => {
    if (!jsxString.trim()) {
      return { success: false, component: null, error: 'JSX string is empty' };
    }

    try {
      if (!window.Babel) {
        throw new Error('Babel is not loaded');
      }

      const wrappedJSX = `(function(React, components) {
        const { Html, Head, Tailwind, Body, Container, Section, Text, Heading, Img, Button, Link, Hr, Column, Row, Preview, Divider } = components;
        return (${jsxString});
      })`;

      const transpiled = window.Babel.transform(wrappedJSX, {
        presets: [['react', { pragma: 'React.createElement' }]],
      }).code;

      const componentFunction = eval(transpiled);
      const components = createMockComponents();
      const reactElement = componentFunction(React, components);

      return { success: true, component: reactElement, error: null };
    } catch (error: any) {
      return { success: false, component: null, error: error.message };
    }
  };

  return { compileEmail };
}

// Example usage:
/*
// In your Next.js page or component:

import { EmailRenderer } from '../components/EmailRenderer';

const MyPage = () => {
  const emailJSX = `
    <Html>
      <Tailwind>
        <Body className="bg-gray-50">
          <Container>
            <Text>Hello World!</Text>
            <Button href="https://example.com">Click me</Button>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  `;

  return (
    <div>
      <h1>My Email Preview</h1>
      <EmailRenderer jsxString={emailJSX} />
    </div>
  );
};
*/

export default EmailRenderer;