export class IntegerTransformer {
  to(data: number): number {
    return data;
  }
  
  from(data: string): number {
    return parseInt(data);
  }
}