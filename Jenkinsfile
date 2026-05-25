pipeline {
    agent any

    environment {
        TODO_BACKEND_PORT  = '3001'
        TODO_FRONTEND_PORT = '5174'
        MONGODB_URI        = 'mongodb://127.0.0.1:27017/todo_mern'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '==> Pulling latest code from repository'
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo '==> Installing todo-backend npm dependencies'
                dir('todo-backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Start Todo Backend') {
            steps {
                echo '==> Starting todo-backend on port 3001'
                dir('todo-backend') {
                    sh '''
                        cp .env.example .env
                        PORT=${TODO_BACKEND_PORT} MONGODB_URI=${MONGODB_URI} nohup node src/server.js > /tmp/todo-backend.log 2>&1 &
                        echo $! > /tmp/todo-backend.pid
                        echo "Backend PID: $(cat /tmp/todo-backend.pid)"
                        sleep 5
                        echo "--- Backend startup log ---"
                        cat /tmp/todo-backend.log
                    '''
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo '==> Installing todo-frontend npm dependencies'
                dir('todo-frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Start Todo Frontend') {
            steps {
                echo '==> Starting todo-frontend on port 5174'
                dir('todo-frontend') {
                    sh '''
                        nohup npm run dev > /tmp/todo-frontend.log 2>&1 &
                        echo $! > /tmp/todo-frontend.pid
                        echo "Frontend PID: $(cat /tmp/todo-frontend.pid)"
                        sleep 10
                        echo "--- Frontend startup log ---"
                        cat /tmp/todo-frontend.log
                    '''
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo '==> Running Selenium UI tests (TodoTest)'
                dir('tests/todo-selenium') {
                    sh 'mvn test -DbaseUrl=http://localhost:${TODO_FRONTEND_PORT} -Dheadless=true'
                }
            }
            post {
                always {
                    echo '--- TestNG results ---'
                    junit 'tests/todo-selenium/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Run Cypress Tests') {
            steps {
                echo '==> Running Cypress UI tests'
                dir('tests/todo-cypress') {
                    sh 'npm install'
                    sh 'npx cypress run --headless'
                }
            }
        }

        stage('Run JMeter Tests') {
            steps {
                echo '==> Running JMeter API tests (POST /todos, GET /todos, DELETE /todos)'
                sh '''
                    if command -v jmeter &> /dev/null; then
                        jmeter -n \
                            -t tests/jmeter/todo_api_tests.jmx \
                            -l tests/jmeter/results.jtl \
                            -e -o tests/jmeter/report
                        echo "--- JMeter summary ---"
                        cat tests/jmeter/results.jtl
                    else
                        echo "WARNING: jmeter not found in PATH — skipping JMeter stage"
                        echo "Install JMeter and ensure it is on PATH to enable this stage"
                    fi
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'tests/jmeter/results.jtl', allowEmptyArchive: true
                }
            }
        }
    }

    post {
        always {
            echo '==> Shutting down background services'
            sh '''
                if [ -f /tmp/todo-backend.pid ]; then
                    kill $(cat /tmp/todo-backend.pid) || true
                    echo "Backend stopped"
                fi
                if [ -f /tmp/todo-frontend.pid ]; then
                    kill $(cat /tmp/todo-frontend.pid) || true
                    echo "Frontend stopped"
                fi
            '''
            echo '==> Pipeline finished'
        }
        success {
            echo 'All tests passed successfully!'
        }
        failure {
            echo 'One or more stages failed. Check logs above.'
        }
    }
}
