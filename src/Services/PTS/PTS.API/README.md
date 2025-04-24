## Trust the Dev Certificate
dotnet dev-certs https --trust

## Use .NET CLI to Create a Dev Certificate (for each machine this certificate needs to be updated)
dotnet dev-certs https -ep ./devcert.pfx -p Farc1lgh#

## go to solution folder
ManagedService/src/

## Build the docker Image
docker build -t ptsapi -f Services/PTS/PTS.API/Dockerfile .

## Run the Docker Container on Port 5101 & 5102
docker run -d -p 5201:5201 -p 5202:5202 ptsapi


## Download Docker Images
navigate to any pc location

docker save -o ptsapi.tar ptsapi:latest
docker save -o ptsui.tar ptsui:latest

## Load docker file (On the Same or Another Machine):
docker load -i ptsapi.tar
docker load -i ptsui.tar


