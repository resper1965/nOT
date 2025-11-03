// Type declarations for modules without TypeScript definitions

declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }

  function pdfParse(
    data: Buffer | Uint8Array | ArrayBuffer,
    options?: {
      max?: number;
      version?: string;
    }
  ): Promise<PDFData>;

  export default pdfParse;
}

declare module 'mammoth' {
  interface MammothOptions {
    styleMap?: string[];
    includeDefaultStyleMap?: boolean;
    convertImage?: any;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
    transformDocument?: any;
  }

  interface MammothResult {
    value: string;
    messages: Array<{
      type: 'warning' | 'error';
      message: string;
    }>;
  }

  export function convertToHtml(
    options: { buffer: Buffer },
    mammothOptions?: MammothOptions
  ): Promise<MammothResult>;

  export function convertToMarkdown(
    options: { buffer: Buffer },
    mammothOptions?: MammothOptions
  ): Promise<MammothResult>;

  export function extractRawText(
    options: { buffer: Buffer }
  ): Promise<MammothResult>;
}

declare module 'turndown' {
  interface TurndownOptions {
    headingStyle?: 'setext' | 'atx';
    hr?: string;
    bulletListMarker?: '-' | '+' | '*';
    codeBlockStyle?: 'indented' | 'fenced';
    fence?: '```' | '~~~';
    emDelimiter?: '_' | '*';
    strongDelimiter?: '**' | '__';
    linkStyle?: 'inlined' | 'referenced';
    linkReferenceStyle?: 'full' | 'collapsed' | 'shortcut';
  }

  class TurndownService {
    constructor(options?: TurndownOptions);
    addRule(name: string, rule: any): this;
    keep(filter: any): this;
    remove(filter: any): this;
    use(plugin: any): this;
    turndown(html: string): string;
  }

  export = TurndownService;
}

declare module 'js-yaml' {
  interface LoadOptions {
    filename?: string;
    schema?: any;
    onWarning?: (warning: any) => void;
    strict?: boolean;
    json?: boolean;
    listener?: any;
  }

  interface DumpOptions {
    indent?: number;
    noRefs?: boolean;
    skipInvalid?: boolean;
    flowLevel?: number;
    styles?: any;
    schema?: any;
    sortKeys?: boolean | ((a: any, b: any) => number);
    lineWidth?: number;
    noCompatMode?: boolean;
    condenseFlow?: boolean;
    quotingType?: '"' | "'";
    forceQuotes?: boolean;
    replacer?: (key: string, value: any) => any;
  }

  export function load(str: string, options?: LoadOptions): any;
  export function loadAll(str: string, iterator?: (doc: any) => void, options?: LoadOptions): void;
  export function dump(obj: any, options?: DumpOptions): string;
  export function safeLoad(str: string, options?: LoadOptions): any;
  export function safeDump(obj: any, options?: DumpOptions): string;
}

