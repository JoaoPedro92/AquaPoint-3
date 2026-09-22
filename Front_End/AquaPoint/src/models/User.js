export class User{
    constructor(data = {}){
        this.id = data.id ?? null
        this.name = data.name ?? ''
        this.email = data.email ?? ''
        this.profilePicture = data.profilePicture ?? ''
        this.passwordHash = data.passwordHash ?? ''
        this.role = data.role ?? 'User'
        this.createdAt = data.createdAt ?? new Date(Date.now)
    }
}