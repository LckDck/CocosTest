const { ccclass, property } = cc._decorator;

@ccclass
export default class SafeObject extends cc.Component {

    basePos: cc.Vec2;
    gridSize: cc.Vec2;
    middlePoint: cc.Vec2;

    //BASE_WIDTH: number = 1080;
    BASE_WIDTH: number = 1080;
    CONTENT_SIZE: number;


    public updatePosition(parentPos: cc.Vec2) {
        var offsetX: number = this.basePos.x - parentPos.x;
        var offsetY: number = this.basePos.y - parentPos.y;
        var ddist: number = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        this.node.setScale(1 - ddist / 1000);
        this.node.opacity = Math.floor((1 - ddist / 1000) * 255);
        //this.node.opacity = (ddist > 600) ? 0.2 * (600 - ddist) / (650 - 600) + 0.2 : 1.2 - ddist / 600;
        
        // var angle: number = Math.atan2(offsetX, offsetY); // угол, тоб потом определить по этому углу другое расстояние
        // var r: number = 60 * Math.atan(ddist * 9 * 2 / this.BASE_WIDTH); // искажение. это совпадение, что функция тоже атангенс.
        // var newX: number = r * Math.sin(angle);
        // var newY: number = r * Math.cos(angle);
        // this.node.setPositionX(this.node.position.x + newX);
        // this.node.setPositionY(this.node.position.y + newY);



        //this.node.active = this.node.opacity > 0.05 && Math.abs(parentPos.x + this.node.position.x) < this.BASE_WIDTH / 2 + this.node.width / 2;
    }

    //TODO getters setters?
    public gridPostion: cc.Vec2;

    public initPosition(i: number, j: number, countX: number, countY: number, contentSize: number) {
        this.CONTENT_SIZE = contentSize;
        this.gridPostion = new cc.Vec2(i, j);
        this.gridSize = new cc.Vec2(countX, countY);
        this.middlePoint = new cc.Vec2(Math.floor(countX / 2), Math.floor(countY / 2));
        this.basePos = new cc.Vec2(this.calculateX(i), this.calculateY(j));

        this.node.setPosition(this.basePos.x, this.basePos.y);
        this.updatePosition(new cc.Vec2(0, 0));
        //this.initOffset(new cc.Vec2(0, 0));
    }

    initOffset(parentPos: cc.Vec2) {
        var offsetX: number = this.basePos.x + parentPos.x;
        var offsetY: number = this.basePos.y + parentPos.y;
        var ddist: number = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        var angle: number = Math.atan2(offsetX, offsetY); // угол, тоб потом определить по этому углу другое расстояние
        var r: number = 60 * Math.atan(ddist * 9 * 2 / this.BASE_WIDTH); // искажение. это совпадение, что функция тоже атангенс.
        var newX: number = r * Math.sin(angle);
        var newY: number = r * Math.cos(angle);
        this.node.setPositionX(this.node.position.x + newX);
        this.node.setPositionY(this.node.position.y + newY);
    }

    calculateX(index: number): number {
        return (index - this.middlePoint.x) * this.CONTENT_SIZE;
    }

    calculateY(index: number): number {
        return (index - this.middlePoint.y) * this.CONTENT_SIZE;
    }
}