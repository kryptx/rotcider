https://tools.ietf.org/html/rfc5531#section-8

       The RPC protocol must provide for the following:

       o  Unique specification of a procedure to be called

       o  Provisions for matching response messages to request messages

       o  Provisions for authenticating the caller to service and vice-versa

       Besides these requirements, features that detect the following are worth supporting because of protocol roll-over errors, implementation bugs, user error, and network administration:

       o  RPC protocol mismatches

       o  Remote program protocol version mismatches

       o  Protocol errors (such as misspecification of a procedure's parameters)

       o  Reasons why remote authentication failed

       o  Any other reasons why the desired procedure was not called
