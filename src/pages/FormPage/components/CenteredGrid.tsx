import { Grid } from '@mantine/core';
import { ReactNode } from 'react';

interface CenteredGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string | number;
  isMobile?: boolean;
  gutter?: string | number;
}

/**
 * A reusable grid component that automatically centers the last item when there's an odd number of items.
 * Each item spans 12 columns on mobile and 6 columns on larger screens (2 columns layout).
 */
function CenteredGrid<T>({
  items,
  renderItem,
  getKey,
  isMobile = false,
  gutter = 'md',
}: CenteredGridProps<T>): React.JSX.Element {
  const isOdd = items.length % 2 === 1;

  return (
    <Grid gutter={gutter} p={isMobile ? 0 : 'xl'}>
      {items.map((item, i) => {
        const isLastItem = i === items.length - 1;

        return (
          <Grid.Col
            key={getKey(item, i)}
            span={{ base: 12, sm: 6 }}
            offset={isLastItem && isOdd ? { base: 0, sm: 3 } : 0}
            style={{ display: 'flex' }}
          >
            {renderItem(item, i)}
          </Grid.Col>
        );
      })}
    </Grid>
  );
}

export default CenteredGrid;
