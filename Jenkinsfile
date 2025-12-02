pipeline {
  agent any
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

    stage('Deploy') {
      steps {
        sh '''docker compose down && docker system prune -af
docker compose up -d'''
      }
    }

  }
  environment {
    IMAGE_NAME = 'fullstack-nginx-node'
  }
}
