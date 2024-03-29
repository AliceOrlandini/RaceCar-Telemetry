const topics = [
  { id: '/sensorboard/front/rpm_left', type: 'std_msgs/msg/Int32', isInTheBag: false, name: 'RPM Front Left', measure: '', selected: false, step: 2000, max: 10000, min: 0 },
  { id: '/sensorboard/front/rpm_right', type: 'std_msgs/msg/Int32', isInTheBag: false, name: 'RPM Front Right', measure: '', selected: false, step: 2000, max: 10000, min: 0 },
  { id: '/sensorboard/front/brake_pressure', type: 'sensor_msgs/msg/FluidPressure', isInTheBag: false, name: 'Front Brake Pressure', measure: '(bar)', selected: false, step: 1000, max: 5000, min: 0 },
  { id: '/sensorboard/rear/rpm_left', type: 'std_msgs/msg/Int32', isInTheBag: false, name: 'RPM Rear Left', measure: '', selected: false, step: 2000, max: 10000, min: 0 },
  { id: '/sensorboard/rear/rpm_right', type: 'std_msgs/msg/Int32', isInTheBag: false, name: 'RPM Rear Right', measure: '', selected: false, step: 2000, max: 10000, min: 0 },
  { id: '/sensorboard/rear/brake_pressure', type: 'sensor_msgs/msg/FluidPressure', isInTheBag: false, name: 'Rear Brake Pressure', measure: '(bar)', selected: false, step: 1000, max: 5000, min: 0 },
  { id: '/sensorboard/front_exclusive/steering_angle', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Steering Angle', measure: '(°C)', selected: false, step: 50, max: 180, min: -180 },
  { id: '/sensorboard/front_exclusive/pps', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Throttle Pedal Posision', measure: '(%)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/sensorboard/traction', type: 'std_msgs/msg/Bool', isInTheBag: false, name: 'Traction Control', measure: '', selected: false, step: 1, max: 1, min: 0 },
  
  { id: '/inverter1/desired_torque', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 Desired Torque', measure: '(%)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter1/desired_erpm', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 Desired ERPM', measure: '', selected: false, step: 2000, max: 10000, min: 0 },
  { id: '/inverter1/temp', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 Temperature', measure: '(°C)', selected: false, step: 20, max: 150, min: 0 },
  { id: '/inverter1/engine_temp', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 Engine Temperature', measure: '(°C)', selected: false, step: 20, max: 150, min: 0 },
  { id: '/inverter1/direct_axis_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 Direct Axis Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter1/quadrature_axis_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 Quadrature Axis Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter1/drive_enable', type: 'std_msgs/msg/Bool', isInTheBag: false, name: 'Inverter1 Drive Enable', measure: '', selected: false, step: 1, max: 1, min: 0 },
  { id: '/inverter1/drive_enable_limit', type: 'std_msgs/msg/Bool', isInTheBag: false, name: 'Inverter1 Drive Enable Limit', measure: '', selected: false, step: 1, max: 1, min: 0 },
  { id: '/inverter1/set/ac/max_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 AC Max Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter1/set/dc/max_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 DC Max Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter1/set/ac/max_brake_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 AC Max Brake Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter1/set/dc/max_brake_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 DC Max Brake Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter1/desired_brake_torque', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 Desired Brake Torque', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter1/erpm', type: 'std_msgs/msg/Int32', isInTheBag: false, name: 'Inverter1 ERPM', measure: '', selected: false, step: 2000, max: 10000, min: 0 },
  { id: '/inverter1/dc_input_voltage', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 DC Input Voltage', measure: '(V)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter1/dc_input_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter1 DC Input Voltage', measure: '(V)', selected: false, step: 20, max: 100, min: 0 },

  { id: '/inverter2/desired_torque', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 Desired Torque', measure: '(%)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter2/desired_erpm', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 Desired ERPM', measure: '', selected: false, step: 2000, max: 10000, min: 0 },
  { id: '/inverter2/temp', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 Temperature', measure: '(°C)', selected: false, step: 20, max: 150, min: 0 },
  { id: '/inverter2/engine_temp', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 Engine Temperature', measure: '(°C)', selected: false, step: 20, max: 150, min: 0 },
  { id: '/inverter2/direct_axis_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 Direct Axis Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter2/quadrature_axis_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 Quadrature Axis Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter2/drive_enable', type: 'std_msgs/msg/Bool', isInTheBag: false, name: 'Inverter2 Drive Enable', measure: '', selected: false, step: 1, max: 1, min: 0 },
  { id: '/inverter2/drive_enable_limit', type: 'std_msgs/msg/Bool', isInTheBag: false, name: 'Inverter2 Drive Enable Limit', measure: '', selected: false, step: 1, max: 1, min: 0 },
  { id: '/inverter2/set/ac/max_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 AC Max Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter2/set/dc/max_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 DC Max Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter2/set/ac/max_brake_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 AC Max Brake Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter2/set/dc/max_brake_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 DC Max Brake Current', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter2/desired_brake_torque', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 Desired Brake Torque', measure: '(A)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter2/erpm', type: 'std_msgs/msg/Int32', isInTheBag: false, name: 'Inverter2 ERPM', measure: '', selected: false, step: 2000, max: 10000, min: 0 },
  { id: '/inverter2/dc_input_voltage', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 DC Input Voltage', measure: '(V)', selected: false, step: 20, max: 100, min: 0 },
  { id: '/inverter2/dc_input_current', type: 'std_msgs/msg/Float32', isInTheBag: false, name: 'Inverter2 DC Input Voltage', measure: '(V)', selected: false, step: 20, max: 100, min: 0 },

  { id: '/pdu/fan_pwm_inverter', type: 'std_msgs/msg/Int32', isInTheBag: false, name: 'Inverter Fan RPM', measure: '', selected: false, step: 2000, max: 10000, min: 0 },
  { id: '/pdu/fan_pwm_engine', type: 'std_msgs/msg/Int32', isInTheBag: false, name: 'Engine Fan RPM', measure: '', selected: false, step: 2000, max: 10000, min: 0 },
  { id: '/pdu/shutdown/pdu', type: 'std_msgs/msg/Bool', isInTheBag: false, name: 'PDU', measure: '', selected: false, step: 1, max: 1, min: 0 },
  { id: '/pdu/shutdown/tsal', type: 'std_msgs/msg/Bool', isInTheBag: false, name: 'TSAL', measure: '', selected: false, step: 1, max: 1, min: 0 },
];