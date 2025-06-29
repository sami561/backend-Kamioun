pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dh_cred')
        REGISTRY_NAMESPACE = "${DOCKERHUB_CREDENTIALS_USR}"
        // Define image names for each service
        API_GATEWAY_IMAGE = "${REGISTRY_NAMESPACE}/api-gateway"
        OMS_IMAGE = "${REGISTRY_NAMESPACE}/oms-express-server"
        KAMARKET_IMAGE = "${REGISTRY_NAMESPACE}/kamarket-express-server"
    }
    triggers {
        pollSCM('*/5 * * * *') // Check every 5 minutes
    }
    stages {
        stage('Checkout') {
            steps {
                echo "Getting source code for all microservices"
                checkout scm
            }
        }
        
        stage('Docker Auth') {
            steps {
                script {
                    sh '''
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                    '''
                }
            }
        }
        
        stage('Build API Gateway') {
            steps {
                script {
                    dir('api-gateway') {  // Assuming API Gateway is in this subdirectory
                        sh """
                        docker build -t ${API_GATEWAY_IMAGE}:${env.BUILD_NUMBER} .
                        """
                    }
                }
            }
        }
        
        stage('Build OMS Express Server') {
            steps {
                script {
                    dir('oms-express-server') {
                        sh """
                        docker build -t ${OMS_IMAGE}:${env.BUILD_NUMBER} .
                        """
                    }
                }
            }
        }
        
        stage('Build Kamarket Express Server') {
            steps {
                script {
                    dir('kamarket-express-server') {
                        sh """
                        docker build -t ${KAMARKET_IMAGE}:${env.BUILD_NUMBER} .
                        """
                    }
                }
            }
        }
        
        stage('Push Images') {
            steps {
                script {
                    sh """
                    docker push ${API_GATEWAY_IMAGE}:${env.BUILD_NUMBER}
                    docker push ${OMS_IMAGE}:${env.BUILD_NUMBER}
                    docker push ${KAMARKET_IMAGE}:${env.BUILD_NUMBER}
                    """
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                script {
                    sh """
                    docker rmi ${API_GATEWAY_IMAGE}:${env.BUILD_NUMBER} || true
                    docker rmi ${OMS_IMAGE}:${env.BUILD_NUMBER} || true
                    docker rmi ${KAMARKET_IMAGE}:${env.BUILD_NUMBER} || true
                    docker logout
                    """
                }
            }
        }
        
        // Optional: Add deployment stage
        stage('Deploy to Staging') {
            when {
                branch 'develop' // Example: only deploy from develop branch
            }
            steps {
                script {
                    // Example commands (adjust for your environment):
                    echo "Deploying to staging environment"
                    // kubectl set image deployment/api-gateway api-gateway=${API_GATEWAY_IMAGE}:${env.BUILD_NUMBER}
                    // kubectl set image deployment/oms oms=${OMS_IMAGE}:${env.BUILD_NUMBER}
                    // kubectl set image deployment/kamarket kamarket=${KAMARKET_IMAGE}:${env.BUILD_NUMBER}
                }
            }
        }
    }
}
