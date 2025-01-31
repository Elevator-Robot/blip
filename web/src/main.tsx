import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

const theme = {
  name: 'brain-in-cup-theme',
  tokens: {
    colors: {
      background: {
        primary: '#0f172a',
        secondary: '#1e1b4b',
      },
      brand: {
        primary: {
          10: '#f5f3ff',
          20: '#ede9fe',
          40: '#ddd6fe',
          60: '#c4b5fd',
          80: '#a78bfa',
          100: '#8b5cf6',
        },
      },
      border: {
        primary: 'rgba(51, 65, 85, 0.5)',
        secondary: 'rgba(30, 27, 75, 0.5)',
      },
      font: {
        interactive: '#ffffff',  // White text for all interactive elements
        secondary: '#cbd5e1',  // Light gray text
        tertiary: '#94a3b8',
      },
    },
    components: {
      authenticator: {
        container: {
          backgroundColor: 'transparent',
          color: 'font.interactive', // Force white text globally
        },
        tabs: {
          item: {
            color: 'font.interactive',  // White for "Sign In" and "Create Account" tabs
            _hover: {
              color: 'brand.primary.80',
            },
            _active: {
              color: 'brand.primary.100',
              borderColor: 'brand.primary.100',
            },
          },
        },
      },
      field: {
        input: {
          color: 'font.interactive', // White input text
          borderColor: 'border.primary',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          _placeholder: {
            color: '#ffffff', // ***Force placeholders (Enter your Email/Password) to be white***
            opacity: 1, // Ensures full visibility
          },
          _focus: {
            borderColor: 'brand.primary.100',
            boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
          },
          _autofill: {
            backgroundColor: 'rgba(15, 23, 42, 0.8) !important', // Ensure autofill background blends with dark mode
            color: '#ffffff !important', // Ensure autofill text is white
          },
        },
        label: {
          color: '#ffffff', // ***Ensure labels (Email, Password) are WHITE***
        },
      },
      button: {
        primary: {
          backgroundColor: 'brand.primary.100',
          _hover: {
            backgroundColor: 'brand.primary.80',
          },
          _focus: {
            backgroundColor: 'brand.primary.80',
          },
        },
      },
      link: {
        color: 'font.interactive', // White for "Forgot your password?" and other links
        _hover: {
          color: 'brand.primary.80',
        },
      },
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gradient-to-br from-brand-bg-dark via-brand-bg-light to-brand-bg-dark">
        <Authenticator>
          <App />
        </Authenticator>
      </div>
    </ThemeProvider>
  </React.StrictMode>
);
