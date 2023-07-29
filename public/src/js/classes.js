class RPM {
  rpm_data_x = [];
  rpm_data_y = [];
  rpmXLabel;
  new_rpm;
  last_rpm;
  rpm_label;
  rpm_linear_chart;
  rpmLineChartOptions = {
    type: 'line',
    animation: false,
    data: {
      labels: this.rpm_data_x,
      datasets: [{
          label: 'RPM',
          data: this.rpm_data_y,
          fill: false,
          borderColor: '#F97316',
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
            color: '#000',
            width: 1
          },
          grid: {
            display: false
          },
          ticks: {
            display: false
          }
        },
        y: {
          border:{
            dash:  function(context) {
              if(context.tick.value != 0) {
                return [4,4]
              }
            },
            color: '#000',
            width: 1
          },
          grid: {
            color: '#000',
            display: true,
          },
          ticks: {
            stepSize: 2000,
            padding: 5,
            color: '#000',
            font: {
              size: 10
            }
          },
          max: 10000,
          min: 0,
        }
      },
      elements: {
        point: {
          radius: 0
        },
      },
      plugins: {
        legend: {
          labels: {
            color: '#000',
            boxWidth: 0,
            font: {
              size: 12,
            }
          },
        }
      }
    }
  };

  constructor() {
    this.rpmXLabel = 0;
    this.last_rpm = 0;
    this.new_rpm = 0;
    this.rpm_label = document.getElementById("radial_chart_rpm_label");
    this.rpm_linear_chart = new Chart(document.querySelector("#rpm_linear_chart"), this.rpmLineChartOptions);
  }

  update(new_rpm) {
    if(new_rpm != -1) { 
      this.last_rpm = this.new_rpm;
      this.new_rpm = new_rpm; 
    }

    animate(this.rpm_label, this.last_rpm, this.new_rpm, 500);

    if(this.rpm_data_x.length > 10) {
      this.rpm_data_x.shift();
      this.rpm_data_y.shift();
    }

    this.rpm_data_x.push(this.rpmXLabel);
    this.rpm_data_y.push(this.new_rpm);
    this.rpm_linear_chart.update();

    this.rpmXLabel++;
  }
}

class GEAR {
  gear_data_x = [];
  gear_data_y = [];
  gearXLabel;
  new_gear;
  last_gear;
  gear_label;
  gear_linear_chart;
  gearLineChartOptions = {
    type: 'line',
    animation: false,
    data: {
      labels: this.gear_data_x,
      datasets: [{
          label: 'GEAR',
          data: this.gear_data_y,
          fill: false,
          borderColor: '#9333EA',
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
            color: '#000',
            width: 1
          },
          grid: {
            display: false
          },
          ticks: {
            display: false
          }
        },
        y: {
          border:{
            dash:  function(context) {
              if(context.tick.value != 0) {
                return [4,4]
              }
            },
            color: '#000',
            width: 1
          },
          grid: {
            color: '#000',
            display: true
          },
          ticks: {
            padding: 15,
            color: '#000',
            font: {
              size: 10
            }
          },
          max: 8,
          min: 1,
        }
      },
      elements: {
        point: {
          radius: 0
        },
      },
      plugins: {
        legend: {
          labels: {
            boxWidth: 0,
            font: {
              size: 12,
            }
          },
        }
      }
    }
  };

  constructor() {
    this.gearXLabel = 0;
    this.last_gear = 0;
    this.new_gear = 0;
    this.gear_label = document.getElementById("radial_chart_gear_label");
    // this.gear_linear_chart = new Chart(document.querySelector("#gear_linear_chart"), this.gearLineChartOptions);
  }

  update(new_gear) {
    this.last_gear = this.new_gear;
    if(new_gear != -1) { 
      this.last_gear = this.new_gear;
      this.new_gear = new_gear; 
    }

   animate(this.gear_label, this.last_gear, this.new_gear, 500);

    if(this.gear_data_x.length > 50) {
      this.gear_data_x.shift();
      this.gear_data_y.shift();
    }

    this.gear_data_x.push(this.gearXLabel);
    this.gear_data_y.push(this.new_gear);
    this.gearLineChartOptions.data.labels = this.gear_data_x;
    this.gearLineChartOptions.data.datasets.data = this.gear_data_y;
    // this.gear_linear_chart.update();

    this.gearXLabel++;
  }
}

class TPS {
  tps_data_x = [];
  tps_data_y = [];
  tps_data_radial = [];
  tpsXLabel;
  new_tps;
  last_tps;
  tps_label;
  tps_linear_chart;
  tps_radial_chart;
  // steer_label;
  // steer_image;
  tpsLineChartOptions = {
    type: 'line',
    animation: false,
    data: {
      labels: this.tps_data_x,
      datasets: [{
          label: 'THROTTLE',
          data: this.tps_data_y,
          fill: false,
          borderColor: '#00E728',
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
            color: '#000',
            width: 1
          },
          grid: {
            display: false
          },
          ticks: {
            display: false
          }
        },
        y: {
          border:{
            dash:  function(context) {
              if(context.tick.value != 0) {
                return [4,4]
              }
            },
            color: '#000',
            width: 1
          },
          grid: {
            color: '#000',
            display: true
          },
          ticks: {
            stepSize: 20,
            padding: 5,
            color: '#000',
            font: {
              size: 10
            }
          },
          max: 100,
          min: 0,
        }
      },
      elements: {
        point: {
          radius: 0
        },
      },
      plugins: {
        legend: {
          labels: {
            color: '#000',
            boxWidth: 0,
            font: {
              size: 12,
            }
          },
        }
      }
    }
  };
  tpsRadialChartOptions = {
    type: 'doughnut',
    animation: false,
    data: {
      labels: {
        display: false
      },
      datasets: [{
          data: this.tps_data_radial,
          backgroundColor: ['#00E728', '#000000'],
          borderColor: ['#00E728', '#000000']
      }]
    },
    options: {
      responsive: true,
      cutout: 85,
      rotation: -135,
      circumference: 175,
      layout: {
        padding: {
            left: 15,
            right: 0,
            top: 43,
            bottom: 33
        }
      }
    }
  }

  constructor() {
    this.tpsXLabel = 0;
    this.tps_label = document.getElementById("tps_label");
    this.last_tps = 0;
    this.new_tps = 0;
    this.tps_data_radial.push(0);
    this.tps_data_radial.push(100);
    this.tps_linear_chart = new Chart(document.querySelector("#tps_linear_chart"), this.tpsLineChartOptions);
    this.tps_radial_chart = new Chart(document.querySelector("#tps_radial_chart"), this.tpsRadialChartOptions);
  }

  update(new_tps) {
    
    this.last_tps = this.new_tps;
    this.new_tps = Math.floor(new_tps); 
    // in real time tps_label non c'è
    // animate(this.tps_label, this.last_tps, this.new_tps, 500);

    this.tps_data_radial[0] = this.new_tps;
    this.tps_data_radial[1] = 100 - this.new_tps;

    if(this.tps_data_x.length > 10) {
      this.tps_data_x.shift();
      this.tps_data_y.shift();
    }

    this.tps_data_x.push(this.tpsXLabel);
    this.tps_data_y.push(this.new_tps);
    this.tps_linear_chart.update();
    this.tps_radial_chart.update();

    this.tpsXLabel++;
  }
}

class FORWARD_VEL {
  forward_vel_data_x = [];
  forward_vel_data_y = [];
  forwardVelXLabel;
  new_forward_vel;
  last_forward_vel;
  forward_vel_label;
  forward_vel_data_radial = [];
  forward_vel_linear_chart;
  forward_vel_radial_chart;
  forwardVelLineChartOptions = {
    type: 'line',
    animation: false,
    data: {
      labels: this.forward_vel_data_x,
      datasets: [{
          label: 'VEL',
          data: this.forward_vel_data_y,
          fill: false,
          borderColor: '#372BF7',
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
            color: '#000',
            width: 1
          },
          grid: {
            display: false
          },
          ticks: {
            display: false
          }
        },
        y: {
          border:{
            dash:  function(context) {
              if(context.tick.value != 0) {
                return [4,4]
              }
            },
            color: '#000',
            width: 1
          },
          grid: {
            color: '#000',
            display: true
          },
          ticks: {
            stepSize: 25,
            padding: 5,
            color: '#000',
            font: {
              size: 10
            }
          },
          max: 150,
          min: 0,
        }
      },
      elements: {
        point: {
          radius: 0
        },
      },
      plugins: {
        legend: {
          labels: {
            color: '#000',
            boxWidth: 0,
            font: {
              size: 12,
            }
          },
        }
      }
    }
  };
  forwardVelRadialChartOptions = {
    type: 'doughnut',
    animation: false,
    data: {
      labels: {
        display: false
      },
      datasets: [{
          data: this.forward_vel_data_radial,
          backgroundColor: ['#372BF7', '#000000'],
          borderColor: ['#372BF7', '#000000']
      }]
    },
    options: {
      responsive: true,
      cutout: 110,
      rotation: -135,
      circumference: 270,
      layout: {
        padding: {
            left: 0,
            right: 10,
            top: -8,
            bottom: 60
        }
      }
    }
  }

  constructor() {
    this.last_forward_vel = 0;
    this.new_forward_vel = 0;
    this.forwardVelXLabel = 0;
    this.forward_vel_data_radial.push(0);
    this.forward_vel_data_radial.push(100);
    this.forward_vel_label = document.getElementById("radial_chart_speed_label");
    this.forward_vel_radial_chart = new Chart(document.querySelector("#forward_vel_radial_chart"), this.forwardVelRadialChartOptions);
    this.forward_vel_linear_chart = new Chart(document.querySelector("#forward_vel_linear_chart"), this.forwardVelLineChartOptions);
  }

  update(new_forward_vel) {
    this.last_forward_vel = this.new_forward_vel;
    if(new_forward_vel != -1) { 
      this.last_forward_vel = this.new_forward_vel;
      this.new_forward_vel = Math.floor(new_forward_vel); 
    }
    
    this.forward_vel_data_radial[0] = (100 * this.new_forward_vel)/150; // chart goes from 0 to 100
    this.forward_vel_data_radial[1] = 100 - this.forward_vel_data_radial[0];
    
    animate(this.forward_vel_label, this.last_forward_vel, this.new_forward_vel, 500);

    if(this.forward_vel_data_x.length > 10) {
      this.forward_vel_data_x.shift();
      this.forward_vel_data_y.shift();
    }

    this.forward_vel_data_x.push(this.forwardVelXLabel);
    this.forward_vel_data_y.push(this.new_forward_vel);
    this.forward_vel_linear_chart.update();
    this.forward_vel_radial_chart.update();

    this.forwardVelXLabel++;
  }
}

class ECT {

  ect_label;
  last_ect;
  new_ect;

  constructor() {
    this.last_ect = 0;
    this.new_ect = 0;
    this.ect_label = document.getElementById("ect_label");
  }

  update(new_ect) {
    
    if(new_ect != -1) { 
      this.last_ect = this.new_ect;
      this.new_ect = Math.floor(new_ect); 
    }
    animate(this.ect_label, this.last_ect, this.new_ect, 500);
  }
}

class EOP {

  eop_label;
  last_eop;
  new_eop;

  constructor() {
    this.last_eop = 0;
    this.new_eop = 0;
    this.eop_label = document.getElementById("eop_label");
  }

  update(new_eop) {
    if(new_eop != -1) { 
      this.last_eop = this.new_eop;
      this.new_eop = new_eop; 
    }
    
    animate(this.eop_label, this.last_eop, this.new_eop, 500);
  }
}

class BRAKE {

  brake_data_x = [];
  brake_data_y = [];
  brake_data_radial = [];
  brake_radial_chart;
  brake_linear_chart;
  last_brake;
  new_brake;
  brakeXLabel;
  brakeLineChartOptions = {
    type: 'line',
    animation: false,
    data: {
      labels: this.brake_data_x,
      datasets: [{
          label: 'BRAKE',
          data: this.brake_data_y,
          fill: false,
          borderColor: '#FB0000',
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
            color: '#000',
            width: 1
          },
          grid: {
            display: false
          },
          ticks: {
            display: false
          }
        },
        y: {
          border:{
            dash:  function(context) {
              if(context.tick.value != 0) {
                return [4,4]
              }
            },
            color: '#000',
            width: 1
          },
          grid: {
            display: true,
            color: '#000'
          },
          ticks: {
            stepSize: 20,
            padding: 5,
            color: '#000',
            font: {
              size: 10,
            }
          },
          max: 100,
          min: 0,
        }
      },
      elements: {
        point: {
          radius: 0
        },
      },
      plugins: {
        legend: {
          labels: {
            color: '#000',
            boxWidth: 0,
            font: {
              size: 12,
            }
          },
        }
      }
    }
  };
  brakeRadialChartOptions = {
    type: 'doughnut',
    animation: false,
    data: {
      labels: {
        display: false
      },
      datasets: [{
          data: this.brake_data_radial,
          backgroundColor: ['#FB0000', '#000000'],
          borderColor: ['#FB0000', '#000000']
      }]
    },
    options: {
      responsive: true,
      cutout: 71,
      rotation: 42,
      circumference: 95,
      layout: {
        padding: {
            left: 0,
            right: 40,
            top: 0,
            bottom: 60
        }
      }
    }
  }

  constructor() {
    this.last_brake = 0;
    this.new_brake = 0;
    this.brakeXLabel = 0;
    this.brake_data_radial.push(0);
    this.brake_data_radial.push(100);
    this.brake_linear_chart = new Chart(document.querySelector("#brake_linear_chart"), this.brakeLineChartOptions);
    this.brake_radial_chart = new Chart(document.querySelector("#brake_radial_chart"), this.brakeRadialChartOptions);
  }

  update(new_brake) {
    this.last_brake = this.new_brake;
    if(new_brake != -1) { 
      this.last_brake = this.new_brake;
      this.new_brake = Math.floor(new_brake); 
    }
    
    this.brake_data_radial[0] = (100 * this.new_brake)/150; // chart goes from 0 to 100
    this.brake_data_radial[1] = 100 - this.brake_data_radial[0];

    if(this.brake_data_x.length > 10) {
      this.brake_data_x.shift();
      this.brake_data_y.shift();
    }

    this.brake_data_x.push(this.brakeXLabel);
    this.brake_data_y.push(this.new_brake);
    this.brake_linear_chart.update();
    this.brake_radial_chart.update();

    this.brakeXLabel++;
  }
}

/*
* Funzione creata solo a scopo di estetica: fa sì che il numero
* della label cresca progressivamente (in modo da non avere scatti)
*/
function animate(obj, initVal, lastVal, duration) {

  let startTime = null;

  // get the current timestamp and assign it to the currentTime variable
  let currentTime = Date.now();

  // pass the current timestamp to the step function
  const step = (currentTime) => {

    // if the start time is null, assign the current time to startTime
    if (!startTime) {
      startTime = currentTime;
    }

    // calculate the value to be used in calculating the number to be displayed
    const progress = Math.min((currentTime  - startTime) / duration, 1);

    // calculate what to be displayed using the value gotten above
    obj.textContent = Math.floor(progress * (lastVal - initVal) + initVal);

    // checking to make sure the counter does not exceed the last value (lastVal)
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
    else{
      window.cancelAnimationFrame(window.requestAnimationFrame(step));
    }
  };

  // start animating
  window.requestAnimationFrame(step);
}