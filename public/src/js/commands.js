const socket = io();
var isRunning = [false, false, false, false, false];

function scriptRunOrStop(id) {
  const runScriptBtn = document.getElementById('run_script_btn_' + id);
    
  if(isRunning[id]) {
    // se lo script è in esecuzione lo stoppo
    socket.emit('stop_script', id);
    isRunning[id] = false;
    runScriptBtn.textContent = 'Run';
    runScriptBtn.classList.remove('bg-red-100', 'hover:bg-red-200', 'dark:bg-red-700', 'dark:hover:bg-red-600', 'text-red-600')
    runScriptBtn.classList.add('bg-blue-100', 'hover:bg-blue-200', 'dark:bg-blue-900', 'dark:hover:bg-blue-700', 'text-blue-600')
  } else {
    // se lo script non è in esecuzione lo eseguo
    socket.emit('run_script', id);
    isRunning[id] = true;
    runScriptBtn.textContent = 'Stop';
    runScriptBtn.classList.remove('bg-blue-100', 'hover:bg-blue-200', 'dark:bg-blue-900', 'dark:hover:bg-blue-700', 'text-blue-600')
    runScriptBtn.classList.add('bg-red-100', 'hover:bg-red-200', 'dark:bg-red-700', 'dark:hover:bg-red-600', 'text-red-600')
  }
}

// se ricevo il segnale che lo script è in esecuzione aggiorno data e status
socket.on('is_running', (id) => {
  console.log(id + ' is running');
  document.getElementById('last_check_' + id).textContent = new Date().toLocaleString();
  document.getElementById('status_circle_' + id).classList.remove('bg-red-500');
  document.getElementById('status_circle_' + id).classList.add('bg-green-500');
});

// se ricevo il segnale che lo script non è in esecuzione aggiorno data e status
socket.on('is_not_running', (id) => {
  console.log(id + ' is not running');
  document.getElementById('last_check_' + id).textContent = new Date().toLocaleString();
  document.getElementById('status_circle_' + id).classList.remove('bg-green-500');
  document.getElementById('status_circle_' + id).classList.add('bg-red-500');
});