local name = ngx.var.arg_name or "Anonymous"
ngx.say("Hello, ", name, "!")