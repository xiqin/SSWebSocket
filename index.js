"use strict";

class SSWebSocket {
  static _instance = null;
  ws = null;
  timeOutId = null;
  // pingTimeoutId = null;
  // pongTimeoutId = null;

  params = {
    uri: '',
    protocols: null,
    options: null,
    needReconnect: true,
    // Reconnection interval (ms)
    reconnectInterval: 30000,
    // Number of reconnections
    reconnectAttempts: 0,
    // Maximum number of reconnections
    maxReconnectAttempts: 5,
    // pingInterval: 15000,
    // pongInterval: 10000,
    // pingMessage: null,
  };

  constructor(params) {
    this.params = Object.assign({}, this.params, params);
    this.initWebSocket();
  }

  /**
   * @param {*} param0 
   */
  static getInstance = (params) => {
    if (!this._instance) {
      this._instance = new SSWebSocket(params);
    }
    return this._instance;
  }

  initWebSocket = () => {
    this.ws = new WebSocket(this.params.uri, this.params.protocols, this.params.options);
    // when open websocket
    this.ws.onopen = (e) => {
      this.params.timeOutId && clearTimeout(this.params.timeOutId);
      console.log('ws open');
      this.onopen();
    };
    this.ws.onmessage = (e) => {
      console.log('ws onmessage');
      this.onmessage(e);
    };
    this.ws.onclose = (e) => {
      console.log('close ws', e);
      // this.reconnect();
      this.onerror(e);
    };
    this.ws.onerror = (e) => {
      console.log('error ws', e);
      this.reconnect();
      this.onclose(e);
    };
  }

  /**
   * connection callback
   */
  onopen = () => { }

  /**
   * message callback
   * @param {*} e 
   */
  onmessage = (e) => { }

  /**
   * close callback
   * @param {*} e 
   */
  onclose = (e) => { }

  /**
   * error callback
   * @param {*} e 
   */
  onerror = (e) => { }

  /**
   * reconnect
   */
  reconnect = () => {
    if (!this.params.needReconnect || this.params.reconnectAttempts > this.params.maxReconnectAttempts) {
      return;
    }

    this.params.timeOutId = setTimeout(() => {
      this.initWebSocket();
    }, this.params.reconnectInterval);
  }

  // heartCheck = () => {
  //   if (!this.params.needReconnect) {
  //     return;
  //   }

  //   this.params.pingTimeoutId && clearTimeout(this.params.pingTimeoutId);

  //   this.params.pingTimeoutId = setInterval(() => {
  //     this.ws.send(this.pingMessage);
  //   }, this.params.pingInterval);

  // }

  /**
   * 在线状态变化回调
   * @param {*} e 
   */
  statusChange = (e) => { }

  /**
   * Send single chat message
   * @param {*} data 
   */
  sendMessage = (data) => {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(data);
      } catch (error) {
        console.error('Send single message error', error.message);
      }
    } else {
      console.error('WebSocket error: connect not open to send message');
    }
  }

  /**
   * Send group chat message
   * @param {*} data 
   */
  sendGroupMessage = (data) => {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(data);
      } catch (error) {
        console.error('Send group message error', error.message);
      }
    } else {
      console.log('WebSocket error: connect not open to send message');
    }
  }

  /**
   * close websocket connection
   */
  close = (code, reason) => {
    this.params.needReconnect = false;
    this.params.timeOutId && clearTimeout(this.params.timeOutId);
    this.ws.close(code, reason);
  }

  destory() {
    this.close();
    this._instance = null;
    this.ws = null;
  }
}

export default SSWebSocket;