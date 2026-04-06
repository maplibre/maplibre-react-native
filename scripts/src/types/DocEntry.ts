export interface PropDocEntry {
  name: string;
  required: boolean;
  type: string;
  defaultValue?: string;
  description: string;
  see: string[];
}

export interface ExampleEntry {
  title: string;
  content: string;
}

export interface ParamDocEntry {
  name: string;
  type: string;
  description: string;
  optional: boolean;
}

export interface ReturnDocEntry {
  type: string;
  description: string;
}

export interface MethodDocEntry {
  name: string;
  description: string;
  params: ParamDocEntry[];
  returns?: ReturnDocEntry;
  examples: ExampleEntry[];
}

export interface StyleValueDocEntry {
  value: string;
  doc: string;
}

export interface StyleDocEntry {
  name: string;
  type: string;
  description: string;
  minimum?: number;
  maximum?: number;
  units?: string;
  default?: unknown;
  values: StyleValueDocEntry[];
  requires: string[];
  disabledBy: string[];
  allowedFunctionTypes: string[];
  expression?: { parameters?: string[] };
  transition?: boolean;
}

export interface ComponentDocEntry {
  name: string;
  filePath: string;
  description: string;
  examples: ExampleEntry[];
  props: PropDocEntry[];
  methods: MethodDocEntry[];
  styles?: StyleDocEntry[];
  composes: string[];
}

export interface ModuleDocEntry {
  name: string;
  filePath: string;
  description: string;
  methods: MethodDocEntry[];
}

export interface TypeDocEntry {
  name: string;
  filePath: string;
  description: string;
  type: string;
}
