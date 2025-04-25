function createImgLayer(imgSrc: string) {
    function evtCall(event: Event) {
        const keyboardEvt = event as KeyboardEvent
        if (keyboardEvt.ctrlKey === true || keyboardEvt.metaKey) {
            event.preventDefault()
        }
    }
    function keyCall(event: KeyboardEvent) {
        if ((event.ctrlKey === true || event.metaKey === true) && (event.key === '=' || event.key === '-')) {
            event.preventDefault()
        }
    }
    window.removeEventListener('keydown', keyCall)
    window.removeEventListener('mousewheel', evtCall)
    window.removeEventListener('DOMMouseScroll', evtCall)

    window.addEventListener('keydown', keyCall, { passive: false })
    window.addEventListener('mousewheel', evtCall, { passive: false })
    //firefox
    window.addEventListener('DOMMouseScroll', evtCall, { passive: false })
    const layerDom = document.createElement('div')
    layerDom.classList.add('customLayer')
    const imgDom = document.createElement('img')
    layerDom.append(imgDom)
    imgDom.classList.add('customLayerImg')
    imgDom.src = imgSrc
    // @ts-ignore
    imgDom.click = function (e: MouseEvent) {
        e.stopPropagation()
        return false
    }

    window.document.body.append(layerDom)
    window.document.documentElement.style.overflow = 'hidden'

    let scale = 1
    imgDom.onwheel = (e: WheelEvent) => {
        // @ts-ignore
        if (e.wheelDelta > 0) {
            scale += 0.05
        } else {
            scale -= 0.05
        }
        if (scale < 0.5) {
            scale = 0.5
        }
        imgDom.style.transform = `scale(${scale})`
    }

    layerDom.onclick = function () {
        window.removeEventListener('keydown', keyCall)
        window.removeEventListener('mousewheel', evtCall)
        window.removeEventListener('DOMMouseScroll', evtCall)
        window.document.documentElement.style.overflow = 'auto'
        layerDom.parentElement?.removeChild(layerDom)
        // touchScale.destory()
    }
}
export function imgClick() {
    /**
   * 这里是为了避免打包时执行后续代码时，
   * 出现 window is not defined 的问题。
   * vitepress应该会对这个组件引入两次，一次是打包的时候，
   * 此时非浏览器环境，因此没有window对象，
   * 如果继续执行后续代码因为没有window对象，所以会导致打包失败。因此需要做这个判断，但没有window对象时，就不执行后续代码。
   * 一次是打包后在浏览器中运行时，此时有window对象，因此可以正确执行后续代码
   */
    if (typeof window === 'undefined') return
    //元素类型，事件类型，执行函数
    window.document.onclick = function (event: MouseEvent) {
        var targetDom = event.target as HTMLElement
        if (targetDom && targetDom.tagName.toLocaleLowerCase() == 'img') {
            const src = targetDom.getAttribute('src')
            if (src) {
                createImgLayer(src)
            }
        }
    }
}