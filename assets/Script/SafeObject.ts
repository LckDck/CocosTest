const { ccclass, property } = cc._decorator;

@ccclass
export default class SafeObject extends cc.Component {
    private basePos: cc.Vec2;
    private middlePoint: cc.Vec2;
    private contentSize: number;

    private BASE_WIDTH: number = 1000;
    

    public updatePosition(parentPos: cc.Vec2) {
        var offsetX: number = this.basePos.x - parentPos.x;
        var offsetY: number = this.basePos.y - parentPos.y;
        var ddist: number = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

        var coef = 1 - ddist / this.BASE_WIDTH;
        this.node.setScale(coef * coef);
        this.node.opacity = Math.floor(coef * coef * 255);

        // Angle corresponding the current point
        var angle: number = Math.atan2(offsetX, offsetY); 
        
        // Convexity. this is an accident that this function is also atan. 
        // And some magic coeffs to look nice.
        var r: number = 160 * Math.atan(ddist / this.BASE_WIDTH * 7); 
        
        var newX: number = r * Math.sin(angle);
        var newY: number = r * Math.cos(angle);
        this.node.setPositionX(this.basePos.x + newX);
        this.node.setPositionY(this.basePos.y + newY);
    }


    private _gridPostion: cc.Vec2;
    public get gridPosition(): cc.Vec2 {
        return this._gridPostion;
    }

    public initPosition(i: number, j: number, countX: number, countY: number, contentSize: number) {
        this.contentSize = contentSize;
        this._gridPostion = new cc.Vec2(i, j);
        this.middlePoint = new cc.Vec2(Math.floor(countX / 2), Math.floor(countY / 2));
        this.basePos = new cc.Vec2(this.calculateX(i), this.calculateY(j));

        this.node.setPosition(this.basePos.x, this.basePos.y);
        this.updatePosition(new cc.Vec2(0, 0));
    }

    private calculateX(index: number): number {
        return (index - this.middlePoint.x) * this.contentSize;
    }

    private calculateY(index: number): number {
        return (index - this.middlePoint.y) * this.contentSize;
    }
}