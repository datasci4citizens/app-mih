export interface MihRecord {
    id: number;
    patient: number;
    start_date: string | null;
    end_date: string | null;
    painLevel?: number | null;
    sensitivityField?: boolean | null;
    stain?: boolean | null;
    aestheticDiscomfort?: boolean | null;
    userObservations?: string | null;
    specialistObservations?: string | null;
    diagnosis?: string | null;
    photo_id1?: number | null;
    photo_id2?: number | null;
    photo_id3?: number | null;
}

export interface TrackingRecord {
    id: number;
    mih?: number | null;
    image_id?: number | null;
    observations?: string | null;
}

export interface ClinicalImage {
    id: number;
    file?: File;
}
