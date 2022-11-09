import { CustomLibraryCompanyAttribute } from "@/api/custom_library/custom_library.type";
import Model from "@/Database/Model";

export default class CustomLibraryModel extends Model<CustomLibraryCompanyAttribute> {
  protected table = "custom_library_companies";
  protected softDelete = true;
}
