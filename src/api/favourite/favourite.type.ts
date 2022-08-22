export interface RetrieveRequestBody {
  personal_email: string;
  mobile: string;
  phone_code: string;
}
export interface FavouriteListRequestQuery {
  brandId?: string;
  categoryId?: string;
}
