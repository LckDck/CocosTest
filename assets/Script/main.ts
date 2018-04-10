import SafeObject from "./SafeObject";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    @property(cc.Prefab)
    private safePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    private pointPrefab: cc.Prefab = null;

    COUNT_VERTICAL: number = 9;
    COUNT_HORIZONTAL: number = 9;
    CONTENT_SIZE: number = 180;

    safes: SafeObject[][] = [[], []];

    rootNode: cc.Node;
    visibleSize = cc.director.getVisibleSize();
    scrollView: cc.ScrollView;
    startOffset: cc.Vec2;

    selectedSafe: SafeObject;

    start() {
        var scrollNode = new cc.Node();
        //rect in which you can grab content to drag it
        scrollNode.setContentSize(this.visibleSize);
        this.node.addChild(scrollNode);


        var maskNode = new cc.Node();
        var mask = maskNode.addComponent(cc.Mask);
        mask.type = cc.Mask.Type.RECT;
        maskNode.setContentSize(this.visibleSize);
        scrollNode.addChild(maskNode);


        var sizeX = this.COUNT_HORIZONTAL * this.CONTENT_SIZE;
        var sizeY = this.COUNT_VERTICAL * this.CONTENT_SIZE;

        this.rootNode = new cc.Node();
        for (var i = 0; i < this.COUNT_VERTICAL; i++) {
            this.safes[i] = [];
            for (var j = 0; j < this.COUNT_HORIZONTAL; j++) {
                var prefab = cc.instantiate(this.safePrefab);
                var safeObject = prefab.getComponent(SafeObject);
                safeObject.initPosition(i, j, this.COUNT_HORIZONTAL, this.COUNT_VERTICAL, this.CONTENT_SIZE);
                this.rootNode.addChild(prefab);
                this.safes[i][j] = safeObject;
            }
        }

        //increase content size to be able to scroll to the corners
        this.rootNode.setContentSize(sizeX + this.visibleSize.width - this.CONTENT_SIZE, sizeY + this.visibleSize.height - this.CONTENT_SIZE);
        maskNode.addChild(this.rootNode);


        this.scrollView = scrollNode.addComponent(cc.ScrollView);
        this.scrollView.horizontal = true;
        this.scrollView.vertical = true;
        this.scrollView.content = this.rootNode;
        this.scrollView.brake = 1;
        this.scrollView.inertia = true;
        this.scrollView.bounceDuration = 0.1;

        var scrollViewEventHandler = new cc.Component.EventHandler();
        //This node is the node to which your event handler code component belongs
        scrollViewEventHandler.target = this.node;
        //This is the code file name
        scrollViewEventHandler.component = "main";
        scrollViewEventHandler.handler = "callback";
        this.scrollView.scrollEvents.push(scrollViewEventHandler);

        var anchorNode = new cc.Node();
        anchorNode.addChild(cc.instantiate(this.pointPrefab));
        this.node.addChild(anchorNode);
        this.initSelectedSafe();
    }

    initSelectedSafe(){
        this.selectedSafe = this.selectSafe();
    }

    callback(scrollview: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData) {
        if (eventType == cc.ScrollView.EventType.SCROLLING) {

            var posInContent = this.convertCorrdinate(this.node, this.rootNode);
            posInContent.x -= this.rootNode.width / 2;
            posInContent.y -= this.rootNode.height / 2;

            this.initSelectedSafe();

            for (var i = 0; i < this.COUNT_VERTICAL; i++) {
                for (var j = 0; j < this.COUNT_HORIZONTAL; j++) {
                    this.safes[i][j].updatePosition(posInContent);
                }
            }
        }

        if (eventType == cc.ScrollView.EventType.TOUCH_UP) {
            this.scrollToSelected();
        }

        if(eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
            console.log("BOUNCE_BOTTOM");
        }

        if(eventType == cc.ScrollView.EventType.SCROLL_TO_BOTTOM) {
            console.log("SCROLL_TO_BOTTOM");
        }

        if(eventType == cc.ScrollView.EventType.AUTOSCROLL_ENDED_WITH_THRESHOLD) {
            console.log("AUTOSCROLL_ENDED_WITH_THRESHOLD");
        }

        if(eventType == cc.ScrollView.EventType.SCROLL_ENDED) {
            console.log("SCROLL_ENDED");
        }
    }

    scrollToSelected() {
        var gridPosition = this.selectedSafe.gridPostion;
        var scrollTarget = new cc.Vec2(gridPosition.x * this.CONTENT_SIZE, (this.COUNT_VERTICAL - gridPosition.y - 1) * this.CONTENT_SIZE);
        this.scrollView.scrollToOffset(scrollTarget, 0.5, true);
    }

    selectSafe(): SafeObject {
        var posInContent = this.convertCorrdinate(this.node, this.rootNode);
        var centralNode = this.getNearestSafe(posInContent);
        return centralNode;
    }


    convertCorrdinate(target: cc.Node, to: cc.Node): cc.Vec2 {
        var pointGlob = target.convertToWorldSpace(target.position);
        return to.convertToNodeSpace(pointGlob);
    }

    getNearestSafe(position: cc.Vec2): SafeObject {
        var posX = position.x - this.visibleSize.width / 2 + this.CONTENT_SIZE / 2;
        var posY = position.y - this.visibleSize.height / 2 + this.CONTENT_SIZE / 2;

        var indexX = Math.floor(posX / this.CONTENT_SIZE);
        var indexY = Math.floor(posY / this.CONTENT_SIZE);

        indexX = (indexX >= 0) ? indexX : 0;
        indexY = (indexY >= 0) ? indexY : 0;
        indexX = (indexX < this.COUNT_HORIZONTAL) ? indexX : this.COUNT_HORIZONTAL - 1;
        indexY = (indexY < this.COUNT_VERTICAL) ? indexY : this.COUNT_VERTICAL - 1;

        return this.safes[indexX][indexY];
    }

}