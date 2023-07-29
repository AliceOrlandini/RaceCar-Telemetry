/**
 * In this file, there are functions that use the SweetAlert2 library to display 
 * information or error messages on the interface.
 */

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 10000,
  timerProgressBar: true,
  customClass: {
    popup: 'colored-toast'
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const Info_Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  width: 400,
  showConfirmButton: false,
  showCloseButton: true,
  timer: 10000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

/**
 * Function used to display an emergency alert, takes a string as input that 
 * will be the title of the alert.
 */
function showAttenctionAlert(title) {
  Toast.fire({
    icon: 'warning',
    iconColor: 'white',
    title: title
  });
}

/**
 * Function that displays an information alert containing information 
 * about inverter mapping, such as AC and DC currents and voltages.
 */
function showInfoAlert(title) {
  let ac_max_current
  let dc_max_current
  let ac_brake_max_current
  let dc_brake_max_current

  if(title == 'Inverter1') {
    ac_max_current = interface_elements[17]
    dc_max_current = interface_elements[18]
    ac_brake_max_current = interface_elements[19]
    dc_brake_max_current = interface_elements[20]
  } else {
    ac_max_current = interface_elements[33]
    dc_max_current = interface_elements[34]
    ac_brake_max_current = interface_elements[35]
    dc_brake_max_current = interface_elements[36]
  }

  Info_Toast.fire({
    icon: 'info',
    title: title + ' Map Info',
    html: '<div class="w-full font-formula1 text-sm">' +
            '<div class="flex">'+
              '<h4>AC Max Current' + '<h4 class="ml-auto font-bold">' + ac_max_current + '</h4>' + '<h4 class="ml-1">A</h4></h4>' +
            '</div>' + 
            '<div class="flex">' +
              '<h4>DC Max Current' + '<h4 class="ml-auto font-bold">' + dc_max_current + '</h4>' + '<h4 class="ml-1">A</h4></h4>' +
            '</div>' +
            '<div class="flex">' +
              '<h4>AC Brake Max Current' + '<h4 class="ml-auto font-bold">' + ac_brake_max_current + '</h4>' + '<h4 class="ml-1">A</h4></h4>' +
            '</div>' +
            '<div class="flex">' +
              '<h4>DC Brake Max Current' + '<h4 class="ml-auto font-bold">' + dc_brake_max_current + '</h4>' + '<h4 class="ml-1">A</h4></h4>' +
            '</div>' +
          '</div>'
  });
}

/**
 * Function that displays a dialog on the screen that allows the user to select 
 * the topics he want to record, and by pressing the recording start button, 
 * sends a request to the server to start recording.
 */
function showStartRecordingDialog() {
  
  // creating the div that will contain the entries of the various topics
  let top_div = document.createElement('div')
  top_div.classList.add('grid', 'grid-cols-5', 'gap-4')

  // adding the checkboxes for the topics
  topics.forEach(topic => {
    let element_div = document.createElement('div')

    let label = document.createElement('label')
    label.classList.add('custom-label', 'flex')

    let span_checkbox = document.createElement('span')
    span_checkbox.classList.add('bg-white', 'shadow', 'rounded-md', 'w-6', 'h-6', 'p-1', 'flex', 'justify-center', 'items-center', 'mr-2')
    
    let checkbox = document.createElement('input')
    let topic_id = topic.id.substring(1).replaceAll('/', '_')
    checkbox.id = topic_id + '_checkbox'
    checkbox.type = 'checkbox';
    if(topic.selected) { checkbox.setAttribute('checked', 'checked') }
    checkbox.classList.add('hidden')

    let span_text = document.createElement('span')
    span_text.classList.add('select-none', 'font-formula1', 'text-left', 'my-auto','text-xs', 'dark:text-white')
    span_text.textContent = topic.name

    span_checkbox.appendChild(checkbox)
    span_checkbox.innerHTML += '<svg class="pointer-events-none hidden" style="color: rgb(255, 134, 71);" width="40" zoomAndPan="magnify" viewBox="0 0 30 30.000001" height="40" preserveAspectRatio="xMidYMid meet"><defs><clipPath><path d="M 2.328125 4.222656 L 27.734375 4.222656 L 27.734375 24.542969 L 2.328125 24.542969 Z M 2.328125 4.222656 " clip-rule="nonzero" fill="#ff8647"></path></clipPath></defs><g clip-path="url(#id1)"><path fill="#ff8647" d="M 27.5 7.53125 L 24.464844 4.542969 C 24.15625 4.238281 23.65625 4.238281 23.347656 4.542969 L 11.035156 16.667969 L 6.824219 12.523438 C 6.527344 12.230469 6 12.230469 5.703125 12.523438 L 2.640625 15.539062 C 2.332031 15.84375 2.332031 16.335938 2.640625 16.640625 L 10.445312 24.324219 C 10.59375 24.472656 10.796875 24.554688 11.007812 24.554688 C 11.214844 24.554688 11.417969 24.472656 11.566406 24.324219 L 27.5 8.632812 C 27.648438 8.488281 27.734375 8.289062 27.734375 8.082031 C 27.734375 7.875 27.648438 7.679688 27.5 7.53125 Z M 27.5 7.53125 " fill-opacity="1" fill-rule="nonzero"></path></g></svg></span>'
    label.appendChild(span_checkbox)
    label.appendChild(span_text)
    element_div.appendChild(label)
    top_div.appendChild(element_div)
  });
  
  Swal.fire({
    title: '<h1 class="text-xl font-formula1 mb-2">Quali topic vuoi registrare?</h1>',
    html: top_div,
    width: 10000,
    position: 'top',
    icon: 'question',
    iconColor: '#EE8119',
    showCancelButton: false,
    showCloseButton: true,
    confirmButtonColor: '#EE8119',
    confirmButtonText: 'Inizia a registrare'
  }).then((result) => {
    // iterate through the list of topics and create a message with only the selected ones
    let msg = []
    let num_topics = 0
    topics.forEach((topic, i) => {
      let topic_id = topic.id.substring(1).replaceAll('/', '_')
      let box = document.getElementById(topic_id + '_checkbox')
      topic.selected = box.checked
      if(topic.selected) {
        msg.push(i)
        num_topics++
      }
    });
    // check that at least one topic is selected
    if(num_topics == 0) {
      // display a start recording alert
      Swal.fire({
        icon: 'warning',
        iconColor: '#EF4444',
        title: 'Attenzione nessun topic selezionato!',
        showCloseButton: true,
        showCancelButton: false,
        confirmButtonColor: '#EF4444',
      })
      return 
    }
    if (result.isConfirmed) {
      // sending the request to the server to start the recording
      socket.emit('start_recording', msg)

      // update the color and text of the button
      record_btn.textContent = 'Stop Recording'
      record_btn.classList.remove('bg-green-100', 'hover:bg-green-200', 'dark:bg-green-700', 'dark:hover:bg-green-600', 'text-green-600')
      record_btn.classList.add('bg-red-100', 'hover:bg-red-200', 'dark:bg-red-700', 'dark:hover:bg-red-600', 'text-red-600')
      
      // update the variable that keeps track of the recording
      isRecording = true

      // display the start-of-recording feedback
      Swal.fire({
        icon: 'success',
        iconColor: '#16A34A',
        title: 'Registrazione iniziata con successo!',
        showCloseButton: true,
        showCancelButton: false,
        confirmButtonColor: '#16A34A',
      })
    }
  })
}

/**
 * Function that displays a confirmation message on the screen that 
 * you want to stop the recording. By pressing the confirmation button, 
 * it sends a message to the server to stop the recording.
 */
function showStopRecordingDialog() {
  Swal.fire({
    icon: 'warning',
    iconColor: '#EF4444',
    title: 'Interrompere la registrazione?',
    showCloseButton: true,
    showCancelButton: false,
    confirmButtonColor: '#EF4444',
  }).then((result) => {
    if(result.isConfirmed) {
      // sending the request to the server to stop the recording
      socket.emit('stop_recording', {})

      // update the variable that keeps track of the recording
      isRecording = false

      // update the color and text of the button
      record_btn.textContent = 'Start Recording'
      record_btn.classList.remove('bg-red-100', 'hover:bg-red-200', 'dark:bg-red-700', 'dark:hover:bg-red-600', 'text-red-600')
      record_btn.classList.add('bg-green-100', 'hover:bg-green-200', 'dark:bg-green-700', 'dark:hover:bg-green-600', 'text-green-600')
    
      // display the end-of-recording feedback
      Swal.fire({
        icon: 'success',
        iconColor: '#16A34A',
        title: 'Registrazione interrotta con successo!',
        showCloseButton: true,
        showCancelButton: false,
        confirmButtonColor: '#16A34A',
      })
    }
  })
}