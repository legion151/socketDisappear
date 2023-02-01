import { Component, OnInit } from '@angular/core'

const SEND_DELAY_MILLIS = 1000;
const WS_SERVER_URL = "wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self";

function sendViaGlobSocket_1<K extends keyof WebSocketEventMap>(this: WebSocket, ev: WebSocketEventMap[K]){
  console.log("receive", ev);
  setTimeout(()=>{
    console.log("sending");
    global.sock1.send("Sending through globSock 1");
  }, SEND_DELAY_MILLIS);
}
function sendViaGlobSocket_2<K extends keyof WebSocketEventMap>(this: WebSocket, ev: WebSocketEventMap[K]){
  console.log("receive", ev);
  setTimeout(()=>{
    console.log("sending");
    global.sock1.send("Sending through globSock 2");
  }, SEND_DELAY_MILLIS);
}

function sendViaThisSocket<K extends keyof WebSocketEventMap>(this: WebSocket, ev: WebSocketEventMap[K]){
  console.log("receive", ev);
  const that = this;
  setTimeout(()=>{
    console.log("sending");
    that.send("Sending through this sock");
  }, SEND_DELAY_MILLIS);
}

@Component({
  selector: 'view',
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

  testGlobalSocket(){
    global.sock1 = this.openConnection(WS_SERVER_URL, "A", sendViaGlobSocket_1);
    global.sock2 = this.openConnection(WS_SERVER_URL, "B", sendViaGlobSocket_2);
  }

  testThisSocket(){
    this.openConnection(WS_SERVER_URL, "A", sendViaThisSocket);
    this.openConnection(WS_SERVER_URL, "B", sendViaThisSocket);
  }

  private openConnection(url: string, peer: string, cb : any) {

    console.log("opening connection as " + peer);
    const createdSocket = new WebSocket(url);
    createdSocket.addEventListener("open", (event) => {
      console.log(peer + " WebSocket->open");
      console.log(peer + " event: ", event);

      setTimeout(() => {
        createdSocket.send("initial message");
      }, SEND_DELAY_MILLIS);

    });

    createdSocket.addEventListener("message", cb);

    createdSocket.addEventListener("close", (event) => {
      console.log(peer + " WebSocket->onclose");
      console.log(peer + " event: ", event);

    });

    createdSocket.addEventListener("error", (event) => {
      console.log(peer + " WebSocket->error");
      console.log(peer + " event: ", event);

    });

    return createdSocket;
  }
}
