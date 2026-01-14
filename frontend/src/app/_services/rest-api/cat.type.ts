export interface Cat {
    catId?: bigint;
    title: string; 
    description: string;
    latitude: number;
    longitude: number;
    authorUsername?: string;
    image?: File;
    createdAt?: Date; 
    updatedAt?: Date;
}
