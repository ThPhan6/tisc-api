import Model from "@/Database/Model";
import { IGalleryAttributes } from "@/types/gallery.type";

export default class GalleryModel extends Model<IGalleryAttributes> {
  protected table = "galleries";
  protected softDelete = true;
}
