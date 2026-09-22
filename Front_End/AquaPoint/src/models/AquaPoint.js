export class AquaPoint{
    constructor(data = {}){
        this.id = data.id ?? null
        this.point_name = data.point_name ?? ''
        this.image = data.image ?? ''
        this.point_type = data.point_type ?? 0
        this.longitude = data.longitude ?? null
        this.latitude = data.latitude ?? null
        this.state_id = data.state_id ?? 1 // 1: avariado, 2: em funcionamento, 3: por aprovar (admin)
        this.ratingAVG = data.ratingAVG ?? 0.0
        this.ratingsAmount = data.ratingsAmount ?? 0.0
        this.local_id = data.local_id ?? null
        this.point_trust = data.point_trust ?? 1 //1: apagar, 2: Existe mas com pouca certeza, 3: Existe com alguma certeza, 4: Existe 100% certeza
        this.state_name = data.state_name ?? ''
        this.type_name = data.type_name ?? ''
        this.local_name = data.local_name ?? ''
        this.zone_name = data.zone_name ?? ''
        this.trust_name = data.trust_name ?? ''
    }
}