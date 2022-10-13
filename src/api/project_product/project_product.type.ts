import {ProjectProductFinishSchedule} from '@/types';
import { ProjectProductAttributes } from "./project_product.model";

export interface UpdateFinishChedulePayload extends Pick<
  ProjectProductFinishSchedule,
  'floor' | 'base' | 'front_wall' | 'left_wall' | 'back_wall' | 'right_wall' | 'ceiling' | 'door' | 'cabinet'
> {}

export interface UpdateProjectProductPayload extends Partial<ProjectProductAttributes> {
  finish_schedules?: UpdateFinishChedulePayload[]
}

export interface AssignProductToProjectRequest {
  entire_allocation: boolean;
  product_id: string;
  project_id: string;
  allocation: string[];
}

export enum ProjectProductStatus {
  consider,
  specify,
}

export enum ProductConsiderStatus {
  "Considered",
  "Re-Considered",
  "Unlisted",
}

export enum ProductSpecifyStatus {
  "Specified",
  "Re-specified",
  "Cancelled",
}

export enum OrderMethod {
  "Direct Purchase",
  "Custom Order",
}
