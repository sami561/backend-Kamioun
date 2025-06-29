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
    options {
        skipStagesAfterUnstable() // Skip remaining stages if one fails
        timeout(time: 30, unit: 'MINUTES') // Set a timeout
    }
    triggers {
        pollSCM('*/5 * * * *') // Check every 5 minutes
    }
    stages {
        stage('Verify Dockerfiles Exist') {
            steps {
                script {
                    // Verify Dockerfiles exist before attempting builds
                    def requiredDirs = [
                        'api-gateway': 'Dockerfile',
                        'oms-express-server': 'Dockerfile',
                        'kamarket-express-server': 'Dockerfile'
                    ]
                    
                    requiredDirs.each { dir, file ->
                        if (!fileExists("${dir}/${file}")) {
                            error("${file} not found in ${dir} directory!")
                        } else {
                            echo "Found ${file} in ${dir}"
                        }
                    }
                }
            }
        }
        
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
                    dir('api-gateway') {
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
                    docker push ${API_GATEWAY_IMAGE}:${env.BUILD_NUMBER} || echo "Failed to push API Gateway"
                    docker push ${OMS_IMAGE}:${env.BUILD_NUMBER} || echo "Failed to push OMS Server"
                    docker push ${KAMARKET_IMAGE}:${env.BUILD_NUMBER} || echo "Failed to push Kamarket Server"
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
    }
    post {
        always {
            echo 'Pipeline completed - cleanup done'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
            // Add notification here (email, Slack, etc.)
        }
    }
}
