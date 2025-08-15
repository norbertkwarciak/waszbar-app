// src/pages/HomePage.tsx
import { Button, Container, Image, Paper, Stack, Group, Box } from '@mantine/core';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Box pos="relative" mih="100vh">
      <Box pos="absolute" top={20} left={20}>
        <Image src="https://placehold.co/150x50?text=WaszBar.pl" alt="Logo" height={50} />
      </Box>

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
          <Paper shadow="md" radius="md" p="md" withBorder w={300} ta="center">
            <Stack align="center">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
                alt="Wedding"
                height={200}
                fit="cover"
                radius="md"
              />
              <Button component={Link} to="/form/wedding" size="lg" fullWidth>
                Drink Bar Weselny
              </Button>
            </Stack>
          </Paper>

          <Paper shadow="md" radius="md" p="md" withBorder w={300} ta="center">
            <Stack align="center">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
                alt="Event"
                height={200}
                fit="cover"
                radius="md"
              />
              <Button component={Link} to="/form/event" size="lg" fullWidth>
                Drink Bar Eventowy
              </Button>
            </Stack>
          </Paper>
        </Group>
      </Container>
    </Box>
  );
};

export default HomePage;
