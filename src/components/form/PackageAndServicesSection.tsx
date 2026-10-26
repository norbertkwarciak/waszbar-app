import CenteredGrid from '@/components/CenteredGrid';
import ExtraServiceBox from '@/components/ExtraServiceBox';
import FormDivider from '@/components/FormDivider';
import MenuPackageBox from '@/components/MenuPackageBox';
import { menuPackages } from '@/core/config/options';
import type { ExtraService, MenuPackage, SelectedService } from '@/types';
import { useTranslation } from 'react-i18next';
import { FORM_PAGE_TRANSLATIONS } from '@/i18n/tKeys';

interface PackageAndServicesSectionProps {
  extraServices: ExtraService[];
  selectedPackage: MenuPackage | null;
  selectedServices: SelectedService[];
  isMobile: boolean;
  onSelectPackage: (pkg: MenuPackage) => void;
  onOpenPackage: (pkg: MenuPackage) => void;
  onToggleService: (id: string, count?: number) => void;
}

export default function PackageAndServicesSection({
  extraServices,
  selectedPackage,
  selectedServices,
  isMobile,
  onSelectPackage,
  onOpenPackage,
  onToggleService,
}: PackageAndServicesSectionProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <FormDivider
        label={
          <>
            {t(FORM_PAGE_TRANSLATIONS.menuSelectionTitle)}{' '}
            <span style={{ color: 'var(--mantine-color-red-6)', marginLeft: 4 }}>*</span>
          </>
        }
      />
      <CenteredGrid
        items={menuPackages}
        getKey={(pkg) => pkg.value}
        isMobile={isMobile}
        renderItem={(pkg) => (
          <MenuPackageBox
            pkg={pkg}
            isSelected={selectedPackage?.value === pkg.value}
            onSelect={() => onSelectPackage(pkg)}
            onOpenModal={() => onOpenPackage(pkg)}
          />
        )}
      />
      <FormDivider label={t(FORM_PAGE_TRANSLATIONS.additionalServicesTitle)} />
      <CenteredGrid
        items={extraServices}
        getKey={(service) => service.id}
        isMobile={isMobile}
        renderItem={(service) => {
          const selected = selectedServices.find((item) => item.id === service.id);
          return (
            <ExtraServiceBox
              service={service}
              isSelected={!!selected}
              onToggle={(count) => onToggleService(service.id, count)}
              hasCalculator={service.id === 'hoshizaki'}
              count={selected?.count ?? 0}
            />
          );
        }}
      />
    </>
  );
}
