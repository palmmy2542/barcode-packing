import { createContext, useContext, useState } from "react";

import { Outlet } from "react-router-dom";
import {
  IPackingContext,
  Product,
  PACKED_STATUS,
  Packaging,
  PackingProviderProps,
  Palette,
} from "./types";

const PackingContext = createContext<IPackingContext>({
  products: [],
  packagings: [],
  palettes: [],
  setProductById: () => {},
  setProducts: () => {},
  setPackagings: () => {},
  setPackagingById: () => {},
  setPalettes: () => {},
  findPackagingById: () => null,
  findProductById: () => null,
  findPaletteById: () => null,
  addProductInPackaging: () => {},
  removeProductInPackagingByProductId: () => {},
});

const mockProducts: Product[] = [
  {
    id: "P001",
    name: "Product 1",
    price: 100,
    status: PACKED_STATUS.READY,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "P002",
    name: "Product 2",
    price: 100,
    status: PACKED_STATUS.READY,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "P003",
    name: "Product 3",
    price: 100,
    status: PACKED_STATUS.READY,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "P004",
    name: "Product 4",
    price: 100,
    status: PACKED_STATUS.READY,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

const mockPackagings: Packaging[] = [
  {
    id: "B001",
    status: PACKED_STATUS.PENDING,
    products: [],

    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },

  {
    id: "B002",
    status: PACKED_STATUS.PENDING,
    products: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

const mockPalettes: Palette[] = [
  {
    id: "PL001",
    status: PACKED_STATUS.PENDING,
    packagings: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },

  {
    id: "PL002",
    status: PACKED_STATUS.PENDING,
    packagings: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

const PackingProvider = (props: PackingProviderProps) => {
  const { children } = props;
  const [products, setProducts] = useState<Product[]>(mockProducts);
  console.log("🚀 ~ PackingProvider ~ products:", products);
  const [packagings, setPackagings] = useState<Packaging[]>(mockPackagings);
  console.log("🚀 ~ PackingProvider ~ packagings:", packagings);
  const [palettes, setPalettes] = useState<Palette[]>(mockPalettes);
  console.log("🚀 ~ PackingProvider ~ palettes:", palettes);

  const handleSetProductById = (productId: string, product: Product) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...product, updatedAt: new Date() } : p
      )
    );
  };

  const handleSetProducts = (products: Product[]) => {
    setProducts(products);
  };

  const handleSetPackagings = (packagings: Packaging[]) => {
    setPackagings(packagings);
  };

  const handleSetPackagingById = (
    packagingId: string,
    packaging: Packaging
  ) => {
    setPackagings((prev) =>
      prev.map((p) =>
        p.id === packagingId ? { ...packaging, updatedAt: new Date() } : p
      )
    );
  };

  const handleSetPalettes = (palettes: Palette[]) => {
    setPalettes(palettes);
  };

  const handleAddProductInPackaging = (
    packagingId: string,
    product: Product
  ) => {
    const productWithPackedStatus: Product = {
      ...product,
      status: PACKED_STATUS.PACKED,
      packingId: packagingId,
      updatedAt: new Date(),
    };
    setPackagings((prev) =>
      prev.map((packaging) => {
        if (packaging.id === packagingId) {
          return {
            ...packaging,
            products: [...(packaging?.products ?? []), productWithPackedStatus],
            updatedAt: new Date(),
          };
        }
        return packaging;
      })
    );
    handleSetProductById(product.id, productWithPackedStatus);
  };

  const handleRemoveProductInPackagingByProductId = (
    packagingId: string,
    productId: string
  ) => {
    const product = handleFindProductById(productId);
    if (product) {
      const productWithReadyStatus: Product = {
        ...product,
        status: PACKED_STATUS.READY,
        packingId: null,
        updatedAt: new Date(),
      };
      setPackagings((prev) =>
        prev.map((packaging) => {
          if (packaging.id === packagingId) {
            const products = packaging.products?.filter(
              (product) => product.id !== productId
            );
            return {
              ...packaging,
              products,
              updatedAt: new Date(),
            };
          }
          return packaging;
        })
      );
      handleSetProductById(productId, productWithReadyStatus as Product);
    }
  };

  const handleFindProductById = (productId: string) => {
    return products.find((product) => product.id === productId) ?? null;
  };

  const handleFindPackagingById = (packagingId: string) => {
    return packagings.find((packaging) => packaging.id === packagingId) ?? null;
  };

  const handleFindPaletteById = (paletteId: string) => {
    return palettes.find((palette) => palette.id === paletteId) ?? null;
  };

  return (
    <PackingContext.Provider
      value={{
        products,
        packagings,
        palettes,
        setProductById: handleSetProductById,
        setProducts: handleSetProducts,
        setPackagingById: handleSetPackagingById,
        setPackagings: handleSetPackagings,
        setPalettes: handleSetPalettes,
        findProductById: handleFindProductById,
        findPackagingById: handleFindPackagingById,
        findPaletteById: handleFindPaletteById,
        addProductInPackaging: handleAddProductInPackaging,
        removeProductInPackagingByProductId:
          handleRemoveProductInPackagingByProductId,
      }}
    >
      {children ?? <Outlet />}
    </PackingContext.Provider>
  );
};

const usePacking = () => {
  const context = useContext(PackingContext);
  if (context === undefined) {
    throw new Error("usePacking must be used within PackingProvider");
  }
  return context;
};

export { usePacking };
export default PackingProvider;
