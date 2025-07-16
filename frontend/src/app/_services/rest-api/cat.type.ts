export interface Cat {
    catId?: number;
    title: string; 
    description: string;
    latitude: number;
    longitude: number;
    author: string;
    //photo
    createdAt?: Date; 
    updatedAt?: Date;
}
