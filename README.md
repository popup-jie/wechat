# 微信小程序组件

## swiper组件版本1.0

可接受参数如下：
```javascript
list 数据源
itemHeight 组件高度
clientWidth 组件宽度
hoverClass 组件点中动态
vertical 垂直滚动
autoPlay 自动播放
interval 播放间隔
speed 播放速度
dotsClick 圆点是否可点
circular 是否衔接播放，若值为true时，不能循环播放
```
可接受函数回调

    MoveEnd 滚动结束
    ItemClick 当前滚屏点击

在需要引用组件的json内部

```json
"usingComponents": {
  "swier": "/components/swier/swier"
}
```
    
 对应的wxml文件内部

```html
<swier list="{{list}}" bind:MoveEnd="send" bind:ItemClick="ItemClick">
</swier>
```
