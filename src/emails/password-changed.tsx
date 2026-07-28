import React from 'react';

import { Body, Container, Head, Html, Preview, Text } from '@react-email/components';

export const PasswordChangedEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Your password has been changed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Password Changed Successfully</Text>
          <Text style={paragraph}>
            This is a confirmation that the password for your account has been successfully changed.
          </Text>
          <Text style={paragraph}>
            If you did not make this change, please contact support immediately to secure your
            account.
          </Text>
          <Text style={footer}>This is an automated message, please do not reply.</Text>
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
const footer = { fontSize: '14px', color: '#888', marginTop: '32px' };

export default PasswordChangedEmail;
