/*
重写swiper组件
引用组件上传参: 

  版本1.0
   list 数据源
   itemHeight 组件高度
   clientWidth 组件宽度
   hoverClass 组件点中动态
   vertical 垂直滚动
   autoPlay 自动播放
   interval 播放间隔
   speed 播放速度
   dotsClick 圆点是否可点

  版本1.1 新增 衔接播放

  版本2.0
    需求：
        增加 -> 无缝连接滚动
        增加 -> 是否循环loop
        增加 -> 圆点样式
  
  版本3.0
    需求：
        增加 -> CSS3特效
        
*/
const EVENTOPTION = { bubbles: true, composed: true }
let transformStr = ''
let minSpwierAttr = '' // X轴拖动多少可移动
let $computedAttr = 0 //当前宽||高
let translateAttr = 0 //当前偏移距离，X || Y
let $triggerEvent = false //是否允许派发

let springback = 5 // 倍率
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: { //数据源
      type: Array,
      value: []
    },
    itemHeight: { //默认高度
      type: Number,
      value: 180
    },
    hoverClass: { //动态class
      type: String,
      value: 'default-hover-class'
    },
    vertical: { //是否垂直滚动
      type: Boolean,
      value: false
    },
    autoPlay: { //自动播放
      type: Boolean,
      value: false
    },
    interval: { //播放间隔
      type: Number,
      value: 4000
    },
    speed: {  //移动速度
      type: Number,
      value: 700
    },
    clientWidth: {//可播放的视口宽度
      type: Number,
      value: ''
    },
    dotsClick: { //小圆点点击
      type: Boolean,
      value: true
    },
    circular: { //采用衔接
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    styles: '', // 父元素样式
    active: 0, //当前下标
    touches: {}, // 初始化坐标
    transform: '', //拖拉动画
    itemStyle: '', //子元素样式
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _SwierStart(e) {
      !this.data.circular && this.setData({
        transform: computedTranslateX(this.data.vertical)
      })
      clearTimeout(this.timer)
      let touches = this.data.touches
      touches.pageX = e.touches[0].pageX
      touches.pageY = e.touches[0].pageY
      this.setData(touches)
    },
    _SwierMove(e) {
      let touches = this.data.touches
      touches.newX = e.touches[0].pageX - this.data.touches.pageX
      touches.newY = e.touches[0].pageY - this.data.touches.pageY
      this.setData(touches)
      this.setData({
        transform: computedTranslateX(this.data.vertical, touches)
      })
    },
    _SwierEnd(e) {

      //鼠标向左拖动 鼠标向上拖动
      if (this.data.touches.newX < -minSpwierAttr && !this.data.vertical || this.data.touches.newY < -minSpwierAttr && this.data.vertical) {
        let am = this.data.circular ? this.data.touches.newX * springback : -$computedAttr
        this._changeTransformX(am)
      }
      //鼠标向右拖动 鼠标向下拖动
      else if (this.data.touches.newX > minSpwierAttr && !this.data.vertical || this.data.touches.newY > minSpwierAttr && this.data.vertical) {
        let am = this.data.circular ? this.data.touches.newX * springback : $computedAttr
        this._changeTransformX(am)
      }
      !this.data.circular && this._Move()
      this.data.circular && this._circularPlay()
      this.setData({
        touches: {}
      })
    },
    //改变偏移
    _changeTransformX(newVal) {
      translateAttr += newVal
      $triggerEvent = true
    },
    //改变currentIndex  //移动结束
    _changeIndex() {
      let _style = Makequeen(this.data.vertical, this.data.list.length, this.data.circular);
      this.setData(_style)

      $triggerEvent && (this.triggerEvent('MoveEnd', { currentIndex: this.data.active }, EVENTOPTION), $triggerEvent = false)

    },
    //衔接播放
    _circularPlay() {

      if ($triggerEvent) {
        translateAttr = Math.min(minSpwierAttr - 1, Math.max(translateAttr, (-$computedAttr * (this.data.list.length - 1)) - (minSpwierAttr + 1)))
      }
      this._changeIndex()
      this._backFnx()
    },
    //回弹
    _backFnx() {

      let _x = Math.abs(translateAttr % $computedAttr)

      if (translateAttr > 0) {
        translateAttr = 0
      } else if (Math.abs(translateAttr) > Math.abs(-$computedAttr * (this.data.list.length - 1))) {
        translateAttr = -$computedAttr * (this.data.list.length - 1)
      } else {
        translateAttr = _x > minSpwierAttr ? translateAttr + _x - $computedAttr : translateAttr + _x
      }

      setTimeout(() => {
        this._changeIndex()
      }, 500)
    },
    //意外打断
    _SwierCancel() {
      !this.data.circular ? this._Move() : this._backFnx()
    },
    _Move() {
      this._changeIndex()

      if (translateAttr === 0) {
        translateAttr = -$computedAttr * (this.data.list.length - 2)
      } else if (Math.abs(translateAttr) === $computedAttr * (this.data.list.length - 1)) {
        translateAttr = -$computedAttr
      }
      this.data.autoPlay && this._AutoPlay()
    },
    //点击
    _clickItem(e) {
      this.triggerEvent('ItemClick', { activeIndex: e.currentTarget.dataset.index }, EVENTOPTION)
    },
    //小圆点点击
    _dotsClick(event) {
      clearTimeout(this.timer)
      if (!this.data.circular) {
        translateAttr = parseInt(event.currentTarget.dataset.id + 1) * -$computedAttr
        this._Move()
      } else {
        $triggerEvent = true
        translateAttr = parseInt(event.currentTarget.dataset.id) * -$computedAttr
        this._circularPlay()
      }
    },
    //循环播放
    _loop() {
      let _list = this.data.list
      _list.splice(0, 0, _list[_list.length - 1])
      _list.push(_list[1])
      translateAttr = -$computedAttr
      this.setData({
        list: _list,
        transform: computedTranslateX(this.data.vertical)
      })

    },
    //初始化
    _init() {
      //如果循环播放则前后加，并且移动到数组下标为1
      !this.data.circular && this._loop()
      //是否自动播放
      this.data.autoPlay && this._AutoPlay()
      let _style = scale(this.data.vertical, this.data.list.length)
      this.setData(_style)
    },
    //自动播放
    _AutoPlay() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        translateAttr -= $computedAttr
        this._Move()
      }, this.data.interval)
    }
  },
  attached() {
    //计算一系列数值： 宽度，高度，父元素总高度和总宽度
    let am = wx.getSystemInfoSync()

    $computedAttr = !this.data.vertical ? (this.data.clientWidth || am.windowWidth) : this.data.itemHeight
    //宽 || 高

    minSpwierAttr = $computedAttr / 3
    transformStr = `transform-origin:50% 50% 0px;transition:transform ${this.data.speed}ms ease-out 0ms`
    this._init()
  }
})

function scale(vertical, length) {
  if (vertical) {
    return {
      styles: `height:${$computedAttr}px;display:flex;flex-flow:column`,
      itemStyle: `height:${$computedAttr}px`
    }
  }
  return {
    styles: `width:${$computedAttr * length}px;display:flex;height:100%`,
    itemStyle: `width:${$computedAttr}px`,
  }
}

function computedTranslateX(vertical, value) {
  if (vertical) {
    return `transform:translate3d(0,${translateAttr + (value ? value.newY : 0)}px,0);`
  }
  return `transform:translate3d(${translateAttr + (value ? value.newX : 0)}px,0,0);`
}


function Makequeen(vertical, len, circular) {
  return {
    transform: computedTranslateX(vertical) + `${transformStr}`,
    active: !circular ? (translateAttr === 0 ? len - 3 : (Math.abs(translateAttr) - $computedAttr) / $computedAttr % (len - 2)) : (Math.abs(translateAttr)) / $computedAttr

  }
}