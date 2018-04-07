class Player{
    constructor(x,y){
        this.health = 100
        this.x = x
        this.y = y
    }

    injure(damage){
        this.health -= damage
    }
}
