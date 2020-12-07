# SSWebSocket

On the basis of websocket, add functions as:
1. disconnect auto reconnection

## Getting started

`$ npm install sswebsocket --save`

## Usage

```javascript
import SSWebSocket from 'sswebsocket';

const ws = new SSWebSocket({
	uri: 'ws://your ws host',
	protocols: null,
	options: null,
	needReconnect: false,
	reconnectInterval: 15000,
	maxReconnectAttempts: 10,
	debug: false,
});

// 建立连接
ws.onopen = () => {
	// 发送数据
	ws.sendMessage("send message");
}

// 接收数据
ws.onmessage = (e) => {}

// 错误信息回调
ws.onerror = (e) => {}

// 关闭连接
ws.close = () => {}

// 关闭连接回调
wx.onclose = () => {}
```

## Props

| Prop  | Type  | Required  | Default  | Description  |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| uri  | string  | Yes  |   | websocket host  |
| protocols | string or string[] or null  |  No |  | Specify acceptable sub protocols |
| options | object or null |  No |  |   |
| needReconnect  | boolean  |  No | true |  Automatic reconnection when disconnected |
| reconnectInterval  | number  | No  | 30000  | Reconnection interval（unit：ms）|
| maxReconnectAttempts  | number  | No  | 5  | Maximum number of reconnections |
| debuf  | boolean  | No  | false  | It will print debugging information |
