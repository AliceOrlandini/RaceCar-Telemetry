const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const parser = require('xml2json');
var zip = require('express-zip');

const app = express();
const port = process.env.PORT || 8080;
const httpServer = createServer(app);
const io = new Server(httpServer, {});

const isFrontDev = process.env.FRONT_DEV ? (process.env.FRONT_DEV.trim() == "true") : false;

const pages = ['index', 'load_file', 'realtime', 'charts', 'commands'];

app.use(express.static(__dirname + '/public'));

pages.forEach(page => {
  if(page == 'index') {
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '/public/src/html/'+ page +'.html'));
    });
  } else {
    app.get('/' + page, (req, res) => {
      res.sendFile(path.join(__dirname, '/public/src/html/'+ page +'.html'));
    });
  }
});

app.use('/modules', express.static(__dirname + '/node_modules/'));

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/**  
 * questo codice è stato commentato perché veniva usato per scaricare i file
 * bag che venivano registrati sul file system del server
 */
/*
app.get('/bags_info', (req, res) => {
  
  let directories_info = [];
  fs.readdir('/home/bag_files', (error, directories) => {
    if (error) { console.log(error); }
    directories.forEach(directory => {
      // cerco le info di quel file
      let stats = fs.statSync('/home/bag_files/' + directory);
      // let fileSizeInBytes = stats.size;
      let directoryCreationDate = stats.birthtime.toLocaleString("it-IT", { hour12: false });

      // converto in megabytes
      // let fileSizeInMegabytes = fileSizeInBytes / (1024 ** 2);
      let directorySizeInBytes = getSize('/home/bag_files/' + directory)
      let directorySizeInKB = Math.floor(directorySizeInBytes / (1024));

      // aggiungo le informazioni al vettore
      directories_info.push({ id: directory, size: directorySizeInKB, date: directoryCreationDate})
    });

    // invio la risposta al client
    res.json({ info: directories_info });
  });
}); 


app.get('/get_bag/*', (req, res) => {
  let file_name = req.path.split('/');
  let pathToFilesDirectory = '/home/bag_files/' + file_name[2] + '/';
  res.zip([
    { path: pathToFilesDirectory + file_name[2] + '_0.db3', name: file_name[2] + '_0.db3'},
    { path: pathToFilesDirectory + 'metadata.yaml', name: 'metadata.yaml' }
  ]);
}); 


function getSize(path){
  // Get the size of a file or folder recursively
  let size = 0;
  if(fs.statSync(path).isDirectory()){
    const files = fs.readdirSync(path);
    files.forEach(file => {
        size += getSize(path + "/" + file);
    });
  } else {
    size += fs.statSync(path).size;
  }
  return size;
}
*/

/**
 * Questo codice è stato commentato perché veniva usato per leggere i file
 * di configurazione del sistema di controllo
 */
/*
fs.readFile('./dticonfdefault_IH310266.dticfg', (err, data) => {
  let json = parser.toJson(data);
  let object = JSON.parse(json);
  // console.log(object)
  // console.log(object.pokedex)

  // for(var pokemon of object.pokedex.pokemon) {
    // console.log(pokemon.species)
  // } 
});
*/

/**
 * Questo codice è stato commentato perché veniva usato per leggere ricevere
 * i dati della macchina da ROS e inviarli ai client connessi
 */
/*
if(process.platform == 'linux') {
  
  const { exec, spawn } = require('child_process');
  const { Ros, Topic } = require('ros2nodejs');
  const kill  = require('tree-kill');
  
  let child_process;
  let isRecording = false;
  let script_shells = [];
  script_shells.length = 5;
  
  io.on('connection', (socket) => {
    console.log(socket.id);

    // se un nuovo client si connette e sto registrando gli invio
    // l'informazione che sto registrando
    if(isRecording) {
      socket.emit('record_started', {});
    }

    socket.on('start_recording', (msg) => {

      // controllo di sicurezza
      if(!isRecording) {
        isRecording = true;
        console.log('Start Recording');
        
        // invio a tutti i client l'informazione che è iniziata la ragistrazione
        io.emit('record_started', {});

        // creo il comando da eseguire
        let command = 'cd /home/bag_files && ros2 bag record ';
        msg.forEach(element => {
          command += topics[element].name + ' ';
        });
        // faccio partire lo script per la registrazione
        child_process = spawn(command, { shell: true });
        child_process.on('error', (err) => {
          console.error(`spawn error: ${ err }`);
        });
        child_process.stderr.on('data', (data) => {
          console.log(`stderr: ${ data }`);
        });
        child_process.stdout.on('data', (data) => {
          console.log(`stdout: ${ data }`);
        });
        child_process.on('close', (code) => {
          console.log(`child process exited with code: ${ code }`);
        });
      }
    });

    socket.on('stop_recording', () => {
      // controllo di sicurezza
      if(isRecording) {
        console.log('Stop Recording');
        isRecording = false;
        // invio a tutti i client l'informazione che la registrazione è terminata
        io.emit('record_stopped', {});

        // stoppo la registrazione 
        kill(child_process.pid, 'SIGINT', (err) => {
          if(err != null) {
            console.error(err);
          }
        });
      }
    });

    socket.on('run_script', (msg) => {
      // TODO: discriminare il comando in base al msg
      // script_shells[msg] = spawn('ros2', ['launch', 'respawn_test', 'respawning_node.launch.py']);
      script_shells[msg] = spawn('ros2', ['launch', 'etdv_slam', 'sensor_fusion.launch.py', 'standalone:=true']);
      
      script_shells[msg].on('error', (err) => {
        console.log(`error while script spawn: ${ err }`);
      });

      script_shells[msg].stdout.on('data', (data) => {
        console.log(`stdout: ${ data }`);
        // controllo il contenuto dello stdout, in base a quello invio al client
        // lo status dello script
        if(data.includes('process has died')) {
          socket.emit('is_not_running', msg);
        } else if(data.includes('Initialized!')) {
          socket.emit('is_running', msg);
        }
      });

      script_shells[msg].stderr.on('data', (data) => {
        console.error(`stderr: ${ data }`);
      });
      
      script_shells[msg].on('close', (code) => {
        script_shells[msg] = null;
        socket.emit('is_not_running', msg);
        console.log(`child process exited with code ${ code }`);
      });
    });
  
    socket.on('stop_script', (msg) => {
      if(script_shells[msg] != null) {
        // interrompo il processo 
        kill(script_shells[msg].pid, 'SIGINT', (err) => {
          if(err != null) {
            console.error(err);
          }
        });
      }
    });
  });

  function pidIsRunning(pid) {
    try {
      kill(pid, 0);
      return true;
    } catch(e) {
      console.log(e);
      return false;
    }
  }

  const topics = [
    { id: 0, name: '/sensorboard/front/rpm_left', type: 'std_msgs/msg/Int32' },
    { id: 1, name: '/sensorboard/front/rpm_right', type: 'std_msgs/msg/Int32' },
    { id: 2, name: '/sensorboard/front/brake_pressure', type: 'sensor_msgs/msg/FluidPressure' },
    { id: 3, name: '/sensorboard/rear/rpm_left', type: 'std_msgs/msg/Int32' },
    { id: 4, name: '/sensorboard/rear/rpm_right', type: 'std_msgs/msg/Int32' },
    { id: 5, name: '/sensorboard/rear/brake_pressure', type: 'sensor_msgs/msg/FluidPressure' },
    { id: 6, name: '/sensorboard/front_exclusive/steering_angle', type: 'std_msgs/msg/Float32' },
    { id: 7, name: '/sensorboard/front_exclusive/pps', type: 'std_msgs/msg/Float32' },
    { id: 8, name: '/sensorboard/traction', type: 'std_msgs/msg/Bool' },
    
    { id: 9, name: '/inverter1/desired_torque', type: 'std_msgs/msg/Float32' },
    { id: 10, name: '/inverter1/desired_erpm', type: 'std_msgs/msg/Float32' },
    { id: 11, name: '/inverter1/temp', type: 'std_msgs/msg/Float32' },
    { id: 12, name: '/inverter1/engine_temp', type: 'std_msgs/msg/Float32' },
    { id: 13, name: '/inverter1/direct_axis_current', type: 'std_msgs/msg/Float32' },
    { id: 14, name: '/inverter1/quadrature_axis_current', type: 'std_msgs/msg/Float32' },
    { id: 15, name: '/inverter1/drive_enable', type: 'std_msgs/msg/Bool' },
    { id: 16, name: '/inverter1/drive_enable_limit', type: 'std_msgs/msg/Bool' },
    { id: 17, name: '/inverter1/set/ac/max_current', type: 'std_msgs/msg/Float32' },
    { id: 18, name: '/inverter1/set/dc/max_current', type: 'std_msgs/msg/Float32' },
    { id: 19, name: '/inverter1/set/ac/max_brake_current', type: 'std_msgs/msg/Float32' },
    { id: 20, name: '/inverter1/set/dc/max_brake_current', type: 'std_msgs/msg/Float32' },
    { id: 21, name: '/inverter1/desired_brake_torque', type: 'std_msgs/msg/Float32' },
    { id: 22, name: '/inverter1/erpm', type: 'std_msgs/msg/Int32' },
    { id: 23, name: '/inverter1/dc_input_voltage', type: 'std_msgs/msg/Float32' },
    { id: 24, name: '/inverter1/dc_input_current', type: 'std_msgs/msg/Float32' },

    { id: 25, name: '/inverter2/desired_torque', type: 'std_msgs/msg/Float32' },
    { id: 26, name: '/inverter2/desired_erpm', type: 'std_msgs/msg/Float32' },
    { id: 27, name: '/inverter2/temp', type: 'std_msgs/msg/Float32' },
    { id: 28, name: '/inverter2/engine_temp', type: 'std_msgs/msg/Float32' },
    { id: 29, name: '/inverter2/direct_axis_current', type: 'std_msgs/msg/Float32' },
    { id: 30, name: '/inverter2/quadrature_axis_current', type: 'std_msgs/msg/Float32' },
    { id: 31, name: '/inverter2/drive_enable', type: 'std_msgs/msg/Bool' },
    { id: 32, name: '/inverter2/drive_enable_limit', type: 'std_msgs/msg/Bool' },
    { id: 33, name: '/inverter2/set/ac/max_current', type: 'std_msgs/msg/Float32' },
    { id: 34, name: '/inverter2/set/dc/max_current', type: 'std_msgs/msg/Float32' },
    { id: 35, name: '/inverter2/set/ac/max_brake_current', type: 'std_msgs/msg/Float32' },
    { id: 36, name: '/inverter2/set/dc/max_brake_current', type: 'std_msgs/msg/Float32' },
    { id: 37, name: '/inverter2/desired_brake_torque', type: 'std_msgs/msg/Float32' },
    { id: 38, name: '/inverter2/erpm', type: 'std_msgs/msg/Int32' },
    { id: 39, name: '/inverter2/dc_input_voltage', type: 'std_msgs/msg/Float32' },
    { id: 40, name: '/inverter2/dc_input_current', type: 'std_msgs/msg/Float32' },

    { id: 41, name: '/pdu/fan_pwm_inverter', type: 'std_msgs/msg/Int32' },
    { id: 42, name: '/pdu/fan_pwm_engine', type: 'std_msgs/msg/Int32' },
    { id: 43, name: '/pdu/shutdown/pdu', type: 'std_msgs/msg/Bool' },
    { id: 44, name: '/pdu/shutdown/tsal', type: 'std_msgs/msg/Bool' },
  ];

  async function subscribeToTopics() {
    const ros = new Ros('ws://localhost:9090');
    ros.open();
  
    await new Promise((resolve) => setTimeout(resolve, 10000));
  
    topics.forEach(element => {
      new Topic(ros, element.name, element.type).subscribe((msg) => {
        // per i dati in percentuale (pps, desired torque dei due inverter)
        // moltiplico per cento e poi approssimo
        if((element.id == 7) || (element.id == 9) || (element.id == 25)) { 
          msg.data = Math.floor(msg.data * 100)
        } 
        // se sono FluidPressure non ho msg.data ma msg.fluid_pressure
        else if((element.id == 2) || (element.id == 5)) {
          io.emit('newMessage', { id: element.id, data: Math.floor(msg.fluid_pressure) });
          return 
        }
        // per i dati diversi dai Bool approssimo
        else if((element.id != 8) && (element.id != 15) && (element.id != 16) && (element.id != 31) && (element.id != 32) && (element.id != 43) && (element.id != 44)) {
          msg.data = Math.floor(msg.data)
        }
        // invio in broadcast il nuovo messaggio
        io.emit('newMessage', { id: element.id, data: msg.data });
      });
    });
  }

  if(!isFrontDev) { subscribeToTopics(); }
}
*/