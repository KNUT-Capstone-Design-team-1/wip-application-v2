declare module 'react-native-xml2js' {
  export interface ParserOptions {
    explicitArray?: boolean;
  }

  export function parseStringPromise(xml: string, options?: ParserOptions): Promise<any>;
}