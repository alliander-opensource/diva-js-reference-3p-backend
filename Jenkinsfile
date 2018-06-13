def buildClosure = {
  def nodeHome = tool name: 'nodejs-8.6.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
  env.PATH = "${nodeHome}/bin:${env.PATH}"

  stage('Install')
  sh 'yarn'

  stage('Lint')
  sh 'yarn run lint'

  stage('Test')
  sh 'echo TODO!'
}

def buildParameterMap = [:]
buildParameterMap['appName'] = 'diva-js-reference-3p'
buildParameterMap['buildClosure'] = buildClosure
buildParameterMap['deploymentStrategy'] = [
    "*": ["promote:nebm-int"],
    "develop":["nebm-int", "promote:nebm-acc"],
    "master": ["nebm-int", "nebm-acc", "promote:nebm-prd"]
]

buildAndDeployGeneric(buildParameterMap)

// vim: ft=groovy
