import { cn } from '@/libs/utils';
import { createContext, useContext } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

type TextProps = RNTextProps & {
  className?: string;
};

const TextClassContext = createContext<string>('');

function Text({ className, ...props }: TextProps) {
  const textClass = useContext(TextClassContext);
  return <RNText className={cn(textClass, className)} {...props} />;
}

export { Text, TextClassContext };
export type { TextProps };

