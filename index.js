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
    reconnectInterval: 10000,
    // Number of reconnections
    reconnectAttempts: 0,
    // Maximum number of reconnections
    maxReconnectAttempts: 5,
    // pingInterval: 15000,
    // pongInterval: 10000,
    // pingMessage: null,
    debug: false,
  };

  constructor(params) {
    console.log('init sswebsocket');
    this.params = Object.assign({}, this.params, params);
    this.reconnectLock = false;
    this.initWebSocket();
  }

  /**
   * @param {*} param0 
   */
  // static getInstance = (params) => {
  //   if (!this._instance) {
  //     this._instance = new SSWebSocket(params);
  //   }
  //   return this._instance;
  // }

  initWebSocket = () => {
    if ('WebSocket' in window) {
      this.ws = new WebSocket(this.params.uri, this.params.protocols, this.params.options);
    } else if ('MozWebSocket' in window) {
      this.ws = new MozWebSocket(this.params.uri, this.params.protocols, this.params.options);
    } else {
      console.error('WebSocket is not supported by this browser');
      return;
    }

    // when open websocket
    this.ws.onopen = (e) => {
      this.params.reconnectAttempts = 0;
      this.params.timeOutId && clearTimeout(this.params.timeOutId);
      this.onopen();
    };
    this.ws.onmessage = (e) => {
      this.onmessage(e);
    };
    this.ws.onclose = (e) => {
      this.reconnect();
      this.onerror(e);
    };
    this.ws.onerror = (e) => {
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
    if (!this.params.needReconnect || this.reconnectLock) {
      return;
    }
    if (this.params.reconnectAttempts > this.params.maxReconnectAttempts) {
      return;
    }

    this.reconnectLock = true;
    this.params.reconnectAttempts++;
    this.params.timeOutId = setTimeout(() => {
      this.initWebSocket();
      this.reconnectLock = false;
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
   * 
   * @param {*} data 
   */
  send = (data) => {
    if(!this.ws) {
      this.reconnect();
      return;
    }

    if(this.ws.readyState === WebSocket.CLOSED) {
      this.ws.close();
      this.reconnect();
    } else if (this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(data);
      } catch (error) {
        this.params.debug && console.log('Send single message error', error.message);
      }
    }
  }

  /**
   * Send single chat message
   * @param {*} data 
   */
  sendMessage = (data) => {
    this.send(data);
    // if (this.ws && this.ws.readyState === WebSocket.OPEN) {
    //   try {
    //     this.ws.send(data);
    //   } catch (error) {
    //     this.params.debug && console.log('Send single message error', error.message);
    //   }
    // } else {
    //   this.params.debug && console.log('WebSocket error: connect not open to send message');
    // }
  }

  /**
   * Send group chat message
   * @param {*} data 
   */
  sendGroupMessage = (data) => {
    this.send(data);
    // if (this.ws && this.ws.readyState === WebSocket.OPEN) {
    //   try {
    //     this.ws.send(data);
    //   } catch (error) {
    //     this.params.debug && console.log('Send group message error', error.message);
    //   }
    // } else {
    //   this.params.debug && console.log('WebSocket error: connect not open to send message');
    // }
  }

  /**
   * close websocket connection
   */
  close = (code, reason) => {
    // this.params.needReconnect = false;
    this.params.timeOutId && clearTimeout(this.params.timeOutId);
    this.ws && this.ws.close(code, reason);
  }

  destory() {
    this.close();
    this.params.needReconnect = false;
    // this._instance = null;
    this.ws = null;
  }
}

export default SSWebSocket;