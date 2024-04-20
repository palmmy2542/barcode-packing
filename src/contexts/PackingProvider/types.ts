import { ReactNode } from "react";

export enum PACKED_STATUS {
  PENDING = "PENDING",
  READY = "READY",
  PACKED = "PACKED",
}

export type Packaging = {
  id: string;
  status: string;
  paletteId?: string | null;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type Product = {
  id: string;
  name: string;
  amount: number;
  status: PACKED_STATUS;
  packingId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type Palette = {
  id: string;
  status: PACKED_STATUS;
  packagings?: Packaging[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type IPackingContext = {
  packagings: Packaging[];
  products: Product[];
  palettes: Palette[];
  setProductById: (productId: string, product: Product) => void;
  setProducts: (products: Product[]) => void;
  setPackagingById: (packagingId: string, packaging: Packaging) => void;
  setPackagings: (packagings: Packaging[]) => void;
  setPaletteById: (paletteId: string, palette: Palette) => void;
  setPalettes: (palettes: Palette[]) => void;
  findProductById: (productId: string) => Product | null;
  findPackagingById: (packagingId: string) => Packaging | null;
  findPaletteById: (paletteId: string) => Palette | null;
  addProductInPackaging: (packagingId: string, product: Product) => void;
  removeProductInPackagingByProductId: (
    packagingId: string,
    productId: string
  ) => void;
  addPackagingInPalette: (paletteId: string, packaging: Packaging) => void;
  removePackagingInPaletteByPackagingId: (
    paletteId: string,
    packagingId: string
  ) => void;
};

export type PackingProviderProps = {
  children?: ReactNode;
};
