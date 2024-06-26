import GalleryModel from "@/models/gallery.model";
import { IGalleryAttributes } from "@/types";
import BaseRepository from "./base.repository";

class GalleryRepository extends BaseRepository<IGalleryAttributes> {
  protected model: GalleryModel;
  protected DEFAULT_ATTRIBUTE: Partial<IGalleryAttributes> = {
    images: [],
  };
  constructor() {
    super();
    this.model = new GalleryModel();
  }
}
export default new GalleryRepository();
export const galleryRepository = new GalleryRepository();
