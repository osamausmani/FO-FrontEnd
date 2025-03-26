declare module '@mapbox/polyline' {
  export function decode(str: string, precision?: number): Array<[number, number]>;
  export function encode(points: Array<[number, number]>, precision?: number): string;
}
