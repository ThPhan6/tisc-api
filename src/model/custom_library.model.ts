import { CustomLibraryAttribute } from "@/api/custom_library/custom_library.type";
import Model from "@/Database/Model";

export default class CustomLibraryModel extends Model<CustomLibraryAttribute> {
  protected table = "custom_libraries";
  protected softDelete = true;
}
