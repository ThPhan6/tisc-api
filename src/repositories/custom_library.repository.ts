import BaseRepository from "@/repositories/base.repository";
import CustomLibraryModel from "@/model/custom_library.model";
import { CustomLibraryAttribute } from "@/api/custom_library/custom_library.type";


class CustomLibraryRepository extends BaseRepository<CustomLibraryAttribute> {
  protected model: CustomLibraryModel;
  protected DEFAULT_ATTRIBUTE: Partial<CustomLibraryAttribute> = {

  };
  constructor() {
    super();
    this.model = new CustomLibraryModel();
  }

}
export const customLibraryRepository = new CustomLibraryRepository();
export default CustomLibraryRepository;
