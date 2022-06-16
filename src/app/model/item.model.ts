export class Item {
  constructor(
    public quantity: number,
    public desc: string,
    public price: number,
    public type: string,
    public imported: boolean
  ) {}
}
