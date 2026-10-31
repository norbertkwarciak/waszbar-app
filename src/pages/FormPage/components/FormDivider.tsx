import { Divider } from '@mantine/core';

interface FormDividerProps {
  label: React.ReactNode;
}

const FormDivider = ({ label }: FormDividerProps): React.JSX.Element => {
  return (
    <Divider
      color="black"
      label={label}
      labelPosition="center"
      styles={{
        label: {
          fontSize: '1rem',
          fontWeight: 700,
          color: 'black',
        },
      }}
    />
  );
};

export default FormDivider;
