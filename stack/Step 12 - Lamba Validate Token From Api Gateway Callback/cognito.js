     const AWS = require('aws-sdk');



exports.handler = function(event, context, callback) {

  const response = {
    statusCode: 200,            // a valid HTTP status code
    headers: { 
        "code": event["queryStringParameters"]['code'],
    },
    body: JSON.stringify({event:event,context:context,AWS:Object.keys(AWS.CognitoIdentity)}),// a JSON string.
    isBase64Encoded:  false  // for binary support
  };
  
  
     var data = { UserPoolId : 'us-west-2_cL2pPAklD',
        ClientId : '7ppvffvjnamj1tke4jff8hi8vb'
    };
    var authUSer = new AWS.CognitoIdentityServiceProvider['7ppvffvjnamj1tke4jff8hi8vb'].LastAuthUser;
    // var cognitoUser = userPool.getCurrentUser();

    // if (cognitoUser != null) {
    //     cognitoUser.getSession(function(err, session) {
    //         if (err) {
    //             alert(err);
    //             return;
    //         }
    //         console.log('session validity: ' + session.isValid());
    //         response.session = session.isValid();
             callback(null,response);
        // });
    // }
  
  console.log('context',context)
 
  return response;

}

