export interface Comment {
    text: string;
    catId: bigint;
    authorUsername?: string;
    createdAt?: Date; 
    updatedAt?: Date;
}