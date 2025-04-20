## Trust the Dev Certificate
dotnet dev-certs https --trust

## Use .NET CLI to Create a Dev Certificate
dotnet dev-certs https -ep ./devcert.pfx -p Farc1lgh#

## go to solution folder
ManagedService/src/

## Build the docker Image
docker build -t ptsapi -f Services/PTS/PTS.API/Dockerfile .

## Run the Docker Container on Port 5101 & 5102
docker run -d -p 5101:5101 -p 5102:5102 ptsapi
