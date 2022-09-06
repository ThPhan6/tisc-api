import {ProductWithCollectionAndBrand} from '../../model/product.model';
import {CategoryValue} from '../category/category.type';

export const getProductCategories = (
  categoryIds: string[] = [],
  categories: CategoryValue[]
) => {
  const productCategories: CategoryValue[] = [];
  ///
  categoryIds.forEach((categoryId) => {
    const category = categories.find(
      (cat) => cat.id === categoryId
    );
    if (category) {
      productCategories.push(category);
    }
  });
  return productCategories;
}

export const mappingByCategory = (
  products: ProductWithCollectionAndBrand[],
  categories: CategoryValue[],
) => {
   return categories.map((category) => {
    let categoryProducts = products.filter(
      (item) => item.category_ids.includes(category.id)
    );

    /// format product data
    const responseProducts = categoryProducts.map((product) => {
      const {
        is_deleted, collection_id, brand_id,
        category_ids, ...rest
      } = product;
      //
      ///
      return {
        ...rest,
        favorites: product.favorites.length,
        is_liked: true,
        categories: getProductCategories(category_ids, categories),
      };
    })
    ///
    return {
      ...category,
      count: categoryProducts.length,
      products: responseProducts,
    };
  });
}

export const mappingByBrand = (
  products: ProductWithCollectionAndBrand[],
  categories: CategoryValue[],
  brands: ProductWithCollectionAndBrand['brand'][],
) => {
  return brands.map((brand) => {
   let categoryProducts = products.filter(
     (item) => item.brand_id = brand.id
   );

   /// format product data
   const responseProducts = categoryProducts.map((product) => {
     const {
       is_deleted, collection_id, brand_id,
       category_ids, ...rest
     } = product;

     ///
     return {
       ...rest,
       favorites: product.favorites.length,
       is_liked: true,
       categories: getProductCategories(category_ids, categories),
     };
   })
   ///
   return {
     id: brand.id,
     name: brand.name,
     count: categoryProducts.length,
     products: responseProducts,
   };
  });
}
