const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var Base64 = require('js-base64').Base64;
var exports = module.exports = {};
const dotenv = require('dotenv').config({path: '../../../../.env'});
const stringify = require('json-stringify-safe')

// If modifying these scopes, delete credentials.json.
var SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
];

const TOKEN_PATH = '../NestJS/src/gmail_api/gmail_credentials.json';

exports.sendMessageH = async function(data, recipient){
    return await authorize(sendMessage, data, recipient);
}

exports.getAllMessages = function(){
  console.log("In GMAIL API")
  authorize(listLabels);
}

async function authorize(callback, data, recipient) {
  // const {client_secret, client_id, redirect_uris} = credentials.installed;
  const client_id = process.env['client_id'];
  const client_secret = process.env['client_secret'];
  const redirect_uris = process.env['redirect_uris'];
  let token = {};
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris);
  try {
    console.log("In getting new token");
    token = fs.readFileSync(TOKEN_PATH);
  } catch (err) {
    return getNewToken(oAuth2Client, callback, data, recipient);
  }
  oAuth2Client.setCredentials(JSON.parse(token));

  const a = await callback(oAuth2Client, data, recipient)
  return a
}


function getNewToken(oAuth2Client, callback, data, recipient) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      try {
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to', TOKEN_PATH);
      } catch (err) {
        console.error(err);
      }
      callback(oAuth2Client, data, recipient);
    });
  });
}

function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});

  gmail.users.messages.list({
    userId: 'me',
    messageId: 'INBOX'
  },function (err,result){
    if(err) console.log(err)
    console.log(result.data)
  })

//   gmail.users.messages.get({
//     userId: 'me',
//     id: '164221d5cd9d9269',
//     format: 'full'
//   },function (err,result){
//     if(err) console.log(err)
//     //Body of message
//     if(typeof result.data.payload['parts'] === 'undefined') {
//       console.log(Base64.decode(result.data.payload.body.data))
//     }
//     else {
//       if(typeof result.data.payload.parts[0].body['data'] === 'undefined')
//       {
//         console.log('body is empty')
//         console.log(result.data.payload.parts[1].body.attachmentId)
//       }else{
//         console.log('body not empty')
//         console.log(result.data.payload);
//       }
//     }
//   })
// )

}

async function sendMessage(auth, data, recipient) {
    const gmail = google.gmail({version: 'v1', auth})
    var raw = makeBody(data, recipient);

    const sentMessage = await gmail.users.messages.send({
        auth: auth,
        userId: 'me',
        resource: {
            raw: raw
        }
    })
    console.log("Yes")
    return sentMessage.status

}

function makeBody(data, recipient) {
  var boundary = "__myapp__";
  var nl = "\n";
  let filename = data.attachments[0].name;
  let type = recipient.type + ": " + recipient.email
  let structure = []
  data.attachments.forEach((attachment) => {
    structure.push(
      "--" + boundary,
      "Content-Type: Application/octet-stream; name=" + attachment.name,
      "Content-Disposition: attachment; filename=" + attachment.name,
      "Content-Transfer-Encoding: base64" + nl,
      attachment.data,
      "--" + boundary,)
  });

  const body = data.content.replace(/NAME/g, recipient.name)
  var str = [
          "MIME-Version: 1.0",
          "Content-Transfer-Encoding: 7bit",
          type,
          "from: shisyr2106@gmail.com",
          "subject: " + data.subject,
          "Content-Type: multipart/alternate; boundary=" + boundary + nl,
          "--" + boundary,
          "Content-Type: text/plain; charset=UTF-8",
          "Content-Transfer-Encoding: 7bit" + nl,
          body + nl,
          "--" + boundary,
          structure.join('\n')
  ].join('\n')
  var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
  return encodedMail;
}


//function to send message to multiple recipients at once
function defineTypeOfRecipients(data) {

  let i;
  let to = [], cc = [], bcc = [];
  for(i = 0; i < data.recipients.length; i++){
    switch(data.recipients[i].type){
      case "to":
        to.push(data.recipients[i].email)
        break;
      case "cc":
        cc.push(data.recipients[i].email)
        break;
      case "bcc":
        bcc.push(data.recipients[i].email)
        break;
      default:
        break;
    }
  }
  //put arrays' content into strings
  let listTos = to.join(', '), listBCCs = bcc.join(', '), listCCs = cc.join(', ');
  return [listTos, listCCs, listBCCs];
}


function getAttachments(userId, message, callback) {
  var parts = message.payload.parts;
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (part.filename && part.filename.length > 0) {
      var attachId = part.body.attachmentId;
      var request = gapi.client.gmail.users.messages.attachments.get({
        'id': attachId,
        'messageId': message.id,
        'userId': userId
      });
      request.execute(function(attachment) {
        callback(part.filename, part.mimeType, attachment);
      });
    }
  }
}
