pipeline {
    agent any

    environment {
        IMAGE_NAME = "fullstack-nginx-node"
    }
    stages {
        stage('DockerPublish') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerlogin') {
                        def dockerImage = docker.build("graves869/${IMAGE_NAME}:latest", "./")
                        dockerImage.push()
                    }
                }
            }
        }
    }
}
