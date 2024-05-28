Install Erlang
https://www.erlang.org/downloads
Install Rabbit MQ
https://www.rabbitmq.com/docs/install-windows



Open Command Prompt as Administrator.
Navigate to the RabbitMQ sbin directory (e.g., C:\Program Files\RabbitMQ Server\rabbitmq_server-x.x.x\sbin).
Run the following command to enable the Management Plugin:

rabbitmq-plugins enable rabbitmq_management
rabbitmq-server start
###if error task manager close the erlang.exe or anything related to rabitmq

