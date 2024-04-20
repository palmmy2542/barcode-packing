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
  setPaletteById: () => {},
  setPalettes: () => {},
  findPackagingById: () => null,
  findProductById: () => null,
  findPaletteById: () => null,
  addProductInPackaging: () => {},
  removeProductInPackagingByProductId: () => {},
  addPackagingInPalette: () => {},
  removePackagingInPaletteByPackagingId: () => {},
});

const mockProducts: Product[] = [
  {
    id: "P001",
    name: "Product 1",
    amount: 100,
    status: PACKED_STATUS.READY,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "P002",
    name: "Product 2",
    amount: 100,
    status: PACKED_STATUS.READY,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "P003",
    name: "Product 3",
    amount: 100,
    status: PACKED_STATUS.READY,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "P004",
    name: "Product 4",
    amount: 100,
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
  const [packagings, setPackagings] = useState<Packaging[]>(mockPackagings);
  const [palettes, setPalettes] = useState<Palette[]>(mockPalettes);

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

  const handleSetPaletteById = (paletteId: string, palette: Palette) => {
    setPalettes((prev) =>
      prev.map((p) =>
        p.id === paletteId ? { ...palette, updatedAt: new Date() } : p
      )
    );
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

  const handleAddPackagingInPalette = (
    paletteId: string,
    packaging: Packaging
  ) => {
    const packagingWithPackedStatus: Packaging = {
      ...packaging,
      status: PACKED_STATUS.PACKED,
      paletteId: paletteId,
      updatedAt: new Date(),
    };
    setPalettes((prev) =>
      prev.map((palette) => {
        if (palette.id === paletteId) {
          return {
            ...palette,
            packagings: [
              ...(palette?.packagings ?? []),
              packagingWithPackedStatus,
            ],
            updatedAt: new Date(),
          };
        }
        return palette;
      })
    );
    handleSetPackagingById(packaging.id, packagingWithPackedStatus);
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

  const handleRemovePackagingInPaletteByPackagingId = (
    paletteId: string,
    packagingId: string
  ) => {
    const packaging = handleFindPackagingById(packagingId);
    if (packaging) {
      const packagingWithReadyStatus: Packaging = {
        ...packaging,
        status: PACKED_STATUS.READY,
        paletteId: null,
        updatedAt: new Date(),
      };
      setPalettes((prev) =>
        prev.map((palette) => {
          if (palette.id === paletteId) {
            const packagings = palette.packagings?.filter(
              (packaging) => packaging.id !== packagingId
            );
            return {
              ...palette,
              packagings,
              updatedAt: new Date(),
            };
          }
          return palette;
        })
      );
      handleSetPackagingById(
        packagingId,
        packagingWithReadyStatus as Packaging
      );
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
        setPaletteById: handleSetPaletteById,
        setPalettes: handleSetPalettes,
        findProductById: handleFindProductById,
        findPackagingById: handleFindPackagingById,
        findPaletteById: handleFindPaletteById,
        addProductInPackaging: handleAddProductInPackaging,
        removeProductInPackagingByProductId:
          handleRemoveProductInPackagingByProductId,
        addPackagingInPalette: handleAddPackagingInPalette,
        removePackagingInPaletteByPackagingId:
          handleRemovePackagingInPaletteByPackagingId,
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
