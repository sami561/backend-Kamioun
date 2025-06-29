pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dh_cred')
        REGISTRY_NAMESPACE = "${DOCKERHUB_CREDENTIALS_USR}"
        // Image names
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
                    def services = [
                        [name: 'API Gateway', path: './api-gateway'],
                        [name: 'OMS Server', path: './oms-express-server'],
                        [name: 'Kamarket Server', path: './Kamarket-express-server']
                    ]
                    
                    services.each { service ->
                        if (!fileExists("${service.path}/Dockerfile")) {
                            error("Dockerfile missing in ${service.path}!")
                        }
                        echo "Verified ${service.path}/Dockerfile exists"
                    }
                }
            }
        }
        
        stage('Checkout') {
            steps {
                checkout scm
                sh 'find . -name ".DS_Store" -delete'
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
                    sh """
                    cd ./api-gateway && docker build -t ${API_GATEWAY_IMAGE}:${env.BUILD_NUMBER} .
                    """
                }
            }
        }
        
        stage('Build OMS Express Server') {
            steps {
                script {
                    sh """
                    cd ./oms-express-server && docker build -t ${OMS_IMAGE}:${env.BUILD_NUMBER} .
                    """
                }
            }
        }
        
        stage('Build Kamarket Express Server') {
            steps {
                script {
                    sh """
                    cd ./kamarket-express-server && docker build -t ${KAMARKET_IMAGE}:${env.BUILD_NUMBER} .
                    """
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
    }
}
