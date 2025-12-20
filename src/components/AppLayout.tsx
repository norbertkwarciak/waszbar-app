import { AppShell, Burger, Image, Group, Container, Box, Drawer, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IMAGES } from '@/core/config/assets';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_LAYOUT_TRANSLATIONS } from '@/i18n/tKeys';

const HEADER_HEIGHT = 60;

const LINKS = [
  { label: 'Strona Główna', to: '/' },
  { label: 'Jak pracujemy', to: '/gallery' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Kontakt', to: '/contact' },
];

function AppLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const { t } = useTranslation();
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell padding="md" header={{ height: HEADER_HEIGHT }}>
      <AppShell.Header style={{ backgroundColor: 'black', borderBottom: 'none' }}>
        <Group h="100%" px="md">
          <Link to="/">
            <Image src={IMAGES.logo} alt="Logo" h={40} w="auto" fit="contain" />
          </Link>

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
                        color: isActive ? 'var(--mantine-color-primary-filled)' : 'white',
                      })}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </Group>

                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                  color="white"
                  aria-label={
                    opened
                      ? t(APP_LAYOUT_TRANSLATIONS.a11y.navToggleClose)
                      : t(APP_LAYOUT_TRANSLATIONS.a11y.navToggleOpen)
                  }
                />
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

      <AppShell.Main
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: 'url(/background.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            opacity: 0.3,
            filter: 'blur(1px)',
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />

        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default AppLayout;
