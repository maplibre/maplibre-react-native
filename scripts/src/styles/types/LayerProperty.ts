export type LayerProperty = {
  name: string;
  type: string;
  value?: string;
  length?: number;
  image: boolean;
  translate: boolean;
  transition?: boolean;
  expression?: {
    interpolated?: boolean;
    parameters?: string[];
  };
  expressionSupported: boolean;
  support: {
    basic: { android: boolean; ios: boolean };
    data: { android: boolean; ios: boolean };
  };
  doc: {
    default?: unknown;
    minimum?: number;
    maximum?: number;
    units?: string;
    description: string;
    requires: string[];
    disabledBy: string[];
    values: Record<string, unknown>;
  };
};
