import BaseRepository from "@/repositories/base.repository";
import CustomLibraryModel from "@/model/custom_library.model";
import { CustomLibraryAttribute } from "@/api/custom_library/custom_library.type";


export default class CustomLibraryRepository extends BaseRepository<CustomLibraryAttribute> {
  protected model: CustomLibraryModel;
  protected DEFAULT_ATTRIBUTE: Partial<CustomLibraryAttribute> = {
    name: '',
    description: '',
    images: [],
    attributes: [],
    specification: [],
    options: [],
    collection_id: '',
    custom_library_company_id: '',
    relation_id: '',
  };
  constructor() {
    super();
    this.model = new CustomLibraryModel();
  }

}
export const customLibraryRepository = new CustomLibraryRepository();
