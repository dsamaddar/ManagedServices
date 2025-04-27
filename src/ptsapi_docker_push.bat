echo Starting docker push process for PTSAPI

docker build -t ptsapi -f Services/PTS/PTS.API/Dockerfile .
docker run -d -p 5201:5201 -p 5202:5202 ptsapi

echo process complete.
pause