import { usePlaygroundContext } from '@lib/index';
import Color from 'color';
import { useEffect } from 'react';

interface CssThemeProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const CssTheme = (props: CssThemeProps) => {
  const { containerRef } = props;
  const {
    fileBarThemes: theme,
    playgroundState: {
      editorConfig: { theme: selectedTheme }
    }
  } = usePlaygroundContext();
  const { light, dark } = theme;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Helper function to create intense dark variants
    const createIntenseVariant = (base: ReturnType<typeof Color>, factor: number): string => {
      return base
        .saturate(factor * 0.3)
        .darken(factor * 0.15)
        .hex();
    };

    // Helper function to create light variants
    const createLightVariant = (base: ReturnType<typeof Color>, whiteMix: number): string => {
      return base.mix(Color('white'), whiteMix).hex();
    };

    // Color variant definitions
    const variants = [
      {
        suffix: '50',
        generator: (base: ReturnType<typeof Color>) => createLightVariant(base, 0.6)
      },
      {
        suffix: '100',
        generator: (base: ReturnType<typeof Color>) => createLightVariant(base, 0.5)
      },
      {
        suffix: '200',
        generator: (base: ReturnType<typeof Color>) => createLightVariant(base, 0.4)
      },
      {
        suffix: '300',
        generator: (base: ReturnType<typeof Color>) => createLightVariant(base, 0.3)
      },
      {
        suffix: '400',
        generator: (base: ReturnType<typeof Color>) => createLightVariant(base, 0.2)
      },
      { suffix: '500', generator: (base: ReturnType<typeof Color>) => base.hex() },
      {
        suffix: '600',
        generator: (base: ReturnType<typeof Color>) => createIntenseVariant(base, 0.3)
      },
      {
        suffix: '700',
        generator: (base: ReturnType<typeof Color>) => createIntenseVariant(base, 0.5)
      },
      {
        suffix: '800',
        generator: (base: ReturnType<typeof Color>) => createIntenseVariant(base, 0.7)
      },
      {
        suffix: '900',
        generator: (base: ReturnType<typeof Color>) => createIntenseVariant(base, 0.9)
      },
      {
        suffix: '950',
        generator: (base: ReturnType<typeof Color>) => createIntenseVariant(base, 1.1)
      }
    ];

    // Apply theme colors
    Object.entries(selectedTheme === 'dark' ? dark.colors : light.colors).forEach(
      ([key, value]) => {
        const base = Color(value);
        const propertyPrefix = `--playground-${key}-`;

        // Clear existing properties (cleanup)
        variants.forEach(({ suffix }) => {
          container.style.removeProperty(`${propertyPrefix}${suffix}`);
        });

        // Set new properties
        variants.forEach(({ suffix, generator }) => {
          container.style.setProperty(`${propertyPrefix}${suffix}`, generator(base));
        });
      }
    );
  }, [theme, selectedTheme, dark, light, containerRef]);

  return null;
};
