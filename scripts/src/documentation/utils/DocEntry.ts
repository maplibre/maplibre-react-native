export interface PropDocEntry {
  name: string;
  required: boolean;
  type: string;
  defaultValue?: string;
  description: string;
  see: string[];
}

export interface ExampleDocEntry {
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
  examples: ExampleDocEntry[];
}

export interface ComponentDocEntry {
  name: string;
  filePath: string;
  description: string;
  examples: ExampleDocEntry[];
  props: PropDocEntry[];
  methods: MethodDocEntry[];
  composes: string[];
  types: TypeDocEntry[];
}

export interface ModuleDocEntry {
  name: string;
  filePath: string;
  description: string;
  methods: MethodDocEntry[];
  types: TypeDocEntry[];
}

export interface TypeDocEntry {
  name: string;
  filePath: string;
  description: string;
  type: string;
}
