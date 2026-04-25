export interface Field {
  id: number;
  name: string;
  crop_type: string;
  planting_date: string;
  assigned_agent_id: number;
  stage: string;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface FieldUpdate {
  id: number;
  field_id: number;
  stage: string;
  notes: string;
  created_at: string;
}
