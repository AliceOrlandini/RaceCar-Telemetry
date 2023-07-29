const socket = io()

let rpm;
let pps;
let forwald_vel;
let brake;
let isRecording = false;
let isLoadingSpinRendered = false;
const record_btn = document.getElementById('record_btn');
const commands_div = document.getElementById('commands_div');

window.addEventListener('load', function() {
  rpm         = new RPM();
  pps         = new TPS();
  forwald_vel = new FORWARD_VEL();
  brake       = new BRAKE();
})

record_btn.onclick = () => {
  if(isRecording) {
    showStopRecordingDialog()
  } else {
    showStartRecordingDialog()
  }
}

let interface_elements = [
  document.getElementById('front_rpm_left_label'),                    // 0
  document.getElementById('front_rpm_right_label'),                   // 1
  document.getElementById('front_brake_pressure_label'),              // 2
  document.getElementById('rear_rpm_left_label'),                     // 3
  document.getElementById('rear_rpm_right_label'),                    // 4
  document.getElementById('rear_brake_pressure_label'),               // 5
  document.getElementById('steering_angle_label'),                    // 6
  document.getElementById(''),                                        // 7
  document.getElementById('traction_circle'),                         // 8

  document.getElementById('inverter1_desired_torque_label'),          // 9
  document.getElementById('inverter1_desired_rpm_label'),             // 10
  document.getElementById('inverter1_temp_label'),                    // 11
  document.getElementById('inverter1_engine_temp_label'),             // 12
  document.getElementById('inverter1_direct_axis_current_label'),     // 13
  document.getElementById('inverter1_quadrature_axis_current_label'), // 14
  document.getElementById('inverter1_drive_enable_circle'),           // 15
  document.getElementById('inverter1_drive_enable_limit_circle'),     // 16
  -1,                                                                 // 17
  -1,                                                                 // 18
  -1,                                                                 // 19
  -1,                                                                 // 20
  document.getElementById('inverter1_desired_brake_torque_label'),    // 21
  document.getElementById('inverter1_actual_rpm_label'),              // 22
  document.getElementById('inverter1_dc_input_voltage_label'),        // 23
  document.getElementById('inverter1_dc_input_current_label'),        // 24
  
  document.getElementById('inverter2_desired_torque_label'),          // 25
  document.getElementById('inverter2_desired_rpm_label'),             // 26
  document.getElementById('inverter2_temp_label'),                    // 27
  document.getElementById('inverter2_engine_temp_label'),             // 28
  document.getElementById('inverter2_direct_axis_current_label'),     // 29
  document.getElementById('inverter2_quadrature_axis_current_label'), // 30
  document.getElementById('inverter2_drive_enable_circle'),           // 31
  document.getElementById('inverter2_drive_enable_limit_circle'),     // 32
  -1,                                                                 // 33
  -1,                                                                 // 34
  -1,                                                                 // 35
  -1,                                                                 // 36
  document.getElementById('inverter2_desired_brake_torque_label'),    // 37
  document.getElementById('inverter2_actual_rpm_label'),              // 38
  document.getElementById('inverter2_dc_input_voltage_label'),        // 39
  document.getElementById('inverter2_dc_input_current_label'),        // 40

  document.getElementById('fan_pwm_inverter_label'),                  // 41
  document.getElementById('fan_pwm_engine_label'),                    // 42
  document.getElementById('pdu_circle'),                              // 43
  document.getElementById('tsal_circle'),                             // 44
]

socket.on('connect', () => {
  if(isLoadingSpinRendered) {
    commands_div.removeChild(document.getElementById('loading_spin'))
    isLoadingSpinRendered = false
  }
})

socket.on('connect_error', () => {
  if(!isLoadingSpinRendered) {
    isLoadingSpinRendered = true
    
    // mostro la rotellina di caricamento
    let loading_spin = document.createElement('div')
    loading_spin.id = 'loading_spin'
    loading_spin.classList.add('h-8', 'w-8', 'animate-spin', 'rounded-full', 'border-4', 'border-solid', 'border-primary-color', 'border-current', 'border-r-transparent', 'align-[-0.125em]', 'motion-reduce:animate-[spin_1.5s_linear_infinite]')
    loading_spin.role = 'status'
    commands_div.appendChild(loading_spin)
  }
})

socket.on('record_started', () => {
  if(!isRecording) {
    record_btn.textContent = 'Recording ...'
    record_btn.disabled = true 
    record_btn.classList.remove('bg-green-100', 'hover:bg-green-200', 'dark:bg-green-700', 'dark:hover:bg-green-600', 'text-green-600')
    record_btn.classList.add('bg-yellow-100', 'dark:bg-blue-900', 'text-yellow-600', 'cursor-progress')
  }
})

socket.on('record_stopped', () => {
  record_btn.textContent = 'Start Recording'
  record_btn.disabled = false 
  if(record_btn.classList.contains('cursor-progress')) {
    record_btn.classList.remove('bg-yellow-100', 'dark:bg-blue-900', 'text-yellow-600', 'cursor-progress')
    record_btn.classList.add('bg-green-100', 'hover:bg-green-200', 'dark:bg-green-700', 'dark:hover:bg-green-600', 'text-green-600')
  }
})

socket.on('newMessage', (msg) => {

  if(msg.id == 7) { // se l'id è 7 bisogna aggiornare il grafico
    pps.update(msg.data)
  } 
  else if(msg.id == 0) { // per testing assegno alla velocità quella della ruota davanti destra
    forwald_vel.update(msg.data%150)
  } 
  else if(msg.id == 5) { // per testing assegno al brake quello davanti destro
    brake.update(msg.data%100)
    interface_elements[msg.id].textContent = msg.data
  } 
  else if(msg.id == 22) { // per testing assegno all'rpm quello attuale dell'inverter1
    rpm.update(Math.floor(msg.data/10)*100)
    interface_elements[msg.id].textContent = Math.floor(msg.data/10)
  } 
  else if(msg.id == 6) { // se ho ricevuto l'angolo di sterzo faccio ruotare l'immagine
    // questi conti sono fatti solo a scopo di test
    msg.data = Math.floor(msg.data%100)
    if(msg.data > 50) {
      msg.data = -msg.data
    }
    let steer_image = document.getElementById('steer_image')
    steer_image.style.WebkitTransitionDuration = '1s';
    steer_image.style.transform = 'rotate('+ msg.data +'deg)';
    interface_elements[msg.id].textContent = msg.data
  }
  else if(typeof(msg.data) == "boolean") { // se il dato è un booleano allora c'è da aggiornare un pallino verde/rosso
    let color_add = (msg.data) ? 'bg-green-500':'bg-red-500'
    let color_remove = (msg.data) ? 'bg-red-500':'bg-green-500'
    interface_elements[msg.id].classList.remove(color_remove)
    interface_elements[msg.id].classList.add(color_add)
  } 
  else if((msg.id == 10) || (msg.id == 22) || (msg.id == 26) || (msg.id == 38)) { // si riceve l'erpm ma si vuole l'rpm quindi divido per 10 coppie polari
    interface_elements[msg.id].textContent = Math.floor(msg.data/10)
  } 
  else if(((msg.id > 16) && (msg.id < 21)) || ((msg.id > 32) && (msg.id < 37))) { // queste informazioni andranno nell'info di inverter 1 e inverter 2
    interface_elements[msg.id] = Math.floor(msg.data)
  }
  else { 
    interface_elements[msg.id].textContent = msg.data
    checkLimits(msg)
  } 
})

function checkLimits(msg) {
  // per vedere se funzione controllo solo il topic 11
  if((msg.id == 11) && (msg.data >= 500)) {
    let warning_div = document.getElementById('inverter1_temp_warning')
    if(!warning_div.hasChildNodes()) {
      warning_div.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FF0000" class="w-5 h-5"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>'
    }
  } else if((msg.id == 11) && (msg.data < 500)) {
    let warning_div = document.getElementById('inverter1_temp_warning')
    if(warning_div.hasChildNodes()) {
      warning_div.removeChild(warning_div.firstChild)
    }
  }
}