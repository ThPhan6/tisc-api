export interface ProjectProductFinishSchedule {
  id: string;
  project_product_id: string;
  room_id: string;
  floor: boolean;
  base: {
    ceiling: boolean;
    floor: boolean;
  };
  front_wall: boolean;
  left_wall: boolean;
  back_wall: boolean;
  right_wall: boolean;
  ceiling: boolean;
  door: {
    frame: boolean;
    panel: boolean;
  };
  cabinet: {
    carcass: boolean;
    door: boolean;
  };
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}
