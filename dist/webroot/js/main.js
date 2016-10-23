var service = null;

function initService() {
  service = new PunchService();
}

document.addEventListener( "DOMContentLoaded", initService);