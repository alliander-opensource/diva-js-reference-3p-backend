def buildClosure = {
  def nodeHome = tool name: 'nodejs-8.6.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
  env.PATH = "${nodeHome}/bin:${env.PATH}"

  stage('Install')
  sh 'yarn'

  stage('Lint')
  sh 'yarn run lint'

  stage('Unit tests')
  // sh 'yarn run test'
}

def buildParameterMap = [:]
buildParameterMap['appName'] = 'diva-fieldlab'
buildParameterMap['buildClosure'] = buildClosure
buildParameterMap['deploymentStrategy'] = [
    "*": ["promote:nebm-dev"],
]

buildAndDeployGeneric(buildParameterMap)

// vim: ft=groovy
