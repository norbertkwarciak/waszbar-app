type StringFunction = string & {
  (): string;
  [key: string]: unknown;
  toString(): string;
  valueOf(): string;
};

export type TranslationKeyObject<T> = {
  [K in keyof T]: T[K] extends object ? TranslationKeyObject<T[K]> : StringFunction;
};

export function createTranslationKeys<T>(prefix: string = ''): TranslationKeyObject<T> {
  // Create a function to build nested paths
  const buildPath = (currentPrefix: string, key: string): string => {
    return currentPrefix ? `${currentPrefix}.${key}` : key;
  };

  // Create a recursive function to build the translation key object
  const createNestedKeys = (currentPrefix: string): StringFunction => {
    // Create a function that returns the current path
    const pathFunction = function (): string {
      return currentPrefix;
    };

    // Add toString and valueOf methods
    pathFunction.toString = function (): string {
      return currentPrefix;
    };

    pathFunction.valueOf = function (): string {
      return currentPrefix;
    };

    // Create the proxy
    return new Proxy(pathFunction, {
      // Handle property access (e.g., AUTH.login.title)
      get: (target: StringFunction, prop: string | symbol): unknown => {
        if (typeof prop !== 'string') return target;

        // Skip special properties
        if (prop === 'then' || prop === 'catch' || prop === 'finally') {
          return undefined;
        }

        // Pass through existing properties like toString and valueOf
        if (prop in target) {
          return target[prop];
        }

        // For normal properties, create a new nested proxy
        const newPath = buildPath(currentPrefix, prop);
        return createNestedKeys(newPath);
      },

      // Handle function calls (AUTH.login.title())
      apply: (): string => {
        return currentPrefix;
      },
    }) as StringFunction;
  };

  return createNestedKeys(prefix) as unknown as TranslationKeyObject<T>;
}
