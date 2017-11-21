# 微信小程序组件
#swiper组件版本1.0

可接受参数如下：

    list 数据源
    itemHeight 组件高度
    clientWidth 组件宽度
    hoverClass 组件点中动态
    vertical 垂直滚动
    autoPlay 自动播放
    interval 播放间隔
    speed 播放速度
    dotsClick 圆点是否可点
可接受函数回调

    MoveEnd 滚动结束
    ItemClick 当前滚屏点击

在需要引用组件的json内部

    "usingComponents": {
      "swier": "/components/swier/swier"
    }
    
 组件名字可自定义
 
    <swier list="{{list}}" bind:MoveEnd="send" bind:Click="clickItem" bind:ItemClick="ItemClick">
    </swier>
 
