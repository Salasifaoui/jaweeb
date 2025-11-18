import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "@/components/ui/button";

interface ButtonActionProps {
  text?: string;
  action?: 'primary' | 'secondary' | 'positive' | 'negative' | 'default';
  variant?: 'solid' | 'outline' | 'link';
  onPress: () => void;
  className?: string;
  iconAs?: React.ElementType;
  colorIconAs?: string;
  sizeIcon?: number;
  sizeText?: number;
  loading?: boolean;
}
export default function ButtonAction({
  text,
  action = 'primary',
  variant = 'solid',
  onPress,
  className,
  iconAs,
  colorIconAs,
  sizeIcon = 24,
  loading = false,
}: ButtonActionProps) {
  return (
    <Button
      action={action}
      variant={variant}
      onPress={onPress}
      className={`w-full h-16 rounded-full ${variant === 'outline' ? 'border-2 border-primary-500' : 'border-none'} ${className}`}
    >
      {loading ? <ButtonSpinner color="gray" /> :
      iconAs && (
        <ButtonIcon
          as={iconAs}
          width={sizeIcon}
          height={sizeIcon}
          className={colorIconAs}
        />
      )
    }
      {text && <ButtonText>{text}</ButtonText>}
    </Button>
  );
}
