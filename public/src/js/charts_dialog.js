var num_charts = 0
var data_rate = 20
var db = null;

window.addEventListener('load', () => {
  const charts_page_content = document.getElementById('charts_page_content')
  const dialog_container = document.getElementById('dialog_container')
  
  // createChartsDialog(charts_page_content, dialog_container, topics)
  createBagsDownloadDialog(charts_page_content)
  createUploadMetadataDialog(charts_page_content, dialog_container)
})

class LinearChart {

  linear_chart;
  chart_id = '';
  lineChartOptions;

  constructor(id, step, max, min, title, data, color) {
    this.chart_id = '#' + id + '_linear_chart';
    this.lineChartOptions = {
      type: 'line',
      animation: false,
      data: {
        labels: data.x,
        datasets: [{
            label: title,
            data: data.y,
            fill: false,
            borderColor: '#F97316',
            pointBackgroundColor: "#F97316"
        }]
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: 10
        },
        scales: {
          x: {
            border:{
              color: color,
              width: 1
            },
            grid: {
              display: true,
              color: color
            }, 
            ticks: {
              display: true,
              color: color,
              font: {
                size: 10
              }
            }
          },
          y: {
            border:{
              dash:  function(context) {
                if(context.tick.value != 0) {
                  return [4,4]
                }
              },
              color: color,
              width: 1
            },
            grid: {
              color: color,
              display: true,
            },
            ticks: {
              stepSize: step,
              padding: 5,
              color: color,
              font: {
                size: 10
              }
            },
            max: max,
            min: min,
          }
        },
        elements: {
          point: {
            radius: 0
          },
        },
        plugins: {
          tooltip: true,
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
              modifierKey: 'ctrl',
            },
            zoom: {
              drag: {
                enabled: true
              },
              mode: 'x',
            },
          },
          legend: {
            labels: {
              color: color,
              boxWidth: 0,
              font: {
                size: 12,
              }
            },
          }
        }
      }
    };
    this.linear_chart = new Chart(document.querySelector(this.chart_id), this.lineChartOptions);
  }
}
/**
 * Funzione che per ogni topic estrae i dati e crea il grafico
 */
async function getChartData(file, topic) {

  const bag = await rosbag.open(file)
  var data = { x: [], y: [] }
  var counter = 0
  var min = 0
  var max = 0
  var sum = 0
  var average = 0
  var num_values = 0

  let topic_name = '/can2ros/' + topic.id
  var new_date = new Date(bag.startTime.sec * 1000)
  var old_date

  bag.readMessages({ topics: [ topic_name ] }, (result) => {  
    old_date = new_date
    new_date = new Date(result.timestamp.sec * 1000)

    if(old_date.toLocaleTimeString() != new_date.toLocaleTimeString()) {
      // aggiungo il valore e il timestamp al grafico
      data.x.push(new_date.toLocaleTimeString())
      data.y.push(Math.floor(result.message['data']))
      
      // calcolo i valori statistici
      if(num_values == 0) {
        min = result.message['data']
        max = result.message['data']
      } else {
        if(result.message['data'] > max) {
          max = result.message['data']
        }
        if(result.message['data'] < min) {
          min = result.message['data']
        }
      }
      sum += result.message['data']
      num_values++
    }
    /* // versione con un rate e non uno al secondo
      if(counter == data_rate) {
      new_date = new Date(result.timestamp.sec * 1000)

      data.x.push(new_date.toLocaleTimeString())
      data.y.push(result.message['data'])
      counter = 0
    }
    counter++ */
  }).then(() => {
    num_charts--
    if(!num_charts) {
      document.getElementById("loading_spin").remove()
      document.getElementById("back_btn").disabled = false
      reset_zoom_btn.classList.add('ml-auto')
    }
    // controllo se sono in light o dark mode
    let color
    if(document.body.classList.contains('dark')) { color = '#FFF' }
    else { color = '#000'}
    new LinearChart(topic.id, topic.step, topic.max, topic.min, topic.name + ' ' + topic.measure, data, color)

    // creo la riga della tabella delle statistiche
    let tr = document.createElement('tr')
    let td_name = document.createElement('td')
    td_name.classList.add('text-left')
    td_name.textContent = topic.name + ' ' + topic.measure

    let td_min = document.createElement('td')
    td_min.textContent = Math.floor(min)

    let td_max = document.createElement('td')
    td_max.textContent = Math.floor(max)

    let td_average = document.createElement('td')
    if(num_values != 0) { average = Math.floor(sum/num_values) }
    td_average.textContent = average

    // metto il bottone per esportare i grafici
    let export_btn = document.createElement('input')

    export_btn.id = 'export_btn_' + topic.id
    export_btn.type = 'button'
    export_btn.value = 'export'
    export_btn.setAttribute('topic-id', topic.id)
    export_btn.classList.add('cursor-pointer', 'w-fit', 'bg-green-100', 'hover:bg-green-200', 'py-2', 'px-5', 'text-green-600', 'text-xs', 'rounded', 'shadow-md', 'font-formula1', 'dark:bg-green-700', 'dark:hover:bg-green-600', 'dark:text-white')
    export_btn.onclick = (e) => {
      let arg = e.target.getAttribute('topic-id')
      // let canvas = document.getElementById(arg + '_linear_chart')
      let chart = Chart.getChart(arg + '_linear_chart')
      downloadCSV({ filename: arg + '_linear_chart', chart: chart })
      /* canvas.toBlob( (blob) => {
        saveAs(blob, arg + '.png')
      }) */
    }

    tr.appendChild(td_name)
    tr.appendChild(td_min)
    tr.appendChild(td_max)
    tr.appendChild(td_average)
    tr.appendChild(export_btn)
    document.getElementById('stats_table_body').appendChild(tr)

    // cambio la dimensione del div principale se i grafici e le statistiche occupano piu spazio di una schermata
    if(document.getElementById('div_charts_reset').clientHeight > document.body.clientHeight) {
      document.getElementById('main_div').classList.remove('h-screen')
      document.getElementById('main_div').classList.add('h-fit')
    }
  })
}

function newMetadataFile(input, charts_page_content, dialog_container) {
  if (!window.FileReader) { 
    showAttenctionAlert("Caricare un file .yaml!");
    return;
  }

  if (!input.files || !input.files[0]) { 
    showAttenctionAlert("Caricare un file .yaml!");
  } else {
    const reader = new FileReader();
    reader.onload = () => {
      const doc = jsyaml.load(reader.result);
      doc.rosbag2_bagfile_information.topics_with_message_count.forEach(element => {
        topics.forEach(topic => {
          if(topic.id == element.topic_metadata.name) {
            topic.isInTheBag = true;
          }
        });
      });
      // elimino il contenuto attuale del dialog
      while (dialog_container.firstChild) {
        dialog_container.removeChild(dialog_container.lastChild);
      }

      // creo il dialog per selezionare i grafici
      createChartsDialog(charts_page_content, dialog_container)
    };
    var file = input.files[0];
    try {
      reader.readAsText(file);
    } catch (e) {
      console.log(e);
    }
  }
}

function createUploadMetadataDialog(charts_page_content, dialog_container) {

  // creo il titolo
  let title = document.createElement('h1')
  title.textContent = 'Generazione grafici dalla bag:'
  title.classList.add('font-formula1', 'text-primary-color', 'mb-4')
  dialog_container.appendChild(title)

  // creo l'input
  let file_input = document.createElement('input')
  file_input.classList.add('hidden')
  file_input.type = 'file'
  file_input.accept = '.yaml'
  file_input.onchange = () => { 
    // prelevo dal file i nomi dei topic e cambio schermata
    newMetadataFile(file_input, charts_page_content, dialog_container)
  }
  dialog_container.appendChild(file_input)

  // creo il bottone per caricare il file
  let button_upload_file = document.createElement('button')
  button_upload_file.classList.add('rounded-md', 'bg-orange-100', 'hover:bg-orange-200', 'shadow-md', 'font-formula1', 'text-primary-color', 'text-sm', 'py-2', 'px-10', 'dark:bg-orange-500', 'dark:hover:bg-orange-400', 'dark:text-white')
  button_upload_file.textContent = 'Carica il file metadata.yaml'
  button_upload_file.onclick = () => { file_input.click() }
  dialog_container.appendChild(button_upload_file)
}

function createChartsDialog(charts_page_content, dialog_container) {
  
  // creo il titolo
  let title = document.createElement('h1')
  title.textContent = 'Scegli i grafici da visualizzare:'
  title.classList.add('font-formula1', 'text-primary-color', 'mb-4')
  dialog_container.appendChild(title)

  // creo il div che conterrà le voci dei vari grafici
  let top_div = document.createElement('div')
  top_div.classList.add('grid', 'grid-cols-4', 'gap-4')

  // aggiungo le checkbox dei grafici
  topics.forEach(topic => {
    if(topic.isInTheBag) {
      let element_div = document.createElement('div')

      let label = document.createElement('label')
      label.classList.add('custom-label', 'flex')

      let span_checkbox = document.createElement('span')
      span_checkbox.classList.add('bg-white', 'shadow', 'rounded-md', 'w-6', 'h-6', 'p-1', 'flex', 'justify-center', 'items-center', 'mr-2')
      
      let checkbox = document.createElement('input')
      let topic_id = topic.id
      topic_id = topic_id.substring(1)
      checkbox.id = topic_id.replaceAll('/', '_') + '_checkbox'
      checkbox.type = 'checkbox';
      if(topic.selected) { checkbox.setAttribute('checked', 'checked') }
      checkbox.classList.add('hidden')

      let span_text = document.createElement('span')
      span_text.classList.add('select-none', 'font-formula1', 'text-sm', 'dark:text-white')
      span_text.textContent = topic.name

      span_checkbox.appendChild(checkbox)
      span_checkbox.innerHTML += '<svg class="pointer-events-none hidden" style="color: rgb(255, 134, 71);" width="40" zoomAndPan="magnify" viewBox="0 0 30 30.000001" height="40" preserveAspectRatio="xMidYMid meet"><defs><clipPath><path d="M 2.328125 4.222656 L 27.734375 4.222656 L 27.734375 24.542969 L 2.328125 24.542969 Z M 2.328125 4.222656 " clip-rule="nonzero" fill="#ff8647"></path></clipPath></defs><g clip-path="url(#id1)"><path fill="#ff8647" d="M 27.5 7.53125 L 24.464844 4.542969 C 24.15625 4.238281 23.65625 4.238281 23.347656 4.542969 L 11.035156 16.667969 L 6.824219 12.523438 C 6.527344 12.230469 6 12.230469 5.703125 12.523438 L 2.640625 15.539062 C 2.332031 15.84375 2.332031 16.335938 2.640625 16.640625 L 10.445312 24.324219 C 10.59375 24.472656 10.796875 24.554688 11.007812 24.554688 C 11.214844 24.554688 11.417969 24.472656 11.566406 24.324219 L 27.5 8.632812 C 27.648438 8.488281 27.734375 8.289062 27.734375 8.082031 C 27.734375 7.875 27.648438 7.679688 27.5 7.53125 Z M 27.5 7.53125 " fill-opacity="1" fill-rule="nonzero"></path></g></svg></span>'
      label.appendChild(span_checkbox)
      label.appendChild(span_text)
      element_div.appendChild(label)
      top_div.appendChild(element_div)
    }
  });

  dialog_container.appendChild(top_div)

  // creo il div che conterrà il menu di selezione dei grafici su una riga
  let div_num_charts = document.createElement('div')
  div_num_charts.classList.add('flex', 'flex-row', 'gap-3', 'mt-4')

  let title_num_charts = document.createElement('h1')
  title_num_charts.textContent = 'Quanti grafici vuoi visualizzare su una riga?'
  title_num_charts.classList.add('font-formula1', 'text-primary-color')

  let input_num_charts = document.createElement('input')
  input_num_charts.classList.add('font-formula1', 'text-sm', 'h-fit', 'my-auto', 'dark:bg-gray-2', 'dark:text-white')
  input_num_charts.type = 'number'
  input_num_charts.value = 1
  input_num_charts.max = 4
  input_num_charts.min = 1

  div_num_charts.appendChild(title_num_charts)
  div_num_charts.appendChild(input_num_charts)

  dialog_container.appendChild(div_num_charts)

  // creo il div per il menu di selezione del file
  let div_upload_file = document.createElement('div')
  div_upload_file.classList.add('flex', 'flex-row', 'gap-4', 'mt-5')

  let file_input = document.createElement('input')
  file_input.classList.add('hidden')
  file_input.type = 'file'
  file_input.accept = '.db3'
  file_input.onchange = () => { 
    span_upload_file.textContent = file_input.files[0].name
    openDB(file_input)
  }
  div_upload_file.appendChild(file_input)

  let button_upload_file = document.createElement('button')
  button_upload_file.classList.add('rounded-md', 'bg-orange-100', 'hover:bg-orange-200', 'shadow-md', 'font-formula1', 'text-primary-color', 'text-sm', 'py-2', 'px-10', 'dark:bg-orange-500', 'dark:hover:bg-orange-400', 'dark:text-white')
  button_upload_file.textContent = 'Carica un file .db3'
  button_upload_file.onclick = () => { file_input.click() }

  let label_upload_file = document.createElement('label')
  label_upload_file.classList.add('text-sm', 'font-base', 'font-formula1', 'flex', 'items-center', 'content-center', 'gap-x-1', 'dark:text-white')
  label_upload_file.textContent = 'File Caricato: '
  let span_upload_file = document.createElement('span')
  span_upload_file.classList.add('font-normal', 'inline-block', 'my-auto', 'text-xs', 'dark:text-white')
  span_upload_file.textContent = 'nessuno'
  label_upload_file.appendChild(span_upload_file)

  div_upload_file.appendChild(button_upload_file)
  div_upload_file.appendChild(label_upload_file)

  dialog_container.appendChild(div_upload_file)

  // creo il div per il bottone per generare i grafici
  let button_div = document.createElement('div')
  button_div.classList.add('flex', 'w-full', 'h-fit')

  let submit_button = document.createElement('input')
  submit_button.type = 'button'
  submit_button.value = "Genera Grafici"
  submit_button.classList.add('cursor-pointer', 'ml-auto', 'bg-blue-100', 'hover:bg-blue-200', 'py-2', 'px-4', 'text-blue-600', 'text-xs', 'rounded', 'shadow-md', 'font-formula1', 'dark:bg-blue-900', 'dark:hover:bg-blue-700', 'dark:text-white')

  submit_button.onclick = () => {
    generateCharts(file_input, topics, input_num_charts, charts_page_content)
  }

  button_div.appendChild(submit_button)

  dialog_container.appendChild(button_div)
}

function generateCharts(file_input, topics, input_num_charts, charts_page_content) {
  
  // controllo se è stato caricato almeno un file
  if (!file_input.files || !file_input.files[0]) { 
    showAttenctionAlert("Attenzione: non è stato caricato nessun file .bag");
    return
  } 
  // controllo quali checkbox sono state selezionate
  topics.forEach(topic => {
    if(topic.isInTheBag) {
      let topic_id = topic.id
      topic_id = topic_id.substring(1)
      let elem = document.getElementById(topic_id.replaceAll('/', '_') + '_checkbox')
      topic.selected = elem.checked
      // conto anche quanti grafici devo visualizzare
      if(elem.checked) {
        num_charts++
      }
    }
  });

  // controllo se è stato selezionato almeno un grafico
  if(!num_charts) {
    showAttenctionAlert("Attenzione: non è stato selezionato nessun grafico");
    return
  }
  // controllo se il numero di grafici su una riga supera 4 o è negativo
  if(input_num_charts.value > 4 || input_num_charts.value < 0) {
    showAttenctionAlert("Attenzione: il numero di grafici su una riga deve essere compreso tra 0 e 4");
    return
  }

  // tolgo il dialog
  document.getElementById('charts_page_content').removeChild(document.getElementById('dialog_container'))
  // metto la width del container a full
  document.getElementById('charts_page_content').classList.remove('w-2/3')
  document.getElementById('charts_page_content').classList.add('w-full')

  // tolgo il download delle bag
  document.getElementById('charts_page_content').removeChild(document.getElementById('bags_download_container'))

  // div per contenere i bottoni di reset e indietro
  let options_div = document.createElement('div')
  options_div.classList.add('w-full', 'h-fit', 'flex')

  // metto il bottone per tornare indietro
  let back_btn = document.createElement('input')
  back_btn.id = 'back_btn'
  back_btn.type = 'button'
  back_btn.value = 'back'
  back_btn.disabled = true
  back_btn.classList.add('cursor-pointer','disabled:cursor-default', 'bg-red-100', 'disabled:bg-red-100', 'hover:bg-red-200', 'py-2', 'px-4', 'text-red-600', 'text-xs', 'rounded', 'shadow-md', 'font-formula1', 'dark:bg-red-600', 'dark:hover:bg-red-500', 'dark:text-white')
  back_btn.onclick = () => {
    // rimuovo il contenuto della pagina
    document.getElementById('charts_page_content').removeChild(div_charts_reset)
    document.getElementById('charts_page_content').classList.remove('w-full')
    document.getElementById('charts_page_content').classList.add('w-2/3')
    
    // ripristino l'altezza del div principale
    if(document.getElementById('main_div').classList.contains('h-fit')) {
      document.getElementById('main_div').classList.remove('h-fit')
      document.getElementById('main_div').classList.add('h-screen')
    }
    
    // creo il div del dialog
    let dialog_container = document.createElement('div')
    dialog_container.id = 'dialog_container'
    dialog_container.classList.add('h-fit', 'bg-white', 'shadow-xl', 'rounded-md', 'p-5', 'dark:bg-gray-2')
    document.getElementById('charts_page_content').appendChild(dialog_container)

    // creo il div del download delle bag
    createBagsDownloadDialog(document.getElementById('charts_page_content'))

    // chiamo la funzione per creare il dialog del yaml
    createUploadMetadataDialog(charts_page_content, dialog_container)

    // ripristino i topic
    topics.forEach(topic => {
      topic.isInTheBag = false 
      topic.selected = false
    });
    // createChartsDialog(charts_container, document.getElementById('dialog_container'), topics)
  }
  options_div.appendChild(back_btn)

  // mostro il caricamento
  let loading_spin = document.createElement('div')
  loading_spin.id = 'loading_spin'
  loading_spin.classList.add('h-8', 'w-8', 'animate-spin', 'rounded-full', 'border-4', 'border-solid', 'border-orange-500', 'border-current', 'border-r-transparent', 'align-[-0.125em]', 'motion-reduce:animate-[spin_1.5s_linear_infinite]', 'mx-auto')
  loading_spin.role = 'status'
  options_div.appendChild(loading_spin)

  // metto il bottone per resettare lo zoom
  let reset_zoom_btn = document.createElement('input')
  reset_zoom_btn.id = 'reset_zoom_btn'
  reset_zoom_btn.type = 'button'
  reset_zoom_btn.value = 'reset zoom'
  reset_zoom_btn.classList.add('cursor-pointer', 'bg-blue-100', 'hover:bg-blue-200', 'py-2', 'px-4', 'text-blue-600', 'text-xs', 'rounded', 'shadow-md', 'font-formula1', 'dark:bg-blue-900', 'dark:hover:bg-blue-700', 'dark:text-white')
  reset_zoom_btn.onclick = () => {
    topics.forEach(topic => {
      if((topic.selected) && (topic.isInTheBag)) {
        let topic_id = topic.id
        topic_id = topic_id.replaceAll('/', '_').substring(1)
        let chart = Chart.getChart(topic_id + '_linear_chart')
        chart.resetZoom()
      }
    });
  }
  options_div.appendChild(reset_zoom_btn)

  let div_charts_reset = document.createElement('div')
  div_charts_reset.id = 'div_charts_reset'
  div_charts_reset.classList.add('bg-white', 'h-fit', 'w-full', 'p-5', 'shadow-md', 'rounded-xl', 'dark:bg-gray-2')

  let layout = 'grid-cols-' + input_num_charts.value
  let charts_container = document.createElement('div')
  charts_container.id = 'charts_container'
  charts_container.classList.add('grid', layout)

  div_charts_reset.appendChild(options_div)
  div_charts_reset.appendChild(charts_container)
  document.getElementById('charts_page_content').appendChild(div_charts_reset)

  // div per le statistiche dei grafici
  let stats_div = document.createElement('div')
  stats_div.classList.add('mt-10')
  stats_div.id = 'stats_div'
  div_charts_reset.appendChild(stats_div)

  let table = document.createElement('table')
  table.classList.add('w-1/2', 'border-separate', 'border-spacing-y-4', 'font-formula1', 'mx-auto')
  let thead = document.createElement('thead')
  thead.classList.add('text-center', 'text-base', 'text-gray-800', 'dark:text-white')

  let th_name = document.createElement('th')
  th_name.classList.add('font-normal', 'text-left')
  th_name.textContent = 'Name'

  let th_max = document.createElement('th')
  th_max.classList.add('font-normal')
  th_max.textContent = 'Max'

  let th_min = document.createElement('th')
  th_min.classList.add('font-normal')
  th_min.textContent = 'Min'

  let th_average = document.createElement('th')
  th_average.classList.add('font-normal')
  th_average.textContent = 'Average'

  let th_action = document.createElement('th')
  th_action.classList.add('font-normal')
  th_action.textContent = 'Action'

  let tbody = document.createElement('tbody')
  tbody.id = 'stats_table_body'
  tbody.classList.add('font-light', 'text-sm', 'text-center', 'text-gray-700', 'dark:text-gray-3')

  thead.appendChild(th_name)
  thead.appendChild(th_min)
  thead.appendChild(th_max)
  thead.appendChild(th_average)
  thead.appendChild(th_action)
  table.appendChild(thead)
  table.appendChild(tbody)

  stats_div.appendChild(table)

  // genero i canvas e prelevo i dati dalla bag
  topics.forEach(topic => {
    if((topic.selected) && (topic.isInTheBag)) {
      let chart_div = document.createElement('div')
      chart_div.classList.add('w-full', 'h-64')

      let canvas = document.createElement('canvas')
      let topic_id = topic.id
      topic_id = topic_id.replaceAll('/', '_').substring(1)
      canvas.id = topic_id + '_linear_chart'

      chart_div.appendChild(canvas)
      charts_container.appendChild(chart_div)

      let color
      if(document.body.classList.contains('dark')) { color = '#FFF' }
      else { color = '#000'}
      // new LinearChart(topic_id, topic.step, topic.max, topic.min, topic.name, {x: [0, 1, 2, 3, 4], y: [31, 42, 12, 63, 12]}, color)
      getChartData2(topic)
      // getChartData(file_input.files[0], topic)
    }
  });
}

function getChartData2(topic) {
  
  var chart_data = { x: [], y: [] }
  var min = 0
  var max = 0
  var sum = 0
  var average = 0
  var num_values = 0
  var new_y = 0
  var counter = 0

  var tables = db.prepare("SELECT 'messages'.'data' FROM 'messages' INNER JOIN 'topics' ON 'messages'.'topic_id' = 'topics'.'id' WHERE 'topics'.'name' = '" + topic.id + "'")
  while (tables.step()) {
    var rowObj = tables.getAsObject()
    var data = rowObj.data
    var reader = new CdrReader(data)
    switch(topic.type) {
      case 'std_msgs/msg/Float32':
        new_y = reader.float32()
        break;
      case 'std_msgs/msg/Int32':
      case 'std_msgs/msg/Bool':
        new_y = reader.int32()
        break;
    }

    if(topic.id == '/sensorboard/front_exclusive/steering_angle') {
      new_y = Math.floor(new_y % 100)
      if(new_y > 50) {
        new_y = -new_y
      }
    }
    // aggiungo i valori al grafico
    chart_data.x.push(counter)
    chart_data.y.push(Math.floor(new_y))
    counter++

    // calcolo i valori statistici
    if(num_values == 0) {
      min = new_y
      max = new_y
    } else {
      if(new_y > max) {
        max = new_y
      }
      if(new_y < min) {
        min = new_y
      }
    }
    sum += new_y
    num_values++
  }

  num_charts--
  if(!num_charts) {
    document.getElementById("loading_spin").remove()
    document.getElementById("back_btn").disabled = false
    reset_zoom_btn.classList.add('ml-auto')
  }
  // controllo se sono in light o dark mode
  let color
  if(document.body.classList.contains('dark')) { color = '#FFF' }
  else { color = '#000'}
  let topic_id = topic.id
  topic_id = topic_id.substring(1).replaceAll('/', '_')
  new LinearChart(topic_id, topic.step, topic.max, topic.min, topic.name + ' ' + topic.measure, chart_data, color)

  // creo la riga della tabella delle statistiche
  let tr = document.createElement('tr')
  let td_name = document.createElement('td')
  td_name.classList.add('text-left')
  td_name.textContent = topic.name + ' ' + topic.measure

  let td_min = document.createElement('td')
  td_min.textContent = Math.floor(min)

  let td_max = document.createElement('td')
  td_max.textContent = Math.floor(max)

  let td_average = document.createElement('td')
  if(num_values != 0) { average = Math.floor(sum/num_values) }
  td_average.textContent = average

  // metto il bottone per esportare i grafici
  let export_btn = document.createElement('input')
  export_btn.id = 'export_btn_' + topic_id
  export_btn.type = 'button'
  export_btn.value = 'export'
  export_btn.setAttribute('topic-id', topic_id)
  export_btn.classList.add('cursor-pointer', 'w-fit', 'bg-green-100', 'hover:bg-green-200', 'py-2', 'px-5', 'text-green-600', 'text-xs', 'rounded', 'shadow-md', 'font-formula1', 'dark:bg-green-700', 'dark:hover:bg-green-600', 'dark:text-white')
  export_btn.onclick = (e) => {
    let arg = e.target.getAttribute('topic-id')
    let chart = Chart.getChart(arg + '_linear_chart')
    downloadCSV({ filename: arg + '_linear_chart', chart: chart })
  }

  tr.appendChild(td_name)
  tr.appendChild(td_min)
  tr.appendChild(td_max)
  tr.appendChild(td_average)
  tr.appendChild(export_btn)
  document.getElementById('stats_table_body').appendChild(tr)

  // cambio la dimensione del div principale se i grafici e le statistiche occupano piu spazio di una schermata
  if(document.getElementById('div_charts_reset').clientHeight > document.body.clientHeight) {
    document.getElementById('main_div').classList.remove('h-screen')
    document.getElementById('main_div').classList.add('h-fit')
  }
}

function openDB(file_input) {

  const f = file_input.files[0];
  const r = new FileReader();
  r.onload = () => {
    const Uints = new Uint8Array(r.result);
    initSqlJs().then((SQL) => {
      try {
          db = new SQL.Database(Uints);
      } catch (ex) {
        showAttenctionAlert(ex);
        return;
      }
  });
  }
  r.readAsArrayBuffer(f);
}


function convertChartDataToCSV(args) {  
  var result, keys, columnDelimiter, lineDelimiter;

  if (args.data_y == null || !args.data_y.length) {
    return null;
  }

  columnDelimiter = ',';
  lineDelimiter = '\n';

  keys = ['x', 'y'];

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  for(let i = 0; i < args.data_y.length; i++) {
    result += args.data_x[i]
    result += columnDelimiter;
    result += args.data_y[i]
    result += lineDelimiter
  }
  return result;
}

function downloadCSV(args) {
  var data, filename, link;
  var csv = "";
  csv += convertChartDataToCSV({
    data_x: args.chart.data.labels,
    data_y: args.chart.data.datasets[0].data
  });
  if (csv == null) return;

  filename = args.filename || 'chart-data.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  
  data = encodeURI(csv);
  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  document.body.appendChild(link); // Required for FF
	link.click(); 
	document.body.removeChild(link);   
}