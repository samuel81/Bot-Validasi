@echo off
cls
echo This script will keep your server running even after crashing!
title JAVA
:StartServer
start /wait java -jar validatorservice-1.0-shaded.jar -XX:+UseG1GC -Xmx4G -Xms4G -Dsun.rmi.dgc.server.gcInterval=2147483646 -XX:+UnlockExperimentalVMOptions -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M
echo (%time%) Server closed/crashed... restarting!
goto StartServer