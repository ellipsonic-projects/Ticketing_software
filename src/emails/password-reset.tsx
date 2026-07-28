import React from 'react';

import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface PasswordResetEmailProps {
  resetLink: string;
}

export const PasswordResetEmail = ({ resetLink }: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Password Reset Request</Text>
          <Text style={paragraph}>
            We received a request to reset your password. Click the button below to choose a new
            password.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={resetLink}>
              Reset Password
            </Button>
          </Section>
          <Text style={paragraph}>This link will expire in 15 minutes.</Text>
          <Text style={footer}>
            If you did not request a password reset, please ignore this email or contact support if
            you have concerns.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = { margin: '0 auto', padding: '20px 0 48px', width: '580px' };
const heading = {
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  color: '#333',
  padding: '16px 0',
};
const paragraph = { fontSize: '16px', lineHeight: '26px', color: '#555' };
const btnContainer = { textAlign: 'center' as const, padding: '20px 0' };
const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};
const footer = { fontSize: '14px', color: '#888', marginTop: '32px' };

export default PasswordResetEmail;
