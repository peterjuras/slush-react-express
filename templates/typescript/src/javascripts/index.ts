var xmlHttp : XMLHttpRequest = null;

function getAppName() {
  xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = processRequest;
  xmlHttp.open("GET", '/api', true);
  xmlHttp.send();
}

function processRequest() {
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    document.getElementById('app_name_result').innerHTML = xmlHttp.responseText;
  }
}