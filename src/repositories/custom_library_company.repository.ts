import BaseRepository from "@/repositories/base.repository";
import CustomLibraryCompanyModel from "@/model/custom_library_company.model";
import {
  CustomLibraryCompanyAttribute,
  CustomLibraryCompanyType
} from "@/api/custom_library/custom_library.type";

export default class CustomLibraryCompanyRepository extends BaseRepository<CustomLibraryCompanyAttribute> {
  protected model: CustomLibraryCompanyModel;
  protected DEFAULT_ATTRIBUTE: Partial<CustomLibraryCompanyAttribute> = {
    website_uri: '',
    location_id: '',
    contacts: [],
    associate_company_ids: [],
    type: CustomLibraryCompanyType.Brand
  };
  constructor() {
    super();
    this.model = new CustomLibraryCompanyModel();
  }

}

export const customLibraryCompanyRepository = new CustomLibraryCompanyRepository();
