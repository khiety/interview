# Websocket API

``` markdown
PATH          = ws://47.101.160.77:3001/freetalk/stream/upload

REQUEST-BODY  = META-LEN META-ENCODED STREAM %s"EOS"

META-LEN      = 4 bytes
META-ENCODED  = BASE64(Meta)
STREAM        = * bytes // Audio format must be WAV/SPEEX
```

## META in request

```
Meta {
    ReqId        string   `json:"reqId"`
	MessageId    string   `json:"messageId"`
	ItemFlag     ItemType `json:"itemFlag"` // deprecated, default 0
	ReqTag       string   `json:"reqTag"` // deprecated, default ""
	Token        string   `json:"token"`
	DeviceId     string   `json:"deviceId"`
	SDeviceId    string   `json:"sDeviceId"`
	AppId        string   `json:"appId"`
	QuestionType string   `json:"type"` // deprecated, default ""
	Timestamp    int32    `json:"timestamp"`
	Extra        string   `json:"extra"` // deprecated, default ""
	Type         string   `json:"type"`
	Quality      int32    `json:"quality"`
}
```
example
```
{
  "reqId": "9a096b0e4d34621baed6b8706856c59c",
  "messageId": "9a096b0e4d34621baed6b8706856c59c",
  "itemFlag": 0,
  "reqTag": "",
  "token": "02abdfb0231d0133bdc802a2643653bc",
  "deviceId": "d4b5d479862872ba9aa0d962bf7fd56dd4ca70d3",
  "sDeviceId": "d4b5d479862872ba9aa0d962bf7fd56dd4ca70d3",
  "appId": "lls-vr",
  "timestamp": 0,
  "extra": "",
  "quality": -1 // WAV: -1, SPEEX: 8
}

```

## RESP-DATA in response
``` markdown
RESPONSE-BODY = RESP-LEN RESP-DATA
RESP-LEN      = 4 bytes
RESP-DATA     = Response
```

```
Response {
    Code  ErrorCode `json:"status"`
	Msg   string    `json:"msg"`
	ReqId string    `json:"reqId"`
	Key   string    `json:"key"`
	Val   string    `json:"result"`
	Flag  FlagType  `json:"flag"`
}

ErrorCode {
  OK                                        = 0
  ParameterInvilid                          = -1
  ReceiveWSDataFailed                       = -2
  ExceedMaxMessageSize                      = -10
  ClientNeedRetry                           = -98
  AcceptorError                             = -110
}

FlagType {
  FINISHED            = 1
}

```
example
```
{
  "status": 0,
  "msg": "ef3f83f22204640fa5a0c6350996586f",
  "reqId": "ef3f83f22204640fa5a0c6350996586f",
  "key": "ef3f83f22204640fa5a0c6350996586f",
  "result": "https://cdn.vtech.plus/1596956180855421248.mp3",
  "flag": 1  
}
```
