
# back-manage
后台管理，node+express+mysql+sqlize

## jwt原理
JWT 的数据结构
它是一个很长的字符串，中间用点（.）分隔成三个部分。注意，JWT 内部是没有换行的，这里只是为了便于展示，将它写成了几行。

JWT 的三个部分依次如下。
Header（头部）
Payload（负载）
Signature（签名）
Header 部分是一个 JSON 对象，描述 JWT 的元数据，通常是下面的样子。
{
  "alg": "HS256",
  "typ": "JWT"
}
Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据
注意，JWT 默认是不加密的，任何人都可以读到，所以不要把秘密信息放在这个部分。
Signature 部分是对前两部分的签名，防止数据篡改。

特点：
JWT 默认是不加密，但也是可以加密的
JWT 不加密的情况下，不能将秘密数据写入 JWT。
JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。
JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。
JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。
为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。

## jwt开发
1.安装依赖
npm install jsonwebtoken express-jwt -S
jsonwebtoken --- 用户签名和验证
express-jwt --- 对jsonwebtoken的封装，能够更好的搭配express

2.生成token
//jwt.sign(payload, secretOrPrivateKey, [options, callback])
var jwt = require('jsonwebtoken');

// 生成token
function generateToken() {
  return jwt.sign({
            foo: 'bar',
          }, 'secretOrPrivateKey', {
            expiresIn: '1d' // 1天 https://github.com/zeit/ms
          });
}

3.返回前端
res.json({
    status: true,
    data: {
      token: generateToken()
    },
    message: '登录成功！'
  });

3.登录验证
var jwt = require('jsonwebtoken');

router.use(function(req, res, next) {
  if(req.headers.hasOwnProperty('token')) {
    jwt.verify(req.headers.token, 'hahaha', function(err, decoded) {
      if(err) {
        res.json({
          status: false,
          message: 'token不存在或已过期'
        });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

4.$.ajax({
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token') // "Bearer "这个也是约定的，必须是这样的格式
  },
  // ...
});

## express-jwt
1.router.post('/xxx', expressJWT({secret: 'secretOrPrivateKey'}), function (req, res, next) {
  // ...
});

