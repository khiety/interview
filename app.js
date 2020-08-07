const Websocket = require('ws');
const ws = new Websocket('ws://47.101.160.77:3001/freetalk/stream/upload');
var fs = require('fs');

// 编码为 base64
 const meta = base64Encode(JSON.stringify({
   reqId: "",
   itemFlag: 0,
   reqTag: "",
   appId: "lls",
   appVer: 2,
   deviceId: "d4b5d479862872ba9aa0d962bf7fd56dd4ca70d3",
   sDeviceId: "d4b5d479862872ba9aa0d962bf7fd56dd4ca70d3",
   token: "02abdfb0231d0133bdc802a2643653bc",
   quality: -1,
   type: "chatbot",
   qId: ""
 }))

ws.on('open', function open() {
  // 根据文档描述，先发送 Meta 的长度
  ws.send(toBytesInt32(meta.length));
  // 再发送 Meta 内容
  ws.send(meta);
  // 再发送音频, 默认频率是 16000 hz
  var content = fs.readFileSync('./input.wav');
  ws.send(content);
  ws.send('EOS');
});

ws.on('message', function incoming(data) {
  // console.log(data.toString())
  // 根据文档，前面 4 byte 描述长度 但因为 response 是 unary, 并不需要事先知道长度，故跳过。
  const dataStr = data.slice(4).toString()
  console.log(dataStr)
  //const result = JSON.parse(dataStr).result
  //console.log('Result URL:', result)
});


function base64Encode(str) {
  if (/([^\u0000-\u00ff])/.test(str)) throw Error('String must be ASCII');

  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, bits, h1, h2, h3, h4, e = [],
    pad = '',
    c;

  c = str.length % 3; // pad string to length of multiple of 3
  if (c > 0) {
    while (c++ < 3) {
      pad += '=';
      str += '\0';
    }
  }
  // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars

  for (c = 0; c < str.length; c += 3) { // pack three octets into four hexets
    o1 = str.charCodeAt(c);
    o2 = str.charCodeAt(c + 1);
    o3 = str.charCodeAt(c + 2);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hextets to index into code string
    e[c / 3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  }
  str = e.join(''); // use Array.join() for better performance than repeated string appends

  // replace 'A's from padded nulls with '='s
  str = str.slice(0, str.length - pad.length) + pad;

  return str;
}

function toBytesInt32 (num) {
    arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
    view = new DataView(arr);
    view.setUint32(0, num, false); // byteOffset = 0; litteEndian = false
    return arr;
}
