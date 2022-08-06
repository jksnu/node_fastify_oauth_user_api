# node_fastify_oauth_user_api
Related oauth POC
  https://github.com/jksnu/node_oauth_poc
  https://github.com/jksnu/angular_oauth_poc

Profiling in Nodejs
Steps:
1) Create a jmeter test plan
2) Export and save .jmx file at any location
3) Run Profiler in node js application by command node --prof app.js
4) Run your Jmeter test plan by on Jmeter CLI:
  a) Open CMD and go to the folder like jmeter/bin
  b) run command like jmeter -n -t C:\node_fastify_oauth_user_api\jmeter\users_tg.jmx
5) One log file will be created in your project folder
6) Convert the log file to processed file by using command like node --prof-process isolate-0000015353717250-4260-v8.log > processed.txt
7) Analyze the processed.txt file to get the bottle nect in your application or in a particular route.