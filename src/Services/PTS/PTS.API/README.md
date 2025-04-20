
## go to solution folder
ManagedService/src/

## Build the docker Image
docker build -t ptsapi -f Services/PTS/PTS.API/Dockerfile .

## Run the Docker Container on Port 5101 & 5102
docker run -d -p 5101:8080 -p 5102:8081 ptsapi
