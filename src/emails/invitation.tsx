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

interface InvitationEmailProps {
  inviteLink: string;
}

export const InvitationEmail = ({ inviteLink }: InvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You have been invited to join the platform.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Welcome to the Platform</Text>
          <Text style={paragraph}>
            You have been invited to join the platform. Please click the button below to set up your
            password and activate your account.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={inviteLink}>
              Activate Account
            </Button>
          </Section>
          <Text style={paragraph}>This invitation link will expire in 24 hours.</Text>
          <Text style={footer}>
            If you did not expect this invitation, please ignore this email.
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

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const heading = {
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  color: '#333',
  padding: '16px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555',
};

const btnContainer = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const button = {
  backgroundColor: '#4f46e5', // indigo-600
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const footer = {
  fontSize: '14px',
  color: '#888',
  marginTop: '32px',
};

export default InvitationEmail;
