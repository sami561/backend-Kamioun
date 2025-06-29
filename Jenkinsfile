pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dh_cred')
        IMAGE_NAME = "${env.DOCKER_HUB_CREDENTIALS_USR}/back-pfe"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    // Install Node.js if not present
                    if (isUnix()) {
                        sh '''
                            curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
                            sudo apt-get install -y nodejs
                            npm install -g npm@latest
                        '''
                    } else {
                        bat 'choco install nodejs -y'
                    }
                }
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
                stage('Kamarket Service') {
                    steps {
                        dir('Kamarket-express-server') {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    }
                }
                stage('OMS Service') {
                    steps {
                        dir('oms-express-server') {
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
                    docker.build("${IMAGE_NAME}-api-gateway:${env.BUILD_NUMBER}", './api-gateway')
                    docker.build("${IMAGE_NAME}-kamarket-service:${env.BUILD_NUMBER}", './Kamarket-express-server')
                    docker.build("${IMAGE_NAME}-oms-service:${env.BUILD_NUMBER}", './oms-express-server')
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'DOCKER_HUB_CREDENTIALS') {
                        docker.image("${IMAGE_NAME}-api-gateway:${env.BUILD_NUMBER}").push()
                        docker.image("${IMAGE_NAME}-kamarket-service:${env.BUILD_NUMBER}").push()
                        docker.image("${IMAGE_NAME}-oms-service:${env.BUILD_NUMBER}").push()
                        
                        // Push as latest tags
                        docker.image("${IMAGE_NAME}-api-gateway:${env.BUILD_NUMBER}").push('latest')
                        docker.image("${IMAGE_NAME}-kamarket-service:${env.BUILD_NUMBER}").push('latest')
                        docker.image("${IMAGE_NAME}-oms-service:${env.BUILD_NUMBER}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy with Docker Compose') {
            steps {
                script {
                    // Stop and remove existing containers
                    sh 'docker-compose down || true'
                    
                    // Start new containers
                    sh 'docker-compose up -d'
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo "Build ${env.BUILD_NUMBER} succeeded!"
            // Uncomment if you have Slack plugin installed:
            // slackSend(color: 'good', message: "Build ${env.BUILD_NUMBER} succeeded!")
        }
        failure {
            echo "Build ${env.BUILD_NUMBER} failed!"
            // Uncomment if you have Slack plugin installed:
            // slackSend(color: 'danger', message: "Build ${env.BUILD_NUMBER} failed!")
        }
    }
}
