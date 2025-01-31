import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator, ThemeProvider, Theme } from '@aws-amplify/ui-react';
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

const theme: Theme = {
  name: 'brain-in-cup-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#0f172a' },
        secondary: { value: '#1e1b4b' },
      },
      brand: {
        primary: {
          10: { value: '#f5f3ff' },
          20: { value: '#ede9fe' },
          40: { value: '#ddd6fe' },
          60: { value: '#c4b5fd' },
          80: { value: '#a78bfa' },
          100: { value: '#8b5cf6' },
        },
      },
      border: {
        primary: { value: 'rgba(51, 65, 85, 0.5)' },
        secondary: { value: 'rgba(30, 27, 75, 0.5)' },
      },
      font: {
        interactive: { value: '#ffffff' },  // White text for all interactive elements
        secondary: { value: '#cbd5e1' },  // Light gray text
        tertiary: { value: '#94a3b8' },
      },
    },
    components: {
      authenticator: {
        container: {
          backgroundColor: { value: 'transparent' },
          color: { value: '{colors.font.interactive.value}' }, // Force white text globally
        },
        tabs: {
          item: {
            color: { value: '{colors.font.interactive.value}' },  // White for "Sign In" and "Create Account" tabs
            _hover: {
              color: { value: '{colors.brand.primary.80.value}' },
            },
            _active: {
              color: { value: '{colors.brand.primary.100.value}' },
              borderColor: { value: '{colors.brand.primary.100.value}' },
            },
          },
        },
      },
      field: {
        input: {
          color: { value: '{colors.font.interactive.value}' }, // White input text
          borderColor: { value: '{colors.border.primary.value}' },
          backgroundColor: { value: 'rgba(15, 23, 42, 0.5)' },
          _placeholder: {
            color: { value: '#ffffff' }, // ***Force placeholders (Enter your Email/Password) to be white***
            opacity: { value: '1' }, // Ensures full visibility
          },
          _focus: {
            borderColor: { value: '{colors.brand.primary.100.value}' },
            boxShadow: { value: '0 0 0 2px rgba(139, 92, 246, 0.2)' },
          },
          _autofill: {
            backgroundColor: { value: 'rgba(15, 23, 42, 0.8) !important' }, // Ensure autofill background blends with dark mode
            color: { value: '#ffffff !important' }, // Ensure autofill text is white
          },
        },
        label: {
          color: { value: '#ffffff' }, // ***Ensure labels (Email, Password) are WHITE***
        },
      },
      button: {
        primary: {
          backgroundColor: { value: '{colors.brand.primary.100.value}' },
          _hover: {
            backgroundColor: { value: '{colors.brand.primary.80.value}' },
          },
          _focus: {
            backgroundColor: { value: '{colors.brand.primary.80.value}' },
          },
        },
      },
      link: {
        color: { value: '{colors.font.interactive.value}' }, // White for "Forgot your password?" and other links
        _hover: {
          color: { value: '{colors.brand.primary.80.value}' },
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
