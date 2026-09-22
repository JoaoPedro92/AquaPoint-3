export class UserReview{
    constructor(data = {}){
        this.id = data.id ?? null
        this.name = data.name ?? ''
        this.rating = data.rating ?? 0
        this.comment = data.comment ?? ''
        this.user_id = data.user_id ?? null
        this.createdAt = data.createdAt ?? new Date(Date.now)
    }
}