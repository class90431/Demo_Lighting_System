# 路燈即時監控

## 畫面

![](./src/img/initPage.png)

## 簡介
#### 此專案設定為物聯網（IoT）路燈監控系統
- 作者測試，可接受數十萬筆資料（視每一筆詳細資料大小浮動）
- 由於是 Demo 版，所以只顯示少數路燈

#### 使用者可用網頁監控路燈的即時狀態、詳細資料
- 路燈狀態：
    - Normal （以綠色顯示）
    - Warning （以黃色顯示）
    - Error （以紅色顯示）

## 操作
#### 滑鼠 hover 在座標上，可顯示路燈詳細資料：
- 路燈 ID
- 名稱
- 地址
- ...

![](./src/img/Hover.png)

#### 滑鼠滾輪可 zoom in / out 地圖

## 核心技術
#### Leaflet.js
- 開源地圖繪製工具
#### RabbitMQ
- 使用 `Docker` 架設，作為 `MQTT` 的 `Broker`
- 如何架設可參考個人另一篇[文章](https://hackmd.io/@class90431/RabbitMQWithDocker)
#### MQTT over WebSockets
- 藉由 `MQTT` 特性（小型傳輸、開銷很小）非常適合應用在 `IoT`，並結合網頁接收即時訊息（`WebSockets`）
#### TypeScript
- 此 Demo 用 TypeScript 撰寫