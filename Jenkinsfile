// Jenkinsfile
pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_PREFIX = 'your-dockerhub-username/'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build and Test') {
            parallel {
                stage('API Gateway') {
                    steps {
                        dir('api-gateway') {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    }
                }
                stage('Service 1') {
                    steps {
                        dir('service1') {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    }
                }
                stage('Service 2') {
                    steps {
                        dir('service2') {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE_PREFIX}api-gateway:${env.BUILD_NUMBER}", './api-gateway')
                    docker.build("${DOCKER_IMAGE_PREFIX}service1:${env.BUILD_NUMBER}", './service1')
                    docker.build("${DOCKER_IMAGE_PREFIX}service2:${env.BUILD_NUMBER}", './service2')
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_HUB_CREDENTIALS) {
                        docker.image("${DOCKER_IMAGE_PREFIX}api-gateway:${env.BUILD_NUMBER}").push()
                        docker.image("${DOCKER_IMAGE_PREFIX}service1:${env.BUILD_NUMBER}").push()
                        docker.image("${DOCKER_IMAGE_PREFIX}service2:${env.BUILD_NUMBER}").push()
                        
                        // Optionally push as latest
                        docker.image("${DOCKER_IMAGE_PREFIX}api-gateway:${env.BUILD_NUMBER}").push('latest')
                        docker.image("${DOCKER_IMAGE_PREFIX}service1:${env.BUILD_NUMBER}").push('latest')
                        docker.image("${DOCKER_IMAGE_PREFIX}service2:${env.BUILD_NUMBER}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            slackSend(color: 'good', message: "Build ${env.BUILD_NUMBER} succeeded!")
        }
        failure {
            slackSend(color: 'danger', message: "Build ${env.BUILD_NUMBER} failed!")
        }
    }
}