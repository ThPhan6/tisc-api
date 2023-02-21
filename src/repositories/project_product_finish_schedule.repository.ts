import ProjectProductFinishScheduleModel from "@/models/project_product_finish_schedule.model";
import { ProjectProductFinishSchedule } from "@/types";
import BaseRepository from "./base.repository";
import {isEmpty, merge} from 'lodash';
import {v4 as uuidv4} from 'uuid';

class ProjectProductFinishScheduleRepository extends BaseRepository<ProjectProductFinishSchedule> {
  protected model: ProjectProductFinishScheduleModel;
  protected DEFAULT_ATTRIBUTE: Partial<ProjectProductFinishSchedule> = {
    project_product_id: "",
    room_id: "", // uuid
    floor: false,
    base: {
      ceiling: false,
      floor: false,
    },
    front_wall: false,
    left_wall: false,
    back_wall: false,
    right_wall: false,
    ceiling: false,
    door: {
      frame: false,
      panel: false,
    },
    cabinet: {
      carcass: false,
      door: false
    },
  }

  constructor() {
    super();
    this.model = new ProjectProductFinishScheduleModel();
  }

  public getDefaultAttribute = (projectProductId: string, roomId = '') => {
    return merge(this.DEFAULT_ATTRIBUTE, {
      project_product_id: projectProductId,
      room_id: roomId,
    });
  }

  public getByProjectProductAndRoom = async (
    projectProductId: string,
    roomIds: string[] = []
  ) => {
    let query = this.model.where('project_product_id', '==', projectProductId);

    if (!isEmpty(roomIds)) {
      query = query.whereIn('room_id', roomIds);
    } else {
      query = query.where('room_id', '==', '');
    }
    ///
    const response = await query.get() as ProjectProductFinishSchedule[];
    ////
    if (isEmpty(roomIds)) {
      if (!isEmpty(response)) {
        return response;
      }
      return [this.getDefaultAttribute(projectProductId)];
    }
    return roomIds.map((roomId) => {
      const finishSchedule = response.find((item) => item.room_id === roomId);
      if (!finishSchedule) {
        return this.getDefaultAttribute(projectProductId, roomId);
      }
      return finishSchedule;
    });
  }

  public upsert = async (
    payload: Omit<ProjectProductFinishSchedule, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>,
    userId: string,
  ) => {
    const now = new Date();
    console.log();
    const modelName = this.model.getTableName();
    return this.model.rawQueryV2(
      `UPSERT {project_product_id: @project_product_id, room_id: @room_id, deleted_at: null}
      INSERT @payloadWithId
      UPDATE @payload
      IN ${modelName}
      RETURN NEW
    `,
      {
        project_product_id: payload.project_product_id,
        room_id: payload.room_id,
        payloadWithId: {
          ...payload,
          id: uuidv4(),
          created_by: userId,
          created_at: now,
          updated_at: now,
        },
        payload: { ...payload, updated_at: now, updated_by: userId },
      }
    );
  }

}

export default ProjectProductFinishScheduleRepository;

export const projectProductFinishScheduleRepository = new ProjectProductFinishScheduleRepository();
