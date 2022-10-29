module.exports = {
    apps: [{
        name: "docker network",
        script: "sudo docker network create net"
    },
    {
        name: "backend",
        script: "sudo docker run --network net --name backend -p 3000:3000 -t meder96/picpro:backend"
    },
    {
        name: "frontend",
        script: "sudo docker run --network net --name frontend -p 4200:80 -t meder96/picpro:frontend"
    }]
}