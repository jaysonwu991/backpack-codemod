declare module "react" {
  export type FC<P = {}> = (props: P) => JSX.Element | null;
}
declare module "react/jsx-runtime";

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}
