let rpm;
let gear;
let tps;
let forwald_vel;
let ect;
let eop;
let brake;
// questo serve per il font
window.addEventListener('load', function() {
  rpm         = new RPM();
  gear        = new GEAR();
  tps         = new TPS();
  forwald_vel = new FORWARD_VEL();
  brake       = new BRAKE();
  ect         = new ECT();
  eop         = new EOP();
})

/*
* Funzione chiamata quando l'utente carica un file:
* controlla che l'input sia corretto e poi fa partire
* la simulazione
*/
function newFileBagInput() {

  if (!window.FileReader) { 
    showAttenctionAlert("Caricare un file .bag!");
    return;
  }

  var input = document.getElementById('fileinput');
  if (!input.files || !input.files[0]) { 
    showAttenctionAlert("Caricare un file .bag!");
  } else {
    var file = input.files[0];
    document.getElementById('span_file_name').textContent = file.name;
    getRosbagData(file);
  }
}

/**
 * Funzione chiave della simulazione: estrae i dati dal 
 * file bag e li inserisce all'interno dei grafici
 */
async function getRosbagData(file) {

  const bag = await rosbag.open(file);

  var counter_rpm         = RPM_FREQUENCY;
  var counter_tps         = THROTTLE_FREQUENCY;
  var counter_forward_vel = FORWARD_VEL_FREQUENCY;
  var counter_gear        = GEAR_FREQUENCY;

  bag.readMessages({ topics: ['/can2ros/rpm', 
                              '/can2ros/tps', 
                              '/can2ros/forward_vel', 
                              '/can2ros/gear', 
                              '/can2ros/ect', 
                              '/can2ros/eop'
                            ] 
                    }, (result) => {
    
    switch(result.topic) {
      case '/can2ros/rpm':
        if(counter_rpm == RPM_FREQUENCY) {
          rpm.update(result.message['data']);
          counter_rpm = 0;
        }
        counter_rpm++;
        break;

      case '/can2ros/tps':
        if(counter_tps == THROTTLE_FREQUENCY) {
          tps.update(result.message['data']);
          counter_tps = 0;
        }
        counter_tps++;
        break;

      case '/can2ros/forward_vel':
        if(counter_forward_vel == FORWARD_VEL_FREQUENCY) {
          forwald_vel.update(result.message['data']);
          counter_forward_vel = 0;
        }
        counter_forward_vel++;
        break;

      case '/can2ros/gear':
        if(counter_gear == GEAR_FREQUENCY) {
          gear.update(result.message['gear']);
          counter_gear = 0;
        }
        counter_gear++;
        break;

      case '/can2ros/ect':
        ect.update(result.message['data']);
        break;
      
      case '/can2ros/eop':
        eop.update(result.message['data']);
        break;
    }
  });
}