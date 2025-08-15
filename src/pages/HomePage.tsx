import { Button, Container, Image, Paper, Stack, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import React from 'react';
import PageLayout from '../components/PageLayout';

interface BarCardProps {
  image: string;
  alt: string;
  buttonText: string;
  to: string;
}

const BarCard = ({ image, alt, buttonText, to }: BarCardProps): React.JSX.Element => {
  return (
    <Paper shadow="md" radius="md" p="md" withBorder w={300} ta="center">
      <Stack align="center">
        <Image src={image} alt={alt} height={200} fit="cover" radius="md" />
        <Button component={Link} to={to} size="lg" fullWidth>
          {buttonText}
        </Button>
      </Stack>
    </Paper>
  );
};

const HomePage = (): React.JSX.Element => {
  return (
    <PageLayout>
      <Container
        size="lg"
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Group justify="center" gap="xl">
          <BarCard
            image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
            alt="Wedding"
            buttonText="Drink Bar Weselny"
            to="/form/wedding"
          />
          <BarCard
            image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
            alt="Event"
            buttonText="Drink Bar Eventowy"
            to="/form/event"
          />
        </Group>
      </Container>
    </PageLayout>
  );
};

export default HomePage;
