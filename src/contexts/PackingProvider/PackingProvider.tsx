import { createContext, useContext, useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import {
  getPackagings,
  getPalettes,
  getProducts,
  updatePackagingById,
  updatePaletteById,
  updateProductById,
} from "../../firebase";
import {
  IPackingContext,
  PACKED_STATUS,
  Packaging,
  PackingProviderProps,
  Palette,
  Product,
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
  getAllProducts: async () => null,
  getAllPackagings: async () => null,
  getAllPalettes: async () => null,
});

const PackingProvider = (props: PackingProviderProps) => {
  const { children } = props;
  const [products, setProducts] = useState<Product[]>([]);
  const [packagings, setPackagings] = useState<Packaging[]>([]);
  const [palettes, setPalettes] = useState<Palette[]>([]);

  const getAllProducts = async (): Promise<Product[] | null> => {
    try {
      const products = await getProducts();
      setProducts(products);
      return products;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getAllPackagings = async (): Promise<Packaging[] | null> => {
    try {
      const packagings = await getPackagings();
      setPackagings(packagings);
      return packagings;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getAllPalettes = async (): Promise<Palette[] | null> => {
    try {
      const palettes = await getPalettes();
      setPalettes(palettes);
      return palettes;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleSetProductById = (productId: string, product: Product) => {
    updateProductById(productId, { ...product, updatedAt: new Date() });
    getAllProducts();
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
    updatePackagingById(packagingId, { ...packaging, updatedAt: new Date() });
    getAllPackagings();
  };

  const handleSetPalettes = (palettes: Palette[]) => {
    setPalettes(palettes);
  };

  const handleSetPaletteById = (paletteId: string, palette: Palette) => {
    updatePaletteById(paletteId, { ...palette, updatedAt: new Date() });
    getAllPalettes();
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

  useEffect(() => {
    getAllProducts();
    getAllPackagings();
    getAllPalettes();
  }, []);

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
        getAllProducts: getAllProducts,
        getAllPackagings,
        getAllPalettes,
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
