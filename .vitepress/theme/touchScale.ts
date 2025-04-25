interface Store {
    scale: number
    originScale?: number

    moveable: boolean
    pageX?: number
    pageY?: number

    pageX2?: number
    pageY2?: number
}
interface Point {
    x: number
    y: number
}

export class TouchScale {
    store: Store = {
        scale: 1,
        moveable: false,
    }
    touchScaleDom: HTMLElement

    constructor(touchScaleDom: HTMLElement) {
        console.log('TouchScale', touchScaleDom)
        this.touchScaleDom = touchScaleDom
        this.destory()
        this.init()
    }

    destory() {
        this.touchScaleDom.removeEventListener('touchstart', this.touchstart)
        document.removeEventListener('touchend', this.touchend)
        document.removeEventListener('touchcancel', this.touchend)
    }

    private init() {
        console.log('init')
        this.touchScaleDom.addEventListener('touchstart', this.touchstart.bind(this))
        document.addEventListener('touchend', this.touchend.bind(this), { passive: true })
        document.addEventListener('touchcancel', this.touchend.bind(this), { passive: true })
    }

    private touchstart(event: TouchEvent) {
        console.log('touchstart')
        const touches = event.touches
        const events = touches[0]
        const events2 = touches[1]
        event.preventDefault()

        // 第一个触摸点的坐标
        console.log('this.store', this.store)
        this.store.pageX = events.pageX
        this.store.pageY = events.pageY

        this.store.moveable = true

        if (events2) {
            this.store.pageX2 = events2.pageX
            this.store.pageY2 = events2.pageY
        }

        this.store.originScale = this.store.scale || 1
    }
    // 获取坐标之间的举例
    private getDistance(start: Point, stop: Point) {
        return Math.hypot(stop.x - start.x, stop.y - start.y)
    }
    private touchmove(event: TouchEvent, scaleDom: HTMLElement) {
        if (!this.store.moveable) {
            return
        }

        event.preventDefault()

        var touches = event.touches
        var events = touches[0]
        var events2 = touches[1]
        // 双指移动
        if (events2) {
            // 第2个指头坐标在touchmove时候获取
            if (!this.store.pageX2) {
                this.store.pageX2 = events2.pageX
            }
            if (!this.store.pageY2) {
                this.store.pageY2 = events2.pageY
            }

            // 双指缩放比例计算
            var zoom =
        this.getDistance(
            {
                x: events.pageX,
                y: events.pageY,
            },
            {
                x: events2.pageX,
                y: events2.pageY,
            }
            ) /
        this.getDistance(
            {
                x: this.store.pageX!,
                y: this.store.pageY!,
            },
            {
                x: this.store.pageX2,
                y: this.store.pageY2,
            }
            )
            // 应用在元素上的缩放比例
            let newScale = this.store.originScale! * zoom
            // 最大缩放比例限制
            if (newScale > 3) {
                newScale = 3
            }
            // 记住使用的缩放值
            this.store.scale = newScale
            // 给指定元素应用缩放效果
            scaleDom.style.transform = 'scale(' + newScale + ')'
        }
    }

    private touchend() {
        this.store.moveable = false

        delete this.store.pageX2
        delete this.store.pageY2
    }

    private touchcancel() {
        this.store.moveable = false

        delete this.store.pageX2
        delete this.store.pageY2
    }
}