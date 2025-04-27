@echo off

call ng build --configuration production
call docker build -t ptsui .
call docker run -d -p 5203:5203 -p 5204:5204 ptsui

pause