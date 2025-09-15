import { AppShell, Burger, Image, Group, Container, Box, Drawer, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IMAGES } from '@/core/config/assets';
import { NavLink } from 'react-router-dom';

const HEADER_HEIGHT = 60;

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

function AppLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell padding="md" header={{ height: HEADER_HEIGHT }}>
      <AppShell.Header>
        <Group h="100%" px="md">
          <Image src={IMAGES.logo} alt="Logo" h={40} w="auto" fit="contain" />

          <Box style={{ flex: 1 }}>
            <Container size="md" h="100%">
              <Group justify="end" h="100%">
                <Group gap="xl" visibleFrom="sm">
                  {LINKS.map((link) => (
                    <NavLink
                      to={link.to}
                      key={link.label}
                      style={({ isActive }) => ({
                        textDecoration: 'none',
                        fontWeight: 500,
                        color: isActive ? 'var(--mantine-color-primary-filled)' : 'black',
                      })}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </Group>

                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              </Group>
            </Container>
          </Box>
        </Group>
      </AppShell.Header>

      <Drawer opened={opened} onClose={close} title="Menu" padding="md" size="xs" hiddenFrom="sm">
        <Stack>
          {LINKS.map((link) => (
            <NavLink
              to={link.to}
              key={link.label}
              onClick={close}
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontWeight: 500,
                color: isActive ? 'var(--mantine-color-primary-filled)' : 'black',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </Stack>
      </Drawer>

      <AppShell.Main style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default AppLayout;
