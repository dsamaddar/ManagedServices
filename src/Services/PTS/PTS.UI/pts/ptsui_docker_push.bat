echo Starting docker push process for PTSUI

ng build --configuration production
docker build -t ptsui .
docker run -d -p 5203:5203 -p 5204:5204 ptsui

echo process complete.
pause