pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dh_cred')
        REGISTRY_NAMESPACE = "${DOCKERHUB_CREDENTIALS_USR}"
        // Image names matching your directory structure
        API_GATEWAY_IMAGE = "${REGISTRY_NAMESPACE}/api-gateway"
        OMS_IMAGE = "${REGISTRY_NAMESPACE}/oms-express-server"
        KAMARKET_IMAGE = "${REGISTRY_NAMESPACE}/kamarket-express-server"
    }
    options {
        skipStagesAfterUnstable()
        timeout(time: 30, unit: 'MINUTES')
    }
    triggers {
        pollSCM('*/5 * * * *')
    }
    stages {
        stage('Verify Structure') {
            steps {
                script {
                    // Verify all required directories exist
                    def services = [
                        'api-gateway',
                        'oms-express-server', 
                        'kamarket-express-server'
                    ]
                    
                    services.each { service ->
                        if (!fileExists("${service}/Dockerfile")) {
                            error("Dockerfile missing in ${service} directory!")
                        } else {
                            echo "Verified ${service}/Dockerfile exists"
                        }
                    }
                    
                    if (!fileExists("docker-compose.yml")) {
                        echo "Warning: docker-compose.yml not found"
                    }
                }
            }
        }
        
        stage('Checkout & Prep') {
            steps {
                checkout scm
                sh 'find . -name ".DS_Store" -delete' // Clean Mac metadata files
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
        
        stage('Parallel Builds') {
            failFast true // Fail immediately if any parallel stage fails
            parallel {
                stage('API Gateway') {
                    steps {
                        dir('api-gateway') {
                            sh """
                            docker build -t ${API_GATEWAY_IMAGE}:${env.BUILD_NUMBER} .
                            """
                        }
                    }
                }
                stage('OMS Server') {
                    steps {
                        dir('oms-express-server') {
                            sh """
                            docker build -t ${OMS_IMAGE}:${env.BUILD_NUMBER} .
                            """
                        }
                    }
                }
                stage('Kamarket Server') {
                    steps {
                        dir('kamarket-express-server') {
                            sh """
                            docker build -t ${KAMARKET_IMAGE}:${env.BUILD_NUMBER} .
                            """
                        }
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
        
        stage('Compose Build') {
            when {
                expression { fileExists('docker-compose.yml') }
            }
            steps {
                sh 'docker-compose build'
            }
        }
    }
    post {
        always {
            script {
                sh """
                docker rmi ${API_GATEWAY_IMAGE}:${env.BUILD_NUMBER} || true
                docker rmi ${OMS_IMAGE}:${env.BUILD_NUMBER} || true
                docker rmi ${KAMARKET_IMAGE}:${env.BUILD_NUMBER} || true
                docker logout
                """
            }
        }
        success {
            echo 'All microservices built and pushed successfully!'
            // slackSend(color: 'good', message: "Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
        failure {
            echo 'Pipeline failed! Check the logs.'
            // slackSend(color: 'danger', message: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
    }
}
